const { config } = require('@shopware-pwa/shopware-6-client')
const { getLoginToken } = require('../services/connectApiManager')
const { throwOnApiError } = require('../services/errorManager')

/**
 * @param {SW6User.PipelineContext} context
 * @return Promise<SW6User.UrlResponse>
 */
module.exports = async (context) => {
  const { token, expiration } = await getLoginToken().catch(e => throwOnApiError(e, context))
  const url = new URL('sgconnect/login', config.endpoint)
  url.searchParams.append('token', token)
  const registrationUrl = new URL(context.config.registrationPath, config.endpoint).href
  url.searchParams.append('redirectTo', registrationUrl)

  return {
    url,
    expires: new Date(expiration * 1000).toISOString()
  }
}
