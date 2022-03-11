const { decorateError } = require('./shopgate/logDecorator')
const { setup, logout, getSessionContext } = require('@shopware-pwa/shopware-6-client')

/**
 * @param {PipelineContext} context
 * @returns {Promise<LoginResponse>}
 */

module.exports = async function (context) {

  console.log('logout called')
  console.log('logout called')
  console.log('logout called')
    try {
      await context.storage.user.del('userInfo')
      await  logout();
    } catch (err) {
        context.log.error(decorateError(err), 'failed to logout')
    }
    try {

      const { endpoint, accessToken, languageId } = context.config.shopware
      setup({
        endpoint,
        accessToken,
        languageId
      })
      const sessionContext = await getSessionContext()
      return {contextToken: sessionContext.token}
    } catch (err) {
        context.log.error(decorateError(err), 'failed to getSessionContext')
      throw err
    }
}
