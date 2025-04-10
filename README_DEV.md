# 🥸 FAQ
- How to deploy a new version
    1. Update `package.json` version
    1. Commit
    1. Tag
    1. Push
    1. `npm publish --access public` 
- What is the purpose of `"prepublishOnly": "npm run build",` in the package.json?
    - Ensure `npm publish` does an `npm run build` first automatically
- Why send `/dist` to npm?
    - Users get compiled code immediately without extra steps
- Why not send `/dist` to github?
    - Simplify github commits
