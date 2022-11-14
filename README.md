# Vue project boilerplate
Boilerplate contains:
- vue router
- vuex
- linter
- prettier
- linter
- prettier
- pre commit git hooks
## Node version recommendation
Node v16 should be used for development. To install it:
```
nvm install 16
nvm use 16
```
⚠️ Note: If you haven't set node 16 as your default node version, you will have to set `nvm use 16` every time before spinnging up dev server

## Code quality tools
>⚠️ Note: If project is not successfully linted, you will be unable to commit

### Vscode
Mandatory extensions:
- vetur
- vue (syntax highlight for vue)
- eslint
- prettier

Other useful extensions:
- path intellisense
- auto close tag
- auto rename tag
- barcket pair colorizer 2
- color highlight

After installing mandatory extensions, in your root folder add
`.vscode/settings.json`
And put this code snippet inside:
```
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
}
```
### Phpstorm
⚠️ You should have PhpStorm 2020.3+

- Install prettier extension
- Settings>Languages and frameworks>Javascript>Code Quality Tools>Eslint
    - Automatic ESLint configuration and Run eslint --fix on save  ✅(optional)
- Settings>Languages and frameworks>Javascript>Prettier
    - Node interpreter: ~/.nvm/versions/node/v16.13.2/bin/node
    - Prettier package: ~/path_to_project/node_modules/prettier
    - Run for files: {**/\*,\*}.{js,ts,jsx,tsx,vue}
    - On code format: ✅
    - On save: ✅
- Settings>Languages and frameworks>Javascript>Webpack
  - Automatic: ✅
## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
