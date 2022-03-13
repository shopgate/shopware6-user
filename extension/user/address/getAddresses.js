'use strict'

const { getSessionContext, getCustomerAddresses } = require('@shopware-pwa/shopware-6-client')
const { UnauthorisedError } = require('../../lib/services/errorList')

/**
 * @param {Object} context
 * @returns {Promise<{addresses: *}>}
 */
module.exports = async function (context) {
  const sessionContext = await getSessionContext()
  if (!sessionContext.customer) {
    context.log.error('Permission denied: User is not logged in.')
    throw new UnauthorisedError('Permission denied: User is not logged in.')
  }

  try {
    // TODO-Rainer test this with a real call from the app
    const addresses = await getCustomerAddresses()

    return {
      addresses: addresses.elements.map(address => ({
        id: address.id,
        salutation: address.salutation.displayName,
        firstName: address.firstName,
        lastName: address.lastName,
        street1: address.street,
        street2: address.additionalAddressLine1 ? address.additionalAddressLine1 + ' | ' + address.additionalAddressLine2 : address.additionalAddressLine2,
        zipCode: address.zipcode,
        city: address.city,
        province: getProvince(address),
        country: address.country.iso,
        tags: getTags(address, sessionContext),
        customAttributes: getCustomAttributes(address)
      }))
    }
  } catch (error) {
    context.log.error(error)
    throw error
  }

  /**
   * @param {Object} address
   * @param {Object} sessionContext
   * @returns {Array}
   * @private
   */
  function getTags (address, sessionContext) {
    const tags = []
    if (address.id === sessionContext.customer.defaultShippingAddressId) {
      tags.push('default_shipping')
    }
    if (address.id === sessionContext.customer.defaultBillingAddressId) {
      tags.push('default_billing')
    }

    return tags
  }

  /**
   *
   * @param {Object} address
   * @returns {string}
   * @private
   */
  function getProvince (address) {
    let province = ''
    if (address.countryState && address.countryState.shortCode) {
      province = address.countryState.shortCode
    }
    return province
  }

  /**
   * @param {Object} address
   * @returns {Object}
   */
  function getCustomAttributes (address) {
    const customAttributes = {}
    customAttributes.title = address.title
    customAttributes.company = address.company
    customAttributes.department = address.department
    customAttributes.phone = address.phoneNumber
    return customAttributes
  }
}
