import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
	mode: ThemeMode;
	toggleTheme: () => void;
	isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
	const [mode, setMode] = useState<ThemeMode>('light');

	useEffect(() => {
		// Check for saved preference or system preference
		const savedMode = localStorage.getItem('theme-mode') as ThemeMode;
		if (savedMode) {
			setMode(savedMode);
		} else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
			setMode('dark');
		}
	}, []);

	useEffect(() => {
		// Apply theme to document
		document.documentElement.setAttribute('data-theme', mode);
		localStorage.setItem('theme-mode', mode);
	}, [mode]);

	const toggleTheme = () => {
		setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
	};

	return (
		<ThemeContext.Provider value={{ mode, toggleTheme, isDark: mode === 'dark' }}>
			{children}
		</ThemeContext.Provider>
	);
};

export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}
	return context;
};

export default ThemeContext;


