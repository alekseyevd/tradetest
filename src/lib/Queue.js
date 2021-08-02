export default class Queue {
  constructor() {
    this.items = []
    this.events = {
      put: [],
      pick: []
    }
  }

  get size () {
    return this.items.length
  }

  put(item) {
    this.items.push(item)
    this.events.put.forEach(f => f.call(this, item))
  }

  pick(n = 0) {
    if (n > 0) return this.items.splice(0, n)

    return this.items.shift()
  }

  on(eventName, callback) {
    this.events[eventName].push(callback)
  }
}


