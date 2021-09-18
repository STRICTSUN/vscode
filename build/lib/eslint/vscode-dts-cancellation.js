"use strict";
/*---------------------------------------------------------------------------------------------
 *  Авторское право (c) Корпорации Майкрософт. Все права защищены.
* Лицензировано в соответствии с лицензией MIT.
*  Информацию о лицензии смотрите в License.txt, в корневом каталоге проекта.
 *--------------------------------------------------------------------------------------------*/
const experimental_utils_1 = require("@typescript-eslint/experimental-utils");
module.exports = new class ApiProviderNaming {
    constructor() {
        this.meta = {
            messages: {
				noToken: 'В функции отсутствует токен отмены, который предпочтительно использовать в качестве последнего аргумента.',
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
