// Определения типов для vinyl 0.4.3
// Проект: https://github.com/wearefractal/vinyl
//Определения по: vvakame <https://github.com/vvakame/>, jedmao <https://github.com/jedmao>
//  Определения: https://github.com/DefinitelyTyped/DefinitelyTyped

declare module "vinyl" {

	import fs = require("fs");

	/**
	 * Формат виртуального файла.
	 */
	class File {
		constructor(options?: {
			/**
			* По умолчанию: process.cwd() .
			*/
			cwd?: string;
			/**
			 * Используется для относительного пути. Обычно там, где начинается глобус.
			 */
			base?: string;
			/**
			 * Полный путь к файлу.
			 */
			path?: string;
			/**
			 * История пути. Не действует, если передан options.path.
			 */
			history?: string[];
			/**
			 * Результат вызова fs.stat. Смотрте доп-информацию в fs.Stats.
			 */
			stat?: fs.Stats;
			/**
			 * Содержимое файла.
			 * Тип: Buffer, Stream или null.
			 */
			contents?: Buffer | NodeJS.ReadWriteStream;
		});

		/**
		 * По умолчанию: process.cwd()
		 */
		public cwd: string;
		/**
		 * Используется для относительного пути. Обычно там, где начинается глобус.
		 */
		public base: string;
		/**
		 * Полный путь к файлу.
		 */
		public path: string;
		public stat: fs.Stats;
		/**
		 * Тип: Buffer|Stream|null (По умолчанию: null)
		 */
		public contents: Buffer | NodeJS.ReadableStream;
		/**
		 * Возвращает path.relative для базы файла и пути к файлу.
		 * Пример:
		 *  var file = new File({
		 *    cwd: "/",
		 *    base: "/test/",
		 *    path: "/test/file.js"
		 *  });
		 *  console.log(file.relative); // file.js
		 */
		public relative: string;

		public isBuffer(): boolean;

		public isStream(): boolean;

		public isNull(): boolean;

		public isDirectory(): boolean;

		/**
		 * Возвращает новый объект File со всеми клонированными атрибутами. Настраиваемые атрибуты глубоко клонированы.
		 */
		public clone(opts?: { contents?: boolean }): File;

		/**
		 * Если file.contents является Buffer, он запишет его в поток.
		 * Если file.contents является Stream, он передаст его в поток.
		 * Если file.contents имеет значение null, он ничего не сделает.
		 */
		public pipe<T extends NodeJS.ReadWriteStream>(
			stream: T,
			opts?: {
				/**
				 * Если значение равно false, назначенный поток не будет завершён (так же, как и ядро узла).
				 */
				end?: boolean;
			}): T;

		/**
		 * Возвращает красивую строковую интерпретацию файла. Полезно для console.log.
		 */
		public inspect(): string;
	}

	/**
	 * Это требуется согласно:
	 * https://github.com/microsoft/TypeScript/issues/5073
	 */
	namespace File {}

	export = File;

}
