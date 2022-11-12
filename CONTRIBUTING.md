# Foxify Contributor Guide

Before you start with this guide, we'd like to thank you for taking the time to help improve & move this project
forward 🎖️

## Table of Contents

- [Source Contribution](#source-contribution)
    - [Before you start!](#before-you-start)
    - [Getting Started](#getting-started)
- [Financial Contribution](#financial-contribution)
- [Credits](#credits)
    - [Contributors](#contributors)
    - [Sponsors](#sponsors)
    - [Backers](#backers)

## Source Contribution

### Before you start!

Before you get started with implementing your **awesome 🚀** ideas,
make sure to check the [![Open Issues][OPEN_ISSUES_BADGE]][OPEN_ISSUES_URL] to see if it is already being
discussed/implemented.

If you don't see any relative `issues`, then create one yourself and try explaining what you'd like to see/do in this
project.

This process will allow us and you to determine the need, willingness! and/or process to achieve your shared idea.
The implementation will start after the said `issue` is finalized and moved out from the `triage` phase.

This process is in place to avoid putting unnecessary/duplicate time/effort delivering all kind of stuff within the
scope of this project.

### Getting Started

To get started please clone the repository and checkout the [`main`](https://github.com/foxifyjs/foxify/tree/main)
branch.

- Firstly, install the dependencies:

```bash
pnpm i
```

- Implement the feature, bug fix, etc, based on the `issue` specification.

- Check your code styles and fix any issues (related to your code only):

```bash
pnpm lint
```

- Then, run the tests and fix any potential bugs:

```bash
pnpm test:coverage
```

> Try to achieve the `100%` reported code coverage on your code, at the very least. (`100%` reported code coverage does
> not guarantee that all possible scenarios are tested)

- Lastly, create a `PR` and link the `issue`.

## Financial Contribution

We welcome financial contributions in full transparency on our [open collective](https://opencollective.com/foxify).

## Credits

### Contributors

This project exists thanks to all the people who
contribute.

[![Contributors][CONTRIBUTORS_BADGE]][CONTRIBUTORS_URL]

_Made with [contrib.rocks](https://contrib.rocks)._

### Sponsors

Support Foxify by becoming a sponsor. Your logo will show up
here. [[Become a sponsor][OPENCOLLECTIVE_SPONSOR_URL]]

[![Sponsors][OPENCOLLECTIVE_SPONSORS_BADGE]][OPENCOLLECTIVE_SPONSORS_URL]

### Backers

Thanks to all Foxify backers! [[Become a backer][OPENCOLLECTIVE_BACKER_URL]]

[![Backers][OPENCOLLECTIVE_BACKERS_BADGE]][OPENCOLLECTIVE_BACKERS_URL]


<!-- Badges -->

[OPEN_ISSUES_BADGE]: https://img.shields.io/github/issues-raw/foxifyjs/foxify.svg

[CONTRIBUTORS_BADGE]: https://contrib.rocks/image?repo=foxifyjs/foxify

[OPENCOLLECTIVE_SPONSORS_COUNT_BADGE]: https://opencollective.com/foxify/sponsors/badge.svg

[OPENCOLLECTIVE_SPONSORS_BADGE]: https://opencollective.com/foxify/sponsors.svg?width=890

[OPENCOLLECTIVE_BACKERS_COUNT_BADGE]: https://opencollective.com/foxify/backers/badge.svg

[OPENCOLLECTIVE_BACKERS_BADGE]: https://opencollective.com/foxify/backers.svg?width=890


<!-- Links -->

[OPEN_ISSUES_URL]: https://github.com/foxifyjs/foxify/issues?q=is%3Aopen+is%3Aissue

[CONTRIBUTORS_URL]: https://github.com/foxifyjs/foxify/graphs/contributors

[OPENCOLLECTIVE_SPONSORS_URL]: https://opencollective.com/foxify#sponsors

[OPENCOLLECTIVE_SPONSOR_URL]: https://opencollective.com/foxify#sponsor

[OPENCOLLECTIVE_BACKERS_URL]: https://opencollective.com/foxify#backers

[OPENCOLLECTIVE_BACKER_URL]: https://opencollective.com/foxify#backer
