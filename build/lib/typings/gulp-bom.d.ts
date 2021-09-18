
declare module "gulp-bom" {
	function f(): NodeJS.ReadWriteStream;

	/**
	 * Это требуется в соответствии с:
	 * https://github.com/microsoft/TypeScript/issues/5073
	 */
	namespace f {}

	export = f;
}
