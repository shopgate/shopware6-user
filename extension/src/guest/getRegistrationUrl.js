'use strict'

const {
  apiManager: { createApiConfig },
  configManager: { getEndpoint },
  connectApiManager: { getLoginToken, getLoginUrl },
  errorManager: { throwOnApiError }
} = require('@apite/shopware6-utility')
const { getRegistrationPath } = require('../services/configManager')

/**
 * @param {ApiteSW6Utility.PipelineContext} context
 * @return Promise<ApiteSW6Utility.UrlResponse>
 */
module.exports = async (context) => {
  const endpoint = getEndpoint(context)
  const api = await createApiConfig(context)
  const { token, expiration } = await getLoginToken(api).catch(e => throwOnApiError(e, context))
  const redirectTo = new URL(getRegistrationPath(context), endpoint).href
  const url = getLoginUrl(endpoint, { token, redirectTo }).toString()

  context.log.debug('Registration URL: ' + url)

  return {
    url,
    expires: new Date(expiration * 1000).toISOString()
  }
}
