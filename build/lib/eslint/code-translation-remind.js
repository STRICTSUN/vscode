"use strict";
/*---------------------------------------------------------------------------------------------
 *  Авторское право (c) Корпорации Майкрософт. Все права защищены.
* Лицензировано в соответствии с лицензией MIT.
*  Информацию о лицензии смотрите в License.txt, в корневом каталоге проекта.
 *--------------------------------------------------------------------------------------------*/
var _a;
const fs_1 = require("fs");
const utils_1 = require("./utils");
module.exports = new (_a = class TranslationRemind {
        constructor() {
            this.meta = {
                messages: {
					missing: 'Пожалуйста, добавьте \'{{resource}}\' в файл ./build/lib/i18n.resources.json, чтобы  здесь использовать переводы.'
                }
            };
        }
        create(context) {
            return (0, utils_1.createImportRuleListener)((node, path) => this._checkImport(context, node, path));
        }
        _checkImport(context, node, path) {
            if (path !== TranslationRemind.NLS_MODULE) {
                return;
            }
            const currentFile = context.getFilename();
            const matchService = currentFile.match(/vs\/workbench\/services\/\w+/);
            const matchPart = currentFile.match(/vs\/workbench\/contrib\/\w+/);
            if (!matchService && !matchPart) {
                return;
            }
            const resource = matchService ? matchService[0] : matchPart[0];
            let resourceDefined = false;
            let json;
            try {
                json = (0, fs_1.readFileSync)('./build/lib/i18n.resources.json', 'utf8');
            }
            catch (e) {
				console.error('[translation-remind rule]: Файл с ресурсами для извлечения из Transifex не найден. Прерывание проверки ресурсов перевода для вновь определённой части/службы рабочего места.');
                return;
            }
            const workbenchResources = JSON.parse(json).workbench;
            workbenchResources.forEach((existingResource) => {
                if (existingResource.name === resource) {
                    resourceDefined = true;
                    return;
                }
            });
            if (!resourceDefined) {
                context.report({
                    loc: node.loc,
                    messageId: 'missing',
                    data: { resource }
                });
            }
        }
    },
    _a.NLS_MODULE = 'vs/nls',
    _a);
