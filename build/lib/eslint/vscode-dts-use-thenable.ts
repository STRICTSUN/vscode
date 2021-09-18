/*---------------------------------------------------------------------------------------------
 *  ��������� ����� (c) ���������� ����������. ��� ����� ��������.
* ������������� � ������������ � ��������� MIT.
*  ���������� � �������� �������� � License.txt, � �������� �������� �������.
 *--------------------------------------------------------------------------------------------*/

import * as eslint from 'eslint';

export = new class ApiEventNaming implements eslint.Rule.RuleModule {

	readonly meta: eslint.Rule.RuleMetaData = {
		messages: {
			usage: '����������� ��� Thenable ������ ���� Promise.',
		}
	};

	create(context: eslint.Rule.RuleContext): eslint.Rule.RuleListener {



		return {
			['TSTypeAnnotation TSTypeReference Identifier[name="Promise"]']: (node: any) => {

				context.report({
					node,
					messageId: 'usage',
				});
			}
		};
	}
};
