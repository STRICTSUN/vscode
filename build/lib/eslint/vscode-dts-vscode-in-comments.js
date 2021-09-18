"use strict";
/*---------------------------------------------------------------------------------------------
 *  Авторское право (c) Корпорации Майкрософт. Все права защищены.
* Лицензировано в соответствии с лицензией MIT.
*  Информацию о лицензии смотрите в License.txt, в корневом каталоге проекта.
 *--------------------------------------------------------------------------------------------*/
module.exports = new class ApiVsCodeInComments {
    constructor() {
        this.meta = {
            messages: {
				comment: `Не используйте термин 'vs code' в комментариях.`
            }
        };
    }
    create(context) {
        const sourceCode = context.getSourceCode();
        return {
            ['Program']: (_node) => {
                for (const comment of sourceCode.getAllComments()) {
                    if (comment.type !== 'Block') {
                        continue;
                    }
                    if (!comment.range) {
                        continue;
                    }
                    const startIndex = comment.range[0] + '/*'.length;
                    const re = /vs code/ig;
                    let match;
                    while ((match = re.exec(comment.value))) {
                        // Разрешите использование 'VS Code' в кавычках.
                        if (comment.value[match.index - 1] === `'` && comment.value[match.index + match[0].length] === `'`) {
                            continue;
                        }
                        // Типы для eslint выглядят некорректными.
                        const start = sourceCode.getLocFromIndex(startIndex + match.index);
                        const end = sourceCode.getLocFromIndex(startIndex + match.index + match[0].length);
                        context.report({
                            messageId: 'comment',
                            loc: { start, end }
                        });
                    }
                }
            }
        };
    }
};
