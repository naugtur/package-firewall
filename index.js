const Module = require('module')

Object.defineProperty(Module._cache, net, {
  configurable: false,
  get () {
    const e = {}
    Error.stackTraceLimit = Infinity
    Error.captureStackTrace(e)
    
    return localCache
  },
  set (newValue) {
    printMessage(`cache populated for '${moduleName}'`)
    localCache = newValue
  }
})
