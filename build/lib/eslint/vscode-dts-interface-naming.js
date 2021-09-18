"use strict";
/*---------------------------------------------------------------------------------------------
 *  Авторское право (c) Корпорации Майкрософт. Все права защищены.
* Лицензировано в соответствии с лицензией MIT.
*  Информацию о лицензии смотрите в License.txt, в корневом каталоге проекта.
 *--------------------------------------------------------------------------------------------*/
var _a;
module.exports = new (_a = class ApiInterfaceNaming {
        constructor() {
            this.meta = {
                messages: {
					naming: 'Интерфейсы не должны начинаться с заглавной буквы `I`.',
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
