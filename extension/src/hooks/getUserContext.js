'use strict'

const {
  apiManager: { createApiConfig },
  errorManager: { throwOnApiError },
  errorList: { ContextDeSyncError, UnauthorizedError }
} = require('@apite/shopware6-utility')
const { getSessionContext } = require('@shopware-pwa/shopware-6-client')
const { decorateMessage } = require('../services/logDecorator')

/**
 * This hook needs to be applied to all customer pipelines
 *
 * @param {ApiteSW6Helper.PipelineContext} context
 * @returns {Promise<{swContext: SW6User.SWContext}>}
 * @throws {ContextDeSyncError|UnknownError}
 */
module.exports = async (context) => {
  if (!context.meta.userId) {
    throw new UnauthorizedError()
  }

  const apiConfig = await createApiConfig(context)
  const swContext = await getSessionContext(apiConfig)
    .catch(error => throwOnApiError(error, context))

  if (context.meta.userId && !swContext.customer) {
    context.log.error(decorateMessage('Logged in the app, but contextToken is of a guest'))
    throw new ContextDeSyncError()
  }

  return { swContext }
}
