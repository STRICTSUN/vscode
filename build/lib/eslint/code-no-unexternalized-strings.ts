/*---------------------------------------------------------------------------------------------
 *  Авторское право (c) Корпорации Майкрософт. Все права защищены.
* Лицензировано в соответствии с лицензией MIT.
*  Информацию о лицензии смотрите в License.txt, в корневом каталоге проекта.
 *--------------------------------------------------------------------------------------------*/

import * as eslint from 'eslint';
import { TSESTree, AST_NODE_TYPES } from '@typescript-eslint/experimental-utils';

function isStringLiteral(node: TSESTree.Node | null | undefined): node is TSESTree.StringLiteral {
	return !!node && node.type === AST_NODE_TYPES.Literal && typeof node.value === 'string';
}

function isDoubleQuoted(node: TSESTree.StringLiteral): boolean {
	return node.raw[0] === '"' && node.raw[node.raw.length - 1] === '"';
}

export = new class NoUnexternalizedStrings implements eslint.Rule.RuleModule {

	private static _rNlsKeys = /^[_a-zA-Z0-9][ .\-_a-zA-Z0-9]*$/;

	readonly meta: eslint.Rule.RuleMetaData = {
		messages: {
			doubleQuoted: 'Используйте строки в двойных кавычках только для внешних строк.',
			badKey: 'Ключ \'{{key}}\' не соответствует действительному идентификатору локализации.',
			duplicateKey: 'Дубликат ключа \'{{key}}\' с другим значением сообщения.',
			badMessage: 'Аргумент сообщения для \'{{message}}\' должен быть строковым литералом.'
		}
	};

	create(context: eslint.Rule.RuleContext): eslint.Rule.RuleListener {

		const externalizedStringLiterals = new Map<string, { call: TSESTree.CallExpression, message: TSESTree.Node }[]>();
		const doubleQuotedStringLiterals = new Set<TSESTree.Node>();

		function collectDoubleQuotedStrings(node: TSESTree.Literal) {
			if (isStringLiteral(node) && isDoubleQuoted(node)) {
				doubleQuotedStringLiterals.add(node);
			}
		}

		function visitLocalizeCall(node: TSESTree.CallExpression) {

			// localize(key, message)
			const [keyNode, messageNode] = (<TSESTree.CallExpression>node).arguments;

			// (1)
			//Извлечение ключа, чтобы его можно было проверить позже.
			let key: string | undefined;
			if (isStringLiteral(keyNode)) {
				doubleQuotedStringLiterals.delete(keyNode);
				key = keyNode.value;

			} else if (keyNode.type === AST_NODE_TYPES.ObjectExpression) {
				for (let property of keyNode.properties) {
					if (property.type === AST_NODE_TYPES.Property && !property.computed) {
						if (property.key.type === AST_NODE_TYPES.Identifier && property.key.name === 'key') {
							if (isStringLiteral(property.value)) {
								doubleQuotedStringLiterals.delete(property.value);
								key = property.value.value;
								break;
							}
						}
					}
				}
			}
			if (typeof key === 'string') {
				let array = externalizedStringLiterals.get(key);
				if (!array) {
					array = [];
					externalizedStringLiterals.set(key, array);
				}
				array.push({ call: node, message: messageNode });
			}

			// (2)
			 // Удалите аргумент-сообщение из списка doubleQuoted и убедитесь, что это строковый литерал.
			doubleQuotedStringLiterals.delete(messageNode);
			if (!isStringLiteral(messageNode)) {
				context.report({
					loc: messageNode.loc,
					messageId: 'badMessage',
					data: { message: context.getSourceCode().getText(<any>node) }
				});
			}
		}

		function reportBadStringsAndBadKeys() {
			// (1)
			//Сообщать обо всех строках, заключённых в двойные кавычки.
			for (const node of doubleQuotedStringLiterals) {
				context.report({ loc: node.loc, messageId: 'doubleQuoted' });
			}

			for (const [key, values] of externalizedStringLiterals) {

				// (2)
				// Сообщать обо всех недействительных ключах NLS.
				if (!key.match(NoUnexternalizedStrings._rNlsKeys)) {
					for (let value of values) {
						context.report({ loc: value.call.loc, messageId: 'badKey', data: { key } });
					}
				}

				// (2)
				// Сообщать обо всех недопустимых дубликатах - такой  же ключ, другое сообщение.
				if (values.length > 1) {
					for (let i = 1; i < values.length; i++) {
						if (context.getSourceCode().getText(<any>values[i - 1].message) !== context.getSourceCode().getText(<any>values[i].message)) {
							context.report({ loc: values[i].call.loc, messageId: 'duplicateKey', data: { key } });
						}
					}
				}
			}
		}

		return {
			['Literal']: (node: any) => collectDoubleQuotedStrings(node),
			['ExpressionStatement[directive] Literal:exit']: (node: any) => doubleQuotedStringLiterals.delete(node),
			['CallExpression[callee.type="MemberExpression"][callee.object.name="nls"][callee.property.name="localize"]:exit']: (node: any) => visitLocalizeCall(node),
			['CallExpression[callee.name="localize"][arguments.length>=2]:exit']: (node: any) => visitLocalizeCall(node),
			['Program:exit']: reportBadStringsAndBadKeys,
		};
	}
};
