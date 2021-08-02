export const connect = () => {
  return new Promise((resolve, reject) => {
    const openRequest = indexedDB.open("store", 1)
    openRequest.onupgradeneeded = function() {
      let db = openRequest.result
      if (!db.objectStoreNames.contains('books')) { // если хранилище "books" не существует
        const store = db.createObjectStore('books', {keyPath: 'id'}); // создаем хранилище
        store.createIndex('value_idx', 'value');
      }
      resolve(db)
    };
    
    openRequest.onerror = function() {
      reject(this.error)
    };
    
  
    openRequest.onsuccess = function() {
      let db = openRequest.result;
      db.transaction("books", "readwrite").objectStore("books").clear()
      resolve(db)
    };
  })
} 