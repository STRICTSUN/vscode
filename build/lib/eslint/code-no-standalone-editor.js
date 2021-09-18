"use strict";
/*---------------------------------------------------------------------------------------------
  *  Авторское право (c) Корпорации Майкрософт. Все права защищены.
* Лицензировано в соответствии с лицензией MIT.
*  Информацию о лицензии смотрите в License.txt, в корневом каталоге проекта.
 *--------------------------------------------------------------------------------------------*/
const path_1 = require("path");
const utils_1 = require("./utils");
module.exports = new class NoNlsInStandaloneEditorRule {
    constructor() {
        this.meta = {
            messages: {
				badImport: 'Не разрешено импортировать автономные модули редактора.'
            },
            docs: {
                url: 'https://github.com/microsoft/vscode/wiki/Source-Code-Organization'
            }
        };
    }
    create(context) {
        if (/vs(\/|\\)editor/.test(context.getFilename())) {
            // В папке vs/editor разрешено использовать автономный редактор.
            return {};
        }
        return (0, utils_1.createImportRuleListener)((node, path) => {
            // Разрешить относительные пути.
            if (path[0] === '.') {
                path = (0, path_1.join)(context.getFilename(), path);
            }
            if (/vs(\/|\\)editor(\/|\\)standalone(\/|\\)/.test(path)
                || /vs(\/|\\)editor(\/|\\)common(\/|\\)standalone(\/|\\)/.test(path)
                || /vs(\/|\\)editor(\/|\\)editor.api/.test(path)
                || /vs(\/|\\)editor(\/|\\)editor.main/.test(path)
                || /vs(\/|\\)editor(\/|\\)editor.worker/.test(path)) {
                context.report({
                    loc: node.loc,
                    messageId: 'badImport'
                });
            }
        });
    }
};
