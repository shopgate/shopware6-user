'use strict'

const { getSessionContext } = require('@shopware-pwa/shopware-6-client')
const UnauthorisedError = require('./shopgate/customer/errors/UnauthorisedError')

/**
 * @returns {Promise<SW6User.getUserResponse>}
 */
module.exports = async () => {
  console.log('getUser called')
  console.log('getUser called')
  console.log('getUser called')

  // todo: handle errors
  const sessionContext = await getSessionContext()
  if (!sessionContext.customer) {
    // todo: is this a possible scenario? If so, we need to do this for every pipeline
    throw new UnauthorisedError('Permission denied: User is not logged in.')
  }
  return {
    id: sessionContext.customer.id,
    mail: sessionContext.customer.email,
    firstName: sessionContext.customer.firstName,
    lastName: sessionContext.customer.lastName,
    birthday: sessionContext.customer.birthday ? processDate(sessionContext.customer.birthday) : null,
    userGroups: [
      {
        id: sessionContext.currentCustomerGroup.id,
        name: sessionContext.currentCustomerGroup.translated.name
      }
    ]
  }
}

function processDate (dateString) {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth()).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return year + '-' + month + '-' + day
}
