/*---------------------------------------------------------------------------------------------
 * Авторское право (c) Корпорации Майкрософт. Все права защищены.
 *  Лицензировано в соответствии с лицензией MIT.
 *  Информацию о лицензии смотрите в License.txt, в корневом каталоге проекта.
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
