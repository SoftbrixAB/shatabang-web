declare module 'dibba-tree' {
  export default class DibbaTree<T = any> {
    constructor()
    insert(keys: string[], value: T): void
    update(value: T, ...keys: number[]): void
    iterator(): DibbaIterator<T>
    leafIterator(): DibbaIterator<T>
    leafIteratorReverse(): DibbaIterator<T>
    get(keys: string[]): T | undefined
    getSize(): number
  }

  export class DibbaIterator<T = any> {
    next(): T | undefined
    prev(): T | undefined
    current(): T | undefined
    hasNext(): boolean
    hasPrev(): boolean
    getPath(): number[]
    gotoPath(path: number[]): T | undefined
  }
}
