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
1. 🚀 Push to GitHub
1. 📦 Push  to NPM
    - Bash: `npm run publish`
### When to minor?
    - fundamentals for:
        - markdown
        - tailwind
        - postgresql
        - d1
    - all component fundamentals are aria compliant
    - `npm create solidfun`
    - 100% test coverage
### When to 1.0?
    - No Github bugs exist that we'd love completed b4 1.0
### When website?
    - Post 1.0
### Readme purpose
    - [ How to / Quick links to ] all possible
### What is the purpose of `"prepublishOnly": "npm run build",` in the package.json?
- This ensure `npm publish` does an `npm run build` first automatically
### Why is the `/dist` sent to NPM?
- This is the case @ `.npmignore` so all receive compiled code immediately with no extra steps required
### Why is `/dist` not sent to Github?
- This is the case @ `.gitignore` to simplify our git commits
