import { useState, useEffect } from 'react'
import { loadArticle } from '../articles/index.js'

function Article({ articleId, onBack }) {
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true)
        const articleModule = await loadArticle(articleId)
        if (articleModule) {
          setArticle({
            ...articleModule.metadata,
            Content: articleModule.Content
          })
        } else {
          setError('Article not found')
        }
      } catch (err) {
        console.error('Error loading article:', err)
        setError(err.message || 'Failed to load article')
      } finally {
        setLoading(false)
      }
    }

    if (articleId) {
      fetchArticle()
    }
  }, [articleId])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading article...</p>
        </div>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-gray-600 dark:text-gray-400">{error || 'Article not found.'}</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Articles
        </button>
      </div>
    )
  }

  const { Content } = article

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Enhanced Back Button */}
      <button
        onClick={onBack}
        className="mb-8 group flex items-center gap-2 px-4 py-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
      >
        <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="font-medium">Back to Articles</span>
      </button>

      {/* Enhanced Header */}
      <header className="mb-12 pb-10 border-b-2 border-gray-200 dark:border-gray-700">
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-full mb-4">
            <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <time className="text-sm font-medium text-blue-700 dark:text-blue-300">
              {new Date(article.date).toLocaleDateString('en-UK', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </time>
          </div>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-gray-100 dark:via-gray-200 dark:to-gray-100 bg-clip-text text-transparent mb-6 leading-tight">
          {article.title}
        </h1>
      </header>

      {/* Enhanced Content Area */}
      <div className="article-content prose prose-lg dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-code:text-blue-600 dark:prose-code:text-blue-400 prose-pre:bg-gray-900 dark:prose-pre:bg-gray-800 prose-blockquote:border-l-blue-500 dark:prose-blockquote:border-l-blue-400 prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300">
        <Content />
      </div>
    </article>
  )
}

export default Article
