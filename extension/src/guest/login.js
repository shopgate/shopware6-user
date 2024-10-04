'use strict'

const {
  apiManager: { login, getSessionContext },
  clientManger: { createApiConfig },
  contextManager: { getContextToken },
  errorManager: { throwOnApiError }
} = require('@apite/shopware6-utility')
const { decorateMessage } = require('../services/logDecorator')

/**
 * // todo: check if this message needs cleaning
 * We do not want to save any tokens here as we will be saving
 * to the "guest" session here
 *
 * @param {ApiteSW6Utility.PipelineContext} context
 * @param {SGConnectAPI.LoginRequest} input
 * @returns {Promise<{userId: string, contextToken: string}>}
 */
module.exports = async function (context, { strategy, parameters }) {
  if (context.meta.userId) {
    context.log.debug(decorateMessage('User is already logged in'))
    return {
      userId: context.meta.userId,
      contextToken: await getContextToken(context)
    }
  }

  // todo: test if not saving the token is necessary
  const apiConfig = await createApiConfig(context)
  let contextToken
  if (strategy === 'auth_code' && parameters.code) {
    contextToken = parameters.code
    apiConfig.defaults.headers['sw-context-token'] = contextToken
    // todo: obfuscate
    context.log.debug(decorateMessage('updating context from registration: ' + contextToken))
  } else {
    contextToken = await login(apiConfig, {
      username: parameters.login,
      password: parameters.password
    }).catch(err => throwOnApiError(err, context))
    context.log.debug(decorateMessage('updating context token from login: ' + contextToken))
  }

  const userId = await getSessionContext(apiConfig)
    .then(swContext => swContext.customer.id)
    .catch(e => throwOnApiError(e, context))

  return {
    userId,
    contextToken
  }
}
