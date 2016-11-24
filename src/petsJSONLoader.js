import JSONLoader from './JSONLoader'

class petsJSONLoader extends JSONLoader {
  constructor() {
    super()
    this.url = 'https://gist.githubusercontent.com/isuvorov/55f38b82ce263836dadc0503845db4da/raw/pets.json'
    this.fetchJSON()
      .then(() => {
        console.log(`petsJSON fetched ${this.url}`)
      })
  }
}

export default petsJSONLoader
