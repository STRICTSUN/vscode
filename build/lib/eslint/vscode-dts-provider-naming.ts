/*---------------------------------------------------------------------------------------------
 *  ��������� ����� (c) ���������� ����������. ��� ����� ��������.
* ������������� � ������������ � ��������� MIT.
*  ���������� � �������� �������� � License.txt, � �������� �������� �������.
 *--------------------------------------------------------------------------------------------*/

import * as eslint from 'eslint';
import { TSESTree } from '@typescript-eslint/experimental-utils';

export = new class ApiProviderNaming implements eslint.Rule.RuleModule {

	readonly meta: eslint.Rule.RuleMetaData = {
		messages: {
			naming: '� ���������� ������ ���� ������ ����� �������, ��� provideXYZ ��� resolveXYZ.',
		}
	};

	private static _providerFunctionNames = /^(provide|resolve|prepare).+/;

	create(context: eslint.Rule.RuleContext): eslint.Rule.RuleListener {

		const config = <{ allowed: string[] }>context.options[0];
		const allowed = new Set(config.allowed);

		return {
			['TSInterfaceDeclaration[id.name=/.+Provider/] TSMethodSignature']: (node: any) => {


				const interfaceName = (<TSESTree.TSInterfaceDeclaration>(<TSESTree.Identifier>node).parent?.parent).id.name;
				if (allowed.has(interfaceName)) {
					// ���������.
					return;
				}

				const methodName = (<any>(<TSESTree.TSMethodSignatureNonComputedName>node).key).name;

				if (!ApiProviderNaming._providerFunctionNames.test(methodName)) {
					context.report({
						node,
						messageId: 'naming'
					});
				}
			}
		};
	}
};
