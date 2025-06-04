import footerDocument from './documents/footer.document'
import homePageDocument from './documents/homePage.document'
import languageDocument from './documents/language.document'
import marketDocument from './documents/market.document'
import { navigationDocument } from './documents/navigation.document'
import pageDocument from './documents/page.document'
import personDocument from './documents/person.document'
import { settingsDocument } from './documents/settings.document'
import { accordion } from './objects/blocks/accordion.block'
import { filmStrip } from './objects/blocks/filmStrip.block'
import { hero } from './objects/blocks/hero.block'
import bookMarkObject from './objects/bookMark.object'
import { button } from './objects/button.object'
import footerColumnObject from './objects/footerColumn.object'
import footerColumnLinkObject from './objects/footerColumnLink.object'
import { navigationColumnObject } from './objects/navigationColumn.object'
import { navigationColumnLinkObject } from './objects/navigationColumnLink.object'
import navigationDropdownObject from './objects/navigationDropdown.object'
import { navigationLinkObject } from './objects/navigationLink.object'
import { pageBuilder } from './objects/pageBuilder.object'
import { richText } from './objects/richText.object'
import body from './portableText/body'

export const schemaTypes = [
  // Documents
  pageDocument,
  homePageDocument,
  settingsDocument,
  navigationDocument,
  footerDocument,
  languageDocument,
  marketDocument,
  personDocument,

  // Page Builder Objects
  pageBuilder,
  richText,
  button,

  // Page Builder Blocks
  hero,
  filmStrip,
  accordion,

  // objects
  bookMarkObject,

  // Navigation objects
  navigationLinkObject,
  navigationColumnLinkObject,
  navigationColumnObject,
  navigationDropdownObject,

  // Footer objects
  footerColumnLinkObject,
  footerColumnObject,

  // Portable Text
  body,
]
