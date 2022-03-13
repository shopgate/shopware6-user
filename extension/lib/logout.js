'use strict'

const { logout, getSessionContext } = require('@shopware-pwa/shopware-6-client')
const { getContextToken } = require('./services/contextManager')
const { throwOnApiError } = require('./services/errorManager')

/**
 * @param {SW6User.PipelineContext} context
 * @returns {Promise<{contextToken: string}>}
 * @throws {Error}
 */
module.exports = async function (context) {
  context.log.debug('logout called')
  context.log.debug('logout called')
  context.log.debug('logout called')

  if (!context.meta.userId) {
    context.log.warn('User is already logged out')
    return {
      contextToken: await getContextToken(context)
    }
  }
  await logout().catch(error => throwOnApiError(error, context))

  // todo: should we ask for a new contextToken or load the one before login? Decision may affect the cart.
  const contextToken = await getSessionContext()
    .then(response => response.token)
    .catch(error => throwOnApiError(error, context))

  return { contextToken }
}
