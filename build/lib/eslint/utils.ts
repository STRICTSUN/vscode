/*---------------------------------------------------------------------------------------------
 *  ��������� ����� (c) ���������� ����������. ��� ����� ��������.
* ������������� � ������������ � ��������� MIT.
*  ���������� � �������� �������� � License.txt, � �������� �������� �������.
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
		//������������� ??? �� "������".
		ImportDeclaration: (node: any) => {
			_checkImport((<TSESTree.ImportDeclaration>node).source);
		},
		// import('module').then(...) ��� ����� import('module').
		['CallExpression[callee.type="Import"][arguments.length=1] > Literal']: (node: any) => {
			_checkImport(node);
		},
		// ������������� foo = ...
		['TSImportEqualsDeclaration > TSExternalModuleReference > Literal']: (node: any) => {
			_checkImport(node);
		},
		// �������������� ?? �� "������".
		ExportAllDeclaration: (node: any) => {
			_checkImport((<TSESTree.ExportAllDeclaration>node).source);
		},
		// export {foo} �� 'module'.
		ExportNamedDeclaration: (node: any) => {
			_checkImport((<TSESTree.ExportNamedDeclaration>node).source);
		},

	};
}
