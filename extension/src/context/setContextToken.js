'use strict'

const { contextManager: { saveContextToken } } = require('@apite/shopware6-utility')

/**
 * @param {ApiteSW6Utility.PipelineContext} context
 * @param {ApiteSW6Utility.ContextToken} input
 * @returns {Promise<void>}
 */
module.exports = async (context, { contextToken }) =>
  saveContextToken(contextToken, context)
