/*---------------------------------------------------------------------------------------------
 *  Авторское право (c) Корпорации Майкрософт. Все права защищены.
* Лицензировано в соответствии с лицензией MIT.
*  Информацию о лицензии смотрите в License.txt, в корневом каталоге проекта.
 *--------------------------------------------------------------------------------------------*/

import * as eslint from 'eslint';
import type * as estree from 'estree';

export = new class ApiVsCodeInComments implements eslint.Rule.RuleModule {

	readonly meta: eslint.Rule.RuleMetaData = {
		messages: {
			comment: `Не используйте термин 'vs code' в комментариях.`
		}
	};

	create(context: eslint.Rule.RuleContext): eslint.Rule.RuleListener {

		const sourceCode = context.getSourceCode();

		return {
			['Program']: (_node: any) => {

				for (const comment of sourceCode.getAllComments()) {
					if (comment.type !== 'Block') {
						continue;
					}
					if (!comment.range) {
						continue;
					}

					const startIndex = comment.range[0] + '/*'.length;
					const re = /vs code/ig;
					let match: RegExpExecArray | null;
					while ((match = re.exec(comment.value))) {
						// Разрешите использование 'VS Code' в кавычках.
						if (comment.value[match.index - 1] === `'` && comment.value[match.index + match[0].length] === `'`) {
							continue;
						}

						// Типы для eslint выглядят некорректными.
						const start = sourceCode.getLocFromIndex(startIndex + match.index) as any as estree.Position;
						const end = sourceCode.getLocFromIndex(startIndex + match.index + match[0].length) as any as estree.Position;
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
