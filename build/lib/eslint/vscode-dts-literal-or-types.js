"use strict";
/*---------------------------------------------------------------------------------------------
 *  Авторское право (c) Корпорации Майкрософт. Все права защищены.
* Лицензировано в соответствии с лицензией MIT.
*  Информацию о лицензии смотрите в License.txt, в корневом каталоге проекта.
 *--------------------------------------------------------------------------------------------*/
module.exports = new class ApiLiteralOrTypes {
    constructor() {
        this.meta = {
            docs: { url: 'https://github.com/microsoft/vscode/wiki/Extension-API-guidelines#enums' },
			messages: { useEnum: 'Используйте перечисления, а не литералы или типы.', }
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
