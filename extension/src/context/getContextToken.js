'use strict'

const { getContextToken } = require('../services/contextManager')

/**
 * Initializes context token on App start, other
 * extensions can subscribe to this pipeline to
 * sync their tokens
 *
 * @param {SW6User.PipelineContext} context
 * @returns {Promise<{contextToken: string}>}
 */
module.exports = async (context) => ({ contextToken: await getContextToken(context) })
