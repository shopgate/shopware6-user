'use strict'

const { saveContextToken } = require('../services/contextManager')
const { UnknownError } = require('../services/errorList')
const { decorateMessage } = require('../services/logDecorator')

/**
 * @param {SW6User.PipelineContext} context
 * @param {Object} input
 * @param {boolean} input.authSuccess
 * @param {string} input.authType
 * @param {string} input.contextToken
 * @returns {Promise<void>}
 */
module.exports = async function (context, input) {
  if (input.authType === 'Login' && input.authSuccess !== true) {
    context.log.error(decorateMessage(input.authType + ': Auth step finished unsuccessfully.'))
    throw new UnknownError()
  }

  await saveContextToken(input.contextToken, context)
}
