"use strict";
/*---------------------------------------------------------------------------------------------
 *  Авторское право (c) Корпорации Майкрософт. Все права защищены.
* Лицензировано в соответствии с лицензией MIT.
*  Информацию о лицензии смотрите в License.txt, в корневом каталоге проекта.
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
        //Импортировать ??? из "модуля".
        ImportDeclaration: (node) => {
            _checkImport(node.source);
        },
        // import('module').then(...) ИЛИ ждать import('module').
        ['CallExpression[callee.type="Import"][arguments.length=1] > Literal']: (node) => {
            _checkImport(node);
        },
        // Импортировать foo = ...
        ['TSImportEqualsDeclaration > TSExternalModuleReference > Literal']: (node) => {
            _checkImport(node);
        },
        // Экспортировать ?? из "модуля".
        ExportAllDeclaration: (node) => {
            _checkImport(node.source);
        },
        // export {foo} из 'module'.
        ExportNamedDeclaration: (node) => {
            _checkImport(node.source);
        },
    };
}
exports.createImportRuleListener = createImportRuleListener;
