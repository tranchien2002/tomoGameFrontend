<h1 align="center">Welcome to Blockchain Confetti 👋</h1>
<p>
  <img src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
</p>

## Prerequisites

- npm >= 6.9.0
- node >= 10.16.0

## Install

```sh
npm install
```

or

```sh
yarn install
```

## Setup firebase

We are using firebase for database , you need to create a project in firebase after that click **`Add Firebase to you web app`** and copy script **firebaseConfig** to `src/config/index.example.js`

```js
var firebase = require('firebase/app');
require('firebase/firestore');
require('firebase/auth');

var config = {
  apiKey: '<YOUR_API_KEY>',
  authDomain: 'YOUR_AUTH_DOMAIN',
  databaseURL: 'YOUR_DATABASE_URL',
  projectId: 'YOUR_PROJECTID',
  storageBucket: 'YOUR_STORAGEBUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID'
};

firebase.initializeApp(config);

module.exports = firebase;
```

After that run script to setup firebase:

```sh
npm run firebase
```

or

```sh
yarn firebase
```

## Usage

```sh
npm start
```

or

```sh
yarn start
```

Runs the app in the development mode.
Open http://localhost:3000 to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

### If you are Admin

- First go to http://localhost:3000/admin to create new game (If you don't create game it make an error in player screen)
- Choice a question for player ,
- share bounty after single question and after 10 question .

## Run tests

```sh
npm test
```

or

```sh
yarn test
```

Launches the test runner in the interactive watch mode.
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

## Run build

```sh
npm run build
```

Builds the app for production to the build folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

## Show your support

Give a ⭐️ if this project helped you!
