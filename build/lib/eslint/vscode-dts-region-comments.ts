/*---------------------------------------------------------------------------------------------
 *  Авторское право (c) Корпорации Майкрософт. Все права защищены.
* Лицензировано в соответствии с лицензией MIT.
*  Информацию о лицензии смотрите в License.txt, в корневом каталоге проекта.
 *--------------------------------------------------------------------------------------------*/

import * as eslint from 'eslint';

export = new class ApiEventNaming implements eslint.Rule.RuleModule {

	readonly meta: eslint.Rule.RuleMetaData = {
		messages: {
			comment: 'Комментарии к региону должны начинаться со ссылки на проблему GH, например #region https://github.com/microsoft/vscode/issues/<number>',
		}
	};

	create(context: eslint.Rule.RuleContext): eslint.Rule.RuleListener {

		const sourceCode = context.getSourceCode();


		return {
			['Program']: (_node: any) => {

				for (let comment of sourceCode.getAllComments()) {
					if (comment.type !== 'Line') {
						continue;
					}
					if (!comment.value.match(/^\s*#region /)) {
						continue;
					}
					if (!comment.value.match(/https:\/\/github.com\/microsoft\/vscode\/issues\/\d+/i)) {
						context.report({
							node: <any>comment,
							messageId: 'comment',
						});
					}
				}
			}
		};
	}
};
