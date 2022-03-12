'use strict'

/**
 * Select storage to use: device or user (if logged in)
 *
 * @param {SW6User.PipelineContext} context
 * @return SW6User.PipelineStorage
 * @private
 */
const _getStorage = context => context.meta.userId ? context.storage.user : context.storage.device

/**
 * Saves the current checkout token into internal storage (user or device)
 *
 * @param {string} contextToken
 * @param {SW6User.PipelineContext} context
 * @returns Promise<void>
 */
const saveContextToken = async function (contextToken, context) {
  await _getStorage(context).set('contextToken', contextToken).catch(err => {
    context.log.error(`Failed to save Shopware checkout token. Error: '${err.message}'`)
  })
}

/**
 * @param {SW6User.PipelineContext} context
 * @return {Promise<string>}
 */
const getContextToken = async context => _getStorage(context).get('contextToken')

module.exports = { getContextToken, saveContextToken }
