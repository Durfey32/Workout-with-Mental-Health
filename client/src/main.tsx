import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'


import App from './App.tsx'
import ErrorPage from './pages/ErrorPage.tsx'


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
      ]
    }
  </StrictMode>
]);
