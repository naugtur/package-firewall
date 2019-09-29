const crypto = require('crypto');
const loaders = /\(internal\/modules\//
const frameSplit = /^.*at[^(]*\((.*)\/[^/]*$/;
// const debug = console.log
const debug = require('debug')('package-firewall')

function produceSignature(cleanStack) {
    const hash = crypto.createHash('sha1');
    hash.update(cleanStack.join());
    const signature = hash.digest('hex');
    debug('signature:"', signature,'"')
    return signature
}
function cleanLoadStack(stack) {
    const frames = stack.split('\n')
    const clean = frames.filter(frame => !loaders.test(frame)).slice(3).slice(0, -1)
    const programStart = clean[clean.length - 1]
    const pathPrefix = programStart.match(frameSplit)[1]
    debug(programStart, pathPrefix)
    const cleanRelative = clean.map(f => f.replace(pathPrefix, '').replace('    at Object.<anonymous> ', ''))
    debug(frames, frames.filter(frame => !loaders.test(frame)), cleanRelative)
    return cleanRelative
}
function capture() {
    const e = {}
    const originalLimit = Error.stackTraceLimit
    Error.stackTraceLimit = Infinity
    Error.captureStackTrace(e)
    Error.stackTraceLimit = originalLimit
    const cleanStack = cleanLoadStack(e.stack)
    const signature = produceSignature(cleanStack)
    return {
        signature,
        cleanStack
    }

}

module.exports = {
    produceSignature,
    cleanLoadStack,
    capture
}