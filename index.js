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
    identity: (i) => i,
  };
  const { allCss } = options;
  if (allCss) {
    const { source, target } = allCss;
    if (
      [source, target].every((c) => Object.keys(caseTransforms).includes(c))
    ) {
      const targetTransform = caseTransforms[target];
      const sourceTransform = caseTransforms[source];
      if (sourceTransform !== target) {
        cssTransforms = allCssProperties
          .map((p) => [sourceTransform(p), targetTransform(p)])
          .filter(([k, v]) => k !== v);
        Object.assign(renameOptions, Object.fromEntries(cssTransforms));
      }
    }
    // TODO else { throw informative error about malconfig }
  }

  for (const [key, f] of Object.entries(caseTransforms).filter(
    ([k]) => k !== "identity"
  )) {
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
