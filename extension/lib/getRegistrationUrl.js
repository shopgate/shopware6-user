const { config } = require('@shopware-pwa/shopware-6-client')

/**
 * @return Promise<{url: string}>
 */
// module.exports = async () => ({ url: config.endpoint + '/account/login' })
module.exports = async () => ({ url: config.endpoint + '/account/login' })
