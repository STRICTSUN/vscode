/*---------------------------------------------------------------------------------------------
 *  Авторское право (c) Корпорации Майкрософт. Все права защищены.
* Лицензировано в соответствии с лицензией MIT.
*  Информацию о лицензии смотрите в License.txt, в корневом каталоге проекта.
 *--------------------------------------------------------------------------------------------*/

import * as eslint from 'eslint';
import { join } from 'path';
import { createImportRuleListener } from './utils';

export = new class NoNlsInStandaloneEditorRule implements eslint.Rule.RuleModule {

	readonly meta: eslint.Rule.RuleMetaData = {
		messages: {
			badImport: 'Не разрешено импортировать автономные модули редактора.'
		},
		docs: {
			url: 'https://github.com/microsoft/vscode/wiki/Source-Code-Organization'
		}
	};

	create(context: eslint.Rule.RuleContext): eslint.Rule.RuleListener {

		if (/vs(\/|\\)editor/.test(context.getFilename())) {
			//  В папке vs/editor разрешено использовать автономный редактор.
			return {};
		}

		return createImportRuleListener((node, path) => {

			// Разрешить относительные пути.
			if (path[0] === '.') {
				path = join(context.getFilename(), path);
			}

			if (
				/vs(\/|\\)editor(\/|\\)standalone(\/|\\)/.test(path)
				|| /vs(\/|\\)editor(\/|\\)common(\/|\\)standalone(\/|\\)/.test(path)
				|| /vs(\/|\\)editor(\/|\\)editor.api/.test(path)
				|| /vs(\/|\\)editor(\/|\\)editor.main/.test(path)
				|| /vs(\/|\\)editor(\/|\\)editor.worker/.test(path)
			) {
				context.report({
					loc: node.loc,
					messageId: 'badImport'
				});
			}
		});
	}
};

