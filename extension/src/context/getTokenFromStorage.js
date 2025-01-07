'use strict'

const { contextManager: { getContextToken: getTokenFromStorage } } = require('@apite/shopware6-utility')

/**
 * @param {ApiteSW6Utility.PipelineContext} context
 * @returns {Promise<SGConnectAPI.ContextTokenParam>}
 */
module.exports = async (context) => ({ contextToken: await getTokenFromStorage(context) })
