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
    case 401:
      context.log.error(decorateError(error), 'Unauthorized request, is user/password correct?')
      throw new InvalidCredentialsError(error.messages[0]?.detail)
    case 403:
      throwOnMessage(error.messages, context)
      break
    case 412:
      context.log.fatal(decorateError(error), 'Possibly SalesChannel access key is invalid.')
      throw new UnknownError()
    case 500:
    default:
      context.log.fatal(decorateError(error), 'Unmapped error')
      throw new UnknownError()
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
