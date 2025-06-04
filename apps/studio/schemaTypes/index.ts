import homePageDocument from './documents/homePage.document'
import languageDocument from './documents/language.document'
import marketDocument from './documents/market.document'
import pageDocument from './documents/page.document'
import personDocument from './documents/person.document'
import bookMarkObject from './objects/bookMark.object'
import body from './portableText/body'

export const schemaTypes = [
  // Documents
  pageDocument,
  homePageDocument,

  languageDocument,

  marketDocument,
  personDocument,

  // objects
  bookMarkObject,

  // Portable Text
  body,
]
