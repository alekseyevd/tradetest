export const once = fn => (...args) => {
  if (!fn) return
  fn(...args)
  fn = null
}