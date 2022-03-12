'use strict'

const { setup, onConfigChange, getSessionContext } = require('@shopware-pwa/shopware-6-client')
const { UnknownError } = require('../services/errorManager')
const { saveContextToken, getContextToken } = require('../services/contextManager')

/**
 * @param {SW6User.PipelineContext} context
 * @returns {Promise<void>}
 */
module.exports = async (context) => {
  if (!context.config.shopware?.endpoint || !context.config.shopware?.accessToken) {
    context.log.fatal('Please specify endpoint or accessToken in the config')
    throw new UnknownError()
  }
  const contextToken = await getContextToken(context).then(contextToken => {
    if (contextToken) {
      return contextToken
    }
    onConfigChange(({ config }) => {
      context.log.debug('contextToken possibly changed:' + config.contextToken)
    })
    return getSessionContext()
      .catch(e => {
        context.log.fatal(e.message, 'Could not get session context')
        throw new UnknownError()
      })
      .then(swContext => {
        saveContextToken(swContext.token, context)
        return swContext.token
      })
  })
  const { endpoint, accessToken, languageId } = context.config.shopware
  // initialize only once
  setup({
    endpoint,
    accessToken,
    languageId,
    contextToken
  })
}
