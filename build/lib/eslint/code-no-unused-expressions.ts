/*---------------------------------------------------------------------------------------------
  *  Авторское право (c) Корпорации Майкрософт. Все права защищены.
* Лицензировано в соответствии с лицензией MIT.
*  Информацию о лицензии смотрите в License.txt, в корневом каталоге проекта.
 *--------------------------------------------------------------------------------------------*/

// ОТВЕТВЛЕНИЕ ОТ  https://github.com/eslint/eslint/blob/b23ad0d789a909baf8d7c41a35bc53df932eaf30/lib/rules/no-unused-expressions.js
// и добавление поддержки для `OptionalCallExpression`, смотрите https://github.com/facebook/create-react-app/issues/8107  и  https://github.com/eslint/eslint/issues/12642

/**
 * @fileoverview Обозначения флагов в позиции оператора, которые не оказывают побочного эффекта.
 * @author Michael Ficarra
 */

'use strict';

import * as eslint from 'eslint';
import { TSESTree } from '@typescript-eslint/experimental-utils';
import * as ESTree from 'estree';

//------------------------------------------------------------------------------
// Определение правила.
//------------------------------------------------------------------------------

module.exports = {
	meta: {
		type: 'suggestion',

		docs: {
			description: 'Зпрещение неиспользуемых выражений.',
			category: 'Best Practices',
			recommended: false,
			url: 'https://eslint.org/docs/rules/no-unused-expressions'
		},

		schema: [
			{
				type: 'object',
				properties: {
					allowShortCircuit: {
						type: 'boolean',
						default: false
					},
					allowTernary: {
						type: 'boolean',
						default: false
					},
					allowTaggedTemplates: {
						type: 'boolean',
						default: false
					}
				},
				additionalProperties: false
			}
		]
	},

	create(context: eslint.Rule.RuleContext) {
		const config = context.options[0] || {},
			allowShortCircuit = config.allowShortCircuit || false,
			allowTernary = config.allowTernary || false,
			allowTaggedTemplates = config.allowTaggedTemplates || false;

		// eslint-disable-next-line jsdoc/require-description
		/**
		 * @param node Любой узел.
		 * @returns Представляет ли данный узел директиву структурно.
		 */
		function looksLikeDirective(node: TSESTree.Node): boolean {
			return node.type === 'ExpressionStatement' &&
				node.expression.type === 'Literal' && typeof node.expression.value === 'string';
		}

		// eslint-disable-next-line jsdoc/require-description
		/**
		 * @param predicate ([a] -> Boolean) Функция, используемая для определения.
		 * @param list the input list
		 * @returns Ведущая последовательность членов в данном списке, которые передают данный предикат.
		 */
		function takeWhile<T>(predicate: (item: T) => boolean, list: T[]): T[] {
			for (let i = 0; i < list.length; ++i) {
				if (!predicate(list[i])) {
					return list.slice(0, i);
				}
			}
			return list.slice();
		}

		// eslint-disable-next-line jsdoc/require-description
		/**
		 * @param node Узел Program или BlockStatement.
		 * @returns Ведущая последовательность директивных узлов в теле данного узла.
		 */
		function directives(node: TSESTree.Program | TSESTree.BlockStatement): TSESTree.Node[] {
			return takeWhile(looksLikeDirective, node.body);
		}

		// eslint-disable-next-line jsdoc/require-description
		/**
		 * @param node Любой узел.
		 * @param ancestors Предшественники данного узла.
		 * @returns Считается ли данный узел директивой в его текущей позиции.
		 */
		function isDirective(node: TSESTree.Node, ancestors: TSESTree.Node[]): boolean {
			const parent = ancestors[ancestors.length - 1],
				grandparent = ancestors[ancestors.length - 2];

			return (parent.type === 'Program' || parent.type === 'BlockStatement' &&
				(/Function/u.test(grandparent.type))) &&
				directives(parent).indexOf(node) >= 0;
		}

		/**
		 * Определение, является ли данный узел допустимым выражением. Обращаение к узлам схемы eval и ternary, если это разрешено флагами.
		 * @param node Любой узел.
		 * @returns Является ли данный узел допустимым выражением.
		 */
		function isValidExpression(node: TSESTree.Node): boolean {
			if (allowTernary) {

				// Рекурсивная проверка троичных и логических выражений.
				if (node.type === 'ConditionalExpression') {
					return isValidExpression(node.consequent) && isValidExpression(node.alternate);
				}
			}

			if (allowShortCircuit) {
				if (node.type === 'LogicalExpression') {
					return isValidExpression(node.right);
				}
			}

			if (allowTaggedTemplates && node.type === 'TaggedTemplateExpression') {
				return true;
			}

			return /^(?:Assignment|OptionalCall|Call|New|Update|Yield|Await)Expression$/u.test(node.type) ||
				(node.type === 'UnaryExpression' && ['delete', 'void'].indexOf(node.operator) >= 0);
		}

		return {
			ExpressionStatement(node: TSESTree.ExpressionStatement) {
				if (!isValidExpression(node.expression) && !isDirective(node, <TSESTree.Node[]>context.getAncestors())) {
					context.report({ node: <ESTree.Node>node, message: 'Ожидалось присвоение или вызов функции, а вместо этого получили выражение.' });
				}
			}
		};

	}
};
