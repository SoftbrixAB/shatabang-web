import type { Media } from '@/types/media'

const movieFileRegexp = /(.+)(mp4|m4v|avi|mov|mpe?g)$/gi

// "2016/03/14/222624.jpg" or "20160314222624.jpg"
const fileNameRegexp = /^([\d]{4}).?(\d{2}).?(\d{2}).?(\d{2})(\d{2})(\d{2})/

export function fileName2Date(fileName: string): Date {
  const result = fileNameRegexp.exec(fileName)
  let date = new Date()

  if (result !== undefined && result !== null) {
    date = new Date(
      parseInt(result[1]),
      parseInt(result[2]) - 1, // Month is 0-indexed
      parseInt(result[3]),
      parseInt(result[4]),
      parseInt(result[5]),
      parseInt(result[6])
    )
  } else {
    console.warn('Unknown date or file type:', fileName)
  }

  return date
}

export function isVideoFile(fileName: string): boolean {
  return movieFileRegexp.test(fileName)
}

export function parseMediaFile(fileName: string): Media {
  const date = fileName2Date(fileName)
  const isVideo = isVideoFile(fileName)

  const media: Media = {
    date,
    fileName,
    downloadUrl: `./media/${fileName}`,
    bigMedia: isVideo ? `./video/${fileName}` : `./images/1920/${fileName}`,
    img: isVideo ? fileName.replace(movieFileRegexp, '$1jpg') : fileName,
    isVideo,
    isImage: !isVideo
  }

  return media
}

export function isNumber(n: any): boolean {
  return !isNaN(parseFloat(n)) && isFinite(n)
}
