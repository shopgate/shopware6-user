'use strict'

const {
  apiManager: { createApiConfig },
  errorManager: { throwOnApiError }
} = require('@apite/shopware6-utility')
const { connectApiManager: { getLoginToken } } = require('@apite/shopware6-utility')

/**
 * @param {ApiteSW6Helper.PipelineContext} context
 * @return Promise<SW6User.UrlResponse>
 */
module.exports = async (context) => {
  const api = await createApiConfig(context)
  const { token, expiration } = await getLoginToken(api).catch(e => throwOnApiError(e, context))
  const url = new URL('sgconnect/login', api.config.endpoint)
  url.searchParams.append('token', token)
  const registrationUrl = new URL(context.config.registrationPath, api.config.endpoint).href
  url.searchParams.append('redirectTo', registrationUrl)

  return {
    url,
    expires: new Date(expiration * 1000).toISOString()
  }
}
