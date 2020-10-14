const { paramCase } = require('change-case');
const transformRename = require('babel-plugin-transform-rename-properties');

module.exports = function ({ types: t }, options = {}) {
  const kebabize = options.kebabize || [];
  const rename = kebabize.reduce((acc, v)=>({...acc, [v]: paramCase(v)}), {});

  return transformRename({types: t}, {rename});
}