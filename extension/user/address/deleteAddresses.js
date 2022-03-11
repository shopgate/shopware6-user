const { getSessionContext, deleteCustomerAddress } = require('@shopware-pwa/shopware-6-client');
const UnauthorisedError = require('../../lib/shopgate/customer/errors/UnauthorisedError');

/**
 *
 * @param context
 * @param input
 * @returns {Promise<void>}
 */
module.exports = async (context, input) => {
  try {
    const sessionContext = await getSessionContext();
    if (!sessionContext.customer) {
      throw new UnauthorisedError('Permission denied: User is not logged in.')
    }

    // TODO-Rainer test this with a real call from the app

    await Promise.all(input.ids.map(async (addressId) => {
      await deleteCustomerAddress(addressId);
    }));
  } catch (error) {
    context.log.error(error);
    throw error;
  }
}
