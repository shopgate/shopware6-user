'use strict'

const InvalidCredentialsError = require('./shopgate/customer/errors/InvalidCredentialsError')
const { login, getSessionContext } = require('@shopware-pwa/shopware-6-client')
const { decorateError } = require('./shopgate/logDecorator')
const { getContextToken } = require('./services/contextManager')

/**
 * @param {SW6User.PipelineContext} context
 * @param {UserLoginInput} input
 * @returns {Promise<{userId: string, contextToken: string}>}
 */
module.exports = async function (context, input) {
  context.log.debug('login')
  context.log.debug('login')
  context.log.debug('login')

  if (context.meta.userId) {
    context.log.warn('User is already logged in')
    return {
      userId: context.meta.userId,
      contextToken: await getContextToken(context)
    }
  }
  const contextToken = await apiLogin(input, context)
  // todo: handle errors
  const userId = await getSessionContext().then(swContext => swContext.customer.id)

  return {
    userId,
    contextToken
  }
}

/**
 * @param {UserLoginInput} input
 * @param {SW6User.PipelineContext} context
 * @returns Promise<string>
 */
const apiLogin = async function (input, context) {
  return login({ username: input.parameters.login, password: input.parameters.password })
    .then(response => response.contextToken)
    .catch(err => {
      context.log.error(decorateError(err), 'Error in login process.')
      if (err.statusCode === 401) {
        throw new InvalidCredentialsError(err.messages[0].detail, err.messages[0].title)
      }
      throw new InvalidCredentialsError(err)
    })
}
