const { config } = require('@shopware-pwa/shopware-6-client')

/**
 * @param {SW6User.PipelineContext} context
 * @return Promise<{url: string}>
 */
module.exports = async (context) => ({ url: new URL(context.config.registrationPath, config.endpoint).href })
