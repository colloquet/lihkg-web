function MemoryStorage() {
  let structureLocalStorage = {}
  this.setItem = (key, value) => {
    structureLocalStorage[key] = value
  }
  this.getItem = (key) => {
    if (typeof structureLocalStorage[key] !== 'undefined') {
      return structureLocalStorage[key]
    }
    return null
  }
  this.removeItem = key => delete structureLocalStorage[key]
  this.clear = () => {
    structureLocalStorage = {}
  }
}

function LocalStorage() {
  this.set = (key, value) => {
    window.localStorage.setItem(key, JSON.stringify(value))
  }
  this.get = (key) => {
    try {
      return JSON.parse(window.localStorage.getItem(key))
    } catch (error) {
      const item = window.localStorage.getItem(key)
      window.localStorage.setItem(key, JSON.stringify(item))
      return item
    }
  }
  this.remove = key => window.localStorage.removeItem(key)
  this.clear = () => window.localStorage.clear()
}

function getStorage() {
  let storageImpl
  try {
    window.localStorage.setItem('_', '')
    window.localStorage.removeItem('_')
    storageImpl = new LocalStorage()
  } catch (e) {
    storageImpl = new MemoryStorage()
  }
  return storageImpl
}

const storage = getStorage()

export default storage
