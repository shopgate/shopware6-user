'use strict'

const { getSessionContext, deleteCustomerAddress } = require('@shopware-pwa/shopware-6-client')
const { UnauthorisedError } = require('../../lib/services/errorList')

/**
 *
 * @param context
 * @param input
 * @returns {Promise<void>}
 */
module.exports = async (context, input) => {
  const sessionContext = await getSessionContext()
  if (!sessionContext.customer) {
    context.log.error('Permission denied: User is not logged in.')
    throw new UnauthorisedError('Permission denied: User is not logged in.')
  }
  try {
    // TODO-Rainer test this with a real call from the app
    await Promise.all(input.ids.map(async (addressId) => {
      await deleteCustomerAddress(addressId)
    }))
  } catch (error) {
    context.log.error(error)
    throw error
  }
}
