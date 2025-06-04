import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom"; 
import './index.css'
import App from './App.jsx'
import Home from './components/Home.jsx';
import TripPlanner from './components/TripPlanner.jsx';
import About from './components/About.jsx';

  const router = createBrowserRouter([
    {
      path: "/",
      element: <App/>,
      children: [
        {
          path: "Home",
          element: <Home />,
        },
        {
          path: "Trip",
          element: <TripPlanner/>,
        },
        {
          path: "About",
          element: <About/>,
        },
        
      ],
    },
  ]);


  createRoot(document.getElementById('root')).render(
    <StrictMode>

       <RouterProvider router={router} />
    </StrictMode>,
  )
