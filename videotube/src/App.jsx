import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import PublishVideo from './pages/PublishVideo';
import VideoDetail from './pages/VideoDetail';
import ErrorPage from './pages/ErrorPage';
import './App.css';

import History from './pages/History';
import LikedVideos from './pages/LikedVideos';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <Home />
      },
      {
        path: "login",
        element: <Login />
      },
      {
        path: "register",
        element: <Register />
      },
      {
        path: "admin",
        element: <AdminDashboard />
      },
      {
        path: "publish",
        element: <PublishVideo />
      },
      {
        path: "video/:videoId",
        element: <VideoDetail />
      },
      {
        path: "history",
        element: <History />
      },
      {
        path: "liked",
        element: <LikedVideos />
      }
    ]
  }
]);

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
