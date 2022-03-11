'use strict'

/**
 * Saves the current checkout token into internal storage (user or device)
 *
 * @param {string} contextToken
 * @param {PipelineContext} context
 * @returns Promise<void>
 */
const saveContextToken = async function (contextToken, context) {
  // select storage to use: device or user, if logged in
  const storage = context.meta.userId ? context.storage.user : context.storage.device

  await storage.set('contextToken', contextToken).catch(err => {
    context.log.error(`Failed to save Shopware checkout token. Error: '${err.message}'`)
  })
}

module.exports = { saveContextToken }
