'use strict'

const {
  apiManager: { createApiConfig },
  contextManager: { getContextToken }
} = require('@apite/shopware6-utility')
const { login, getSessionContext, update } = require('@shopware-pwa/shopware-6-client')
const { throwOnApiError } = require('../services/errorManager')

/**
 * We do not want to save any tokens here as we will be saving
 * to the "guest" session here
 *
 * @param {ApiteSW6Helper.PipelineContext} context
 * @param {SW6User.UserLoginInput} input
 * @returns {Promise<{userId: string, contextToken: string}>}
 */
module.exports = async function (context, input) {
  if (context.meta.userId) {
    context.log.warn('User is already logged in')
    return {
      userId: context.meta.userId,
      contextToken: await getContextToken(context)
    }
  }

  const apiConfig = await createApiConfig(context, {}, false)
  let contextToken
  if (input.strategy === 'auth_code' && input.parameters.code) {
    update({ contextToken: input.parameters.code })
    contextToken = input.parameters.code
    context.log.debug('updating context from registration: ' + contextToken)
  } else {
    contextToken = await apiLogin(input, context, apiConfig)
    context.log.debug('updating context from login: ' + contextToken)
  }

  const userId = await getSessionContext(apiConfig)
    .then(swContext => swContext.customer.id)
    .catch(e => throwOnApiError(e, context))

  return {
    userId,
    contextToken
  }
}

/**
 * @param {SW6User.UserLoginInput} input
 * @param {ApiteSW6Helper.PipelineContext} context
 * @param {ApiteSW6Helper.SWApiInstance} config
 * @returns Promise<SW6User.SWContextTokenResponse>
 * @throws {Error}
 */
const apiLogin = async function (input, context, config) {
  return login({ username: input.parameters.login, password: input.parameters.password }, config)
    .then(response => response.contextToken)
    .catch(err => throwOnApiError(err, context))
}
