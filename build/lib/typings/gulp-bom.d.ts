
declare module "gulp-bom" {
	function f(): NodeJS.ReadWriteStream;

	/**
	 * ��� ��������� � ������������ �:
	 * https://github.com/microsoft/TypeScript/issues/5073
	 */
	namespace f {}

	export = f;
}
