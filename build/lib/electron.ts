/*---------------------------------------------------------------------------------------------
 * Авторское право (c) Корпорации Майкрософт. Все права защищены.
 * Лицензировано в соответствии с лицензией MIT.
 *  Информацию о лицензии смотрите в License.txt, в корневом каталоге проекта.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import * as fs from 'fs';
import * as path from 'path';
import * as vfs from 'vinyl-fs';
import * as filter from 'gulp-filter';
import * as _ from 'underscore';
import * as util from './util';

type DarwinDocumentSuffix = 'document' | 'script' | 'file' | 'source code';
type DarwinDocumentType = {
	name: string,
	role: string,
	ostypes: string[],
	extensions: string[],
	iconFile: string,
};

function isDocumentSuffix(str?: string): str is DarwinDocumentSuffix {
	return str === 'document' || str === 'script' || str === 'file' || str === 'source code';
}

const root = path.dirname(path.dirname(__dirname));
const product = JSON.parse(fs.readFileSync(path.join(root, 'product.json'), 'utf8'));
const commit = util.getVersion(root);

const darwinCreditsTemplate = product.darwinCredits && _.template(fs.readFileSync(path.join(root, product.darwinCredits), 'utf8'));

/**
 * Создание `DarwinDocumentType` с учётом списка расширений файлов, названия значка и необязательного суффикса или названия типа файла.
 * @param extensions Список расширений файлов, например `['bat', 'cmd']`
 * @param icon Название типа файла в виде предложения, которое совпадает с названием ресурса значка darwin в нижнем регистре.
 * Например, HTML вместо html или Java вместо java.
 * Этот параметр переводится в нижний регистр, прежде чем он будет использоваться для ссылки на файл значка.
 * @param nameOrSuffix Произвольный суффикс или строка для использования в качестве типа файла.
 * Если указан суффикс, он используется с параметром значка для создания строки типа файла.
 * Если ничего не указано, `'document'` используется с параметром icon для создания строки типа файла.
 *
 * Например, если вы вызываете 'darwinBundleDocumentType(..., 'HTML')', результирующий тип файла '"HTML document"' и используется значок ''html'' darwin.
 *
 * Если вы называете 'darwinBundleDocumentType(..., 'Javascript', 'file')', результирующий тип файла будет `"Javascript file"`.
 * И используется значок `'javascript'`  darwin.
 *
 * Если вы вызываете 'darwinBundleDocumentType(..., 'bat', 'Windows command script')', тип файла '"Windows command script"', и используется значок ''bat'' darwin.
 */
function darwinBundleDocumentType(extensions: string[], icon: string, nameOrSuffix?: string | DarwinDocumentSuffix): DarwinDocumentType {
    // Если задан суффикс, сгенерируйте из него имя.
	// Если ничего не дано, по умолчанию используется значение 'document'.
	if (isDocumentSuffix(nameOrSuffix) || !nameOrSuffix) {
		nameOrSuffix = icon.charAt(0).toUpperCase() + icon.slice(1) + ' ' + (nameOrSuffix ?? 'document');
	}

	return {
		name: nameOrSuffix,
		role: 'Editor',
		ostypes: ['TEXT', 'utxt', 'TUTX', '****'],
		extensions: extensions,
		iconFile: 'resources/darwin/' + icon + '.icns'
	};
}

/**
 * Создайте несколько`DarwinDocumentType` с уникальными названиями и общим значком.
 * @param types Сопоставление названий типов файлов с соответствующими им расширениями файлов.
 * @param icon Ресурс значка darwin для использования. Например, `'HTML'`будет относиться к `resources/darwin/html.icns`
 *
 *Примеры:
 * ```
 * darwinBundleDocumentTypes({ 'Файл заголовка Cи': 'h', 'Исходный код Cи': 'c' },'c')
 * darwinBundleDocumentTypes({ 'Исходный код React': ['jsx', 'tsx'] }, 'react')
 * ```
 */
function darwinBundleDocumentTypes(types: { [name: string]: string | string[] }, icon: string): DarwinDocumentType[] {
	return Object.keys(types).map((name: string): DarwinDocumentType => {
		const extensions = types[name];
		return {
			name: name,
			role: 'Editor',
			ostypes: ['TEXT', 'utxt', 'TUTX', '****'],
			extensions: Array.isArray(extensions) ? extensions : [extensions],
			iconFile: 'resources/darwin/' + icon + '.icns',
		} as DarwinDocumentType;
	});
}

export const config = {
	version: util.getElectronVersion(),
	productAppName: product.nameLong,
	companyName: 'Корпорация Майкрософт',
	copyright: 'Авторское право (C) 2021 Майкрософт. Все права защищены',
	darwinIcon: 'resources/darwin/code.icns',
	darwinBundleIdentifier: product.darwinBundleIdentifier,
	darwinApplicationCategoryType: 'public.app-category.developer-tools',
	darwinHelpBookFolder: 'VS Code HelpBook',
	darwinHelpBookName: 'VS Code HelpBook',
	darwinBundleDocumentTypes: [
		...darwinBundleDocumentTypes({ 'C header file': 'h', 'C source code': 'c' }, 'c'),
		...darwinBundleDocumentTypes({ 'Git configuration file': ['gitattributes', 'gitconfig', 'gitignore'] }, 'config'),
		...darwinBundleDocumentTypes({ 'HTML template document': ['asp', 'aspx', 'cshtml', 'jshtm', 'jsp', 'phtml', 'shtml'] }, 'html'),
		darwinBundleDocumentType(['bat', 'cmd'], 'bat', 'Windows command script'),
		darwinBundleDocumentType(['bowerrc'], 'Bower'),
		darwinBundleDocumentType(['config', 'editorconfig', 'ini', 'cfg'], 'config', 'Configuration file'),
		darwinBundleDocumentType(['hh', 'hpp', 'hxx', 'h++'], 'cpp', 'C++ header file'),
		darwinBundleDocumentType(['cc', 'cpp', 'cxx', 'c++'], 'cpp', 'C++ source code'),
		darwinBundleDocumentType(['m'], 'default', 'Objective-C source code'),
		darwinBundleDocumentType(['mm'], 'cpp', 'Objective-C++ source code'),
		darwinBundleDocumentType(['cs', 'csx'], 'csharp', 'C# source code'),
		darwinBundleDocumentType(['css'], 'css', 'CSS'),
		darwinBundleDocumentType(['go'], 'go', 'Go source code'),
		darwinBundleDocumentType(['htm', 'html', 'xhtml'], 'HTML'),
		darwinBundleDocumentType(['jade'], 'Jade'),
		darwinBundleDocumentType(['jav', 'java'], 'Java'),
		darwinBundleDocumentType(['js', 'jscsrc', 'jshintrc', 'mjs', 'cjs'], 'Javascript', 'file'),
		darwinBundleDocumentType(['json'], 'JSON'),
		darwinBundleDocumentType(['less'], 'Less'),
		darwinBundleDocumentType(['markdown', 'md', 'mdoc', 'mdown', 'mdtext', 'mdtxt', 'mdwn', 'mkd', 'mkdn'], 'Markdown'),
		darwinBundleDocumentType(['php'], 'PHP', 'source code'),
		darwinBundleDocumentType(['ps1', 'psd1', 'psm1'], 'Powershell', 'script'),
		darwinBundleDocumentType(['py', 'pyi'], 'Python', 'script'),
		darwinBundleDocumentType(['gemspec', 'rb', 'erb'], 'Ruby', 'source code'),
		darwinBundleDocumentType(['scss', 'sass'], 'SASS', 'file'),
		darwinBundleDocumentType(['sql'], 'SQL', 'script'),
		darwinBundleDocumentType(['ts'], 'TypeScript', 'file'),
		darwinBundleDocumentType(['tsx', 'jsx'], 'React', 'source code'),
		darwinBundleDocumentType(['vue'], 'Vue', 'source code'),
		darwinBundleDocumentType(['ascx', 'csproj', 'dtd', 'plist', 'wxi', 'wxl', 'wxs', 'xml', 'xaml'], 'XML'),
		darwinBundleDocumentType(['eyaml', 'eyml', 'yaml', 'yml'], 'YAML'),
		darwinBundleDocumentType([
			'bash', 'bash_login', 'bash_logout', 'bash_profile', 'bashrc',
			'profile', 'rhistory', 'rprofile', 'sh', 'zlogin', 'zlogout',
			'zprofile', 'zsh', 'zshenv', 'zshrc'
		], 'Shell', 'script'),
		// Значок по умолчанию с указанными названиями.
		...darwinBundleDocumentTypes({
			'Clojure source code': ['clj', 'cljs', 'cljx', 'clojure'],
			'VS Code workspace file': 'code-workspace',
			'CoffeeScript source code': 'coffee',
			'Comma Separated Values': 'csv',
			'CMake script': 'cmake',
			'Dart script': 'dart',
			'Diff file': 'diff',
			'Dockerfile': 'dockerfile',
			'Gradle file': 'gradle',
			'Groovy script': 'groovy',
			'Makefile': ['makefile', 'mk'],
			'Lua script': 'lua',
			'Pug document': 'pug',
			'Jupyter': 'ipynb',
			'Lockfile': 'lock',
			'Log file': 'log',
			'Plain Text File': 'txt',
			'Xcode project file': 'xcodeproj',
			'Xcode workspace file': 'xcworkspace',
			'Visual Basic script': 'vb',
			'R source code': 'r',
			'Rust source code': 'rs',
			'Restructured Text document': 'rst',
			'LaTeX document': ['tex', 'cls'],
			'F# source code': 'fs',
			'F# signature file': 'fsi',
			'F# script': ['fsx', 'fsscript'],
			'SVG document': ['svg', 'svgz'],
			'TOML document': 'toml',
		}, 'default'),
		// Значок по умолчанию с названием по умолчанию.
		darwinBundleDocumentType([
			'containerfile', 'ctp', 'dot', 'edn', 'handlebars', 'hbs', 'ml', 'mli',
			'pl', 'pl6', 'pm', 'pm6', 'pod', 'pp', 'properties', 'psgi', 'rt', 't'
		], 'default', product.nameLong + ' document')
	],
	darwinBundleURLTypes: [{
		role: 'Viewer',
		name: product.nameLong,
		urlSchemes: [product.urlProtocol]
	}],
	darwinForceDarkModeSupport: true,
	darwinCredits: darwinCreditsTemplate ? Buffer.from(darwinCreditsTemplate({ commit: commit, date: new Date().toISOString() })) : undefined,
	linuxExecutableName: product.applicationName,
	winIcon: 'resources/win32/code.ico',
	token: process.env['VSCODE_MIXIN_PASSWORD'] || process.env['GITHUB_TOKEN'] || undefined,
	repo: product.electronRepository || undefined
};

function getElectron(arch: string): () => NodeJS.ReadWriteStream {
	return () => {
		const electron = require('gulp-atom-electron');
		const json = require('gulp-json-editor') as typeof import('gulp-json-editor');

		const electronOpts = _.extend({}, config, {
			platform: process.platform,
			arch: arch === 'armhf' ? 'arm' : arch,
			ffmpegChromium: true,
			keepDefaultApp: true
		});

		return vfs.src('package.json')
			.pipe(json({ name: product.nameShort }))
			.pipe(electron(electronOpts))
			.pipe(filter(['**', '!**/app/package.json']))
			.pipe(vfs.dest('.build/electron'));
	};
}

async function main(arch = process.arch): Promise<void> {
	const version = util.getElectronVersion();
	const electronPath = path.join(root, '.build', 'electron');
	const versionFile = path.join(electronPath, 'version');
	const isUpToDate = fs.existsSync(versionFile) && fs.readFileSync(versionFile, 'utf8') === `${version}`;

	if (!isUpToDate) {
		await util.rimraf(electronPath)();
		await util.streamToPromise(getElectron(arch)());
	}
}

if (require.main === module) {
	main(process.argv[2]).catch(err => {
		console.error(err);
		process.exit(1);
	});
}
