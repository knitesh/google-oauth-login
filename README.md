[![npm-version](https://img.shields.io/npm/v/google-oauth-login?color=green&style=flat-square)](https://img.shields.io/npm/v/google-oauth-login?color=green&style=flat-square)
[![Total Downloads](https://img.shields.io/npm/dw/google-oauth-login?style=flat-square)](https://www.npmjs.com/package/google-oauth-login)
[![GitHub issues](https://img.shields.io/github/issues/knitesh/google-oauth-login?style=flat-square)](https://github.com/knitesh/google-oauth-login/issues)
[![GitHub license](https://img.shields.io/github/license/knitesh/google-oauth-login)](https://github.com/knitesh/google-oauth-login/blob/master/LICENSE)

# Google Login OAuth 2.0 flow

Google oAuth flow to retrieve access &amp; refresh token

## Feature

This package can be used to get Google access token and refresh token for an user access token.

**Implements a server-Side flow for login with Google, similar to one provided by Facebook or Twitter.**

**This can be used to get User Access Token to make API calls to Google, like getting access to Google My Business**

## Installation

- Clone as a Git repository

  ```sh
  git clone https://github.com/knitesh/google-login.git
  ```

- Install as a node_module

  ```sh
  npm i google-oauth-login --save

  OR

  npm install google-oauth-login --save
  ```

## Usage

To initialize Google oAuth function

```js
new GoogleLogin(config)
```

where config will be

```js
const config = {
  clientId,
  clientSecret,
  scope,
  redirectUri,
}
```

To get oAuth URl for user consent and login

```js
await google.getGoogleOauthUrl()
```

To extract code received from Google

```js
await google.getOauthCodeAsync(oAuthParam)
```

To get access token and refresh token(if accessType = offline)

```js
await google.getAccessTokenAsync(oAuthParam)
```

## Sample Express app

```js
const express = require('express')
const GoogleLogin = require('google-oauth-login')

const app = express()
const port = 9000



const google = new GoogleLogin({
  clientId:<<your Google oAuth Client Id>,
  clientSecret: <<your Google oAuth Client Secret>,
  redirectUri: 'http://localhost:9000/google/oauth/callback',
  scope: 'https://www.googleapis.com/auth/userinfo.profile',
  accessType: 'offline', // to get refresh token pass access type: offline
  prompt: 'consent', // to prompt user everytime
})

app.get('/google/oauth', async (req, res) => {
  // generate the URL that Googl will use for login and consent dialog
  var result = await google.getGoogleOauthUrl()
  // redirect the user to consent screen
  res.redirect(result)
})

// This is the Authrized redirect URl that needs to be added to oAuth Client Id generation screen
// Google will  send the code and related scope as query string to this Url
app.get('/google/oauth/callback', async (req, res) => {
  const oAuthParam = {
    code: req.query.code,
    scope: req.query.scope,
  }
  // if you just need the code
  const code = await google.getOauthCodeAsync(oAuthParam)
  // get the access token, token_type  so that you can make additional call to google
  var result = await google.getAccessTokenAsync(oAuthParam)
  // This example just showing result returned in a browers
  // You should store this in a secure database and never expose to client app
  res.send(JSON.stringify(result))
})

app.get('/', (req, res) => {
  const _user = req.session && req.session.user
  if (_user) {
    res.send(JSON.stringify(_user))
  } else {
    res.send('Login with Google')
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
```
