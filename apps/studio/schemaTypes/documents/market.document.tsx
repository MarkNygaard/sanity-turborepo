import { TbMap2 } from 'react-icons/tb'
import { defineField, defineType, ReferenceValue } from 'sanity'
import { StringInputProps, set, PatchEvent } from 'sanity'

export default defineType({
  name: 'market',
  title: 'Market',
  type: 'document',
  icon: TbMap2,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'code',
      title: 'Code',
      type: 'string',
      validation: (Rule) => Rule.required().regex(/^[A-Z]{2}$/),
      description: 'Two-letter country/region code (ISO 3166-1 alpha-2)',
    }),

    defineField({
      name: 'flagCode',
      title: 'Flag',
      type: 'string',
      description: 'Country code for flag display (same as Code field, but can be customized)',
      validation: (Rule) =>
        Rule.required().custom((flagCode) => {
          if (!flagCode) return 'Flag code is required'
          if (!/^[A-Z]{2}$/.test(flagCode)) {
            return 'Flag code must be 2 uppercase letters (e.g., US, EU, GB, CH)'
          }
          return true
        }),
      initialValue: ({ document }) => document?.code || 'EU',
      components: {
        input: (props: StringInputProps) => {
          const { onChange, value, elementProps } = props

          // Common country/region codes with their names
          const flagOptions = [
            { code: 'US', name: 'United States' },
            { code: 'EU', name: 'European Union', note: 'Use generic EU flag' },
            { code: 'GB', name: 'United Kingdom' },
            { code: 'DE', name: 'Germany' },
            { code: 'FR', name: 'France' },
            { code: 'CH', name: 'Switzerland' },
            { code: 'NL', name: 'Netherlands' },
            { code: 'SE', name: 'Sweden' },
            { code: 'NO', name: 'Norway' },
            { code: 'DK', name: 'Denmark' },
            { code: 'FI', name: 'Finland' },
            { code: 'AT', name: 'Austria' },
            { code: 'BE', name: 'Belgium' },
            { code: 'IT', name: 'Italy' },
            { code: 'ES', name: 'Spain' },
            { code: 'PT', name: 'Portugal' },
            { code: 'IE', name: 'Ireland' },
            { code: 'LU', name: 'Luxembourg' },
            { code: 'MT', name: 'Malta' },
            { code: 'CY', name: 'Cyprus' },
            { code: 'EE', name: 'Estonia' },
            { code: 'LV', name: 'Latvia' },
            { code: 'LT', name: 'Lithuania' },
            { code: 'SI', name: 'Slovenia' },
            { code: 'SK', name: 'Slovakia' },
            { code: 'HR', name: 'Croatia' },
            { code: 'BG', name: 'Bulgaria' },
            { code: 'RO', name: 'Romania' },
            { code: 'HU', name: 'Hungary' },
            { code: 'PL', name: 'Poland' },
            { code: 'CZ', name: 'Czech Republic' },
          ]

          const handleChange = (newValue: string) => {
            onChange(PatchEvent.from(set(newValue.toUpperCase())))
          }

          return (
            <div>
              <div style={{ marginBottom: '1rem' }}>
                <input
                  {...elementProps}
                  value={value || ''}
                  onChange={(e) => handleChange(e.target.value)}
                  placeholder="Enter 2-letter country code (e.g., US, GB, CH)"
                  maxLength={2}
                  style={{
                    textTransform: 'uppercase',
                    padding: '8px 12px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontSize: '14px',
                    width: '100px',
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <strong>Current selection:</strong>
                <span
                  style={{
                    marginLeft: '8px',
                    padding: '4px 8px',
                    background: '#f0f0f0',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                  }}
                >
                  {value || 'EU'}
                </span>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                  Flag will be displayed using flag-icons CSS library
                </div>
              </div>

              <div>
                <strong>Quick select:</strong>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                    gap: '4px',
                    marginTop: '8px',
                    maxHeight: '200px',
                    overflowY: 'auto',
                  }}
                >
                  {flagOptions.map(({ code, name, note }) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => handleChange(code)}
                      style={{
                        padding: '8px',
                        border: '1px solid #ccc',
                        background: value === code ? '#e6f3ff' : 'white',
                        cursor: 'pointer',
                        fontSize: '12px',
                        borderRadius: '4px',
                        textAlign: 'left',
                      }}
                      title={note || name}
                    >
                      <div style={{ fontWeight: 'bold' }}>{code}</div>
                      <div style={{ color: '#666' }}>{name}</div>
                      {note && <div style={{ fontSize: '10px', color: '#999' }}>{note}</div>}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )
        },
      },
    }),

    defineField({
      name: 'languages',
      title: 'Languages',
      type: 'array',
      of: [
        {
          type: 'reference',
          name: 'language',
          to: [{ type: 'language' }],
          options: {
            filter: ({ document }) => {
              return {
                filter: '_type == "language" && !(_id in $refs)',
                params: {
                  refs: (document?.languages as ReferenceValue[])?.map(({ _ref }) => _ref) || [],
                },
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],

  preview: {
    select: {
      title: 'title',
      code: 'code',
      flagCode: 'flagCode',
      languages: 'languages',
    },
    prepare({ title, code, flagCode, languages = [] }) {
      // Flag icon component using CSS classes
      const FlagIcon = () => {
        const countryCode = (flagCode || code || 'EU').toLowerCase()
        return (
          <span
            className={`fi fi-${countryCode}`}
            style={{
              fontSize: '20px',
              lineHeight: 1,
              display: 'inline-block',
              width: '30px',
              height: '20px',
              backgroundSize: 'cover',
              borderRadius: '2px',
            }}
            title={`Flag: ${flagCode || code}`}
          />
        )
      }

      return {
        title: title,
        subtitle: `${code} • ${languages.length} language${languages.length === 1 ? '' : 's'}`,
        media: FlagIcon,
      }
    },
  },
})
