export function spool<T extends {new(...args: any[]): {}}>(constructor: T) {
  return class extends constructor {
    isSpool = true
  }
}
