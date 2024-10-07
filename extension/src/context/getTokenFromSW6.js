'use strict'

const {
  apiManager: { getSessionContext },
  clientManger: { createApiConfig },
  errorManager: { throwOnApiError }
} = require('@apite/shopware6-utility')

/**
 * @param {ApiteSW6Utility.PipelineContext} context
 * @returns {Promise<SGConnectAPI.ContextTokenParam>}
 * @throws {Error}
 */
module.exports = async context => {
  const apiConfig = await createApiConfig(context)
  const contextToken = await getSessionContext(apiConfig)
    .then(response => response.token)
    .catch(error => throwOnApiError(error, context))

  return { contextToken }
}
