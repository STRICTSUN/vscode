"use strict";
/*---------------------------------------------------------------------------------------------
 *  ��������� ����� (c) ���������� ����������. ��� ����� ��������.
* ������������� � ������������ � ��������� MIT.
*  ���������� � �������� �������� � License.txt, � �������� �������� �������.
 *--------------------------------------------------------------------------------------------*/
module.exports = new class ApiVsCodeInComments {
    constructor() {
        this.meta = {
            messages: {
				comment: `�� ����������� ������ 'vs code' � ������������.`
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
                        // ��������� ������������� 'VS Code' � ��������.
                        if (comment.value[match.index - 1] === `'` && comment.value[match.index + match[0].length] === `'`) {
                            continue;
                        }
                        // ���� ��� eslint �������� �������������.
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
