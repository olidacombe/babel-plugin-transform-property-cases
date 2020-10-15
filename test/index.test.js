const { expect } = require("chai");
const { getOptions } = require("..");

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
