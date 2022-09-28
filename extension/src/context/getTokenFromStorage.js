'use strict'

const { contextManager: { getContextToken: getTokenFromStorage } } = require('@apite/shopware6-utility')

/**
 * Initializes context token on App start, other
 * extensions can subscribe to this pipeline to
 * sync their tokens
 *
 * @param {ApiteSW6Utility.PipelineContext} context
 * @returns {Promise<ApiteSW6Utility.ContextToken>}
 */
module.exports = async (context) => ({ contextToken: await getTokenFromStorage(context) })
