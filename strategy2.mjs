import axios from 'axios'
import https from 'https'

function createFetcher() {
  const _identifier = Symbol('_createFetcher_')
  let fetchStrategy

  const isFetcher = (fn) => _identifier in fn

  function createFetch(fn) {
    const fetchFn = async function _fetch(url, args) {
      return fn(url, args)
    }
    fetchFn[_identifier] = true
    return fetchFn
  }

  return {
    get fetch() {
      return fetchStrategy
    },
    create(fn) {
      return createFetch(fn)
    },
    use(fetcher) {
      if (!isFetcher(fetcher)) {
        throw new Error(`The fetcher provided is invalid`)
      }
      fetchStrategy = fetcher
      return this
    },
  }
}

const fetcher = createFetcher()

const axiosFetcher = fetcher.create(async (url, args) => {
  try {
    return axios.get(url, args)
  } catch (error) {
    throw error
  }
})

const httpsFetcher = fetcher.create((url, args) => {
  return new Promise((resolve, reject) => {
    const req = https.get(url, args)
    req.addListener('response', resolve)
    req.addListener('error', reject)
  })
})

const nodeFetchFetcher = fetcher.create(async (url, args) => {
  try {
    return fetch(url, args)
  } catch (error) {
    throw error
  }
})

const url = 'https://google.com'
fetcher.use(axiosFetcher)

//example 3:
const nums = [2, -13, 0, 42, 1999, 200, 1, 32]
const letters = ['z', 'b', 'm', 'o', 'hello', 'zebra', 'c', '0']
const dates = [
  new Date(2001, 1, 14),
  new Date(2000, 1, 14),
  new Date(1985, 1, 14),
  new Date(2020, 1, 14),
  new Date(2022, 1, 14),
]
// Need to be sorted by height
/* const elements = [
  document.getElementById('submitBtn'),
  document.getElementById('submit-form'),
  ...document.querySelectorAll('li'),
] */

const sorterId =Symbol('_sorter_')

class Sort { //strategy
  constructor(name) {
    this[sorterId] = name
  }

  execute(...args) {
    return this.fn(...args)
  }

  use(fn) {
    this.fn = fn
    return this
  }
}

class Sorter { //context
  sort(...args) {
    return this.sorter.execute.call(this.sorter, ...args)
  }

  use(sorter) {
    if(!(sorterId in sorter)) {
      throw new Error('Please use Sort as a sorter')
    }
    this.sorter = sorter
    return this
  }
}

const sorter = new Sorter()

const numberSorter = new Sort('number')
const letterSorter = new Sort('letter')
const dateSorter = new Sort('date')
const domElementSizeSorter = new Sort('dom-element-sizes')

numberSorter.use((item1, item2) => item1 - item2)
letterSorter.use((item1, item2) => item1.localeCompare(item2))
dateSorter.use((item1, item2) => item1.getTime() - item2.getTime())
domElementSizeSorter.use(
  (item1, item2) => item1.scrollHeight - item2.scrollHeight,
)

function sort(items) {
  const type = typeof items[0]
  sorter.use(
    type === 'number'
    ? numberSorter
    : type === 'string'
    ? letterSorter
    : items[0] instanceof Date
    ? dateSorter
    : items[0] && type === 'object' && 'tagName' in items[0]
    ? domElementSizeSorter
    : Array.prototype.sort.bind(Array)
  )
  return [...items].sort(sorter.sort.bind(sorter))
}

console.log('Sorted numbers', sort(nums))
console.log('Sorted letters', sort(letters))
console.log('Sorted dates', sort(dates))