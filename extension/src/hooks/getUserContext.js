'use strict'

const { getSessionContext } = require('@shopware-pwa/shopware-6-client')
const { throwOnApiError } = require('../services/errorManager')
const { ContextDeSyncError, UnknownError } = require('../services/errorList')
const { decorateMessage } = require('../services/logDecorator')

/**
 * @param {SW6User.PipelineContext} context
 * @returns {Promise<{swContext: SW6User.SWContext}>}
 * @throws {ContextDeSyncError|UnknownError}
 */
module.exports = async (context) => {
  const swContext = await getSessionContext().catch(error => throwOnApiError(error, context))

  if (!context.meta.userId) {
    context.log.error(decorateMessage('Attempted to load user pages without being logged in'))
    throw new UnknownError()
  }

  if (context.meta.userId && !swContext.customer) {
    context.log.error(decorateMessage('Logged in the app, but contextToken is of a guest'))
    throw new ContextDeSyncError()
  }

  return { swContext }
}
