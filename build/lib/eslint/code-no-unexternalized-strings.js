"use strict";
/*---------------------------------------------------------------------------------------------
*  Авторское право (c) Корпорации Майкрософт. Все права защищены.
* Лицензировано в соответствии с лицензией MIT.
*  Информацию о лицензии смотрите в License.txt, в корневом каталоге проекта.
 *--------------------------------------------------------------------------------------------*/
var _a;
const experimental_utils_1 = require("@typescript-eslint/experimental-utils");
function isStringLiteral(node) {
    return !!node && node.type === experimental_utils_1.AST_NODE_TYPES.Literal && typeof node.value === 'string';
}
function isDoubleQuoted(node) {
    return node.raw[0] === '"' && node.raw[node.raw.length - 1] === '"';
}
module.exports = new (_a = class NoUnexternalizedStrings {
        constructor() {
            this.meta = {
                messages: {
					doubleQuoted: 'Используйте строки в двойных кавычках только для внешних строк.',
					badKey: 'Ключ \'{{key}}\' не соответствует действительному идентификатору локализации.',
					duplicateKey: 'Дубликат ключа \'{{key}}\' с другим значением сообщения.',
					badMessage: 'Аргумент сообщения для \'{{message}}\' должен быть строковым литералом.'
                }
            };
        }
        create(context) {
            const externalizedStringLiterals = new Map();
            const doubleQuotedStringLiterals = new Set();
            function collectDoubleQuotedStrings(node) {
                if (isStringLiteral(node) && isDoubleQuoted(node)) {
                    doubleQuotedStringLiterals.add(node);
                }
            }
            function visitLocalizeCall(node) {
                // localize(key, message)
                const [keyNode, messageNode] = node.arguments;
                // (1)
                // Извлечение ключа, чтобы его можно было проверить позже.
                let key;
                if (isStringLiteral(keyNode)) {
                    doubleQuotedStringLiterals.delete(keyNode);
                    key = keyNode.value;
                }
                else if (keyNode.type === experimental_utils_1.AST_NODE_TYPES.ObjectExpression) {
                    for (let property of keyNode.properties) {
                        if (property.type === experimental_utils_1.AST_NODE_TYPES.Property && !property.computed) {
                            if (property.key.type === experimental_utils_1.AST_NODE_TYPES.Identifier && property.key.name === 'key') {
                                if (isStringLiteral(property.value)) {
                                    doubleQuotedStringLiterals.delete(property.value);
                                    key = property.value.value;
                                    break;
                                }
                            }
                        }
                    }
                }
                if (typeof key === 'string') {
                    let array = externalizedStringLiterals.get(key);
                    if (!array) {
                        array = [];
                        externalizedStringLiterals.set(key, array);
                    }
                    array.push({ call: node, message: messageNode });
                }
                // (2)
                // Удалите аргумент-сообщение из списка doubleQuoted и убедитесь, что это строковый литерал.
                doubleQuotedStringLiterals.delete(messageNode);
                if (!isStringLiteral(messageNode)) {
                    context.report({
                        loc: messageNode.loc,
                        messageId: 'badMessage',
                        data: { message: context.getSourceCode().getText(node) }
                    });
                }
            }
            function reportBadStringsAndBadKeys() {
                // (1)
                // Сообщать обо всех строках, заключённых в двойные кавычки.
                for (const node of doubleQuotedStringLiterals) {
                    context.report({ loc: node.loc, messageId: 'doubleQuoted' });
                }
                for (const [key, values] of externalizedStringLiterals) {
                    // (2)
                    // Сообщать обо всех недействительных ключах NLS.
                    if (!key.match(NoUnexternalizedStrings._rNlsKeys)) {
                        for (let value of values) {
                            context.report({ loc: value.call.loc, messageId: 'badKey', data: { key } });
                        }
                    }
                    // (2)
                    // Сообщать обо всех недопустимых дубликатах - такой  же ключ, другое сообщение.
                    if (values.length > 1) {
                        for (let i = 1; i < values.length; i++) {
                            if (context.getSourceCode().getText(values[i - 1].message) !== context.getSourceCode().getText(values[i].message)) {
                                context.report({ loc: values[i].call.loc, messageId: 'duplicateKey', data: { key } });
                            }
                        }
                    }
                }
            }
            return {
                ['Literal']: (node) => collectDoubleQuotedStrings(node),
                ['ExpressionStatement[directive] Literal:exit']: (node) => doubleQuotedStringLiterals.delete(node),
                ['CallExpression[callee.type="MemberExpression"][callee.object.name="nls"][callee.property.name="localize"]:exit']: (node) => visitLocalizeCall(node),
                ['CallExpression[callee.name="localize"][arguments.length>=2]:exit']: (node) => visitLocalizeCall(node),
                ['Program:exit']: reportBadStringsAndBadKeys,
            };
        }
    },
    _a._rNlsKeys = /^[_a-zA-Z0-9][ .\-_a-zA-Z0-9]*$/,
    _a);
