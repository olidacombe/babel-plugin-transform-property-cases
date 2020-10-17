const { camelCase, paramCase, pascalCase, snakeCase } = require("change-case");
const transformRename = require("babel-plugin-transform-rename-properties");
const allCssProperties = require("known-css-properties").all;

function renameOptionsFromCasesOptions(options = {}) {
  const renameOptions = {};
  const caseTransforms = {
    "kebab-case": paramCase,
    "param-case": paramCase,
    camelCase: camelCase,
    snake_case: snakeCase,
    PascalCase: pascalCase,
  };
  const cases = Object.keys(caseTransforms);
  const identity = (i) => i;
  const { allCss } = options;
  if (allCss) {
    const { source, target } = allCss;
    const targetTransform = caseTransforms[target] || identity;
    const sourceTransform = caseTransforms[source] || identity;
    if (sourceTransform !== targetTransform) {
      cssTransforms = allCssProperties
        .map((p) => [sourceTransform(p), targetTransform(p)])
        .filter(([k, v]) => k !== v);
      Object.assign(renameOptions, Object.fromEntries(cssTransforms));
    }
  }

  for (const [key, f] of Object.entries(caseTransforms)) {
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
