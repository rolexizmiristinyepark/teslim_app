/**
 * ActionButton Component
 * Reusable add/remove button with hover effects
 * Uses div instead of button to avoid CSS conflicts
 */

import { memo, useState } from 'react';

const ActionButton = memo(({ type, size = 'small', onClick, title }) => {
  const [isHovered, setIsHovered] = useState(false);

  const isAdd = type === 'add';
  const isSmall = size === 'small';

  const iconColor = isAdd ? '#003057' : '#be0300';
  const iconSize = isSmall ? 12 : 14; // Daha küçük yapıldı
  const buttonSize = isSmall ? 18 : 20; // Daha küçük yapıldı

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(e);
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={title}
      style={{
        width: `${buttonSize}px`,
        height: `${buttonSize}px`,
        borderRadius: '4px',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease',
        background: 'transparent',
        padding: '0',
        margin: '0',
        outline: 'none',
        transform: isHovered ? 'scale(1.1)' : 'scale(1)',
        opacity: isHovered ? 0.7 : 1
      }}
    >
      {isAdd ? (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width={iconSize} 
          height={iconSize} 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="#003057"
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          style={{ display: 'block' }}
        >
          <path d="M12 2a10 10 0 0 1 7.38 16.75"/>
          <path d="M12 8v8"/>
          <path d="M16 12H8"/>
          <path d="M2.5 8.875a10 10 0 0 0-.5 3"/>
          <path d="M2.83 16a10 10 0 0 0 2.43 3.4"/>
          <path d="M4.636 5.235a10 10 0 0 1 .891-.857"/>
          <path d="M8.644 21.42a10 10 0 0 0 7.631-.38"/>
        </svg>
      ) : (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width={iconSize} 
          height={iconSize} 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="#be0300"
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          style={{ display: 'block' }}
        >
          <path d="M3 6h18"/>
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
          <line x1="10" x2="10" y1="11" y2="17"/>
          <line x1="14" x2="14" y1="11" y2="17"/>
        </svg>
      )}
    </div>
  );
});

ActionButton.displayName = 'ActionButton';

export default ActionButton;