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

  it("converts various cases simultaneously", () => {
    const options = getOptions({
      "kebab-case": ["blaBla", "yaDa"],
      camelCase: ["TotalSoup"],
      PascalCase: ["munster _vs_ cheese"],
      snake_case: ["basel-Craft"],
    });
    expect(options).to.eql({
      blaBla: "bla-bla",
      yaDa: "ya-da",
      TotalSoup: "totalSoup",
      "munster _vs_ cheese": "MunsterVsCheese",
      "basel-Craft": "basel_craft",
    });
  });

  it("transforms allCss via source, target, or both specifications", () => {
    let options = getOptions({
      allCss: { source: "camelCase" },
    });
    expect(options).to.have.property("marginTop", "margin-top");
    options = getOptions({
      allCss: { target: "camelCase" },
    });
    expect(options).to.have.property("margin-top", "marginTop");
    options = getOptions({
      allCss: { source: "PascalCase", target: "camelCase" },
    });
    expect(options).to.have.property("MarginTop", "marginTop");
  });

  it("omits identity transforms via options like allCss", () => {
    const options = getOptions({
      allCss: { source: "camelCase" },
    });
    expect(options).to.not.have.property("margin");
    expect(options).to.have.property("marginTop", "margin-top");
  });

  it("combines allCss with specific overrides", () => {
    const options = getOptions({
      allCss: { source: "camelCase" },
      snake_case: ["marginLeft"],
    });
    expect(options).to.have.property("marginTop", "margin-top");
    expect(options).to.have.property("marginLeft", "margin_left");
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
  it("transforms as claimed in the readme", () => {
    compare(
      `
      const yaDa = 3;

      const thing = {
        blaBla: 7,
        yaDa,
        paddingBottom: "1em"
      };

      function mutateStuff(stuff) {
        stuff.blaBla += 2;
      }

      const meal = {
        TotalSoup: {
          "munster _vs_ cheese": {
            "basel-Craft": "yaDa"
          },
        },
      };
      `,
      `
      const yaDa = 3;

      const thing = {
        "bla-bla": 7,
        "ya-da": yaDa,
        "padding-bottom": "1em"
      };

      function mutateStuff(stuff) {
        stuff["bla-bla"] += 2;
      }

      const meal = {
        totalSoup: {
          "MunsterVsCheese": {
            "basel_craft": "yaDa"
          },
        },
      };
      `,
      {
        allCss: {
          source: "camelCase",
        },
        "kebab-case": ["blaBla", "yaDa"],
        camelCase: ["TotalSoup"],
        PascalCase: ["munster _vs_ cheese"],
        snake_case: ["basel-Craft"],
      }
    );
  });

  it("can be used on all css properties using allCss setting", () => {
    compare(
      `
      const props = {
        marginTop: '1px'
      };
      `,
      `
      const props = {
        'margin-top': '1px'
      };
      `,
      { allCss: { source: "camelCase" } }
    );
  });
});
