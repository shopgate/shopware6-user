'use strict'

const {
  contextManager: { saveContextToken },
  errorList: { UnknownError }
} = require('@apite/shopware6-utility')
const { decorateMessage } = require('../services/logDecorator')

/**
 * @param {ApiteSW6Utility.PipelineContext} context
 * @param {ApiteSW6User.SGAuthSuccessInput} input
 * @returns {Promise<void>}
 */
module.exports = async function (context, input) {
  if (input.authType === 'Login' && input.authSuccess !== true) {
    context.log.error(decorateMessage(input.authType + ': Auth step finished unsuccessfully.'))
    throw new UnknownError()
  }

  await saveContextToken(input.contextToken, context)
}
