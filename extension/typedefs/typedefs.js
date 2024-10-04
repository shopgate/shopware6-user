/**
 * @typedef ApiteSW6User
 */

/**
 * @typedef {Object} ApiteSW6User.SGAuthSuccessInput
 * @property {boolean} authSuccess
 * @property {string} authType
 * @property {string} contextToken
 */

/**
 * @typedef {Object} ApiteSW6User.getResponse
 * @property {string} id
 * @property {string} mail
 * @property {string|undefined} firstName
 * @property {string|undefined} lastName
 * @property {string|undefined} gender male|female
 * @property {string|undefined} phone
 * @property {string|undefined} birthday YYYY-MM-DD
 * @property {ApiteSW6User.Group[]} userGroups
 * @property {Object|undefined} customAttributes key value attributes
 */

/**
 * @typedef {Object} ApiteSW6User.Group
 * @property {string} id
 * @property {string} name
 */
