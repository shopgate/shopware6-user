'use strict'

const {
  apiManager: { login, getSessionContext },
  clientManger: { createApiConfig },
  contextManager: { getContextToken },
  errorManager: { throwOnApiError, throwOnMessage }
} = require('@apite/shopware6-utility')
const { decorateMessage, obfuscateString } = require('../services/logDecorator')

/**
 * We do not want to save any tokens here as it will be saving
 * to the "guest" storage (before App log in happens)
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

  // prevent saving to storage for this client
  const client = await createApiConfig(context, false)
  let contextToken
  if (strategy === 'auth_code' && parameters.code) {
    contextToken = parameters.code
    context.log.debug(decorateMessage('Received token from auth_code: ' + obfuscateString(contextToken)))
  } else {
    contextToken = await login(client, {
      username: parameters.login,
      password: parameters.password
    }).catch(err =>
      err.messages ? throwOnMessage(err.messages, context) : throwOnApiError(err, context)
    )
    context.log.debug(decorateMessage('Received token from login/pass: ' + obfuscateString(contextToken)))
  }

  client.defaults.headers['sw-context-token'] = contextToken
  const userId = await getSessionContext(client)
    .then(swContext => swContext.customer.id)
    .catch(e => throwOnApiError(e, context))

  return {
    userId,
    contextToken
  }
}
