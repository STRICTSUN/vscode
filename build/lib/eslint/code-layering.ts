/*---------------------------------------------------------------------------------------------
*  ��������� ����� (c) ���������� ����������. ��� ����� ��������.
* ������������� � ������������ � ��������� MIT.
*  ���������� � �������� �������� � License.txt, � �������� �������� �������.
 *--------------------------------------------------------------------------------------------*/

import * as eslint from 'eslint';
import { join, dirname } from 'path';
import { createImportRuleListener } from './utils';

type Config = {
	allowed: Set<string>;
	disallowed: Set<string>;
};

export = new class implements eslint.Rule.RuleModule {

	readonly meta: eslint.Rule.RuleMetaData = {
		messages: {
			layerbreaker: '������ ������������ ����. ��� �� �������� ������ � {{from}} ������, ������������ ������ ��������: [{{allowed}}]'
		},
		docs: {
			url: 'https://github.com/microsoft/vscode/wiki/Source-Code-Organization'
		}
	};

	create(context: eslint.Rule.RuleContext): eslint.Rule.RuleListener {

		const fileDirname = dirname(context.getFilename());
		const parts = fileDirname.split(/\\|\//);
		const ruleArgs = <Record<string, string[]>>context.options[0];

		let config: Config | undefined;
		for (let i = parts.length - 1; i >= 0; i--) {
			if (ruleArgs[parts[i]]) {
				config = {
					allowed: new Set(ruleArgs[parts[i]]).add(parts[i]),
					disallowed: new Set()
				};
				Object.keys(ruleArgs).forEach(key => {
					if (!config!.allowed.has(key)) {
						config!.disallowed.add(key);
					}
				});
				break;
			}
		}

		if (!config) {
			// ������ ������.
			return {};
		}

		return createImportRuleListener((node, path) => {
			if (path[0] === '.') {
				path = join(dirname(context.getFilename()), path);
			}

			const parts = dirname(path).split(/\\|\//);
			for (let i = parts.length - 1; i >= 0; i--) {
				const part = parts[i];

				if (config!.allowed.has(part)) {
					//  GOOD ������ - ����� �� ����.
					break;
				}

				if (config!.disallowed.has(part)) {
					//BAD ����� - ������������ ����.
					context.report({
						loc: node.loc,
						messageId: 'layerbreaker',
						data: {
							from: part,
							allowed: [...config!.allowed.keys()].join(', ')
						}
					});
					break;
				}
			}
		});
	}
};

