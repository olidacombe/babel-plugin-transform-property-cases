const t = require("@babel/types");
const { transform } = require("@babel/core");
const { parse } = require("@babel/parser");
const { expect } = require("chai");
const plugin = require("..");
const { getOptions } = plugin;

// test the only thing this plugin is really
// responsible for, building a config for
// babel-plugin-transform-rename-properties
describe("getOptions", () => {
  it("converts to kebab-case", () => {
    const options = getOptions({
      "kebab-case": ["MincePies", "Territorial Kittens"],
    });
    expect(options).to.eql({
      MincePies: "mince-pies",
      "Territorial Kittens": "territorial-kittens",
    });
  });
});

function replace(input, options = {}) {
  return transform(input, {
    babelrc: false,
    configFile: false,
    plugins: [[plugin, options]],
  }).code;
}

function compare(input, output, options = {}) {
  const transformed = replace(input, options);

  if (!t.isNodesEquivalent(parse(transformed), parse(output))) {
    expect(transformed).to.equal(output);
  }
}

// functional test to check we've hooked things up properly
describe("plugin", () => {
  it("transforms", () => {
    compare(
      `
      const yaDa = 3;

      const thing = {
        blaBla: 7,
        yaDa
      };

      function mutateStuff(stuff) {
        stuff.blaBla += 2;
      }
      `,
      `
      const yaDa = 3;

      const thing = {
        'bla-bla': 7,
        'ya-da': yaDa
      };

      function mutateStuff(stuff) {
        stuff['bla-bla'] += 2;
      }
      `,
      { "kebab-case": ["blaBla", "yaDa"] }
    );
  });
});
