# babel-plugin-transform-property-cases ![test](https://github.com/olidacombe/babel-plugin-transform-property-cases/workflows/test/badge.svg) ![npm](https://github.com/olidacombe/babel-plugin-transform-property-cases/workflows/npm/badge.svg)

Babel plugin to transform properties into different cases.

# Installation

```
$ yarn add -D babel-plugin-transform-property-cases
```

# Usage

Specify which object property names should be converted to different cases by providing arrays under the following keys in the plugin config:

```
camelCase
kebab-case
param-case
PascalCase
snake_case
```

## Property Collections

Also available are property collections for which you can speficy global case-change behaviour. Currently only `allCss` is supported, converting any standard css property name according to the specified `source` and/or `target` subkeys.

E.g.

```json
{
  "allCss": {
    "source": "snake_case"
  }
}
```

Would convert `margin_top` to `margin-top`.

```json
{
  "allCss": {
    "target": "PascalCase"
  }
}
```

Would convert `margin-top` to `MarginTop`.

And

```json
{
  "allCss": {
    "target": "camelCase",
    "source": "PascalCase"
  }
}
```

Would convert `MarginTop` to `marginTop`.

# Example

Input file:

```js
const yaDa = 3;

const thing = {
  blaBla: 7,
  yaDa,
  paddingBottom: "1em",
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
        "allCss": {
          "source": "camelCase"
        },
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
  "padding-bottom": "1em",
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

# License

This plugin is licensed under the MIT license. See [LICENSE](./LICENSE).

# Thanks

This plugin relies heavily on:

- [babel-plugin-transform-rename-properties](https://github.com/jviide/babel-plugin-transform-rename-properties)
- [change-case](https://github.com/blakeembrey/change-case)
