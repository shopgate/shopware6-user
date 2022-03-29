'use strict'

class AuthFailedError extends Error {
  constructor (message) {
    // todo: translate
    super(message || 'Something went wrong during authorization.')
    this.code = 'EAUTHFAILED'
  }
}

class InvalidCredentialsError extends Error {
  constructor (message) {
    // todo: translate
    super(message || 'The given credentials are wrong or do not exist.')
    this.code = 'EINVALIDCREDENTIALS'
  }
}

class UnauthorisedError extends Error {
  constructor () {
    super('Permission denied.')
    this.code = 'EACCESS'
  }
}

class UnknownError extends Error {
  constructor () {
    // todo: translate
    super('An internal error occurred.')
    this.code = 'EUNKNOWN'
    this.displayMessage = null
  }
}

module.exports = {
  AuthFailedError,
  InvalidCredentialsError,
  UnauthorisedError,
  UnknownError
}
