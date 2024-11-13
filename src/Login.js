import React from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from './firebase';
import './Login.css'; // Import the CSS file
import googleLogo from './assets/Google_Icons.webp'; 

const Login = () => {
  const handleGoogleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log('User signed in:', result.user);
      })
      .catch((error) => {
        console.error('Error signing in:', error);
      });
  };

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Welcome</h1>
        <p className="subtitle">Sign in to continue</p>
        <button className="button" onClick={handleGoogleLogin}>
          <img 
            src={googleLogo} 
            alt="Google Logo"
            className="icon"
            style={{ width: '20px', height: '20px', maxWidth: '20px', maxHeight: '20px' }} 
          />
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default Login;

