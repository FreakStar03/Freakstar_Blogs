---
emoji: 🔮
title: 2 Auto Deploy React Website Using Github Action
date: '2022-08-09 00:00:00'
author: freakstar
tags: Gh-pages Github-Action React
categories: featured
---


![Potions Class](./image.png)

##### Create Empty Repository w/o readme or licences or any files, go to its screte tab and

- Add four secrets in the working repository

  - USER_NAME --> github username
  - USER_EMAIL --> github email address
  - USER_TOKEN --> github access token
  - USER_REPO --> working repository name

- follow this tutorial to add secrets-->

<https://www.paigeniedringhaus.com/blog/use-secret-environment-variables-in-git-hub-actions#access-the-repos-settings-tab>

```bash
.
├── .git
├── .github/workflows/deploy.yml
├── .gitignore
├── .gitmodules
├── node_modules
├── package.json
├── public
├── README.md
├── src
```

- create .github/workflows/deploy.yml in above level only->

```bash
name: Node.js CI

on:
  push:
    branches: ["main"]
  pull_request:
    branches: ["main"]

jobs:
  build:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [14.x]
        # See supported Node.js release schedule at https://nodejs.org/en/about/releases/

    steps:
      - uses: actions/checkout@v3
        with:
          persist-credentials: false
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: "npm"
      - name: Install dependencies
        run: npm install
      - name: Build
        run: npm run build
      - name: deploy
        run: |
          git config --global user.name ${{secrets.USER_NAME}}
          git config --global user.email ${{secrets.USER_EMAIL}}
          git remote set-url origin https://${{ secrets.USER_TOKEN }}@github.com/${{secrets.USER_NAME}}/${{secrets.USER_REPO}}.git
          npm run deploy
```

- add following lines in package.json in script dictionary -->

```bash
  "scripts": {
  ...
    "predeploy": "npm build",
    "deploy": "gh-pages -d build"
    },
```

- add following line in package.json in under private=true, in staring of file -->

```bash
  "homepage": "https://{username}.github.io/{repositoryname}",
  {replace username and repository name with ur repo}
```

- run -->

```bash
npm install gh-pages --save-dev
```

- publish to repository on github -->

```bash
// you can also follow given detail when create empty repository
git init
git add .
git commit -m "init"
git remote add origin 'https url'
git push main
```

```toc

```
