import React from 'react';

const Test = () => {
  console.log('Test component rendering...');
  
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: 'red',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '24px',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 9999
    }}>
      <h1>TESTE - React funcionando! {new Date().toLocaleTimeString()}</h1>
    </div>
  );
};

export default Test;
