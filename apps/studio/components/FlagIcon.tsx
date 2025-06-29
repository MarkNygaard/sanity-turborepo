// components/FlagIcon.tsx
import React from 'react'

interface FlagIconProps {
  countryCode: string
  size?: number
  className?: string
}

export const FlagIcon: React.FC<FlagIconProps> = ({ countryCode, size = 20, className = '' }) => {
  // Convert country code to lowercase for flag-icons
  let code = countryCode.toLowerCase()
  if (code === 'uk') code = 'gb'

  return (
    <span
      className={`fi fi-${code} workspace-flag ${className}`}
      style={{
        fontSize: `${size}px`,
        lineHeight: 1,
        display: 'inline-block',
        width: `${Math.round(size * 1.33)}px`, // Standard flag ratio
        height: `${size}px`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '2px',
        verticalAlign: 'middle',
      }}
      title={`${countryCode.toUpperCase()} Flag`}
    />
  )
}

// Workspace icon factory using flag icons
export function createFlagWorkspaceIcon(countryCode: string) {
  const WorkspaceFlagIcon = () => (
    <FlagIcon countryCode={countryCode} size={18} className="workspace-flag" />
  )

  // Set display name for debugging
  WorkspaceFlagIcon.displayName = `FlagIcon(${countryCode})`

  return WorkspaceFlagIcon
}
