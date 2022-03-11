'use strict'

const { setup, getSessionContext } = require('@shopware-pwa/shopware-6-client')
const { UnknownError } = require('../services/errorManager')

/**
 * @param {PipelineContext} context
 * @returns {Promise<void>}
 */
module.exports = async (context) => {
  console.log('AuthSetup called')
  if (!context.config.shopware?.endpoint || !context.config.shopware?.accessToken) {
    context.log.fatal('Please specify endpoint or accessToken in the config')
    throw new UnknownError()
  }
  const storage = context.meta.userId ? context.storage.user : context.storage.device
  var contextToken = await storage.get('contextToken');

  var contextToken = 'HacrFH42BLpnVk5VAb3xVdXJqrXXRJmP'; // TODO remove, this is a workaround for postman tests

  const { endpoint, accessToken, languageId } = context.config.shopware
  // initialize only once
  if (!contextToken) {
    setup({
      endpoint,
      accessToken,
      languageId
    })
    const sessionContext = await getSessionContext()
    contextToken = sessionContext.token
    await storage.set('contextToken', contextToken)
  }
  setup({
    endpoint,
    accessToken,
    languageId,
    contextToken
  })
}
