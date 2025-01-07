'use strict'

const {
  apiManager: { getSessionContext },
  clientManger: { createApiConfig },
  errorManager: { throwOnApiError },
  errorList: { ContextDeSyncError, UnauthorizedError }
} = require('@apite/shopware6-utility')
const { decorateMessage } = require('../services/logDecorator')

/**
 * This hook needs to be applied to all customer pipelines
 *
 * @param {ApiteSW6Utility.PipelineContext} context
 * @returns {Promise<{swContext: SessionContext }>}
 * @throws {ContextDeSyncError|UnauthorizedError}
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
