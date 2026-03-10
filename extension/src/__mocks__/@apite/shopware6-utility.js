'use strict'

const path = require('path')

const getLoginEndpoint = () => '/sgwebcheckout/login'

module.exports = {
  apiManager: {
    login: jest.fn(),
    getSessionContext: jest.fn()
  },
  clientManger: {
    createApiConfig: jest.fn()
  },
  contextManager: {
    getContextToken: jest.fn()
  },
  errorManager: {
    throwOnApiError: jest.fn(),
    throwOnMessage: jest.fn()
  },
  errorList: {
    InvalidCredentialsError: class InvalidCredentialsError extends Error {
      constructor () {
        super('ApiteSW6Utility.notice.loginBadCredentials')
        this.code = 'EBADCREDENTIALS'
      }
    }
  },
  configManager: {
    getEndpoint: (context) => {
      const endpoint = process.env.SW_ENDPOINT || context.config.endpoint
      return endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint
    }
  },
  connectApiManager: {
    getLoginUrl: (baseUrl, props) => {
      const url = new URL(path.join(baseUrl, getLoginEndpoint()))
      Object.keys(props).forEach(key => url.searchParams.append(key, props[key]))
      return url
    }
  }
}
