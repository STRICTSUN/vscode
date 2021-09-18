/*---------------------------------------------------------------------------------------------
 *  Авторское право (c) Корпорации Майкрософт. Все права защищены.
* Лицензировано в соответствии с лицензией MIT.
*  Информацию о лицензии смотрите в License.txt, в корневом каталоге проекта.
 *--------------------------------------------------------------------------------------------*/

import * as eslint from 'eslint';
import { AST_NODE_TYPES, TSESTree } from '@typescript-eslint/experimental-utils';

export = new class ApiProviderNaming implements eslint.Rule.RuleModule {

	readonly meta: eslint.Rule.RuleMetaData = {
		messages: {
			noToken: 'В функции отсутствует токен отмены, который предпочтительно использовать в качестве последнего аргумента.',
		}
	};

	create(context: eslint.Rule.RuleContext): eslint.Rule.RuleListener {

		return {
			['TSInterfaceDeclaration[id.name=/.+Provider/] TSMethodSignature[key.name=/^(provide|resolve).+/]']: (node: any) => {

				let found = false;
				for (let param of (<TSESTree.TSMethodSignature>node).params) {
					if (param.type === AST_NODE_TYPES.Identifier) {
						found = found || param.name === 'token';
					}
				}

				if (!found) {
					context.report({
						node,
						messageId: 'noToken'
					});
				}
			}
		};
	}
};
