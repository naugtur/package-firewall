const Module = require('module')
const fs = require('fs')
const allowed = JSON.parse(fs.readFileSync('./package.json')).packageFirewallSignatures || []
const { capture } = require('./src/core')
const debug = require('debug')('package-firewall')

let localCache
Object.defineProperty(Module._cache, 'net', {
    configurable: false,
    get() {
        const { signature, cleanStack } = capture()
        debug({ signature, cleanStack, allowed })
        if (allowed.includes(signature)) {
            return localCache
        } else {
            // skip try-catch, crash the process 
            process.nextTick(() => {
                throw Error(`Network access blocked for \n ${cleanStack.join('\n')}`)
            })
            return undefined
        }
    },
    set(newValue) {
        localCache = newValue
    }
})
