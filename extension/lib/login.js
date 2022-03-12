'use strict'

const InvalidCredentialsError = require('./shopgate/customer/errors/InvalidCredentialsError')
const { login, getSessionContext } = require('@shopware-pwa/shopware-6-client')
const { decorateError } = require('./shopgate/logDecorator')

/**
 * @param {SW6User.PipelineContext} context
 * @param {UserLoginInput} input
 * @returns {Promise<{userId: string, contextToken: string}>}
 */
module.exports = async function (context, input) {
  console.log('login')
  console.log('login')
  console.log('login')

  const contextToken = await apiLogin(input, context)
  // todo: handle errors
  const userId = await getSessionContext().then(swContext => swContext.customer.id)

  return {
    userId,
    contextToken
  }
}

/**
 * @param {UserLoginInput} input
 * @param {SW6User.PipelineContext} context
 * @returns Promise<string>
 */
const apiLogin = async function (input, context) {
  try {
    const loginResponse = await login({ username: input.parameters.login, password: input.parameters.password })
    return loginResponse.contextToken
  } catch (err) {
    context.log.error(decorateError(err), 'Error in login process.')
    if (err.statusCode === 401) {
      throw new InvalidCredentialsError(err.messages[0].detail, err.messages[0].title)
    }
    throw new InvalidCredentialsError(err)
  }
}
