module.exports = {
    "extends": "airbnb",
    "globals": {
        "window": true,
        "document": true,
        "navigator": true,
        "WebSocket": true,
    },
    "rules": {
        "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
        "react/jsx-max-props-per-line": [0, { "maximum": 3 }],
        "react/jsx-first-prop-new-line": ["error", "never"],
        "react/jsx-closing-bracket-location": [0],
        "react/jsx-one-expression-per-line": [1, { "allow": "literal" }],
        "react/forbid-prop-types": [0],
        "react/no-array-index-key": [0],
        "jsx-a11y/label-has-for": [0],
        "jsx-a11y/label-has-associated-control": [0],
        "max-len": ["error", { "code": 130 }],
        "implicit-arrow-linebreak": ["error", "beside"],
        "object-curly-newline": ["error", { "consistent": true }],
        "no-use-before-define": ["error", { "functions": false, "classes": false, "variables": false }],
        "operator-linebreak": ["error", "before", { "overrides": { "&&": "ignore" } }],
        "padded-blocks": ["error", "never"],
        "class-methods-use-this": [0],
        "no-plusplus": ["error", { "allowForLoopAfterthoughts": true }],
        "no-underscore-dangle": ["error", { "allowAfterThis": true }],
    }
};