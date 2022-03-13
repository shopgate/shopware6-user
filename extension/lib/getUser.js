'use strict'

const { getSessionContext } = require('@shopware-pwa/shopware-6-client')
const { throwOnApiError } = require('./services/errorManager')
const { UnauthorisedError } = require('./services/errorList')

/**
 * @param {SW6User.PipelineContext} context
 * @returns {Promise<SW6User.getUserResponse>}
 */
module.exports = async (context) => {
  console.log('getUser called')
  console.log('getUser called')
  console.log('getUser called')

  const sessionContext = await getSessionContext().catch(error => throwOnApiError(error, context))
  if (!sessionContext.customer) {
    // todo: is this a possible scenario? If so, we need to do this for every pipeline
    throw new UnauthorisedError('Permission denied: User is not logged in.')
  }
  return {
    id: sessionContext.customer.id,
    mail: sessionContext.customer.email,
    firstName: sessionContext.customer.firstName,
    lastName: sessionContext.customer.lastName,
    birthday: processDate(sessionContext.customer.birthday),
    userGroups: [
      {
        id: sessionContext.currentCustomerGroup.id,
        name: sessionContext.currentCustomerGroup.translated.name
      }
    ]
  }
}

/**
 * @param {string|undefined} dateString
 * @return {string|undefined} - YYYY-MM-DD
 */
function processDate (dateString) {
  if (!dateString) {
    return undefined
  }
  const date = new Date(dateString)
  const month = String(date.getMonth()).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return date.getFullYear() + '-' + month + '-' + day
}
