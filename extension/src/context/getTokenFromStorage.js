'use strict'

const { contextManager: { getContextToken: getTokenFromStorage } } = require('@apite/shopware6-utility')

/**
 * @param {ApiteSW6Utility.PipelineContext} context
 * @returns {Promise<ApiteSW6Utility.ContextToken>}
 */
module.exports = async (context) => ({ contextToken: await getTokenFromStorage(context) })
