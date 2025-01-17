"use strict";
/*---------------------------------------------------------------------------------------------
 *  ��������� ����� (c) ���������� ����������. ��� ����� ��������.
* ������������� � ������������ � ��������� MIT.
*  ���������� � �������� �������� � License.txt, � �������� �������� �������.
 *--------------------------------------------------------------------------------------------*/
const path_1 = require("path");
const utils_1 = require("./utils");
module.exports = new class {
    constructor() {
        this.meta = {
            messages: {
				layerbreaker: '������ ������������ ����. ��� �� �������� ������ � {{from}} ������, ������������ ������ ��������: [{{allowed}}]'
            },
            docs: {
                url: 'https://github.com/microsoft/vscode/wiki/Source-Code-Organization'
            }
        };
    }
    create(context) {
        const fileDirname = (0, path_1.dirname)(context.getFilename());
        const parts = fileDirname.split(/\\|\//);
        const ruleArgs = context.options[0];
        let config;
        for (let i = parts.length - 1; i >= 0; i--) {
            if (ruleArgs[parts[i]]) {
                config = {
                    allowed: new Set(ruleArgs[parts[i]]).add(parts[i]),
                    disallowed: new Set()
                };
                Object.keys(ruleArgs).forEach(key => {
                    if (!config.allowed.has(key)) {
                        config.disallowed.add(key);
                    }
                });
                break;
            }
        }
        if (!config) {
            // ������ ������.
            return {};
        }
        return (0, utils_1.createImportRuleListener)((node, path) => {
            if (path[0] === '.') {
                path = (0, path_1.join)((0, path_1.dirname)(context.getFilename()), path);
            }
            const parts = (0, path_1.dirname)(path).split(/\\|\//);
            for (let i = parts.length - 1; i >= 0; i--) {
                const part = parts[i];
                if (config.allowed.has(part)) {
                    // GOOD ������ - ����� �� ����.
                    break;
                }
                if (config.disallowed.has(part)) {
                    // BAD ����� - ������������ ����.
                    context.report({
                        loc: node.loc,
                        messageId: 'layerbreaker',
                        data: {
                            from: part,
                            allowed: [...config.allowed.keys()].join(', ')
                        }
                    });
                    break;
                }
            }
        });
    }
};
