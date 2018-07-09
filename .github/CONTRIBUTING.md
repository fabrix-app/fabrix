# Contributing to Fabrix and Spools

This guide is designed to help you get off the ground quickly contributing to Fabrix, Spools and the Fabrix ecosystem.  The goal of our community is to make it easy for members of all skill levels to contribute.  This guide will help you write useful issues, propose eloquent feature requests, and submit top-notch code that can be merged quickly.  

Maintaining a open source project is a labor of love, meaning the core maintainers of Fabrix or Spools are volunteering their time.  Respecting the guidelines laid out below helps the maintainers be efficient and make the most of the time they spend working on the project.  This, in turn, creates a better experience of working with Fabrix more enjoyable for the community at large.


## Submitting Issues

> Fabrix is composed of a core library, [Fabrix](https://github.com/fabrix-app/fabrix), and a number of [Spools](https://github.com/fabrix-app), which have their own dedicated repositories.  These repositories may also live outside the Fabrix-app official Github organization and NPM scope @fabrix.  
> 
> _*Please open issues with spools, generators, etc. in the relevant repository.*_  
> 
> This helps us stay on top of issues and keep organized.

When submitting an issue, please follow these simple instructions:

1. Search for issues similar to yours in [GitHub search](https://github.com/fabrix-app/fabrix/search?type=Issues) and [Google](https://www.google.nl/search?q=fabrix+app). 
2. Feature requests are welcome; see [Requesting Features](#requesting-features) below for submission guidelines.
3. If there's an open issue, please contribute to that issue.
4. If there's a closed issue, open a new issue and link the url of the already closed issue(s).
5. If there is no issue, open a new issue and specify the following:
  - A short description of your issue in the title
  - The fabrix version (find this with in the package.json file)
  - Detailed explanation of how to recreate the issue, including necessary setup setps
6. If you are experiencing more than one problem, create a separate issue for each one. If you think they might be related, please reference the other issues you've created.

## Submitting Features

> New feature requests should be made as pull requests to the `backlog` section of [ROADMAP.MD](https://github.com/fabrix-app/fabrix/blob/master/ROADMAP.md) or as issues on the `Backlog` milestone in the [issue queue](https://github.com/fabrix-app/fabrix/milestones/Backlog).  We will monitor community discussion on these PRs and issues and if they are wanted by the community/fabrix devs, they will be merged.  Further discussion is welcome even after a PR has been merged. 

##### Submitting a new feature request
1. First, look at the `backlog` table in [ROADMAP.MD](https://github.com/fabrix-app/fabrix/blob/master/ROADMAP.md) or the [Backlog Milestone](https://github.com/fabrix-app/fabrix/milestones/Backlog) in the issue queue and also search open pull requests in that file to make sure your change hasn't already been proposed.  If it has, join the discussion.
2. If it doesn't already exist, create a pull request editing the `backlog` table of [ROADMAP.MD](https://github.com/fabrix-app/fabrix/blob/master/ROADMAP.md).
3. Start a discussion about why your feature should be built (or better yet, build it).  Get feedback in the [Fabrix-app Gitter](https://gitter.im/fabrix-app/Lobby) Channel.  The more feedback we get from our community, the better we are able to build the framework of your dreams :evergreen_tree:

## Writing Tests

Ideally, all code contributions should be accompanied by functional and/or unit tests (as appropriate).  

Test Coverage:

| Edge (master branch) |
|----------------------|
| [![Coverage Status](https://coveralls.io/repos/fabrix-app/fabrix/badge.png)](https://coveralls.io/r/fabrix-app/fabrix) |


## Code Submission Guidelines

The community is what makes Fabrix great, without you we wouldn't have come so far. But to help us keep our sanity and reach code-nirvana together, please follow these quick rules whenever contributing.

> Note: This section is based on the [Node.js contribution guide](https://github.com/joyent/node/blob/master/CONTRIBUTING.md#contributing).

###### Contributing to an Spool 

If the Spool is in the Fabrix Github organization, please send feature requests, patches and pull requests to that organization.  Other Spools may have their own contribution guidelines.  Please follow the guidelines of the Spool you are contributing to.

###### Authoring a new Spool

You are welcome to author a new Spool at any time.  Spools must inherit from the main [Spool](https://github.com/fabrix-app/fabrix) interface to inherit the API.  Feel free to start work on a new spool, just make sure and do a thorough search on npm, Google and Github to make sure someone else hasn't already started working on the same thing.  

It is recommended that you maintain your Spool in your own Github repository.  If you would like to submit your Spool to be listed in the [Fabrix-app Github Organization](https://github.com/fabrix-app) and @fabrix NPM scope, please submit an issue to the [Fabrix Issue queue](https://github.com/fabrix-app/fabrix/issues).

###### Contributing to a generator

Fabrix generators are based upon a cli. Please follow the core best practices for contributing to generators.  If it is located in a different repo, please send feature requests, patches, and issues there.

###### Contributing to core

Fabrix has several dependencies referenced in the `package.json` file that are not part of the project proper. Any proposed changes to those dependencies or _their_ dependencies should be sent to their respective projects (i.e. Sequelize etc.) Please do not send your patch or feature request to this repository, we cannot accept or fulfill it.

In case of doubt, open an issue in the [issue tracker](https://github.com/fabrix-app/fabrix/issues), ask your question in the [Gitter room](http://gitter.im/fabrix-app/Lobby).  Especially if you plan to work on something big. Nothing is more frustrating than seeing your hard work go to waste because your vision does not align with a project's roadmap.  At the end of the day, we just want to be able to merge your code.

###### Submitting Pull Requests

0. If you don't know how to fork and PR, [Github has some great documentation](https://help.github.com/articles/using-pull-requests/).  Here's the quick version:
1. Fork the repo.
2. Add a test for your change. Only refactoring and documentation changes require no new tests. If you are adding functionality or fixing a bug, we need a test!
4. Make the tests pass and make sure you follow our syntax guidelines.
5. Add a line of what you did to CHANGELOG.md (right under `master`).
6. Push to your fork and submit a pull request to the appropriate branch

## Publishing Releases

All releases are tagged and published by the [Fabrix Maintainers](https://github.com/orgs/fabrix-app/teams) automatically via [Cicle-CI](https://circleci.com/gh/fabrix-app/fabrix). For a patch release, the deployment process is as follows:

1. Tag a release
```sh
$ npm version patch
```

2. Push the tag upstream (the "fabrix-app" org)
```sh
$ git push upstream --tags
```

3. Circle-CI will publish the release to npm.
