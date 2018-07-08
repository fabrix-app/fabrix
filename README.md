<img src="https://s3.us-east-2.amazonaws.com/fabrix-app/web/sw-002-1_rect-01-01.png" height="96px" title="Fabrix Logo" />

[![Gitter][gitter-image]][gitter-url]
[![NPM version][npm-image]][npm-url]
[![Build Status][ci-image]][ci-url]
[![Test Coverage][coverage-image]][coverage-url]
[![Dependency Status][daviddm-image]][daviddm-url]
[![Follow @FabrixApp on Twitter][twitter-image]][twitter-url]

Fabrix is a strongly typed modern web application framework for Node.js. It builds on the pedigree of [Rails](http://rubyonrails.org/) and [Grails](https://grails.org/) to accelerate development by adhering to a straightforward, convention-based, API-driven design philosophy.

## Getting Started

#### Install
The Fabrix CLI is still under development so the following is a placeholder.

```sh
$ npm install @fabrix/fab-cli
```

#### Start Sewing

Fabrix uses a CLI to generate scaffolding for new
applications, and to create resources inside the application. (TODO)

```sh
$ fab --help

Usage:
  fab

Generators:

  Create New Model
    fab model <model-name>

  Create New Controller
    fab controller <controller-name>

  Create New Policy
    fab policy <policy-name>

  Create New Service
    fab service <service-name>
    
  Create New Spool
    fab spool <spool-name>
```

#### Run

Once installation is complete, begin weaving!
```sh
$ npm run build && node dist/server.js
```

#### Sew on and Sew Forth!

## Spools

[Spools](https://github.com/fabrix-app/spool) extend the framework's
capabilities and allow developers to leverage existing ecosystem tools through a simple and well-defined API. New features, behavior, APIs, and other functionality can be added to the Fabrix framework through Spools.

Many Fabrix installations will include some of the following Spools:

- [router](https://github.com/fabrix-app/spool-router)
- [i81n](https://github.com/fabrix-app/spool-i18n)
- [repl](https://github.com/fabrix-app/spool-repl)
- [express](https://github.com/fabrix-app/spool-express)
- [sequelize](https://github.com/fabrix-app/spool-sequelize)

## Compatibility

- Windows, Mac, and Linux
- Node 8.0 and newer

## Documentation

See [**fabrix.app/doc**](http://fabrix.app/doc) for complete documentation.

## More Resources

#### Tutorials

#### Videos

#### Support
- [Live Gitter Chat](https://gitter.im/fabrix-app/Lobby)
- [Twitter](https://twitter.com/FabrixApp)
- [Fabrix.app Website](http://fabrix.app/support)
- [Stackoverflow](http://stackoverflow.com/questions/tagged/fabrix)

## FAQ

See https://github.com/fabrix-app/fabrix/wiki/FAQ

## Contributing
We love contributions! Please check out our [Contributor's Guide](https://github.com/fabrix-app/fabrix/blob/master/.github/CONTRIBUTING.md) for more
information on how our projects are organized and how to get started.

## Development
Fabrix uses a continuous integration process and all tests must pass for Fabrix to release a new version.  CircleCI releases a new version when a PR is merged into master.  For local development, you can download [CircleCI's local development tools](https://circleci.com/docs/2.0/local-cli/#installing-the-circleci-local-cli-on-macos-and-linux-distros) and run local tests before submitting a Pull Request.

Fabrix maintains a high score of coverage tests, any Pull Request should have well written Integration and Unit tests that increase the overall coverage score. 

## License
[MIT](https://github.com/fabrix-app/fabrix/blob/master/LICENSE)

## Legacy
Fabrix would not have been possible without the substantial work done by the [Trails.js team](https://github.com/trailsjs). While Fabrix maintains a different code base and system of best practices, none of this would have been possible without the contributions from the Trails community.

[npm-image]: https://img.shields.io/npm/v/@fabrix/fabrix.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@fabrix/fabrix
[ci-image]: https://img.shields.io/circleci/project/github/fabrix-app/fabrix/master.svg
[ci-url]: https://circleci.com/gh/fabrix-app/fabrix/tree/master
[daviddm-image]: http://img.shields.io/david/fabrix-app/fabrix.svg?style=flat-square
[daviddm-url]: https://david-dm.org/fabrix-app/fabrix
[gitter-image]: http://img.shields.io/badge/+%20GITTER-JOIN%20CHAT%20%E2%86%92-1DCE73.svg?style=flat-square
[gitter-url]: https://gitter.im/fabrix-app/Lobby
[twitter-image]: https://img.shields.io/twitter/follow/FabrixApp.svg?style=social
[twitter-url]: https://twitter.com/FabrixApp
[coverage-image]: https://img.shields.io/codeclimate/coverage/github/fabrix-app/fabrix.svg?style=flat-square
[coverage-url]: https://codeclimate.com/github/fabrix-app/fabrix/coverage
