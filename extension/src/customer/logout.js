'use strict'

const {
  apiManager: { logout },
  clientManger: { createApiConfig }
} = require('@apite/shopware6-utility')
const { decorateError } = require('../services/logDecorator')

/**
 * @param {ApiteSW6Utility.PipelineContext} context
 * @returns {Promise<void>}
 */
module.exports = async function (context) {
  /**
   * We do not mind if the customer is logged out already,
   * we want to continue with App logout. We also do not
   * want to save the token new guest to the user storage
   */
  const apiConfig = await createApiConfig(context)
  await logout(apiConfig).catch(error => context.log.warn(decorateError(error)))
}
