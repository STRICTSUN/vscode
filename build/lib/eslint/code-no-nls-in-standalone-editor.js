"use strict";
/*---------------------------------------------------------------------------------------------
 *  ��������� ����� (c) ���������� ����������. ��� ����� ��������.
* ������������� � ������������ � ��������� MIT.
*  ���������� � �������� �������� � License.txt, � �������� �������� �������.

 *--------------------------------------------------------------------------------------------*/
const path_1 = require("path");
const utils_1 = require("./utils");
module.exports = new class NoNlsInStandaloneEditorRule {
    constructor() {
        this.meta = {
            messages: {
				noNls: '�� ����������� ������������� vs/nls � ���������� ������ ���������. ��������������  standaloneStrings.ts'
            }
        };
    }
    create(context) {
        const fileName = context.getFilename();
        if (/vs(\/|\\)editor(\/|\\)standalone(\/|\\)/.test(fileName)
            || /vs(\/|\\)editor(\/|\\)common(\/|\\)standalone(\/|\\)/.test(fileName)
            || /vs(\/|\\)editor(\/|\\)editor.api/.test(fileName)
            || /vs(\/|\\)editor(\/|\\)editor.main/.test(fileName)
            || /vs(\/|\\)editor(\/|\\)editor.worker/.test(fileName)) {
            return (0, utils_1.createImportRuleListener)((node, path) => {
                // resolve relative paths
                if (path[0] === '.') {
                    path = (0, path_1.join)(context.getFilename(), path);
                }
                if (/vs(\/|\\)nls/.test(path)) {
                    context.report({
                        loc: node.loc,
                        messageId: 'noNls'
                    });
                }
            });
        }
        return {};
    }
};
