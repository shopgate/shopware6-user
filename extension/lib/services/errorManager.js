'use strict'

const { decorateError } = require('./logDecorator')
const { UnknownError, InvalidCredentialsError } = require('./errorList')

/**
 * @param {SW6User.ClientApiError|Error} error
 * @param {SW6User.PipelineContext} context
 * @see https://shopware.stoplight.io/docs/store-api/ZG9jOjExMTYzMDU0-error-handling
 * @throws {Error}
 */
const throwOnApiError = function (error, context) {
  if (!error.statusCode) {
    context.log.error(decorateError(error))
    throw new UnknownError()
  }
  switch (error.statusCode) {
    case 412:
      context.log.fatal(decorateError(error), 'Possibly SalesChannel access key is invalid.')
      throw new UnknownError()
    case 500:
    default:
      throwOnMessage(error.messages, context)
  }
}

/**
 * @param {SW6User.ShopwareError[]} messages
 * @param {SW6User.PipelineContext} context
 * @throws {UnknownError}
 */
const throwOnMessage = function (messages, context) {
  messages.forEach(message => {
    switch (message.code) {
      case 'CHECKOUT__CUSTOMER_NOT_LOGGED_IN':
        // do not need to throw as this is a soft error, maybe?
        context.log.debug(decorateError(message), 'Logged in SG, but contextToken is of a guest. Cannot logout.')
        break
      case 'CHECKOUT__CUSTOMER_AUTH_THROTTLED':
        context.log.debug(decorateError(message), 'Too many login attempts. Need to wait.')
        throw new UnknownError()
      case 'CHECKOUT__CUSTOMER_AUTH_BAD_CREDENTIALS':
        context.log.error(decorateError(message), 'Unauthorized request, is user/password correct?')
        throw new InvalidCredentialsError(message.detail)
      case 'CHECKOUT__CUSTOMER_IS_INACTIVE':
        context.log.error(decorateError(message), 'Customer is not active. Needs to confirm account in email.')
        throw new InvalidCredentialsError(message.detail)
      default:
        context.log.fatal(decorateError(message), 'Cannot call this endpoint with authentication')
        throw new UnknownError()
    }
  })
}

module.exports = {
  UnknownError,
  throwOnApiError
}
