# Converts the COVID-19 Aid Workers Guide to a static website

This projects turns the content in the [Google Drive folder](https://drive.google.com/drive/folders/1FpnENOl1oZXLzmvvIqrR3kJgPNsGaDTo) into a static website.

## Set up

> _WARNING!_ Use a blank Google Account when setting this up on Continuous Integration

1. On the [Node.js Quickstart page](https://developers.google.com/drive/api/v3/quickstart/nodejs) enable the Drive API
2. Pick "COVID-19 Aid Workers Guide" as the _new project name_
3. Select "Web Server" as the OAuth client
4. Enter `https://resources.distributeaid.org` as _Authorized Javascript Origin_
5. Follow the [Create the service account and credentials](https://developers.google.com/admin-sdk/directory/v1/guides/delegation#create_the_service_account_and_credentials) instructions and generate a key for the service account
6. Store that file in the project folder as `jwt.keys.json`
7. Install [pandoc](https://pandoc.org/installing.html)
