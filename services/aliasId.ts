/* eslint-disable @typescript-eslint/no-var-requires,global-require */
const en = require('nanoid-good/locale/en')
const pt = require('nanoid-good/locale/pt')
const customAlphabet = require('nanoid-good/async').customAlphabet(en, pt)
const dictionary = require('nanoid-dictionary')

class AliasId {
  public static async generate(size = 6): Promise<string> {
    const alphabet = dictionary.numbers + dictionary.uppercase
    const nanoId = customAlphabet(alphabet, size)
    return nanoId()
  }
}

export default AliasId