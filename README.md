# Converts the COVID-19 Aid Workers Guide to a static website

![Publish Export](https://github.com/distributeaid/covid-19-resources-drive-export/workflows/Publish%20Export/badge.svg?branch=saga)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

This projects turns the content in the
[Google Drive folder](https://drive.google.com/drive/folders/1FpnENOl1oZXLzmvvIqrR3kJgPNsGaDTo)
into a static website.

## Set up the export

### Using a copy of the export

Every time the website is published the export folder is zipped and published,
which you can download:

      wget https://raw.githubusercontent.com/distributeaid/covid-19-resources-drive-export/gh-pages/export.zip
      unzip export.zip ./

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
      export-to-markdown.js

to export the Google Drive contents to the `export` folder.

## Start Gatsby

      npm ci
      npx gatsby develop
