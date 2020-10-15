# babel-plugin-transform-property-cases ![test](https://github.com/olidacombe/babel-plugin-transform-property-cases/workflows/test/badge.svg) ![npm](https://github.com/olidacombe/babel-plugin-transform-property-cases/workflows/npm/badge.svg)

Babel plugin to transform properties into different cases.

## Installation

```
$ yarn add -D babel-plugin-transform-property-cases
```

## Usage

Specify which object property names should be converted to different cases by providing arrays under the following keys in the plugin config:

```
camelCase
kebab-case
param-case
PascalCase
snake_case
```

## Example

Input file:

```js
const yaDa = 3;

const thing = {
  blaBla: 7,
  yaDa,
};

function mutateStuff(stuff) {
  stuff.blaBla += 2;
}

const meal = {
  TotalSoup: {
    "munster _vs_ cheese": {
      "basel-Craft": "yaDa",
    },
  },
};
```

`.babelrc`:

```json
{
  "plugins": [
    [
      "babel-plugin-transform-property-cases",
      {
        "kebab-case": ["blaBla", "yaDa"],
        "camelCase": ["TotalSoup"],
        "PascalCase": ["munster _vs_ cheese"],
        "snake_case": ["basel-Craft"]
      }
    ]
  ]
}
```

Output:

```js
const yaDa = 3;

const thing = {
  "bla-bla": 7,
  "ya-da": yaDa,
};

function mutateStuff(stuff) {
  stuff["bla-bla"] += 2;
}

const meal = {
  totalSoup: {
    MunsterVsCheese: {
      basel_craft: "yaDa",
    },
  },
};
```

## License

This plugin is licensed under the MIT license. See [LICENSE](./LICENSE).

## Thanks

This plugin relies heavily on:

- [babel-plugin-transform-rename-properties](https://github.com/jviide/babel-plugin-transform-rename-properties)
- [change-case](https://github.com/blakeembrey/change-case)
