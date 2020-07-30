module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": [
        "standard",
        'plugin:react/recommended'
    ],
    "settings": {
        "react": {
            "version": "detect"
        }
    },
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "parser": "babel-eslint",
    "plugins": [
        "react"
    ],
    "rules": {
        "semi": [2, 'always'],
        "comma-dangle": [
            "error",
            {
              "arrays": "always-multiline",
              "exports": "always-multiline",
              "functions": "never",
              "imports": "always-multiline",
              "objects": "always-multiline"
            }
          ],
    }
};