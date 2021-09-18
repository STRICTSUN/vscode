"use strict";
/*---------------------------------------------------------------------------------------------
 *  Авторское право (c) Корпорации Майкрософт. Все права защищены.
* Лицензировано в соответствии с лицензией MIT.
*  Информацию о лицензии смотрите в License.txt, в корневом каталоге проекта.
 *--------------------------------------------------------------------------------------------*/
const path_1 = require("path");
const minimatch = require("minimatch");
const utils_1 = require("./utils");
module.exports = new class {
    constructor() {
        this.meta = {
            messages: {
                badImport: 'Импорт нарушает ограничения \'{{restrictions}}\' . Смотрите https://github.com/microsoft/vscode/wiki/Source-Code-Organization'
            },
            docs: {
                url: 'https://github.com/microsoft/vscode/wiki/Source-Code-Organization'
            }
        };
    }
    create(context) {
        const configs = context.options;
        for (const config of configs) {
            if (minimatch(context.getFilename(), config.target)) {
                return (0, utils_1.createImportRuleListener)((node, value) => this._checkImport(context, config, node, value));
            }
        }
        return {};
    }
    _checkImport(context, config, node, path) {
        // Разрешить относительные пути.
        if (path[0] === '.') {
            path = (0, path_1.join)(context.getFilename(), path);
        }
        let restrictions;
        if (typeof config.restrictions === 'string') {
            restrictions = [config.restrictions];
        }
        else {
            restrictions = config.restrictions;
        }
        let matched = false;
        for (const pattern of restrictions) {
            if (minimatch(path, pattern)) {
                matched = true;
                break;
            }
        }
        if (!matched) {
            // Ни одно из ограничений не совпало.
            context.report({
                loc: node.loc,
                messageId: 'badImport',
                data: {
                    restrictions: restrictions.join(' or ')
                }
            });
        }
    }
};
