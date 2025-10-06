import {
  createBrowserRouter,
  RouterProvider,
  Route,
} from "react-router-dom"
import ListPage from "./routes/listPage/listPage";
import {Layout, RequireAuth} from "./routes/layout/layout";
import HomePage from "./routes/homePage/homePage";
import SinglePage from "./routes/singlePage/singlePage";
import ProfilePage from "./routes/profilePage/profilePage";
import LoginPage from "./routes/login/loginPage";
import Register from "./routes/register/register";
import ProfileUpdatePage from "./routes/profileUpdatePage/profileUpdatePage";
import NewPostPage from "./routes/newPostPage/newPostPage";
import { listPageLoader, profilePageLoader, singlePageLoader } from "./lib/loaders";


function App() {
  
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout/>,
      children: [
        {
          path: "/",
          element: <HomePage/>
        },
        {
          path: "/list",
          element: <ListPage/>,
          loader: listPageLoader
        },
        {
          path: "/:id",
          element: <SinglePage/>,
          loader: singlePageLoader,
        },
        {
          path: "/login",
          element: <LoginPage/>,
        },
        {
          path: "/register",
          element: <Register/>,
        },
      ]
    },
    {
      path: "/",
      element: <RequireAuth/>,
      children: [
        {
          path: "/profile",
          element: <ProfilePage/>,
          loader: profilePageLoader
        },
        {
          path: "/profile/update",
          element: <ProfileUpdatePage/>
        },
        {
          path: "/add",
          element: <NewPostPage/>
        },
      ]
    }
  ]);

  return (
    // <div className="layout">
    // <div className="navbar">
    //   <Navbar/>
    // </div>
    // <div className="content">
    //   <HomePage/>
    // </div>
    // </div>
    <RouterProvider router={router}/>
  )
}

export default App
