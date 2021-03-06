Digital Marketplace GOV.UK Frontend ·
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Known Vulnerabilities](https://snyk.io/test/github/alphagov/digitalmarketplace-govuk-frontend/badge.svg?targetFile=package.json)](https://snyk.io/test/github/alphagov/digitalmarketplace-govuk-frontend?targetFile=package.json)
=====================

This repository does two things:

- it provides a central repository for custom components used in the Digital Marketplace
- it imports GOV.UK Frontend and serves it to Digital Marketplace frontend applications
  where they can consume GOV.UK Frontend and all the custom components in a single dependency

The problem we are trying to solve:

- it is difficult to ensure that all our applications are using the same version of GOV.UK Frontend and digitalmarketplace-frontend-toolkit (which is being replaced).
- it is difficult to ensure that we are only importing and using css/js for components we are actually using and not been removed.

## GOV.UK Frontend

GOV.UK Frontend contains the code you need to start building a user interface
for government platforms and services.

See live examples of GOV.UK Frontend components, and guidance on when to use
them in your service, in the [GOV.UK Design
System](https://design-system.service.gov.uk/).

### Contact the GOV.UK Frontend team

GOV.UK Frontend is maintained by a team at Government Digital Service. If you want to know more about GOV.UK Frontend, please email the [Design System
team](mailto:govuk-design-system-support@digital.cabinet-office.gov.uk) or get in touch with them on [Slack](https://ukgovernmentdigital.slack.com/messages/govuk-design-system).

## Digital Marketplace GOV.UK Frontend

Digital Marketplace GOV.UK Frontend contains the code you need to start building a user interface for Digital Marketplace.

### Contact the Digital Marketplace team

Digital Marketplace GOV.UK Frontend is maintained by a team at Government Digital Service. If you want to know more about Digital Marketplace GOV.UK Frontend, please email the [Digital Marketplace team](mailto:digital-marketplace-development@digital.cabinet-office.gov.uk).

## Quick start

### 1. Install with npm (recommended)

We recommend [installing Digital Marketplace GOV.UK Frontend using node package manager
(npm)](docs/installation/installing-with-npm.md).

## Getting updates

To be notified when there’s a new release:

- [watch the digitalmarketplace-govuk-frontend Github repository](https://help.github.com/en/articles/watching-and-unwatching-repositories)

Find out how to [update with npm](docs/installation/updating-with-npm.md).


## Developing new components

We use gulp to automate various tasks. Below we will detail what each part of the process is
and what task are run


## 1. Installing the repo
After cloning this repository you will need to run `npm install`. After npm has successfully installed
all packages and dependencies, an npm `postinstall` script will automatically run to do the following tasks:

- Removes `govuk-frontend` from `src`(if it exists)
- Copy `govuk-frontend` from `node_modules` to `src`

The reason for copying `govuk-frontend` to `src` is to ensure that `src` mirrors what will eventually become `package` and it also helps with import file paths as they would have vary between `src` and `packaged`

## 2. Developing components/features and previewing

Run `npm start dev`

- compiles sass and js from `src` and places in `app/public`
- watch task for any file changes to `src`, compiles and reloads the browser (using browsersync)
- Start the webserver and reload the server if any server config changes (using nodemon)

## 3. Publishing

Follow the steps in `docs/publishing.md`.

## Licence

Unless stated otherwise, the codebase is released under [the MIT License][mit].
This covers both the codebase and any sample code in the documentation.

The documentation is [&copy; Crown copyright][copyright] and available under the terms
of the [Open Government 3.0][ogl] licence.

[mit]: LICENCE
[copyright]: http://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/
[ogl]: http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/
