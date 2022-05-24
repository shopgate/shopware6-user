'use strict'

const { getSessionContext } = require('@shopware-pwa/shopware-6-client')
const { throwOnApiError } = require('../services/errorManager')
const { ContextDeSyncError, UnauthorizedError } = require('../services/errorList')
const { decorateMessage } = require('../services/logDecorator')

/**
 * This hook needs to be applied to all customer pipelines
 *
 * @param {SW6User.PipelineContext} context
 * @returns {Promise<{swContext: SW6User.SWContext}>}
 * @throws {ContextDeSyncError|UnknownError}
 */
module.exports = async (context) => {
  const swContext = await getSessionContext().catch(error => throwOnApiError(error, context))

  if (!context.meta.userId) {
    throw new UnauthorizedError()
  }

  if (context.meta.userId && !swContext.customer) {
    context.log.error(decorateMessage('Logged in the app, but contextToken is of a guest'))
    throw new ContextDeSyncError()
  }

  return { swContext }
}
