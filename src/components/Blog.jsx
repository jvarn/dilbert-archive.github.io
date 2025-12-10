import { articles } from '../articles/index.js'

function Blog({ onArticleSelect }) {
  // Sort articles by date (newest first)
  const sortedArticles = [...articles].sort((a, b) => {
    return new Date(b.date) - new Date(a.date)
  })

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Enhanced Header Section */}
      <header className="mb-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 mb-6 shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
          Analysis & Articles
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Research and analysis based on the Dilbert transcript dataset
        </p>
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{sortedArticles.length} {sortedArticles.length === 1 ? 'article' : 'articles'}</span>
        </div>
      </header>

      {/* Enhanced Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {sortedArticles.map((article, index) => {
          const articleDate = new Date(article.date)
          const formattedDate = articleDate.toLocaleDateString('en-UK', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })
          
          return (
            <article
              key={article.id}
              className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
              onClick={() => onArticleSelect(article.id)}
            >
              {/* Gradient accent bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="p-6 sm:p-8">
                {/* Date badge */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-full">
                    <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <time className="text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-300">
                      {formattedDate}
                    </time>
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                  {article.title}
                </h2>

                {/* Excerpt */}
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 line-clamp-3">
                  {article.excerpt}
                </p>

                {/* Read more indicator */}
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium text-sm group-hover:gap-3 transition-all duration-200">
                  <span>Read article</span>
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              {/* Hover overlay effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-indigo-500/0 group-hover:from-blue-500/5 group-hover:to-indigo-500/5 transition-all duration-300 pointer-events-none rounded-2xl"></div>
            </article>
          )
        })}
      </div>

      {/* Empty state (if no articles) */}
      {sortedArticles.length === 0 && (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">No articles available yet.</p>
        </div>
      )}
    </div>
  )
}

export default Blog

