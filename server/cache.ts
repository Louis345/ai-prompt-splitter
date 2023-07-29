class Cache {
  cache: any[];

  constructor(...args: any) {
    this.cache = args || [];
  }
  add(item: any): void {
    this.cache.push(item);
  }
  isLast(item: any): boolean {
    return this.cache[this.cache.length - 1] === item;
  }
  clear(): void {
    this.cache = [];
  }
}

export default Cache;
