/**
 * @param {ApiteSW6Utility.PipelineContext} context
 * @returns {?string}
 */
const getRegistrationPath = context => process.env.REGISTER_PATH || context.config.registrationPath

module.exports = { getRegistrationPath }