// IndexedDB helper for caching comics data
const DB_NAME = 'dilbert-comics-cache'
const DB_VERSION = 1
const STORE_INDEX = 'index'
const STORE_YEARS = 'years'
const CACHE_VERSION = '1.0.0' // Increment when data structure changes

let db = null

// Initialize IndexedDB
export const initDB = () => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db)
      return
    }

    // Check if IndexedDB is supported
    if (!window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this browser'))
      return
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      db = request.result
      resolve(db)
    }

    request.onupgradeneeded = (event) => {
      const database = event.target.result
      
      // Create object store for index
      if (!database.objectStoreNames.contains(STORE_INDEX)) {
        database.createObjectStore(STORE_INDEX)
      }
      
      // Create object store for years
      if (!database.objectStoreNames.contains(STORE_YEARS)) {
        database.createObjectStore(STORE_YEARS)
      }
    }
  })
}

// Get index from cache
export const getCachedIndex = async () => {
  try {
    const database = await initDB()
    return new Promise((resolve, reject) => {
      const transaction = database.transaction([STORE_INDEX], 'readonly')
      const store = transaction.objectStore(STORE_INDEX)
      const request = store.get('comics-index')
      
      request.onsuccess = () => {
        const result = request.result
        // Check version
        if (result && result._version === CACHE_VERSION) {
          // Remove version metadata before returning
          const { _version, ...indexData } = result
          resolve(indexData)
        } else {
          resolve(null) // Version mismatch or no cache
        }
      }
      request.onerror = () => reject(request.error)
    })
  } catch (error) {
    console.warn('Failed to get cached index:', error)
    return null
  }
}

// Cache index
export const cacheIndex = async (indexData) => {
  try {
    const database = await initDB()
    // Store with version metadata
    const dataWithVersion = { ...indexData, _version: CACHE_VERSION }
    return new Promise((resolve, reject) => {
      const transaction = database.transaction([STORE_INDEX], 'readwrite')
      const store = transaction.objectStore(STORE_INDEX)
      const request = store.put(dataWithVersion, 'comics-index')
      
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  } catch (error) {
    console.warn('Failed to cache index:', error)
  }
}

// Get year data from cache
export const getCachedYear = async (year) => {
  try {
    const database = await initDB()
    return new Promise((resolve, reject) => {
      const transaction = database.transaction([STORE_YEARS], 'readonly')
      const store = transaction.objectStore(STORE_YEARS)
      const request = store.get(year)
      
      request.onsuccess = () => {
        const result = request.result
        // Check version
        if (result && result._version === CACHE_VERSION) {
          // Remove version metadata before returning
          const { _version, ...yearData } = result
          resolve(yearData)
        } else {
          resolve(null) // Version mismatch or no cache
        }
      }
      request.onerror = () => reject(request.error)
    })
  } catch (error) {
    console.warn(`Failed to get cached year ${year}:`, error)
    return null
  }
}

// Cache year data
export const cacheYear = async (year, yearData) => {
  try {
    const database = await initDB()
    // Store with version metadata
    const dataWithVersion = { ...yearData, _version: CACHE_VERSION }
    return new Promise((resolve, reject) => {
      const transaction = database.transaction([STORE_YEARS], 'readwrite')
      const store = transaction.objectStore(STORE_YEARS)
      const request = store.put(dataWithVersion, year)
      
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  } catch (error) {
    console.warn(`Failed to cache year ${year}:`, error)
  }
}

// Clear all cached data (useful for debugging or updates)
export const clearCache = async () => {
  try {
    const database = await initDB()
    return new Promise((resolve, reject) => {
      const transaction = database.transaction([STORE_INDEX, STORE_YEARS], 'readwrite')
      
      transaction.objectStore(STORE_INDEX).clear()
      transaction.objectStore(STORE_YEARS).clear()
      
      transaction.oncomplete = () => resolve()
      transaction.onerror = () => reject(transaction.error)
    })
  } catch (error) {
    console.warn('Failed to clear cache:', error)
  }
}

