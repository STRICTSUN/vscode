/*---------------------------------------------------------------------------------------------
 *  Авторское право (c) Корпорации Майкрософт. Все права защищены.
* Лицензировано в соответствии с лицензией MIT.
*  Информацию о лицензии смотрите в License.txt, в корневом каталоге проекта.
 *--------------------------------------------------------------------------------------------*/

import * as eslint from 'eslint';
import { TSESTree } from '@typescript-eslint/experimental-utils';

export function createImportRuleListener(validateImport: (node: TSESTree.Literal, value: string) => any): eslint.Rule.RuleListener {

	function _checkImport(node: TSESTree.Node | null) {
		if (node && node.type === 'Literal' && typeof node.value === 'string') {
			validateImport(node, node.value);
		}
	}

	return {
		//Импортировать ??? из "модуля".
		ImportDeclaration: (node: any) => {
			_checkImport((<TSESTree.ImportDeclaration>node).source);
		},
		// import('module').then(...) ИЛИ ждать import('module').
		['CallExpression[callee.type="Import"][arguments.length=1] > Literal']: (node: any) => {
			_checkImport(node);
		},
		// Импортировать foo = ...
		['TSImportEqualsDeclaration > TSExternalModuleReference > Literal']: (node: any) => {
			_checkImport(node);
		},
		// Экспортировать ?? из "модуля".
		ExportAllDeclaration: (node: any) => {
			_checkImport((<TSESTree.ExportAllDeclaration>node).source);
		},
		// export {foo} из 'module'.
		ExportNamedDeclaration: (node: any) => {
			_checkImport((<TSESTree.ExportNamedDeclaration>node).source);
		},

	};
}
