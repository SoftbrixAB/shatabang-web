declare module 'dibba-tree' {
  export interface DibbaIterator<T = any> {
    hasPrev(): boolean
    hasNext(): boolean
    prev(): T
    next(): T
    getPath(): number[]
    gotoPath(path: number[], exact?: boolean): void
  }

  export default class DibbaTree<T = any> {
    constructor()
    update(obj: T, y: number, m: number, d: number, h: number, mm: number, s: number, id: number): void
    getSize(): number
    leafIterator(): DibbaIterator<T>
    leafIteratorReverse(): DibbaIterator<T>
  }
}
