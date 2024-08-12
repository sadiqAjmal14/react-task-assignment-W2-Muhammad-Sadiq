import React from 'react';
import { Spinner } from 'react-bootstrap';

const LoadingPage = () => {
  return (
    <div style={styles.container} className='bg-seconday'>
      <Spinner animation="border" role="status" style={styles.spinner}>
        <span className="visually-hidden">Loading...</span>
      </Spinner>
      <h4 style={styles.text}>Loading, please wait...</h4>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  spinner: {
    marginBottom: '20px',
    color: '#007bff',
  },
  text: {
    color: '#343a40',
  },
};

export default LoadingPage;
