export interface Language {
  _id: string;
  code: string;
  title: string;
  isDefault?: boolean;
}

export interface Market {
  _id: string;
  code: string;
  title: string;
  flag?: string;
  flagCode?: string;
  languages: Language[];
}

export interface MarketWithStats extends Market {
  languageCount: number;
  hasDefaultLanguage: boolean;
  studioUrl: string;
  hostname: string;
}
