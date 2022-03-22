'use strict'

const { saveContextToken } = require('./services/contextManager')
const { AuthFailedError } = require('./services/errorList')

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
    context.log.error(input.authType + ': Auth step finished unsuccessfully.')
    throw new AuthFailedError('Authorisation failed.')
  }

  await saveContextToken(input.contextToken, context)
}
