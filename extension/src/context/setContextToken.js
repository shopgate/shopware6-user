'use strict'

const { saveContextToken } = require('../services/contextManager')

/**
 * @param {SW6User.PipelineContext} context
 * @param {Object} input
 * @property {string} input.contextToken
 * @returns {Promise<void>}
 */
module.exports = async (context, { contextToken }) => saveContextToken(contextToken, context)
