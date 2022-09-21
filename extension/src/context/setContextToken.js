'use strict'

const { contextManager: { saveContextToken } } = require('@apite/sw6-webcheckout-helper')

/**
 * @param {ApiteSW6Helper.PipelineContext} context
 * @param {Object} input
 * @property {string} input.contextToken
 * @returns {Promise<void>}
 */
module.exports = async (context, { contextToken }) =>
  await saveContextToken(contextToken, context)
