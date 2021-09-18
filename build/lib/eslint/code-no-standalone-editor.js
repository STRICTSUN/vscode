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
				badImport: '�� ��������� ������������� ���������� ������ ���������.'
            },
            docs: {
                url: 'https://github.com/microsoft/vscode/wiki/Source-Code-Organization'
            }
        };
    }
    create(context) {
        if (/vs(\/|\\)editor/.test(context.getFilename())) {
            // � ����� vs/editor ��������� ������������ ���������� ��������.
            return {};
        }
        return (0, utils_1.createImportRuleListener)((node, path) => {
            // ��������� ������������� ����.
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
