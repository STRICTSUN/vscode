"use strict";
/*---------------------------------------------------------------------------------------------
 *  ��������� ����� (c) ���������� ����������. ��� ����� ��������.
* ������������� � ������������ � ��������� MIT.
*  ���������� � �������� �������� � License.txt, � �������� �������� �������.
 *--------------------------------------------------------------------------------------------*/
var _a;
const fs_1 = require("fs");
const utils_1 = require("./utils");
module.exports = new (_a = class TranslationRemind {
        constructor() {
            this.meta = {
                messages: {
					missing: '����������, �������� \'{{resource}}\' � ���� ./build/lib/i18n.resources.json, �����  ����� ������������ ��������.'
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
				console.error('[translation-remind rule]: ���� � ��������� ��� ���������� �� Transifex �� ������. ���������� �������� �������� �������� ��� ����� ����������� �����/������ �������� �����.');
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
