"use strict";
/*---------------------------------------------------------------------------------------------
 *  ��������� ����� (c) ���������� ����������. ��� ����� ��������.
* ������������� � ������������ � ��������� MIT.
*  ���������� � �������� �������� � License.txt, � �������� �������� �������.
 *--------------------------------------------------------------------------------------------*/
var _a;
module.exports = new (_a = class ApiInterfaceNaming {
        constructor() {
            this.meta = {
                messages: {
					naming: '���������� �� ������ ���������� � ��������� ����� `I`.',
                }
            };
        }
        create(context) {
            return {
                ['TSInterfaceDeclaration Identifier']: (node) => {
                    const name = node.name;
                    if (ApiInterfaceNaming._nameRegExp.test(name)) {
                        context.report({
                            node,
                            messageId: 'naming'
                        });
                    }
                }
            };
        }
    },
    _a._nameRegExp = /I[A-Z]/,
    _a);
