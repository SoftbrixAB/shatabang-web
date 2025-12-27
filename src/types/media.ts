export interface Media {
  fileName: string
  date: Date
  downloadUrl: string
  bigMedia: string
  img: string
  isVideo: boolean
  isImage: boolean
  path?: number[]
}

export interface MediaFolder {
  year: string
  count: number
}
