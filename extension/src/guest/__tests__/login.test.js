'use strict'

beforeEach(() => {
  jest.resetModules()
})

const mockContextToken = 'ctx-token-123'
const mockUserId = 'user-id-456'

const baseContext = {
  config: {
    endpoint: 'http://test',
    accessToken: 'TOKEN',
    languageId: null
  },
  log: { debug: jest.fn(), error: jest.fn() },
  meta: {},
  storage: { device: { get: async () => null } }
}

const baseInput = {
  strategy: 'default',
  parameters: { login: 'user@test.com', password: 'secret' }
}

jest.mock('@apite/shopware6-utility', () => ({
  apiManager: {
    login: jest.fn(),
    getSessionContext: jest.fn()
  },
  clientManger: {
    createApiConfig: jest.fn()
  },
  contextManager: {
    getContextToken: jest.fn()
  },
  errorManager: {
    throwOnApiError: jest.fn(),
    throwOnMessage: jest.fn()
  },
  errorList: {
    InvalidCredentialsError: class InvalidCredentialsError extends Error {
      constructor () { super('ApiteSW6Utility.notice.loginBadCredentials'); this.code = 'EBADCREDENTIALS' }
    }
  }
}))

jest.mock('../../services/logDecorator', () => ({
  decorateMessage: msg => msg,
  obfuscateString: str => str
}))

describe('login step', () => {
  let utility

  beforeEach(() => {
    utility = require('@apite/shopware6-utility')
    utility.clientManger.createApiConfig.mockResolvedValue({
      defaults: { headers: {} }
    })
    utility.apiManager.getSessionContext.mockResolvedValue({
      customer: { id: mockUserId }
    })
  })

  it('returns userId and contextToken on successful login', async () => {
    utility.apiManager.login.mockResolvedValue(mockContextToken)
    const loginStep = require('../login')

    const result = await loginStep(baseContext, baseInput)

    expect(result).toEqual({ userId: mockUserId, contextToken: mockContextToken })
  })

  it('throws InvalidCredentialsError on 401', async () => {
    utility.apiManager.login.mockRejectedValue({ statusCode: 401, messages: [] })
    const loginStep = require('../login')

    await expect(loginStep(baseContext, baseInput)).rejects.toThrow('ApiteSW6Utility.notice.loginBadCredentials')
  })

  it('calls throwOnMessage when err.messages present and statusCode is not 401', async () => {
    const messages = [{ code: 'SOME_CODE', status: '400' }]
    utility.apiManager.login.mockRejectedValue({ statusCode: 400, messages })
    const loginStep = require('../login')

    await loginStep(baseContext, baseInput).catch(() => {})

    expect(utility.errorManager.throwOnMessage).toHaveBeenCalledWith(messages, baseContext)
  })

  it('calls throwOnApiError when err.messages is missing and statusCode is not 401', async () => {
    const err = { statusCode: 500 }
    utility.apiManager.login.mockRejectedValue(err)
    const loginStep = require('../login')

    await loginStep(baseContext, baseInput).catch(() => {})

    expect(utility.errorManager.throwOnApiError).toHaveBeenCalledWith(err, baseContext)
  })

  it('skips login when user is already logged in', async () => {
    utility.contextManager.getContextToken.mockResolvedValue(mockContextToken)
    const loginStep = require('../login')
    const context = { ...baseContext, meta: { userId: mockUserId } }

    const result = await loginStep(context, baseInput)

    expect(result).toEqual({ userId: mockUserId, contextToken: mockContextToken })
    expect(utility.apiManager.login).not.toHaveBeenCalled()
  })

  it('uses auth_code strategy directly as contextToken', async () => {
    const code = 'auth-code-token'
    const input = { strategy: 'auth_code', parameters: { code } }
    const loginStep = require('../login')

    const result = await loginStep(baseContext, input)

    expect(result).toEqual({ userId: mockUserId, contextToken: code })
    expect(utility.apiManager.login).not.toHaveBeenCalled()
  })
})
