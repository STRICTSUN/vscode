"use strict";
/*---------------------------------------------------------------------------------------------
 *  ��������� ����� (c) ���������� ����������. ��� ����� ��������.
* ������������� � ������������ � ��������� MIT.
*  ���������� � �������� �������� � License.txt, � �������� �������� �������.
 *--------------------------------------------------------------------------------------------*/
module.exports = new class ApiEventNaming {
    constructor() {
        this.meta = {
            messages: {
				usage: '����������� ��� Thenable ������ ���� Promise.',
            }
        };
    }
    create(context) {
        return {
            ['TSTypeAnnotation TSTypeReference Identifier[name="Promise"]']: (node) => {
                context.report({
                    node,
                    messageId: 'usage',
                });
            }
        };
    }
};
