const crypto = require('crypto');
const loaders = /\(internal\/modules\//

function produceSignature(stack) {
    const cleanStack = cleanLoadStack(stack);
    console.log(cleanStack)
    const hash = crypto.createHash('sha1');
    hash.update(cleanStack.join());
    return hash.digest('hex');
}
function cleanLoadStack(stack) {
    const frames = stack.split('\n')
    console.log(frames, frames.filter(frame => !loaders.test(frame)))
    return frames.filter(frame => !loaders.test(frame)).slice(2)
}

module.exports = {
    produceSignature,
    cleanLoadStack
}