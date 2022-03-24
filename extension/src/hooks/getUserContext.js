'use strict'

const { getSessionContext } = require('@shopware-pwa/shopware-6-client')
const { throwOnApiError } = require('../services/errorManager')
const { UnauthorisedError } = require('../services/errorList')
const { decorateMessage } = require('../services/logDecorator')

/**
 * @param {SW6User.PipelineContext} context
 * @returns {Promise<{swContext: SW6User.SWContext}>}
 */
module.exports = async (context) => {
  const swContext = await getSessionContext().catch(error => throwOnApiError(error, context))
  // todo: check if guest property also needed to be checked (see SW login endpoint logic)
  if (!swContext.customer) {
    context.log.error(decorateMessage('Logged in the app, but contextToken is of a guest'))
    // todo: translate
    throw new UnauthorisedError('User is not logged in.')
  }
  return { swContext }
}
