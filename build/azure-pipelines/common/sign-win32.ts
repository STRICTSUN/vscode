/*---------------------------------------------------------------------------------------------
 * ��������� ����� (c) ���������� ����������. ��� ����� ��������.
 *  ������������� � ������������ � ��������� MIT.
 *  ���������� � �������� �������� � License.txt, � �������� �������� �������.
 *--------------------------------------------------------------------------------------------*/

import { main } from './sign';
import * as path from 'path';

main([
	process.env['EsrpCliDllPath']!,
	'windows',
	process.env['ESRPPKI']!,
	process.env['ESRPAADUsername']!,
	process.env['ESRPAADPassword']!,
	path.dirname(process.argv[2]),
	path.basename(process.argv[2])
]);
