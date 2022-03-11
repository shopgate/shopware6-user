const { getSessionContext } = require('@shopware-pwa/shopware-6-client');
const UnauthorisedError = require('./shopgate/customer/errors/UnauthorisedError');
/**
 * @param {PipelineContext} context
 * @returns {Promise<getUserResponse>}
 */
module.exports = async function (context) {
  console.log('getUser called')
  console.log('getUser called')
  console.log('getUser called')
  if (!context.meta.userId) {
    throw new UnauthorisedError('Permission denied: User is not logged in.')
  }


  try {

    const sessionContext = await getSessionContext();
    if (!sessionContext.customer) {
      throw new UnauthorisedError('Permission denied: User is not logged in.')
    }

    return {
      id: sessionContext.customer.id,
      mail: sessionContext.customer.email,
      firstName: sessionContext.customer.firstName,
      lastName: sessionContext.customer.lastName,
      gender: null,
      birthday: sessionContext.customer.birthday ? processDate(sessionContext.customer.birthday) : null,
      phone: null,
      customerGroups: sessionContext.customer.groupId,
      addresses: []
    }

  } catch (error) {
    context.log.error(error)
    throw error
  }
}

function processDate(dateString) {
  let date = new Date(dateString)

  let year = date.getFullYear()
  let month = String(date.getMonth()).padStart(2, '0')
  let day = String(date.getDate()).padStart(2, '0')

  return year + '-' + month + '-' + day
}
