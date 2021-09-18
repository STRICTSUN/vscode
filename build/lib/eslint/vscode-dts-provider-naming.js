"use strict";
/*---------------------------------------------------------------------------------------------
 *  Авторское право (c) Корпорации Майкрософт. Все права защищены.
* Лицензировано в соответствии с лицензией MIT.
*  Информацию о лицензии смотрите в License.txt, в корневом каталоге проекта.
 *--------------------------------------------------------------------------------------------*/
var _a;
module.exports = new (_a = class ApiProviderNaming {
        constructor() {
            this.meta = {
                messages: {
					naming: 'У провайдера должны быть только такие функции, как provideXYZ или resolveXYZ.',
                }
            };
        }
        create(context) {
            const config = context.options[0];
            const allowed = new Set(config.allowed);
            return {
                ['TSInterfaceDeclaration[id.name=/.+Provider/] TSMethodSignature']: (node) => {
                    var _a;
                    const interfaceName = ((_a = node.parent) === null || _a === void 0 ? void 0 : _a.parent).id.name;
                    if (allowed.has(interfaceName)) {
                        // Разрешено.
                        return;
                    }
                    const methodName = node.key.name;
                    if (!ApiProviderNaming._providerFunctionNames.test(methodName)) {
                        context.report({
                            node,
                            messageId: 'naming'
                        });
                    }
                }
            };
        }
    },
    _a._providerFunctionNames = /^(provide|resolve|prepare).+/,
    _a);
