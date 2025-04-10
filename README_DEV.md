# 💖 FAQ
### How may I deploy a new version?
1. ⬆️ Upgrade version in `package.json`
    - `MAJOR.MINOR.PATCH`
    - `npm version patch`
        - Update includes backward compatible bug fixes or small changes that does not add new features
    - `npm version minor`
        - Update includes new features added in a backward-compatible way
    - `npm version major`
        - Update includes new features added in a not backward-compatible way
1. 💬 Create Git Commit
    - For the version increment
    - Convention example:
        - `v0.0.3`
1. 🏷️ Create Git Tag 
    - Convention example:
        - `v0.0.6`
    - To do this in `Github Desktop`
        - Click `History`
        - Right click the commit to tag
        - Click `Create Tag...`
1. 🚀 Push to GitHub
1. 📦 Push  to NPM
    - Bash: `npm run publish`
### I did a git tag, but now I need to do another git commit, what do I do?
1. Delete the most recently created tag: `git tag -d v0.0.X`
1. Then just follow the `how to deploy steps` above from here, b/c now the slate is clean 🙌
### What is the purpose of `"prepublishOnly": "npm run build",` in the package.json?
- This ensure `npm publish` does an `npm run build` first automatically
### Why is the `/dist` sent to NPM?
- This is the case @ `.npmignore` so all receive compiled code immediately with no extra steps required
### Why is `/dist` not sent to Github?
- This is the case @ `.gitignore` to simplify our git commits
