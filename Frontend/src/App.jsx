import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import Landing from "./Pages/Landing";
import Main from "./Pages/Main";
import Story from "./Pages/Story";
import PhotoWord from "./Pages/PhotoWord";
import Login from "./Pages/Login";
import Purpose from "./Pages/Purpose";
import Level from "./Pages/Level";
import Cards from "./Pages/Cards";
import Signup from "./Pages/Signup";
import Profile from "./Pages/Profile";
import EditProfile from "./Pages/EditProfile";

import AuthRoute from "./components/AuthRoute";

function App() {
  const router = createBrowserRouter([
    // PUBLIC PAGES
    {
      path: "/",
      element: <AuthRoute element={<Landing />} authType="public" />,
    },
    {
      path: "/login",
      element: <AuthRoute element={<Login />} authType="public" />,
    },
    {
      path: "/signup",
      element: <AuthRoute element={<Signup />} authType="public" />,
    },

    // PROTECTED PAGES
    {
      path: "/main",
      element: <AuthRoute element={<Main />} authType="protected" />,
    },
    {
      path: "/profile",
      element: <AuthRoute element={<Profile />} authType="protected" />,
    },
    {
      path: "/purpose",
      element: <AuthRoute element={<Purpose />} authType="protected" />,
    },
    {
      path: "/level",
      element: <AuthRoute element={<Level />} authType="protected" />,
    },
    {
      path: "/cards",
      element: <AuthRoute element={<Cards />} authType="protected" />,
    },
    {
      path: "/story",
      element: <AuthRoute element={<Story />} authType="protected" />,
    },
    {
      path: "/photoWord",
      element: <AuthRoute element={<PhotoWord />} authType="protected" />,
    },
    {
      path: "/edit_pr",
      element: <AuthRoute element={<EditProfile />} authType="protected" />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;