const { camelCase, paramCase, pascalCase, snakeCase } = require("change-case");
const transformRename = require("babel-plugin-transform-rename-properties");

function renameOptionsFromCasesOptions(options = {}) {
  const renameOptions = {};
  const caseTransforms = [
    ["kebab-case", paramCase],
    ["param-case", paramCase],
    ["camelCase", camelCase],
    ["snake_case", snakeCase],
    ["PascalCase", pascalCase],
  ];
  for (const [key, f] of caseTransforms) {
    const targets = options[key] || [];
    Object.assign(
      renameOptions,
      targets.reduce((acc, v) => ({ ...acc, [v]: f(v) }), {})
    );
  }
  return renameOptions;
}

module.exports = function ({ types: t }, options = {}) {
  const rename = renameOptionsFromCasesOptions(options);
  return transformRename({ types: t }, { rename });
};

module.exports.getOptions = renameOptionsFromCasesOptions;
