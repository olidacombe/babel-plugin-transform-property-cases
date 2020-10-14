const { paramCase } = require('change-case');
const transformRename = require('babel-plugin-transform-rename-properties');

module.exports = function ({ types: t }, options = {}) {
  const rename = {};
  const mappings = [['kebabCase', paramCase]];
  for(const [key, f] of mappings) {
      const targets = options[key] || [];
      Object.assign(rename, targets.reduce((acc, v)=>({...acc, [v]: f(v)}), {}));
  }

  return transformRename({types: t}, {rename});
}