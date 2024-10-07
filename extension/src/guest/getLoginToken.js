'use strict'

const {
  clientManger: { createApiConfig },
  connectApiManager: { getLoginToken },
  errorManager: { throwOnApiError }
} = require('@apite/shopware6-utility')

/**
 * @param {ApiteSW6Utility.PipelineContext} context
 * @return Promise<SGConnectAPI.LoginTokenResponse>
 */
module.exports = async (context) => {
  const api = await createApiConfig(context)

  return getLoginToken(api).catch(e => throwOnApiError(e, context))
}
