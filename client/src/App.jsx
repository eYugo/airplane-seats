import { React, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './components/NavBar';
import MainPage from './pages/MainPage'
import MyReservationsPage from './pages/MyReservationsPage';
import LoginPage from './pages/LoginPage';
import usersAPI from './services/api-users';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);

  // Function to show errors in a toast
  const handleErrors = (err) => {
    let msg = '';
    if (err.error) msg = err.error;
    else if (String(err) === "string") msg = String(err);
    else msg = "Unknown Error";
    setMessage(msg);
  }

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const user = await usersAPI.getUserInfo();
        setUser(user);
        setIsLoggedIn(true);
      } catch (err) {
        handleErrors(err);
        setUser(null);
        setIsLoggedIn(false);
      }
    };
    init();
  }, []);

  // Function to handle the Login
  const handleLogin = async (credentials) => {
    try {
      const user = await usersAPI.logIn(credentials);
      setUser(user);
      setIsLoggedIn(true);
    } catch (err) {
      throw err;
    }
  };

  // Function to handle the Lougout
  const handleLogout = async () => {
    await usersAPI.logOut();
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <BrowserRouter>
      <NavBar
        isLoggedIn={isLoggedIn}
        handleLogout={handleLogout}
      />
      <Routes>
        <Route index element={<MainPage isLoggedIn={isLoggedIn} user={user} />} />
        <Route path="/reservations" element={<MyReservationsPage user={user} />} />
        <Route path="/login" element={<LoginPage handleLogin={handleLogin} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
