import { ConfigContext, Template, TemplateResolver } from 'sanity'

export const templates: TemplateResolver = (prev: Template<any, any>[], context: ConfigContext) => [
  ...prev,
  {
    id: 'internationalised-page',
    title: 'Internationalised Page',
    schemaType: 'page',
    parameters: [{ name: 'language', type: 'string' }],
    value: (params: { language: string }) => {
      return {
        language: params.language,
      }
    },
  },
  {
    id: 'market-home-page',
    title: 'Market Home Page',
    schemaType: 'homePage',
    parameters: [
      { name: 'language', type: 'string' },
      { name: 'market', type: 'string' },
      { name: 'marketTitle', type: 'string' },
    ],
    value: (params: { language: string; market: string; marketTitle: string }) => {
      return {
        title: `${params.marketTitle} Home Page`,
        language: params.language,
        market: params.market,
      }
    },
  },
  {
    id: 'market-settings',
    title: 'Market Settings',
    schemaType: 'settings',
    parameters: [
      { name: 'language', type: 'string' },
      { name: 'market', type: 'string' },
      { name: 'marketTitle', type: 'string' },
    ],
    value: (params: { language: string; market: string; marketTitle: string }) => {
      return {
        label: `${params.marketTitle} Settings (${params.language.toUpperCase()})`,
        siteTitle: `DILLING - ${params.marketTitle}`,
        siteDescription: `Organic underwear and clothing from DILLING for the ${params.marketTitle} market`,
        language: params.language,
        market: params.market,
      }
    },
  },
  {
    id: 'market-navigation',
    title: 'Market Navigation',
    schemaType: 'navigation',
    parameters: [
      { name: 'language', type: 'string' },
      { name: 'market', type: 'string' },
      { name: 'marketTitle', type: 'string' },
    ],
    value: (params: { language: string; market: string; marketTitle: string }) => {
      return {
        label: `${params.marketTitle} Navigation (${params.language.toUpperCase()})`,
        language: params.language,
        market: params.market,
        navigationItems: [
          {
            _type: 'navigationLink',
            name: 'Home',
            linkType: 'internal',
            openInNewTab: false,
          },
          {
            _type: 'navigationDropdown',
            title: 'Products',
            columns: [
              {
                _type: 'navigationColumn',
                title: 'Categories',
                links: [
                  {
                    _type: 'navigationColumnLink',
                    name: 'Underwear',
                    linkType: 'external',
                    externalLink: '#',
                    openInNewTab: false,
                  },
                  {
                    _type: 'navigationColumnLink',
                    name: 'Merino Wool',
                    linkType: 'external',
                    externalLink: '#',
                    openInNewTab: false,
                  },
                  {
                    _type: 'navigationColumnLink',
                    name: 'Organic Cotton',
                    linkType: 'external',
                    externalLink: '#',
                    openInNewTab: false,
                  },
                ],
              },
            ],
          },
          {
            _type: 'navigationLink',
            name: 'About',
            linkType: 'external',
            externalLink: '#',
            openInNewTab: false,
          },
          {
            _type: 'navigationLink',
            name: 'Contact',
            linkType: 'external',
            externalLink: '#',
            openInNewTab: false,
          },
        ],
      }
    },
  },
  // Add this template to your existing templates.ts file

  {
    id: 'market-footer',
    title: 'Market Footer',
    schemaType: 'footer',
    parameters: [
      { name: 'language', type: 'string' },
      { name: 'market', type: 'string' },
      { name: 'marketTitle', type: 'string' },
    ],
    value: (params: { language: string; market: string; marketTitle: string }) => {
      return {
        label: `${params.marketTitle} Footer (${params.language.toUpperCase()})`,
        subtitle: `Premium organic underwear and clothing made with care for the environment since 1916`,
        copyrightText: `© ${new Date().getFullYear()} DILLING A/S. All rights reserved.`,
        language: params.language,
        market: params.market,
        columns: [
          {
            _type: 'footerColumn',
            title: 'Products',
            links: [
              {
                _type: 'footerColumnLink',
                name: 'Underwear',
                linkType: 'external',
                externalLink: '#',
                openInNewTab: false,
              },
              {
                _type: 'footerColumnLink',
                name: 'Merino Wool',
                linkType: 'external',
                externalLink: '#',
                openInNewTab: false,
              },
              {
                _type: 'footerColumnLink',
                name: 'Organic Cotton',
                linkType: 'external',
                externalLink: '#',
                openInNewTab: false,
              },
              {
                _type: 'footerColumnLink',
                name: 'Outdoor Wear',
                linkType: 'external',
                externalLink: '#',
                openInNewTab: false,
              },
            ],
          },
          {
            _type: 'footerColumn',
            title: 'Company',
            links: [
              {
                _type: 'footerColumnLink',
                name: 'About DILLING',
                linkType: 'external',
                externalLink: '#',
                openInNewTab: false,
              },
              {
                _type: 'footerColumnLink',
                name: 'Our Story',
                linkType: 'external',
                externalLink: '#',
                openInNewTab: false,
              },
              {
                _type: 'footerColumnLink',
                name: 'Sustainability',
                linkType: 'external',
                externalLink: '#',
                openInNewTab: false,
              },
              {
                _type: 'footerColumnLink',
                name: 'Careers',
                linkType: 'external',
                externalLink: '#',
                openInNewTab: false,
              },
            ],
          },
          {
            _type: 'footerColumn',
            title: 'Customer Service',
            links: [
              {
                _type: 'footerColumnLink',
                name: 'Contact Us',
                linkType: 'external',
                externalLink: '#',
                openInNewTab: false,
              },
              {
                _type: 'footerColumnLink',
                name: 'Size Guide',
                linkType: 'external',
                externalLink: '#',
                openInNewTab: false,
              },
              {
                _type: 'footerColumnLink',
                name: 'Returns & Exchanges',
                linkType: 'external',
                externalLink: '#',
                openInNewTab: false,
              },
              {
                _type: 'footerColumnLink',
                name: 'FAQ',
                linkType: 'external',
                externalLink: '#',
                openInNewTab: false,
              },
            ],
          },
          {
            _type: 'footerColumn',
            title: 'Legal',
            links: [
              {
                _type: 'footerColumnLink',
                name: 'Privacy Policy',
                linkType: 'external',
                externalLink: '#',
                openInNewTab: false,
              },
              {
                _type: 'footerColumnLink',
                name: 'Terms of Service',
                linkType: 'external',
                externalLink: '#',
                openInNewTab: false,
              },
              {
                _type: 'footerColumnLink',
                name: 'Cookie Policy',
                linkType: 'external',
                externalLink: '#',
                openInNewTab: false,
              },
            ],
          },
        ],
      }
    },
  },
]
