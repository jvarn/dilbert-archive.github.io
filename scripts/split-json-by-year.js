import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const inputFile = path.join(__dirname, '../data/dilbert_comics_transcripts.json')
const outputDir = path.join(__dirname, '../public/comics-data')
const indexFile = path.join(__dirname, '../public/comics-index.json')

// Read the full JSON
console.log('Reading comics data...')
const allData = JSON.parse(fs.readFileSync(inputFile, 'utf8'))

// Create output directory
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
  console.log(`Created directory: ${outputDir}`)
}

// Split by year
const byYear = {}
const index = {
  years: [],
  dates: [],
  latestYear: null
}

console.log('Splitting data by year...')
Object.keys(allData).forEach(date => {
  const year = date.split('-')[0]
  if (!byYear[year]) {
    byYear[year] = {}
    index.years.push(year)
  }
  byYear[year][date] = allData[date]
  index.dates.push({
    date,
    title: allData[date].title || '',
    year
  })
})

index.years.sort()
index.latestYear = index.years[index.years.length - 1]

// Write year files (minified)
console.log('\nWriting year files...')
let totalSize = 0
Object.keys(byYear).forEach(year => {
  const filePath = path.join(outputDir, `${year}.json`)
  const jsonContent = JSON.stringify(byYear[year])
  fs.writeFileSync(filePath, jsonContent)
  const fileSize = fs.statSync(filePath).size
  totalSize += fileSize
  console.log(`  Created ${year}.json (${(fileSize / 1024).toFixed(2)} KB)`)
})

// Write index file
console.log('\nWriting index file...')
const indexContent = JSON.stringify(index)
fs.writeFileSync(indexFile, indexContent)
const indexSize = fs.statSync(indexFile).size
console.log(`  Created comics-index.json (${(indexSize / 1024).toFixed(2)} KB)`)

console.log(`\n✓ Split complete!`)
console.log(`  Total years: ${index.years.length}`)
console.log(`  Total comics: ${index.dates.length}`)
console.log(`  Total size of year files: ${(totalSize / 1024 / 1024).toFixed(2)} MB`)
console.log(`  Index size: ${(indexSize / 1024).toFixed(2)} KB`)

