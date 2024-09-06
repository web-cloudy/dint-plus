import React, {
  createContext,
  Dispatch,
  ReactElement,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from 'react'

type ColorThemeContextType = {
  theme: string | null
  setTheme: Dispatch<SetStateAction<string | null>>
}

const ThemeContext = createContext<ColorThemeContextType | undefined>(undefined)

function useTheme(): ColorThemeContextType {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within an ThemeProvider')
  }
  return context
}

const ThemeProvider = (props: { children: ReactNode }): ReactElement => {
  const [theme, setTheme] = useState<string | null>(null)

  return <ThemeContext.Provider {...props} value={{ theme, setTheme }} />
}

export { ThemeProvider, useTheme }
