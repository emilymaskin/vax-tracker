module.exports = {
  plugins: ["react", "import"],
  parser: "babel-eslint",
  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      modules: true
    }
  },
  globals: {
    __SERVER__: true,
    __CLIENT__: true,
    $PropertyType: true,
    fbq: true,
    rdt: true
  },
  rules: {
    // Possible errors
    "no-cond-assign": 2,
    "no-console": 0,
    "no-debugger": 2,
    "no-dupe-args": 2,
    "no-dupe-keys": 2,
    "no-duplicate-case": 2,
    "no-empty-character-class": 2,
    "no-extra-boolean-cast": 2,
    "no-extra-parens": [2, "functions"],
    "no-extra-semi": 2,
    "no-func-assign": 2,
    //es6 allows block-scoped functions
    "no-inner-declarations": 2,
    "no-invalid-regexp": 2,
    "no-irregular-whitespace": 2,
    "no-obj-calls": 2,
    "no-regex-spaces": 2,
    "use-isnan": 2,

    // Best Practices
    "prefer-template": 2,
    "comma-dangle": [2, "always-multiline"],
    complexity: [2, 15],
    "consistent-return": 2,
    curly: [2, "all"],
    "default-case": 2,
    "dot-notation": 2,
    eqeqeq: [2, "allow-null"],
    "no-caller": 2,
    "no-extra-bind": 2,
    "no-floating-decimal": 2,
    "no-implicit-coercion": 0,
    "no-implicit-globals": 2,
    "no-implied-eval": 2,
    "no-lone-blocks": 2,
    "no-loop-func": 2,
    "no-multi-spaces": 2,
    "no-multiple-empty-lines": 2,
    "no-global-assign": [2, { exceptions: ["Map", "Set"] }],
    "no-nested-ternary": 2,
    "no-new-func": 2,
    "no-new-wrappers": 2,
    "no-new": 2,
    "no-proto": 2,
    "no-redeclare": 2,
    "no-shadow": 2,
    "no-script-url": 2,
    "no-undef": 2,
    "no-underscore-dangle": 0,
    "no-unused-expressions": 2,
    "no-use-before-define": 0,
    "no-useless-call": 2,
    "no-useless-constructor": 2,
    "no-useless-return": 2,
    "no-void": 0,
    "no-with": 2,
    quotes: [2, "single"],
    "spaced-comment": [
      2,
      "always",
      {
        line: { markers: ["/"] },
        block: { exceptions: ["*"] }
      }
    ],
    radix: 2,
    // Trying this out...
    "vars-on-top": 2,
    yoda: 2,

    // ES6 modules enforce this
    strict: [2, "never"],

    "import/no-unresolved": 2,

    // Variables
    "init-declarations": 0,
    "no-delete-var": 2,
    "no-shadow-restricted-names": 2,
    "no-undef-init": 0,
    "no-undefined": 0,
    "no-unused-vars": [2, { args: "none" }],

    // ES6
    "arrow-parens": 0,
    "arrow-spacing": [2, { before: true, after: true }],
    "constructor-super": 2,
    "no-this-before-super": 2,
    "no-var": 2,
    "object-shorthand": 2,
    "prefer-arrow-callback": 2,
    "prefer-const": 2,
    "prefer-spread": 2,

    // React
    "react/jsx-uses-react": 2,
    "react/jsx-uses-vars": 2,
    "react/no-unknown-property": 2
  }
};
