const Module = require('module')
const fs = require('fs')
const pkg = JSON.parse(fs.readFileSync('./package.json'))
const { capture } = require('./src/core')

const signatureList = {}
let pending = false
setInterval(() => {
  if (pending) {
    fs.writeFileSync('./packageFirewallRecording.json', JSON.stringify(signatureList, null, 2))
    pkg.packageFirewallSignatures = Object.keys(signatureList)
    fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2))
    pending = false
  }
}, 1000)
let localCache
Object.defineProperty(Module._cache, 'net', {
  configurable: false,
  get() {
    const {cleanStack, signature } = capture()
    signatureList[signature] = cleanStack
    pending = true
    return localCache
  },
  set(newValue) {
    printMessage(`cache populated for '${moduleName}'`)
    localCache = newValue
  }
})
