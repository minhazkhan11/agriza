import { useEffect } from 'react';

const useShortcut = (shortcuts = []) => {
  useEffect(() => {
    const handler = (event) => {
      if (event.metaKey) return; 
      for (const { keys, callback } of shortcuts) {
        const keyParts = keys.toLowerCase().split('+');
        const isMatch = keyParts.every((key) => {
          if (key === 'ctrl') return event.ctrlKey;
          if (key === 'shift') return event.shiftKey;
          if (key === 'alt') return event.altKey;
          return event.key.toLowerCase() === key;
        });

        if (isMatch) {
          event.preventDefault();
          callback();
          break;
        }
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [shortcuts]);
};

export default useShortcut;
