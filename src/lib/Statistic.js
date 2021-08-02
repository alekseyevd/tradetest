export class Statistic {
  constructor() {
    this.data = new Map()
    this.size = 0
    this.sum = 0
  }

  set(value) {
    if (this.data.has(value)) {
      const freq = this.data.get(value) + 1
      this.data.set(value, freq)
    } else {
      this.data.set(value, 1)
    }
    this.size++
    this.sum += value
  }
}