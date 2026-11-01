import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Profile from '../components/Profile';

export default function ProfilePage({ user, onUpdateUser, onLogout }) {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar user={user} onLogout={onLogout} />
      <main className="flex-grow-1 py-4 py-md-5 hs-fade-in">
        <div className="container">
          <div className="mb-4">
            <h2 className="fw-bold mb-1 text-white">Profile</h2>
            <p className="text-secondary">Build a profile that gets noticed.</p>
          </div>
          <Profile user={user} onUpdate={onUpdateUser} onLogout={onLogout} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
