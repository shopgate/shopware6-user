const AuthFailedError = require('./shopgate/customer/errors/AuthFailedError')

/**
 *
 * @param {SW6User.PipelineContext} context
 * @param {Object} input
 * @param {boolean} input.authSuccess
 * @param {string} input.authType
 * @returns {Promise<void>}
 */
module.exports = async function (context, input) {
  if (input.authType === "Login" && input.authSuccess !== true) {
    context.log.error(input.authType + ': Auth step finished unsuccessfully.')
    throw new AuthFailedError('Authorisation failed.')
  }

  const storage = context.meta.userId ? context.storage.user : context.storage.device
  await storage.set('contextToken', input.contextToken)
}
