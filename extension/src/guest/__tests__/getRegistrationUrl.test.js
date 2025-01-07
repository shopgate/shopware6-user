'use strict'

beforeEach(() => {
  jest.resetModules()
})

const dataProvider = [
  {
    endpoint: 'http://test',
    registrationPath: '/sgwebcheckout/register',
    url: 'http://test/sgwebcheckout/login?token=someToken&redirectTo=http%3A%2F%2Ftest%2Fsgwebcheckout%2Fregister'
  },
  {
    endpoint: 'http://test',
    registrationPath: 'sgwebcheckout/register',
    url: 'http://test/sgwebcheckout/login?token=someToken&redirectTo=http%3A%2F%2Ftest%2Fsgwebcheckout%2Fregister'
  },
  {
    endpoint: 'http://test/sub',
    registrationPath: '/sgwebcheckout/register',
    url: 'http://test/sub/sgwebcheckout/login?token=someToken&redirectTo=http%3A%2F%2Ftest%2Fsub%2Fsgwebcheckout%2Fregister'
  },
  {
    endpoint: 'http://test/sub',
    registrationPath: 'sgwebcheckout/register',
    url: 'http://test/sub/sgwebcheckout/login?token=someToken&redirectTo=http%3A%2F%2Ftest%2Fsub%2Fsgwebcheckout%2Fregister'
  },
  {
    endpoint: 'http://test/sub/',
    registrationPath: 'sgwebcheckout/register',
    url: 'http://test/sub/sgwebcheckout/login?token=someToken&redirectTo=http%3A%2F%2Ftest%2Fsub%2Fsgwebcheckout%2Fregister'
  },
  {
    endpoint: 'http://test/sub/',
    registrationPath: '/sgwebcheckout/register',
    url: 'http://test/sub/sgwebcheckout/login?token=someToken&redirectTo=http%3A%2F%2Ftest%2Fsub%2Fsgwebcheckout%2Fregister'
  }
]

describe.each(dataProvider)('Register URL Check', ({ endpoint, registrationPath, url }) => {
  it(`should pass based on endpoint: ${endpoint} & registration: ${registrationPath}`, async () => {
    const context = {
      config: {
        endpoint,
        accessToken: 'TOKEN',
        languageId: null,
        registrationPath
      },
      log: { debug: () => {} },
      meta: () => {},
      storage: { device: { get: async () => 'token' } }
    }
    const getRegistrationUrl = require('../getRegistrationUrl')

    const result = await getRegistrationUrl(context, { token: 'someToken', expiration: 1317996123 })
    expect(result).toEqual({ expires: '2011-10-07T14:02:03.000Z', url })
  })
})
