'use strict'

const { getSessionContext, updateProfile } = require('@shopware-pwa/shopware-6-client')
const { UnauthorisedError } = require('../lib/services/errorList')

/**
 * @param context
 * @param input
 * @returns {Promise<void>}
 */
module.exports = async function (context, input) {
  const sessionContext = await getSessionContext()
  if (!sessionContext.customer) {
    throw new UnauthorisedError('Permission denied: User is not logged in.')
  }
  try {
    // TODO-Rainer test this with a real call from the app
    await updateProfile({
      firstName: input.firstName,
      lastName: input.lastName
    })
  } catch (error) {
    context.log.error(error)
    throw error
  }
}
