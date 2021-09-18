/*---------------------------------------------------------------------------------------------
 *  ��������� ����� (c) ���������� ����������. ��� ����� ��������.
* ������������� � ������������ � ��������� MIT.
*  ���������� � �������� �������� � License.txt, � �������� �������� �������.
 *--------------------------------------------------------------------------------------------*/

import * as eslint from 'eslint';
import { TSESTree, AST_NODE_TYPES } from '@typescript-eslint/experimental-utils';

export = new class ApiEventNaming implements eslint.Rule.RuleModule {

	private static _nameRegExp = /on(Did|Will)([A-Z][a-z]+)([A-Z][a-z]+)?/;

	readonly meta: eslint.Rule.RuleMetaData = {
		docs: {
			url: 'https://github.com/microsoft/vscode/wiki/Extension-API-guidelines#event-naming'
		},
		messages: {
			naming: '�������� ������� ������ ��������������� ����� �������: `on[Did|Will]<Verb><Subject>`',
			verb: '����������� ������ \'{{verb}}\' - ��� ������������� ������? ���� ��� ���, �� �������� ���� ������ � ������������.',
			subject: '����������� ���-������ \'{{subject}}\' - ���� ������ ����� �� �������������, �� �� ������ ��������� �� ���-�� � API.',
			unknown: '���������� ������������ �������, lint-������� ��������� � ���������.'
		}
	};

	create(context: eslint.Rule.RuleContext): eslint.Rule.RuleListener {

		const config = <{ allowed: string[], verbs: string[] }>context.options[0];
		const allowed = new Set(config.allowed);
		const verbs = new Set(config.verbs);

		return {
			['TSTypeAnnotation TSTypeReference Identifier[name="Event"]']: (node: any) => {

				const def = (<TSESTree.Identifier>node).parent?.parent?.parent;
				const ident = this.getIdent(def);

				if (!ident) {
					//  ������� �� ����������� ��������� ...
					return context.report({
						node,
						message: 'unknown'
					});
				}

				if (allowed.has(ident.name)) {
					//����������� ����������.
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

				//  ���������, ��� <verb> ������� (��������) ��� ������.
				if (!verbs.has(match[2].toLowerCase())) {
					context.report({
						node: ident,
						messageId: 'verb',
						data: { verb: match[2] }
					});
				}

				// ��������, ������ �� ������ (���� ����).
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

	private getIdent(def: TSESTree.Node | undefined): TSESTree.Identifier | undefined {
		if (!def) {
			return;
		}

		if (def.type === AST_NODE_TYPES.Identifier) {
			return def;
		} else if ((def.type === AST_NODE_TYPES.TSPropertySignature || def.type === AST_NODE_TYPES.ClassProperty) && def.key.type === AST_NODE_TYPES.Identifier) {
			return def.key;
		}

		return this.getIdent(def.parent);
	}
};

