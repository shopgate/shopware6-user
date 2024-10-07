'use strict'

const {
  configManager: { getEndpoint },
  connectApiManager: { getLoginUrl }
} = require('@apite/shopware6-utility')
const path = require('path')
const { getRegistrationPath } = require('../services/configManager')

/**
 * @param {ApiteSW6Utility.PipelineContext} context
 * @param {SGConnectAPI.LoginTokenResponse} input
 * @return Promise<SGConnectAPI.UrlResponse>
 */
module.exports = async (context, { token, expiration }) => {
  const endpoint = getEndpoint(context)
  const redirectTo = new URL(path.join(endpoint, getRegistrationPath(context))).href
  const url = getLoginUrl(endpoint, { token, redirectTo }).toString()

  context.log.debug('Registration URL: ' + url)

  return {
    url,
    expires: new Date(expiration * 1000).toISOString()
  }
}
