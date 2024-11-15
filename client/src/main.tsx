import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import  ReactDOM  from 'react-dom/client';
import './index.css'


import App from './App.tsx';
import ErrorPage from './pages/ErrorPage.tsx';
import MainPage from './pages/MainPage.tsx';
import CreateAccount from './pages/CreateAccount.tsx';
import DashBoard from './pages/DashBoard.tsx';
import SettingsInfo from './pages/SettingsInfo.tsx';
import ContactUs from './pages/ContactUs.tsx';
import CommChat from './pages/CommChat.tsx';
import Journal from './pages/Journal.tsx';
import Workout from './pages/WorkOutGen.tsx';



const router = createBrowserRouter([
    {
      path: '/',
      element: <App />,
      errorElement: <ErrorPage />,
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
          path: 'home',
          element: <DashBoard />
        },
        {
          path: 'workout-gen',
          element: <Workout />
        },
        {
          path: 'journal',
          element: <Journal />
        },
        {
          path: 'comms-chat',
          element: <CommChat />
        },
        {
          path: 'contact-us',
          element: <ContactUs />
        },
        {
          path: 'settings',
          element: <SettingsInfo />
        },
      ],
    },
]);

const rootElement = document.getElementById('root');
if(rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <RouterProvider router={router} />
   );
 }
