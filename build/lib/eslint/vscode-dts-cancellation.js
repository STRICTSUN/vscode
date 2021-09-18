"use strict";
/*---------------------------------------------------------------------------------------------
 *  ��������� ����� (c) ���������� ����������. ��� ����� ��������.
* ������������� � ������������ � ��������� MIT.
*  ���������� � �������� �������� � License.txt, � �������� �������� �������.
 *--------------------------------------------------------------------------------------------*/
const experimental_utils_1 = require("@typescript-eslint/experimental-utils");
module.exports = new class ApiProviderNaming {
    constructor() {
        this.meta = {
            messages: {
				noToken: '� ������� ����������� ����� ������, ������� ��������������� ������������ � �������� ���������� ���������.',
            }
        };
    }
    create(context) {
        return {
            ['TSInterfaceDeclaration[id.name=/.+Provider/] TSMethodSignature[key.name=/^(provide|resolve).+/]']: (node) => {
                let found = false;
                for (let param of node.params) {
                    if (param.type === experimental_utils_1.AST_NODE_TYPES.Identifier) {
                        found = found || param.name === 'token';
                    }
                }
                if (!found) {
                    context.report({
                        node,
                        messageId: 'noToken'
                    });
                }
            }
        };
    }
};
