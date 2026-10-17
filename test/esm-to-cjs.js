const ts = require('typescript');

module.exports = {
  process(sourceText, sourcePath) {
    const source = sourceText
      .replace(/const require = createRequire\(import\.meta\.url\);?/g, '')
      .replace(/createRequire\(import\.meta\.url\)/g, 'require');
    const result = ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        esModuleInterop: true,
        target: ts.ScriptTarget.ES2022,
        allowJs: true,
      },
      fileName: sourcePath.replace(/\.mjs$/, '.js'),
    });
    return { code: result.outputText };
  },
};
