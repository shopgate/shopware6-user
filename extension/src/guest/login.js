'use strict'

const {
  apiManager: { createApiConfig },
  contextManager: { getContextToken },
  errorManager: { throwOnApiError }
} = require('@apite/shopware6-utility')
const { login, getSessionContext, update } = require('@shopware-pwa/shopware-6-client')

/**
 * We do not want to save any tokens here as we will be saving
 * to the "guest" session here
 *
 * @param {ApiteSW6Utility.PipelineContext} context
 * @param {ApiteSW6User.LoginInput} input
 * @returns {Promise<{userId: string, contextToken: string}>}
 */
module.exports = async function (context, input) {
  if (context.meta.userId) {
    context.log.debug('User is already logged in')
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
    apiConfig.update({ contextToken })
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
 * @param {ApiteSW6User.LoginInput} input
 * @param {ApiteSW6Utility.PipelineContext} context
 * @param {ApiteSW6Utility.SWApiInstance} config
 * @returns Promise<string>
 * @throws {Error}
 */
const apiLogin = async function ({ parameters }, context, config) {
  await login({ username: parameters.login, password: parameters.password }, config)
    .catch(err => throwOnApiError(err, context))
  return config.config.contextToken
}
