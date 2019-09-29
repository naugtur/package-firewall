const Module = require('module')
const fs = require('fs')
const allowed = JSON.parse(fs.readFileSync('./package.json')).packageFirewallSignatures || []
const { capture } = require('./src/core')
const debug = require('debug')('package-firewall')

let localCache
Object.defineProperty(Module._cache, 'net', {
  configurable: false,
  get () {
    const { signature, cleanStack } = capture()
    debug({ signature, cleanStack, allowed })
    if (!allowed.includes(signature)) {
      console.error(`Unexpected network access for \n ${cleanStack.join('\n')}`)
    }
    return localCache
  },
  set (newValue) {
    localCache = newValue
  }
})
