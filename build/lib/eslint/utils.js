"use strict";
/*---------------------------------------------------------------------------------------------
 *  ��������� ����� (c) ���������� ����������. ��� ����� ��������.
* ������������� � ������������ � ��������� MIT.
*  ���������� � �������� �������� � License.txt, � �������� �������� �������.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.createImportRuleListener = void 0;
function createImportRuleListener(validateImport) {
    function _checkImport(node) {
        if (node && node.type === 'Literal' && typeof node.value === 'string') {
            validateImport(node, node.value);
        }
    }
    return {
        //������������� ??? �� "������".
        ImportDeclaration: (node) => {
            _checkImport(node.source);
        },
        // import('module').then(...) ��� ����� import('module').
        ['CallExpression[callee.type="Import"][arguments.length=1] > Literal']: (node) => {
            _checkImport(node);
        },
        // ������������� foo = ...
        ['TSImportEqualsDeclaration > TSExternalModuleReference > Literal']: (node) => {
            _checkImport(node);
        },
        // �������������� ?? �� "������".
        ExportAllDeclaration: (node) => {
            _checkImport(node.source);
        },
        // export {foo} �� 'module'.
        ExportNamedDeclaration: (node) => {
            _checkImport(node.source);
        },
    };
}
exports.createImportRuleListener = createImportRuleListener;
