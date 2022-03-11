'use strict'

class UnknownError extends Error {
  constructor () {
    super('An internal error occurred.')

    this.code = 'EUNKNOWN'
    this.displayMessage = null
  }
}

class ProductNotFoundError extends Error {
  constructor () {
    // todo: translate
    super('Unfortunately, this product is no longer available')
    this.code = 'ENOTFOUND'
  }
}

class ProductStockReachedError extends Error {
  constructor () {
    // todo: translate
    super('Maximum stock reached for this product')
    this.code = 'ESTOCKREACHED'
  }
}

/**
 * @param {SWErrorLevel} shopwareType
 */
const toShopgateType = function (shopwareType) {
  switch (shopwareType) {
    case 20:
      return 'error'
    case 10:
      return 'warning'
    case 0:
    default:
      return 'info'
  }
}

/**
 * @param {SWEntityError} error
 * @return SGCartMessage
 */
const toShopgateMessage = function (error) {
  return {
    type: toShopgateType(error.level),
    code: error.messageKey,
    message: error.message,
    messageParams: {},
    translated: true
  }
}

/**
 * @param {SWClientApiError|Error} error
 * @return string
 */
const wrapErrorForPrint = function (error) {
  if (error?.statusCode) {
    return JSON.stringify(error.messages)
  }
  return error.message
}

/**
 * @param {SWCartErrors} errorList
 * @param {PipelineContext} context
 */
const throwOnCartErrors = function (errorList, context) {
  Object.keys(errorList).forEach((key) => {
    switch (errorList[key].messageKey) {
      case 'product-not-found':
        throw new ProductNotFoundError()
      case 'product-stock-reached':
        throw new ProductStockReachedError()
      default:
        context.log.debug('Cannot map error: ' + wrapErrorForPrint(errorList[key]))
        throw new UnknownError()
    }
  })
}

module.exports = {
  UnknownError,
  ProductNotFoundError,
  ProductStockReachedError,
  throwOnCartErrors,
  toShopgateType,
  toShopgateMessage,
  wrapErrorForPrint
}
