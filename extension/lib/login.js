const { login, setup, getSessionContext} = require('@shopware-pwa/shopware-6-client')
const InvalidCredentialsError = require('./shopgate/customer/errors/InvalidCredentialsError');
const { decorateError } = require('./shopgate/logDecorator');

/**
 *
 * @param {PipelineContext} context
 * @param {object} input
 * @returns {Promise.<LoginResponse>}
 */
module.exports = async function (context, input) {

  console.log('login')
  console.log('login')
  console.log('login')

  const contextToken = await apiLogin(input, context);

  // await context.storage.user.set('contextToken', contextToken)

  const { endpoint, accessToken, languageId } = context.config.shopware
  setup({
    endpoint,
    accessToken,
    languageId,
    contextToken
  })


  const sessionContext = await getSessionContext();

  return {
    userId: sessionContext.customer.id,
    contextToken
  }
}

/**
 * @param {object} input
 * @param {object} context
 * @returns {Promise}
 */
const apiLogin = async function (input, context) {
  try {
    // TODO: document problem, user might be bound to a sales channel
    const loginResponse = await login({ username: input.parameters.login, password: input.parameters.password});
    // const loginResponse = await login({ username: input.parameters.login, password: 'Shopwareq12wer'});
    return loginResponse.contextToken
  } catch (err) {
    context.log.error(decorateError(err), 'Error in login process.')
    if (err.statusCode === 401) {
      throw new InvalidCredentialsError(err.messages[0].detail, err.messages[0].title);
    }
    throw new InvalidCredentialsError(err);
  }
}
