'use strict'

const {login, getSessionContext, update} = require('@shopware-pwa/shopware-6-client');
const {getContextToken} = require('./services/contextManager');
const { throwOnApiError } = require('./services/errorManager')

/**
 * @param {SW6User.PipelineContext} context
 * @param {SW6User.UserLoginInput} input
 * @returns {Promise<{userId: string, contextToken: string}>}
 */
module.exports = async function (context, input) {
  if (context.meta.userId) {
    context.log.warn('User is already logged in');
    return {
      userId: context.meta.userId,
      contextToken: await getContextToken(context)
    };
  }

  let contextToken;
  if (input.strategy === 'auth_code' && input.parameters.token) {
    update({contextToken: input.parameters.token});
    contextToken = input.parameters.token;
  } else {
    contextToken = await apiLogin(input, context);
  }

  const userId = await getSessionContext()
      .then(swContext => swContext.customer.id)
      .catch(e => throwOnApiError(e, context));

  return {
    userId,
    contextToken
  };
}

/**
 * @param {SW6User.UserLoginInput} input
 * @param {SW6User.PipelineContext} context
 * @returns Promise<string>
 */
const apiLogin = async function (input, context) {
  return login({ username: input.parameters.login, password: input.parameters.password })
    .then(response => response.contextToken)
    .catch(err => throwOnApiError(err, context))
}
