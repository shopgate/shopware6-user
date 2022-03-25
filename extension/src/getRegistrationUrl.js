const { config } = require('@shopware-pwa/shopware-6-client')

/**
 * @param {SW6User.PipelineContext} context
 * @return Promise<{SW6User.UrlResponse}>
 */
module.exports = async (context) => ({ url: new URL(context.config.registrationPath, config.endpoint).href })
