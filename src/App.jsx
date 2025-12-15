import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import AdminUserDetail from './pages/AdminUserDetail';
import PublishVideo from './pages/PublishVideo';
import VideoDetail from './pages/VideoDetail';
import ErrorPage from './pages/ErrorPage';
import './App.css';

import History from './pages/History';
import LikedVideos from './pages/LikedVideos';
import Settings from './pages/Settings';
import EditVideo from './pages/EditVideo';
import Search from './pages/Search';
import Playlists from './pages/Playlists';
import PlaylistDetail from './pages/PlaylistDetail';
import Subscriptions from './pages/Subscriptions';
import Shorts from './pages/Shorts';
import Trending from './pages/Trending';
import Library from './pages/Library';
import WatchLater from './pages/WatchLater';
import Downloads from './pages/Downloads';
import Channel from './pages/Channel';
import Studio from './pages/Studio';

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
        path: "admin/user/:userId",
        element: <AdminUserDetail />
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
        path: "video/edit/:videoId",
        element: <EditVideo />
      },
      {
        path: "history",
        element: <History />
      },
      {
        path: "liked",
        element: <LikedVideos />
      },
      {
        path: "settings",
        element: <Settings />
      },
      {
        path: "search",
        element: <Search />
      },
      {
        path: "playlists",
        element: <Playlists />
      },
      {
        path: "playlist/:playlistId",
        element: <PlaylistDetail />
      },
      {
        path: "subscriptions",
        element: <Subscriptions />
      },
      {
        path: "shorts",
        element: <Shorts />
      },
      {
        path: "trending",
        element: <Trending />
      },
      {
        path: "library",
        element: <Library />
      },
      {
        path: "watch-later",
        element: <WatchLater />
      },
      {
        path: "downloads",
        element: <Downloads />
      },
      {
        path: "your-channel",
        element: <Channel />
      },
      {
        path: "channel/:username",
        element: <Channel />
      },
      {
        path: "studio",
        element: <Studio />
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
