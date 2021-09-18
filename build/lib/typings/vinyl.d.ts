// ����������� ����� ��� vinyl 0.4.3
// ������: https://github.com/wearefractal/vinyl
//����������� ��: vvakame <https://github.com/vvakame/>, jedmao <https://github.com/jedmao>
//  �����������: https://github.com/DefinitelyTyped/DefinitelyTyped

declare module "vinyl" {

	import fs = require("fs");

	/**
	 * ������ ������������ �����.
	 */
	class File {
		constructor(options?: {
			/**
			* �� ���������: process.cwd() .
			*/
			cwd?: string;
			/**
			 * ������������ ��� �������������� ����. ������ ���, ��� ���������� ������.
			 */
			base?: string;
			/**
			 * ������ ���� � �����.
			 */
			path?: string;
			/**
			 * ������� ����. �� ���������, ���� ������� options.path.
			 */
			history?: string[];
			/**
			 * ��������� ������ fs.stat. ������� ���-���������� � fs.Stats.
			 */
			stat?: fs.Stats;
			/**
			 * ���������� �����.
			 * ���: Buffer, Stream ��� null.
			 */
			contents?: Buffer | NodeJS.ReadWriteStream;
		});

		/**
		 * �� ���������: process.cwd()
		 */
		public cwd: string;
		/**
		 * ������������ ��� �������������� ����. ������ ���, ��� ���������� ������.
		 */
		public base: string;
		/**
		 * ������ ���� � �����.
		 */
		public path: string;
		public stat: fs.Stats;
		/**
		 * ���: Buffer|Stream|null (�� ���������: null)
		 */
		public contents: Buffer | NodeJS.ReadableStream;
		/**
		 * ���������� path.relative ��� ���� ����� � ���� � �����.
		 * ������:
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
		 * ���������� ����� ������ File �� ����� �������������� ����������. ������������� �������� ������� �����������.
		 */
		public clone(opts?: { contents?: boolean }): File;

		/**
		 * ���� file.contents �������� Buffer, �� ������� ��� � �����.
		 * ���� file.contents �������� Stream, �� �������� ��� � �����.
		 * ���� file.contents ����� �������� null, �� ������ �� �������.
		 */
		public pipe<T extends NodeJS.ReadWriteStream>(
			stream: T,
			opts?: {
				/**
				 * ���� �������� ����� false, ����������� ����� �� ����� �������� (��� ��, ��� � ���� ����).
				 */
				end?: boolean;
			}): T;

		/**
		 * ���������� �������� ��������� ������������� �����. ������� ��� console.log.
		 */
		public inspect(): string;
	}

	/**
	 * ��� ��������� ��������:
	 * https://github.com/microsoft/TypeScript/issues/5073
	 */
	namespace File {}

	export = File;

}
