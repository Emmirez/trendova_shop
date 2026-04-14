import { useState, useEffect } from 'react';
import { ThemeContext } from './ThemeContext.js';

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('trendova-theme') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('trendova-theme', theme);
    const html = document.documentElement;
    if (theme === 'light') {
      html.classList.add('light');
      html.classList.remove('dark');
    } else {
      html.classList.remove('light');
      html.classList.add('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
};