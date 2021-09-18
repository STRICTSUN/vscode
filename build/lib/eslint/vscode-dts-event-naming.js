"use strict";
/*---------------------------------------------------------------------------------------------
 *  Авторское право (c) Корпорации Майкрософт. Все права защищены.
* Лицензировано в соответствии с лицензией MIT.
*  Информацию о лицензии смотрите в License.txt, в корневом каталоге проекта.
 *--------------------------------------------------------------------------------------------*/
var _a;
const experimental_utils_1 = require("@typescript-eslint/experimental-utils");
module.exports = new (_a = class ApiEventNaming {
        constructor() {
            this.meta = {
                docs: {
                    url: 'https://github.com/microsoft/vscode/wiki/Extension-API-guidelines#event-naming'
                },
                messages: {
					naming: 'Названия событий должны соответствовать этому шаблону: `on[Did|Will]<Verb><Subject>`',
					verb: 'Неизвестный глагол \'{{verb}}\' - это действительно глагол? Если это так, то добавьте этот глагол в конфигурацию.',
					subject: 'Неизвестный суб-объект \'{{subject}}\' - Этот объект ранее не использовался, но он должен ссылаться на что-то в API.',
					unknown: 'Объявление НЕИЗВЕСТНОГО события, lint-правило нуждается в настройке.'
                }
            };
        }
        create(context) {
            const config = context.options[0];
            const allowed = new Set(config.allowed);
            const verbs = new Set(config.verbs);
            return {
                ['TSTypeAnnotation TSTypeReference Identifier[name="Event"]']: (node) => {
                    var _a, _b;
                    const def = (_b = (_a = node.parent) === null || _a === void 0 ? void 0 : _a.parent) === null || _b === void 0 ? void 0 : _b.parent;
                    const ident = this.getIdent(def);
                    if (!ident) {
                        // Событие на неизвестной структуре ...
                        return context.report({
                            node,
                            message: 'unknown'
                        });
                    }
                    if (allowed.has(ident.name)) {
                        // Настроенное исключение.
                        return;
                    }
                    const match = ApiEventNaming._nameRegExp.exec(ident.name);
                    if (!match) {
                        context.report({
                            node: ident,
                            messageId: 'naming'
                        });
                        return;
                    }
                    // Убедитесь, что <verb> написан (настроен) как глагол.
                    if (!verbs.has(match[2].toLowerCase())) {
                        context.report({
                            node: ident,
                            messageId: 'verb',
                            data: { verb: match[2] }
                        });
                    }
                    // Проверка, возник ли объект (если есть).
                    if (match[3]) {
                        const regex = new RegExp(match[3], 'ig');
                        const parts = context.getSourceCode().getText().split(regex);
                        if (parts.length < 3) {
                            context.report({
                                node: ident,
                                messageId: 'subject',
                                data: { subject: match[3] }
                            });
                        }
                    }
                }
            };
        }
        getIdent(def) {
            if (!def) {
                return;
            }
            if (def.type === experimental_utils_1.AST_NODE_TYPES.Identifier) {
                return def;
            }
            else if ((def.type === experimental_utils_1.AST_NODE_TYPES.TSPropertySignature || def.type === experimental_utils_1.AST_NODE_TYPES.ClassProperty) && def.key.type === experimental_utils_1.AST_NODE_TYPES.Identifier) {
                return def.key;
            }
            return this.getIdent(def.parent);
        }
    },
    _a._nameRegExp = /on(Did|Will)([A-Z][a-z]+)([A-Z][a-z]+)?/,
    _a);
