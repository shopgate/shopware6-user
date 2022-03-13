'use strict'

const { getSessionContext, updatePassword } = require('@shopware-pwa/shopware-6-client')
const { UnauthorisedError } = require('../lib/services/errorList')
const { decorateError } = require('../lib/services/logDecorator')

/**
 *
 * @param context
 * @param input
 * @returns {Promise<void>}
 */
module.exports = async function (context, input) {
  const sessionContext = await getSessionContext()
  if (!sessionContext.customer) {
    context.log.error('Permission denied: User is not logged in.')
    throw new UnauthorisedError('Permission denied: User is not logged in.')
  }
  try {
    // TODO-Rainer test this with a real call from the app
    await updatePassword({
      password: input.oldPassword,
      newPassword: input.password,
      newPasswordConfirm: input.password
    })
  } catch (error) {
    context.log.error(decorateError(error))
    throw error
  }
}
