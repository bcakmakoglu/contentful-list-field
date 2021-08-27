# Contentful List Field

![top-language](https://img.shields.io/github/languages/top/bcakmakoglu/contentful-list-field)
[![dependencies Status](https://status.david-dm.org/gh/bcakmakoglu/contentful-list-field.svg)](https://david-dm.org/bcakmakoglu/contentful-list-field)
[![devDependencies Status](https://status.david-dm.org/gh/bcakmakoglu/contentful-list-field.svg?type=dev)](https://david-dm.org/bcakmakoglu/contentful-list-field?type=dev)
![vulnerabilities](https://img.shields.io/snyk/vulnerabilities/github/bcakmakoglu/contentful-list-field)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/bcakmakoglu/contentful-list-field)
![GitHub last commit](https://img.shields.io/github/last-commit/bcakmakoglu/contentful-list-field)

## What does this do?
Similar to the Repeater App on the Contentful marketplace this app provides a
custom entry field for JSON objects that will display a key-value list.
Additionally, you can pass options when creating a Content Model which will be
used as Select options in the entry editor.

This project was bootstrapped with [Create Contentful App](https://github.com/contentful/create-contentful-app).

## Instance properties
You can pass these options when creating an app instance (i.e. applying the app on a content model).

* keyOptions/valueOptions - list of strings separated by a `|`, each string will be displayed as an option for keys/values (ex: foo|bar|baz)
* checkbox - display a checkbox in each row, can only be uniquely selected
* taggable - enable value inputs to be passed as tags
* valueName - an alternative name to display for the value property
* keyName - an alternative name to display for the key property
* uniqueKeys - enable validation check for unique keys

## Available Scripts

In the project directory, you can run:

#### `npm start`

Creates or updates your app definition in Contentful, and runs the app in development mode.
Open your app to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

#### `npm run build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

#### `npm run upload`

Uploads the build folder to contentful and creates a bundle that is automatically activated.
The command guides you through the deployment process and asks for all required arguments.
Read [here](https://www.contentful.com/developers/docs/extensibility/app-framework/create-contentful-app/#deploy-with-contentful) for more information about the deployment process.

#### `npm run upload-ci`

Similar to `npm run upload` it will upload your app to contentful and activate it. The only difference is   
that with this command all required arguments are read from the environment variables, for example when you add
the upload command to your CI pipeline.

For this command to work, the following environment variables must be set: 

- `CONTENTFUL_ORG_ID` - The ID of your organization
- `CONTENTFUL_APP_DEF_ID` - The ID of the app to which to add the bundle
- `CONTENTFUL_ACCESS_TOKEN` - A personal [access token](https://www.contentful.com/developers/docs/references/content-management-api/#/reference/personal-access-tokens)

## Libraries to use

To make your app look and feel like Contentful use the following libraries:

- [Forma 36](https://f36.contentful.com/) – Contentful's design system
- [Contentful Field Editors](https://www.contentful.com/developers/docs/extensibility/field-editors/) – Contentful's field editor React components

## Using the `contentful-management` SDK

With the SDK and the `contentful-management` package installed, you can also 
create an instance of the `contentful-management` client using the `cmaAdapter`, 
which is part of the SDK, without passing the access token.

Install the package

```bash
npm i @contentful/contentful-management@latest @contentful/app-sdk@canary
```

Use it in your app

```js
import { init } from '@contentful/app-sdk'
import { createClient } from 'contentful-management'


init(sdk => {
  // Create the client scoped to current space-environment
  const cma = createClient(
    { apiAdapter: sdk.cmaAdapter },
    {
      type: 'plain',
      defaults: {
        environmentId: sdk.ids.environment,
        spaceId: sdk.ids.space,
      },
    }
  );

  // Use the client
  cma.locale.getMany({}).then((locales) => console.log(locales))
})

```

Visit the [`contentful-management` documentation](https://www.contentful.com/developers/docs/extensibility/app-framework/sdk/#using-the-contentful-management-library)
to find out more.

## Learn More

[Read more](https://www.contentful.com/developers/docs/extensibility/app-framework/create-contentful-app/) and check out the video on how to use the CLI.

Create Contentful App uses [Create React App](https://create-react-app.dev/). You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started) and how to further customize your app.
