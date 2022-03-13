'use strict'

const { login, getSessionContext } = require('@shopware-pwa/shopware-6-client')
const { getContextToken } = require('./services/contextManager')
const { throwOnApiError } = require('./services/errorManager')

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
  const userId = await getSessionContext()
    .then(swContext => swContext.customer.id)
    .catch(e => throwOnApiError(e, context))

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
    .catch(err => throwOnApiError(err, context))
}
