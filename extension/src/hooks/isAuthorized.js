'use strict'

const { UnauthorisedError } = require('../services/errorList')

/**
 * @param {SW6User.PipelineContext} context
 * @returns {Promise<void>}
 * @throws {UnauthorisedError}
 */
module.exports = async (context) => {
  if (!context.meta.userId) {
    throw new UnauthorisedError('Permission denied: User is not logged in.')
  }
}
