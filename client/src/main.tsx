import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'


import App from './App.tsx'
import ErrorPage from './pages/ErrorPage.tsx'
import MainPage from './pages/MainPage.tsx'
import CreateAccount from './pages/CreateAccount.tsx'
import Login from './pages/Login.tsx'
import Home from './pages/Home.tsx'
import Profile from './pages/Profile.tsx'
import ContactUs from './pages/ContactUs.tsx'


createRoot(document.getElementById('root')!).render([
  <StrictMode>
    {
      path: '/',
      element: <App />
      errorElement: <ErrorPage />
      children: [
        {
          index: true,
          element: <MainPage />
        },
        {
          path: '/create-account',
          element: <CreateAccount />
        },
        {
          path: 'login',
          element: <Login />
        },
        {
          path: 'home',
          element: <Home />
        },
        {
          path: 'profile',
          element: <Profile />
        },
        {
          path: 'contact-us',
          element: <ContactUs />
        },
      ]
    }
  </StrictMode>
]);
