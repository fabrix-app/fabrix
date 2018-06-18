# <%= packName %>

[![NPM version][npm-image]][npm-url]
[![Build status][ci-image]][ci-url]
[![Dependency Status][daviddm-image]][daviddm-url]
[![Code Climate][codeclimate-image]][codeclimate-url]

<%= description %>

## Install

```sh
$ npm install --save <%= packName %>
```

## Configure

```js
// config/main.js
module.exports = {
  spools: [
    // ... other spools
    require('<%= packName %>')
  ]
}
```

[npm-image]: https://img.shields.io/npm/v/<%= packName %>.svg?style=flat-square
[npm-url]: https://npmjs.org/package/<%= packName %>
[ci-image]: https://img.shields.io/travis/<%= githubAccount %>/<%= packName %>/master.svg?style=flat-square
[ci-url]: https://travis-ci.org/<%= githubAccount %>/<%= packName %>
[daviddm-image]: http://img.shields.io/david/<%= githubAccount %>/<%= packName %>.svg?style=flat-square
[daviddm-url]: https://david-dm.org/<%= githubAccount %>/<%= packName %>
[codeclimate-image]: https://img.shields.io/codeclimate/github/<%= githubAccount %>/<%= packName %>.svg?style=flat-square
[codeclimate-url]: https://codeclimate.com/github/<%= githubAccount %>/<%= packName %>

