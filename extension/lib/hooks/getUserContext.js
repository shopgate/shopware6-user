'use strict'

const { getSessionContext } = require('@shopware-pwa/shopware-6-client')
const { throwOnApiError } = require('../services/errorManager')
const { UnauthorisedError } = require('../services/errorList')

/**
 * @param {SW6User.PipelineContext} context
 * @returns {Promise<{swContext: SW6User.SWContext}>}
 */
module.exports = async (context) => {
  const swContext = await getSessionContext().catch(error => throwOnApiError(error, context))
  if (!swContext.customer) {
    throw new UnauthorisedError('Permission denied: User is not logged in.')
  }
  return { swContext }
}
