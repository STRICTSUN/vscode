declare module 'gulp-flatmap' {
	import File = require('vinyl');
	function f(fn:(stream:NodeJS.ReadWriteStream, file:File)=>NodeJS.ReadWriteStream): NodeJS.ReadWriteStream;

	/**
	 * ��� ��������� � ������������ �:
	 * https://github.com/microsoft/TypeScript/issues/5073
	 */
	namespace f {}

	export = f;
}
