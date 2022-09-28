'use strict'

const {
  contextManager: { getContextToken },
  apiManager: { createApiConfig },
  errorManager: { throwOnApiError }
} = require('@apite/shopware6-utility')
const { getCart } = require('@shopware-pwa/shopware-6-client')
const nanoid = require('nanoid/async')

/**
 * Every SW6 API call saves the token to storage afterwards
 *
 * @param {ApiteSW6Utility.PipelineContext} context
 * @returns {Promise<void>}
 */
module.exports = async (context) => {
  await getContextToken(context).then(async contextToken => {
    if (typeof contextToken === 'string' && contextToken.length > 0) {
      return
    }

    // If not in storage, ask SW to create a new guest cart
    const config = await createApiConfig(context, { contextToken: 'SG-WebC-' + await nanoid(26) })
    await getCart(config).catch(e => throwOnApiError(e, context))
  })
}
