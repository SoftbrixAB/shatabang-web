import DibbaTree from 'dibba-tree'
import type { DibbaIterator } from 'dibba-tree'
import type { Media } from '@/types/media'

export class MediaTree {
  private tree: DibbaTree<Media>

  constructor() {
    this.tree = new DibbaTree<Media>()
  }

  update(media: Media, y: number, m: number, d: number, h: number, mm: number, s: number, id: number) {
    this.tree.update(media, y, m, d, h, mm, s, id)
  }

  getSize(): number {
    return this.tree.getSize()
  }

  leafIterator(): DibbaIterator<Media> {
    return this.tree.leafIterator()
  }

  leafIteratorReverse(): DibbaIterator<Media> {
    return this.tree.leafIteratorReverse()
  }

  getTree(): DibbaTree<Media> {
    return this.tree
  }
}

export type { DibbaIterator }
