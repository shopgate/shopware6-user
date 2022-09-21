'use strict'

const {
  apiManager: { createApiConfig },
  errorManager: { throwOnApiError }
} = require('@apite/shopware6-utility')
const { getSessionContext } = require('@shopware-pwa/shopware-6-client')

/**
 * @param {ApiteSW6Helper.PipelineContext} context
 * @returns {Promise<{contextToken: string}>}
 * @throws {Error}
 */
module.exports = async context => {
  const apiConfig = await createApiConfig(context)
  const contextToken = await getSessionContext(apiConfig)
    .then(response => response.token)
    .catch(error => throwOnApiError(error, context))

  return { contextToken }
}
