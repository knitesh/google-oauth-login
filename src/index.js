const axios = require('axios')
const querystring = require('querystring')
const FormData = require('form-data')

const {
  GOOGLE_OAUTH_URL,
  GOOGLE_OAUTH_ACCESS_TOKEN_URL,
  GOOGLE_OAUTH_REVOKE_ACCESS_URL,
  GOOGLE_OAUTH_INCREMENTAL_GRANT_URL,
} = require('./endpoints')

const ValidateGoogleLoginAppConfig = (config) => {
  if (!config.clientId || typeof config.clientId !== 'string') {
    throw new Error('Invalid or missing `client_Id`')
  }
  if (
    !config.clientSecret ||
    typeof config.clientSecret !== 'string'
  ) {
    throw new Error('Invalid or missing `clientSecret` ')
  }
  if (!config.redirectUri || typeof config.redirectUri !== 'string') {
    throw new Error('Invalid or missing `redirectUri`')
  }
  if (!config.scope || typeof config.scope !== 'string') {
    throw new Error('Invalid or missing `scope`')
  }
}

const getOAuthUrl = (options) => {
  const oAuthUrl =
    `${GOOGLE_OAUTH_URL}?` + querystring.stringify(options)
  return oAuthUrl
}

class GoogleLogin {
  constructor(googleApiConfig) {
    // Check all required options exist for calling Twitter API
    ValidateGoogleLoginAppConfig(googleApiConfig)

    this.Config = googleApiConfig
  }
  getGoogleOauthUrl = async () => {
    let googlOauthUrlPromise = new Promise((resolve, reject) => {
      try {
        const {
          clientId,
          redirectUri,
          scope,
          accessType,
          prompt,
        } = this.Config

        const params = {
          client_id: clientId,
          redirect_uri: redirectUri,
          response_type: 'code',
          scope: scope,
          ...(accessType ? { access_type: accessType } : {}),
          ...(prompt ? { prompt } : {}),
        }

        console.log(params)

        const oAuthUrl = getOAuthUrl(params)
        resolve(oAuthUrl)
      } catch (err) {
        reject(err)
      }
    })

    return googlOauthUrlPromise
  }
  getOauthCodeAsync = async (config) => {
    return new Promise((resolve, reject) => {
      try {
        const { code, scope } = config
        resolve(code)
      } catch (err) {
        reject(err)
      }
    })
  }
  getAccessTokenAsync = async (params) => {
    const { code, scope } = params

    return new Promise(async (resolve, reject) => {
      try {
        const { clientId, clientSecret, redirectUri } = this.Config
        let formData = new FormData()

        formData.append('code', code)
        formData.append('client_id', clientId)
        formData.append('client_secret', clientSecret)
        formData.append('redirect_uri', redirectUri)
        formData.append('grant_type', 'authorization_code')

        var config = {
          method: 'post',
          url: GOOGLE_OAUTH_ACCESS_TOKEN_URL,
          data: formData,
          headers: formData.getHeaders(),
        }
        const { data } = await axios(config)
        resolve(data)
      } catch (err) {
        reject(err)
      }
    })
  }
  refreshAccessTokenAsync = async (refreshToken) => {
    return new Promise(async (resolve, reject) => {
      try {
        let formData = new FormData()
        formData.append('client_id', clientId)
        formData.append('client_secret', clientSecret)
        formData.append('redirect_uri', redirectUri)
        formData.append('grant_type', 'refresh_token')
        formData.append('refresh_token', refreshToken)

        var httpConfig = {
          method: 'post',
          url: GOOGLE_OAUTH_ACCESS_TOKEN_URL,
          data: formData,
          headers: formData.getHeaders(),
        }

        const { data } = await axios(httpConfig)
        resolve(data)
      } catch (err) {
        reject(err)
      }
    })
  }
  revokeAccessTokenAsync = async (token) => {
    return new Promise(async (resolve, reject) => {
      try {
        var param = querystring.stringify({
          token: token,
        })
        var config = {
          method: 'post',
          url: GOOGLE_OAUTH_REVOKE_ACCESS_URL,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          data: param,
        }
        const { data } = await axios(config)

        resolve(data)
      } catch (err) {
        reject(err)
      }
    })
  }
}

module.exports = GoogleLogin

/*
  Authorized redirect URIs
  Users will be redirected to this path after they have authenticated with Google.
  The path will be appended with the authorization code for access, and must have a protocol.
  It can’t contain URL fragments, relative paths, or wildcards, and can’t be a public IP address.
 */
