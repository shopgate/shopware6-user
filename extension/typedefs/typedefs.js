/* eslint-disable */
// noinspection ES6ShorthandObjectProperty
const {
  ClientApiError,
  EntityError,
  ShopwareError
} = require('@shopware-pwa/commons')

/**
 * @typedef {Object} SW6User.UserLoginInput
 * @property {'auth_code'|'basic'} strategy
 * @property {SW6User.UserLoginStrategyBasic|SW6User.UserLoginStrategyToken} parameters
 */

/**
 * @typedef {Object} SW6User.UserLoginStrategyBasic
 * @property {string} login - email
 * @property {string} password
 */

/**
 * @typedef {Object} SW6User.UserLoginStrategyToken
 * @property {string} token - shopware context token
 */

/**
 * @typedef {Object} SW6User.getUserResponse
 * @property {string} id
 * @property {string} mail
 * @property {string|undefined} firstName
 * @property {string|undefined} lastName
 * @property {string|undefined} gender male|female
 * @property {string|undefined} phone
 * @property {string|undefined} birthday YYYY-MM-DD
 * @property {SW6User.UserGroup[]} userGroups
 * @property {Object|undefined} customAttributes key value attributes
 */

/**
 * @typedef {Object} SW6User.UserGroup
 * @property {string} id
 * @property {string} name
 */

/** @typedef {EntityError} SW6User.EntityError */
/** @typedef {ShopwareError} SW6User.ShopwareError */
/** @typedef {ClientApiError} SW6User.ClientApiError */
