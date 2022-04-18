'use strict'

const { logout, getSessionContext } = require('@shopware-pwa/shopware-6-client')
const { throwOnApiError } = require('../services/errorManager')
const { decorateError } = require('../services/logDecorator')

/**
 * @param {SW6User.PipelineContext} context
 * @returns {Promise<{contextToken: string}>}
 * @throws {Error}
 */
module.exports = async function (context) {
  /**
   * We do not mind if the customer is logged out already,
   * we want to continue with App logout
   */
  await logout().catch(error => context.log.warn(decorateError(error)))

  const contextToken = await getSessionContext()
    .then(response => response.token)
    .catch(error => throwOnApiError(error, context))

  return { contextToken }
}
