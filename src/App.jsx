import { useState, useEffect, useCallback } from 'react'
import SearchBar from './components/SearchBar'
import DatePicker from './components/DatePicker'
import SearchResults from './components/SearchResults'
import ComicDisplay from './components/ComicDisplay'
import NavigationButtons from './components/NavigationButtons'
import TranscriptPanel from './components/TranscriptPanel'
import DarkModeToggle from './components/DarkModeToggle'
import SettingsModal from './components/SettingsModal'

function App() {
  const [comicsData, setComicsData] = useState(null)
  const [currentDate, setCurrentDate] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [useLocalImages, setUseLocalImages] = useState(() => {
    // Load preference from localStorage, default to false (use original URLs)
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('useLocalImages')
      return saved === 'true'
    }
    return false
  })
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  // Debounce search term - wait 500ms after last keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Load comics data from JSON file
  useEffect(() => {
    // Use Vite's base URL to support flexible deployment paths
    const baseUrl = import.meta.env.BASE_URL
    const jsonPath = `${baseUrl}dilbert_comics_transcripts.json`
    
    fetch(jsonPath)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status} - Could not find ${jsonPath}`)
        }
        return response.text().then(text => {
          try {
            return JSON.parse(text)
          } catch (parseError) {
            throw new Error(`JSON parse error: ${parseError.message}`)
          }
        })
      })
      .then(data => {
        setComicsData(data)
        setLoading(false)
        
        // Initialize date from URL parameter or use random/default
        const urlParams = new URLSearchParams(window.location.search)
        const dateParam = urlParams.get('date')
        
        if (dateParam && data[dateParam]) {
          setCurrentDate(dateParam)
        } else {
          // Default to last comic date or random
          const dates = Object.keys(data).sort()
          const defaultDate = dates[dates.length - 1] // Last comic
          setCurrentDate(defaultDate)
          window.history.replaceState({}, '', `?date=${defaultDate}`)
        }
      })
      .catch(error => {
        console.error('Error loading comics data:', error)
        console.error('Error details:', error.message)
        setError(error.message)
        setLoading(false)
      })
  }, [])

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search)
      const dateParam = urlParams.get('date')
      if (dateParam && comicsData && comicsData[dateParam]) {
        setCurrentDate(dateParam)
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [comicsData])

  // Handle search (using debounced search term)
  useEffect(() => {
    if (!comicsData || !debouncedSearchTerm) {
      setSearchResults([])
      return
    }

    const term = debouncedSearchTerm.toLowerCase()
    const results = []

    for (const key in comicsData) {
      const comic = comicsData[key]
      let transcript = comic.transcript ? comic.transcript.toLowerCase() : ''
      transcript = transcript.replace(/\s*\n\s*/g, ' ')

      if (
        comic.title.toLowerCase().includes(term) ||
        transcript.includes(term)
      ) {
        let excerpt = ''
        
        if (transcript.includes(term)) {
          const index = transcript.indexOf(term)
          const start = Math.max(0, index - 25)
          const end = Math.min(transcript.length, index + term.length + 25)
          excerpt = transcript.slice(start, end)
          if (start > 0) excerpt = '...' + excerpt
          if (end < transcript.length) excerpt += '...'
        } else {
          excerpt = transcript.slice(0, 50) + '...'
        }

        results.push({
          date: key,
          comic,
          excerpt
        })
      }
    }

    setSearchResults(results)
  }, [debouncedSearchTerm, comicsData])

  // Navigation function
  const navigateTo = useCallback((action, date) => {
    if (!comicsData) return

    const dates = Object.keys(comicsData).sort()
    const currentIndex = dates.indexOf(date)
    let newIndex

    switch (action) {
      case 'first':
        newIndex = 0
        break
      case 'previous':
        newIndex = currentIndex > 0 ? currentIndex - 1 : 0
        break
      case 'next':
        newIndex = currentIndex < dates.length - 1 ? currentIndex + 1 : dates.length - 1
        break
      case 'last':
        newIndex = dates.length - 1
        break
      case 'random':
        do {
          newIndex = Math.floor(Math.random() * dates.length)
        } while (newIndex === currentIndex)
        break
      default:
        return
    }

    const newDate = dates[newIndex]
    setCurrentDate(newDate)
    window.history.pushState({}, '', `?date=${newDate}`)
  }, [comicsData])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!comicsData || !currentDate) return

      if (event.key === 'ArrowLeft') {
        navigateTo('previous', currentDate)
      } else if (event.key === 'ArrowRight') {
        navigateTo('next', currentDate)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [comicsData, currentDate, navigateTo])

  // Handle date selection from date picker
  const handleDateSelect = (date) => {
    if (comicsData && comicsData[date]) {
      setCurrentDate(date)
      window.history.pushState({}, '', `?date=${date}`)
    } else {
      alert('No comic available for the selected date.')
    }
  }

  // Handle search result click
  const handleResultClick = (date) => {
    setCurrentDate(date)
    setSearchTerm('')
    window.history.pushState({}, '', `?date=${date}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mb-4"></div>
          <p className="text-xl text-gray-700 dark:text-gray-300 font-medium">Loading comics data...</p>
        </div>
      </div>
    )
  }

  if (!comicsData && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-xl text-red-600 dark:text-red-400 font-semibold mb-2">Error loading comics data</p>
          {error && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Error: {error}</p>
          )}
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Make sure the dev server is running and the JSON file is in the public directory.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-200 pb-12">
      <header role="banner" className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Dilbert Comic Viewer
              </h1>
              <p className="text-center text-gray-600 dark:text-gray-400 mt-2 text-sm md:text-base">
                Accessible transcripts from 1989 to 2023
              </p>
            </div>
            <div className="ml-4 flex items-center gap-2">
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Open settings"
                title="Settings"
              >
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">Settings</span>
              </button>
              <DarkModeToggle />
            </div>
          </div>
        </div>
      </header>
      
      <main role="main" className="w-full px-4 py-6">
        {currentDate ? (
          <div className="flex flex-col lg:flex-row gap-6 w-full">
            {/* Left column - Comic (70%) */}
            <div className="w-full lg:flex-[7] min-w-0">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 md:p-6 sticky top-6">
                <ComicDisplay 
                  date={currentDate}
                  comic={comicsData[currentDate]}
                  comicsData={comicsData}
                  useLocalImages={useLocalImages}
                />
              </div>
            </div>

            {/* Right column - Search, Controls, Transcript, Navigation (30%) */}
            <div className="w-full lg:flex-[3] flex-shrink-0 space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 space-y-4">
                <div className="space-y-3">
                  <div className="relative">
                    <SearchBar 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <DatePicker
                      value={currentDate || ''}
                      onChange={handleDateSelect}
                      minDate="1989-04-16"
                      maxDate="2023-03-12"
                    />
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <NavigationButtons
                    currentDate={currentDate}
                    onNavigate={navigateTo}
                  />
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 text-center pt-2 border-t border-gray-200 dark:border-gray-700">
                  Use <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600">←</kbd> <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600">→</kbd> keys to navigate
                </div>
              </div>

              {searchTerm ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
                  <SearchResults 
                    results={searchResults}
                    onResultClick={handleResultClick}
                  />
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
                  <TranscriptPanel
                    date={currentDate}
                    comic={comicsData[currentDate]}
                  />
                </div>
              )}
            </div>
          </div>
        ) : null}
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        useLocalImages={useLocalImages}
        setUseLocalImages={setUseLocalImages}
      />

      {/* Fixed Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-2 px-4 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <a
            href="https://github.com/jvarn/dilbert-transcripts"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            <span>View on GitHub</span>
          </a>
        </div>
      </footer>
    </div>
  )
}

export default App

