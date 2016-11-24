import JSONLoader from './JSONLoader'

class pcJSONLoader extends JSONLoader {
  constructor() {
    super()
    this.url = 'https://gist.githubusercontent.com/isuvorov/ce6b8d87983611482aac89f6d7bc0037/raw/pc.json'
    this.fetchJSON()
      .then(() => {
        console.log(`pcJSON fetched ${this.url}`)
      })
  }
}

export default pcJSONLoader
