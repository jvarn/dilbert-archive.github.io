import { useEffect, useCallback, useState } from 'react'

function ComicDisplay({ date, comic, comicsData, comicsIndex, useLocalImages }) {
  const [showTranscript, setShowTranscript] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isArchiveOrgError, setIsArchiveOrgError] = useState(false)
  
  const formatDateString = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('en-UK', options)
  }

  // Get image source based on toggle
  const getImageSrc = useCallback((comicData, comicDate) => {
    if (!comicData) return ''
    
    if (useLocalImages && comicData.image) {
      // Extract year from date (YYYY-MM-DD format)
      const year = comicDate.split('-')[0]
      // Use Vite's base URL to support flexible deployment paths
      const baseUrl = import.meta.env.BASE_URL
      return `${baseUrl}images/${year}/${comicData.image}`
    }
    
    return comicData.originalimageurl || ''
  }, [useLocalImages])

  // Reset error state when comic or image source changes
  useEffect(() => {
    setImageError(false)
    setIsArchiveOrgError(false)
  }, [date, comic, useLocalImages])

  // Preload adjacent images
  useEffect(() => {
    if (!comic || !comicsIndex) return

    // Get all dates from index
    const dates = comicsIndex.dates.map(item => item.date).sort()
    const currentIndex = dates.indexOf(date)
    const previousIndex = currentIndex > 0 ? currentIndex - 1 : null
    const nextIndex = currentIndex < dates.length - 1 ? currentIndex + 1 : null

    if (previousIndex !== null) {
      const prevDate = dates[previousIndex]
      const prevYear = prevDate.split('-')[0]
      const previousComic = comicsData[prevYear]?.[prevDate]
      if (previousComic) {
        const img = new Image()
        img.src = getImageSrc(previousComic, prevDate)
      }
    }

    if (nextIndex !== null) {
      const nextDate = dates[nextIndex]
      const nextYear = nextDate.split('-')[0]
      const nextComic = comicsData[nextYear]?.[nextDate]
      if (nextComic) {
        const img = new Image()
        img.src = getImageSrc(nextComic, nextDate)
      }
    }
  }, [date, comic, comicsData, comicsIndex, getImageSrc])

  if (!comic) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600 dark:text-gray-400 font-medium">Comic not found!</p>
      </div>
    )
  }

  const h2Content = comic.title || 'Untitled'

  return (
    <section aria-labelledby={`comic-${date}`}>
      <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <h2 id={`comic-${date}`} className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          {h2Content}
        </h2>
        <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600 dark:text-gray-400">
          <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <time dateTime={date} className="font-medium">
            {formatDateString(date)}
          </time>
        </div>
      </div>
      
      <div>
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-2 md:p-4 border border-gray-200 dark:border-gray-700">
          {imageError && isArchiveOrgError ? (
            <div className="text-center py-12 px-4">
              <div className="inline-block mb-4">
                <svg className="w-12 h-12 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Image unavailable
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Sorry, archive.org appears to be down. The image cannot be loaded at this time.
              </p>
            </div>
          ) : imageError ? (
            <div className="text-center py-12 px-4">
              <div className="inline-block mb-4">
                <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Image could not be loaded
              </p>
            </div>
          ) : (
            <img
              src={getImageSrc(comic, date)}
              alt={comic.title || 'Dilbert comic'}
              className="max-w-full h-auto block mx-auto rounded-lg shadow-sm"
              onError={(e) => {
                const imageSrc = getImageSrc(comic, date)
                const isArchiveOrg = imageSrc.includes('archive.org') || imageSrc.includes('web.archive.org')
                
                if (isArchiveOrg) {
                  setImageError(true)
                  setIsArchiveOrgError(true)
                } else if (useLocalImages && comic.originalimageurl) {
                  // Fallback to original URL if local image fails to load
                  e.target.src = comic.originalimageurl
                } else {
                  setImageError(true)
                }
              }}
              onLoad={() => {
                // Reset error state when image loads successfully
                setImageError(false)
                setIsArchiveOrgError(false)
              }}
            />
          )}
        </div>
      </div>
    </section>
  )
}

export default ComicDisplay

