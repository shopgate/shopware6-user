'use strict'

const {
  apiManager: { createApiConfig },
  configManager: { getEndpoint },
  connectApiManager: { getLoginToken, getLoginUrl },
  errorManager: { throwOnApiError }
} = require('@apite/shopware6-utility')

/**
 * @param {ApiteSW6Utility.PipelineContext} context
 * @return Promise<ApiteSW6Utility.UrlResponse>
 */
module.exports = async (context) => {
  const endpoint = getEndpoint(context)
  const api = await createApiConfig(context)
  const { token, expiration } = await getLoginToken(api).catch(e => throwOnApiError(e, context))
  const redirectTo = new URL(context.config.registrationPath, endpoint).href
  const url = getLoginUrl(endpoint, { token, redirectTo })

  return {
    url: url.toString(),
    expires: new Date(expiration * 1000).toISOString()
  }
}
