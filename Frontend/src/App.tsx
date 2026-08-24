import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import Landing from "./Pages/Landing";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Purpose from "./Pages/Purpose";
import Level from "./Pages/Level";
import Main from "./Pages/Main";
import Profile from "./Pages/Profile";
import EditProfile from "./Pages/EditProfile";
import Story from "./Pages/Story";
import PhotoWord from "./Pages/PhotoWord";
import Cards from "./Pages/Cards";

import AuthRoute from "./components/AuthRoute";
import { UserProvider } from "./components/UserContext";

const router = createBrowserRouter([
  // PUBLIC PAGES
  { path: "/", element: <AuthRoute element={<Landing />} authType="public" /> },
  { path: "/login", element: <AuthRoute element={<Login />} authType="public" /> },
  { path: "/signup", element: <AuthRoute element={<Signup />} authType="public" /> },

  // PROTECTED PAGES
  { path: "/purpose", element: <AuthRoute element={<Purpose />} authType="protected" /> },
  { path: "/level", element: <AuthRoute element={<Level />} authType="protected" requirePurpose /> },
  { path: "/main", element: <AuthRoute element={<Main />} authType="protected" requirePurpose /> },
  { path: "/profile", element: <AuthRoute element={<Profile />} authType="protected" /> },
  { path: "/edit_pr", element: <AuthRoute element={<EditProfile />} authType="protected" /> },
  { path: "/story", element: <AuthRoute element={<Story />} authType="protected" /> },
  { path: "/photoWord", element: <AuthRoute element={<PhotoWord />} authType="protected" /> },
  { path: "/cards", element: <AuthRoute element={<Cards />} authType="protected" /> },
]);

function App() {
  return (
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  );
}

export default App;