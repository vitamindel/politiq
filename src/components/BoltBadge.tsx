import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const BoltBadge: React.FC = () => {
  const { user } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      const userDarkMode = user?.preferences.darkMode;
      const systemDarkMode = document.documentElement.classList.contains('dark');
      setIsDarkMode(userDarkMode || systemDarkMode);
    };

    // Check initially
    checkDarkMode();

    // Listen for changes to the dark class on html element
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, [user?.preferences.darkMode]);

  return (
    <a
      href="https://bolt.new/"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed top-4 right-4 z-[60] transition-opacity hover:opacity-80"
      aria-label="Powered by Bolt.new"
    >
      <img
        src={isDarkMode ? '/boltwhite.png' : '/boltblack.png'}
        alt="Powered by Bolt.new"
        className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 transition-all duration-300"
      />
    </a>
  );
};

export default BoltBadge; 