'use strict'

/**
 * @param {SW6User.PipelineContext} context
 * @param {Object} input
 * @param {SW6User.SWContext} input.swContext
 * @returns {Promise<SW6User.getUserResponse>}
 */
module.exports = async (context, input) => {
  return {
    id: input.swContext.customer.id,
    mail: input.swContext.customer.email,
    firstName: input.swContext.customer.firstName,
    lastName: input.swContext.customer.lastName,
    birthday: processDate(input.swContext.customer.birthday),
    userGroups: [
      {
        id: input.swContext.currentCustomerGroup.id,
        name: input.swContext.currentCustomerGroup.translated.name
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
