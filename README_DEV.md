# 💖 FAQ
### How may I deploy a new version?
1. ⬆️ Increase version in `package.json`
    - `npm version patch`
        - Update includes backward compatible:
            - Bug fixes
            - Super small features
    - `npm version minor`
        - Update includes new features added in a backward-compatible way
    - `npm version major`
        - Update includes new features added in a not backward-compatible way
    - `MAJOR.MINOR.PATCH`
    - Potential prerequisites:
        - `npm login`
1. 🚀 Push to GitHub, do GitHub `auto release notes`
1. 📦 Push  to NPM
    - Bash: `npm run publish`
### When to minor?
    - fundamentals / npm create solid fun example for:
        - markdown
        - tailwind
        - postgresql
        - d1
    - 100% test coverage
### When to 1.0?
    - 100% test code coverage
    - all component fundamentals are aria compliant
    - No Github bugs exist that we'd love completed b4 1.0
### Readme purpose
    - [ How to / Quick links to ] all possible
### What is the purpose of `"prepublishOnly": "npm run build",` in the package.json?
    - This ensure `npm publish` does an `npm run build` first automatically
### Why is the `/dist` sent to NPM?
    This is the case @ `.npmignore` so all receive compiled code immediately with no extra steps required
### Why is `/dist` not sent to Github?
    This is the case @ `.gitignore` to simplify our git commits
### How to get Solid for `.tsx` files in VSCode
1. Download the `Symbols` extension by `Miguel Solorio`
1. Bash cd into `~/.vscode/extensions/`
1. Bash cd `miguelsolorio.symbols-` w/ the proper version
1. Bash: `code .`
1. @ `/src/icons/files/` place `solid.svg`
1. @ `/src/symbol-icon-theme.json` w/in `iconDefinitions` place `"solid": { "iconPath": "./icons/files/solid.svg" },`
1. @ `fileExtensions` update `"tsx": "solid",` & anywhere else ya love!
1. @ `settings.json` add:
```js
"symbols.files.associations": {
  "*.jsx": "solidjs",
  "*.tsx": "solidjs"
}
```
1. Reload vscode!