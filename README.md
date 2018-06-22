<img src="http://cdn.fabrix.app/art/logos/fabrix-horiz-logo-green.svg" height="96px" title="Fabrix Logo" />

[![Gitter][gitter-image]][gitter-url]
[![NPM version][npm-image]][npm-url]
[![Build Status][ci-image]][ci-url]
[![Test Coverage][coverage-image]][coverage-url]
[![Follow @fabrix-app on Twitter][twitter-image]][twitter-url]

Fabrix is a strongly typed modern, [community-driven](https://opencollective.com/fabrix) web application framework for Node.js. It
builds on the pedigree of [Rails](http://rubyonrails.org/) and [Grails](https://grails.org/)
to accelerate development by adhering to a straightforward, convention-based,
API-driven design philosophy.

## Getting Started

#### Install

```sh
$ 
```

#### Trailblaze

Fabrix uses a CLI to generate scaffolding for new
applications, and to create resources inside the application.

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
```

#### Run

Once installation is complete, begin your journey!
```sh
$ node server.js
```

#### Happy Fabrix!

## Spools

[Spools](https://github.com/fabrix-app/spool) extend the framework's
capabilities and allow developers to leverage existing ecosystem tools through a
simple and well-defined API. New features, behavior, APIs, and other functionality
can be added to the Fabrix framework through Spools.

Many Fabrix installations will include some of the following Spools:

- [router](https://github.com/fabrix-app/spool-router)
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
- [Live Gitter Chat](https://gitter.im/fabrix-app/fabrix)
- [Twitter](https://twitter.com/fabrix-app)
- [Fabrix.app Website](http://fabrix.app/support)
- [Stackoverflow](http://stackoverflow.com/questions/tagged/fabrix-app)

## FAQ

See https://github.com/fabrix-app/fabrix/wiki/FAQ

## Contributing
We love contributions! Please check out our [Contributor's Guide](https://github.com/fabrix-app/fabrix/blob/master/.github/CONTRIBUTING.md) for more
information on how our projects are organized and how to get started.

## License
[MIT](https://github.com/fabrix-app/fabrix/blob/master/LICENSE)

## Legacy
Fabrix would not have been possible without the substantial work done by the [Trail.js team](https://github.com/trailsjs). While Fabrix maintains a different code base and system of best practices, none of this would have been possible without the contributions from their community.

<img src="http://cdn.fabrix.app/art/backgrounds/fabrix-day.png">

[npm-image]: https://img.shields.io/npm/v/@fabrix/fabrix.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@fabrix/fabrix
[ci-image]: https://img.shields.io/circleci/project/github/fabrix-app/fabrix/nmaster.svg
[ci-url]: https://circleci.com/gh/fabrix-app/fabrix/tree/master
[gitter-image]: http://img.shields.io/badge/+%20GITTER-JOIN%20CHAT%20%E2%86%92-1DCE73.svg?style=flat-square
[gitter-url]: https://gitter.im/fabrix-app/fabrix
[twitter-image]: https://img.shields.io/twitter/follow/fabrix-app.svg?style=social
[twitter-url]: https://twitter.com/fabrix-app
[coverage-image]: https://img.shields.io/codeclimate/coverage/github/fabrix-app/fabrix.svg?style=flat-square
[coverage-url]: https://codeclimate.com/github/fabrix-app/fabrix/coverage
