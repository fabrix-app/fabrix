# <%= spoolName %>

[![Gitter][gitter-image]][gitter-url]
[![NPM version][npm-image]][npm-url]
[![Build status][ci-image]][ci-url]
[![Dependency Status][daviddm-image]][daviddm-url]
[![Code Climate][codeclimate-image]][codeclimate-url]

<%= description %>

## Install

```sh
$ npm install --save <%= spoolName %>
```

## Configure

```js
// config/main.ts
import { <%= spoolName %> } from '<%= spoolName %>'
export const main = {
  spools: [
    // ... other spools
    <%= spoolName %>
  ]
}
```

[npm-image]: https://img.shields.io/npm/v/<%= spoolName %>.svg?style=flat-square
[npm-url]: https://npmjs.org/spoolage/<%= spoolName %>
[ci-image]: https://img.shields.io/travis/<%= githubAccount %>/<%= spoolName %>/master.svg?style=flat-square
[ci-url]: https://travis-ci.org/<%= githubAccount %>/<%= spoolName %>
[daviddm-image]: http://img.shields.io/david/<%= githubAccount %>/<%= spoolName %>.svg?style=flat-square
[daviddm-url]: https://david-dm.org/<%= githubAccount %>/<%= spoolName %>
[codeclimate-image]: https://img.shields.io/codeclimate/github/<%= githubAccount %>/<%= spoolName %>.svg?style=flat-square
[codeclimate-url]: https://codeclimate.com/github/<%= githubAccount %>/<%= spoolName %>
[gitter-image]: http://img.shields.io/badge/+%20GITTER-JOIN%20CHAT%20%E2%86%92-1DCE73.svg?style=flat-square
[gitter-url]: https://gitter.im/fabrix-app/Lobby
[twitter-image]: https://img.shields.io/twitter/follow/FabrixApp.svg?style=social
[twitter-url]: https://twitter.com/FabrixApp
