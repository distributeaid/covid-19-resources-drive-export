# Converts the COVID-19 Aid Workers Guide to a static website

![Publish Export](https://github.com/distributeaid/covid-19-resources-drive-export/workflows/Publish%20Export/badge.svg?branch=saga)
[![Netlify Status](https://api.netlify.com/api/v1/badges/36f29c28-c785-4d29-a5de-6e4da41b3bae/deploy-status)](https://app.netlify.com/sites/covid19-aidworkers-guide/deploys)
[![Renovate](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com)
[![Mergify Status](https://img.shields.io/endpoint.svg?url=https://dashboard.mergify.io/badges/distributeaid/covid-19-resources-drive-export&style=flat)](https://mergify.io)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

This projects turns the content in the
[Google Drive folder](https://drive.google.com/drive/folders/1FpnENOl1oZXLzmvvIqrR3kJgPNsGaDTo)
into a static website using [Gatsby.js](https://www.gatsbyjs.org/)

## Set up the export

### Using a copy of the export

Every time the website is published the export folder is zipped and published,
which you can download:

      wget https://raw.githubusercontent.com/distributeaid/covid-19-resources-drive-export/gh-pages/export.zip
      unzip export.zip

### Using the Google Drive API

> _WARNING!_ Use a blank Google Account when setting this up on Continuous
> Integration

1. On the
   [Node.js Quickstart page](https://developers.google.com/drive/api/v3/quickstart/nodejs)
   enable the Drive API
2. Pick "COVID-19 Aid Workers Guide" as the _new project name_
3. Select "Web Server" as the OAuth client
4. Enter `https://resources.distributeaid.org` as _Authorized Javascript Origin_
5. Follow the
   [Create the service account and credentials](https://developers.google.com/admin-sdk/directory/v1/guides/delegation#create_the_service_account_and_credentials)
   instructions and generate a key for the service account
6. Store that file in the project folder as `jwt.keys.json`
7. Install [pandoc](https://pandoc.org/installing.html)

You can now run

      npm ci
      node export-to-markdown.js

to export the Google Drive contents to the `export` folder.

## Start Gatsby

      npm ci
      npx gatsby develop

## How this project works

Gatsby is configured in [`gatsby-node.js`](./gatsby-node.js) to collect the
markdown files in the `export` folder and turn them into pages. In addition the
[`static/README.md`](./static/README.md) will be used as the start page.

All pages are rendered using the template
[`src/templates/page.tsx`](./src/templates/pages.tsx).

### Search

In addition, when building the version for production, the
[Algolia](http://algolia.com/) `Pages` index is filled based on the
configuration in [`gatsby-config.js`](./gatsby-config.js). For this to work
these environment variables have to be configured:

      GATSBY_ALGOLIA_APP_ID=...
      GATSBY_ALGOLIA_SEARCH_KEY=...
      ALGOLIA_ADMIN_KEY=...
