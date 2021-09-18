"use strict";
/*---------------------------------------------------------------------------------------------
 *  ��������� ����� (c) ���������� ����������. ��� ����� ��������.
* ������������� � ������������ � ��������� MIT.
*  ���������� � �������� �������� � License.txt, � �������� �������� �������.
 *--------------------------------------------------------------------------------------------*/
module.exports = new class ApiLiteralOrTypes {
    constructor() {
        this.meta = {
            docs: { url: 'https://github.com/microsoft/vscode/wiki/Extension-API-guidelines#enums' },
			messages: { useEnum: '����������� ������������, � �� �������� ��� ����.', }
        };
    }
    create(context) {
        return {
            ['TSTypeAnnotation TSUnionType']: (node) => {
                if (node.types.every(value => value.type === 'TSLiteralType')) {
                    context.report({
                        node: node,
                        messageId: 'useEnum'
                    });
                }
            }
        };
    }
};
