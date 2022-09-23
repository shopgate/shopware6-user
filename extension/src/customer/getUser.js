'use strict'

/**
 * @param {ApiteSW6Utility.PipelineContext} context
 * @param {ApiteSW6Utility.SWContext} swContext
 * @returns {Promise<ApiteSW6User.getResponse>}
 */
module.exports = async (context, { swContext }) => {
  return {
    id: swContext.customer.id,
    mail: swContext.customer.email,
    firstName: swContext.customer.firstName,
    lastName: swContext.customer.lastName,
    birthday: processDate(swContext.customer.birthday),
    userGroups: [
      {
        id: swContext.currentCustomerGroup.id,
        name: swContext.currentCustomerGroup.translated.name
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
