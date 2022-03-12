/**
 * @param {SW6User.PipelineContext} context
 * @param {GetRegistrationUrlInput} input
 * @param {function} callback
 */

module.exports = async function(context, input) {

  // TODO-Rainer return real URL depending on config
  return {'url': 'test.com/register', 'expires': new Date(null)}
}
