/* eslint-disable */
// noinspection ES6ShorthandObjectProperty
const {
  ClientApiError,
  EntityError,
  ShopwareError
} = require('@shopware-pwa/commons')

/**
 * @typedef {Object} UserLoginInput
 * @property {string} strategy
 * @property {UserLoginStrategyBasic} parameters
 */

/**
 * @typedef {Object} UserLoginStrategyBasic
 * @property {string} login - email
 * @property {string} password
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
