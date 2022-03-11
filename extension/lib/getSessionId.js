module.exports = async function (context) {

  console.log('getSessionId called')
  console.log('getSessionId called')
  console.log('getSessionId called')
    try {
        const sessionId = await context.storage.device.get('sessionId')
        const sessionId2 = sessionId ? sessionId : ''

      console.log('getSessionId done ' + sessionId2)
      console.log('getSessionId done ' + sessionId2)
      console.log('getSessionId done ' + sessionId2)
        return {'sessionId': sessionId2}
    } catch (error) {
        context.log.error(error)
        throw error
    }
}
