'use strict'

const { setup, getSessionContext } = require('@shopware-pwa/shopware-6-client')
const { UnknownError } = require('../services/errorManager')
const { decorateError, decorateMessage } = require('../services/logDecorator')
const { saveContextToken, getContextToken } = require('../services/contextManager')

// noinspection DuplicatedCode
/**
 * @param {SW6User.PipelineContext} context
 * @returns {Promise<void>}
 */
module.exports = async (context) => {
  const endpoint = process.env.SW_ENDPOINT || context.config.endpoint
  const accessToken = process.env.SW_ACCESS_KEY || context.config.accessToken
  const languageId = process.env.SW_LANG_ID || context.config.languageId

  if (!endpoint || !accessToken) {
    context.log.fatal(decorateMessage('Please specify endpoint or accessToken in the config'))
    throw new UnknownError()
  }

  const contextToken = await getContextToken(context).then(contextToken => {
    if (typeof contextToken === 'string' && contextToken.length > 0) {
      return contextToken
    }
    // If not in storage, ask SW to give us one
    return getSessionContext()
      .then(swContext => {
        saveContextToken(swContext.token, context)
        return swContext.token
      })
      .catch(e => context.log.info(decorateError(e), 'Could not get session context'))
  })
  setup({
    endpoint,
    accessToken,
    languageId,
    contextToken
  })
}
