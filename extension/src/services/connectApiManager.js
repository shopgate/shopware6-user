'use strict'

/**
 * @namespace SGConnectAPI
 */
/**
 * @typedef {Object} SGConnectAPI.loginTokenResponse
 * @property {string} token - JWT token for login purposes
 * @property {number} expiration - unix timestamp in seconds
 */
const { invokeGet } = require('@shopware-pwa/shopware-6-client')

const getLoginTokenEndpoint = () => '/store-api/sgconnect/login/token'

/**
 * @returns {Promise<SGConnectAPI.loginTokenResponse>}
 */
const getLoginToken = async () => invokeGet({ address: getLoginTokenEndpoint() }).then(({ data }) => data)

module.exports = { getLoginToken }
