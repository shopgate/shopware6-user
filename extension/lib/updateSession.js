
module.exports = async function (context, input) {

    try {
        await context.storage.device.set('sessionId', input.sessionId)
        if (typeof input.promotionVouchers != "undefined") {
            await context.storage.device.set('promotionVouchers', input.promotionVouchers)
        }
        return {}
    } catch (error) {
        context.log.error(error)
        throw error
    }
}