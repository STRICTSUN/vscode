"use strict";
/*---------------------------------------------------------------------------------------------
 *  Авторское право (c) Корпорации Майкрософт. Все права защищены.
* Лицензировано в соответствии с лицензией MIT.
*  Информацию о лицензии смотрите в License.txt, в корневом каталоге проекта.
 *--------------------------------------------------------------------------------------------*/
module.exports = new class ApiEventNaming {
    constructor() {
        this.meta = {
            messages: {
				usage: 'Используйте тип Thenable вместо типа Promise.',
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
