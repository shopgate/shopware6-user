'use strict'

const { contextManager: { saveContextToken } } = require('@shopgate/shopware6-utility')

/**
 * @param {ApiteSW6Utility.PipelineContext} context
 * @param {SGConnectAPI.ContextTokenParam} input
 * @returns {Promise<void>}
 */
module.exports = async (context, { contextToken }) =>
  saveContextToken(contextToken, context)
