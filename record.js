const Module = require('module')
const fs = require('fs')
const pkg = require('./package.json')
const { produceSignature } = require('./src/core')

const signatureList = {}
let pending = false
setInterval(() => {
  if (pending) {
    fs.writeFileSync('./packageFirewallRecording.json', JSON.stringify(signatureList, null, 2))
    pkg.packageFirewallSignatures = Object.keys(signatureList)
    // fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2))
    pending = false
  }
})
let localCache
Object.defineProperty(Module._cache, 'net', {
  configurable: false,
  get() {
    const e = {}
    const originalLimit = Error.stackTraceLimit
    Error.stackTraceLimit = Infinity
    Error.captureStackTrace(e)
    Error.stackTraceLimit = originalLimit
    const signature = produceSignature(e.stack)
    signatureList[signature] = e.stack
    pending = true
    return localCache
  },
  set(newValue) {
    printMessage(`cache populated for '${moduleName}'`)
    localCache = newValue
  }
})
