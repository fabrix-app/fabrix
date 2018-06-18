export function writable(value: boolean) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.writable = value
    return descriptor
  }
}
