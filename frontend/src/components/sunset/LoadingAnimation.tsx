import React from 'react';

function LoadingAnimation() {
    const spinnerStyle = {
      border: '5px solid white', // White outer circle
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      borderLeft: '5px solid #2E7D32', // Dark green spinner section
      animation: 'spin 0.7s linear infinite'
    };
  
    const backgroundStyle = {
      background: 'rgba(46, 125, 50, 0.3)', // Semi-transparent dark green background
      width: '125px',
      height: '125px',
      borderRadius: '50%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    };
  
    const animationStyle = {
      '@keyframes spin': {
        '0%': { transform: 'rotate(0deg)' },
        '100%': { transform: 'rotate(360deg)' }
      }
    };
  
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '163px' }}>
      <div style={backgroundStyle}>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <div style={spinnerStyle}></div>
      </div>
      </div>
    );
  }
  
  export default LoadingAnimation;