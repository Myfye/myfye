import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Logo from '../../assets/MyFyeLogo2.png';

function PrivacyPolicy() {
  const navigate = useNavigate();
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 768);
  const [pdfError, setPdfError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePdfError = () => {
    console.error('Failed to load PDF');
    setPdfError(true);
    setIsLoading(false);
  };

  const handlePdfLoad = () => {
    setIsLoading(false);
  };

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: isSmallScreen ? '1rem' : '2rem',
      backgroundColor: '#ffffff',
      width: '100%',
      boxSizing: 'border-box' as const,
      minHeight: '100vh'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: isSmallScreen ? '1rem' : '2rem',
      flexDirection: isSmallScreen ? 'column' : 'row' as const,
      textAlign: isSmallScreen ? 'center' : 'left' as const
    },
    logo: {
      width: isSmallScreen ? '150px' : '200px',
      height: 'auto',
      marginBottom: isSmallScreen ? '1rem' : '0'
    },
    title: {
      fontSize: isSmallScreen ? '1.5rem' : '2rem',
      margin: 0
    },
    pdfContainer: {
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      height: isSmallScreen ? 'auto' : '800px',
      width: '100%',
      position: 'relative' as const,
      padding: isSmallScreen ? '1rem' : '0'
    },
    pdf: {
      border: 'none',
      width: '100%',
      height: '100%',
      display: isLoading ? 'none' : 'block'
    },
    loadingContainer: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#AAAAAA'
    },
    errorContainer: {
      padding: '2rem',
      textAlign: 'center' as const,
      backgroundColor: '#AAAAAA',
      borderRadius: '8px',
      marginTop: '1rem'
    },
    link: {
      color: '#0066cc',
      textDecoration: 'underline',
      cursor: 'pointer',
      display: 'inline-block',
      padding: '1rem',
      backgroundColor: '#f5f5f5',
      borderRadius: '4px',
      margin: '1rem 0'
    },
    mobileMessage: {
      textAlign: 'center' as const,
      padding: '2rem',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      marginBottom: '1rem'
    }
  };
  
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <img src={Logo} alt="Myfye Logo" style={styles.logo} />
        <h1 style={styles.title}>Privacy Policy</h1>
      </div>

      <div style={styles.pdfContainer}>
        {isLoading && !isSmallScreen && (
          <div style={styles.loadingContainer}>
            Loading Privacy Policy...
          </div>
        )}
        
        {isSmallScreen ? (
          <div style={styles.mobileMessage}>
            <p>For the best viewing experience on mobile devices, please use the link below to view the Privacy Policy:</p>
            <a 
              href="/Myfye Privacy Policy.pdf" 
              target="_blank" 
              rel="noopener noreferrer"
              style={styles.link}
            >
              View Privacy Policy PDF
            </a>
          </div>
        ) : pdfError ? (
          <div style={styles.errorContainer}>
            <p>Unable to load the Privacy Policy PDF.</p>
            <p>
              You can{' '}
              <a 
                href="/Myfye Privacy Policy.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                style={styles.link}
              >
                view the PDF directly
              </a>
              {' '}or try refreshing the page.
            </p>
          </div>
        ) : (
          <iframe 
            src="/Myfye Privacy Policy.pdf#toolbar=0&navpanes=0" 
            style={styles.pdf}
            title="Privacy Policy"
            onError={handlePdfError}
            onLoad={handlePdfLoad}
          />
        )}
      </div>
    </div>
  );
}

export default PrivacyPolicy;