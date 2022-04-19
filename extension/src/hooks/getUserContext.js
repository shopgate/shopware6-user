'use strict'

const { getSessionContext } = require('@shopware-pwa/shopware-6-client')
const { throwOnApiError } = require('../services/errorManager')
const { AuthFailedError, UnauthorisedError } = require('../services/errorList')
const { decorateMessage } = require('../services/logDecorator')

/**
 * @param {SW6User.PipelineContext} context
 * @returns {Promise<{swContext: SW6User.SWContext}>}
 * @throws {AuthFailedError|UnauthorisedError}
 */
module.exports = async (context) => {
  const swContext = await getSessionContext().catch(error => throwOnApiError(error, context))

  if (!context.meta.userId) {
    throw new UnauthorisedError('Permission denied: User is not logged in.')
  }

  if (context.meta.userId && !swContext.customer) {
    context.log.error(decorateMessage('Logged in the app, but contextToken is of a guest'))
    throw new AuthFailedError()
  }

  return { swContext }
}
