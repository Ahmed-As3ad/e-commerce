
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Home from "./components/Home/Home";
import ProductDetails from "./components/ProductDetails/ProductDetails";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import WishList from "./components/WishList/WishList";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setLogin, setLogout } from "./lib/authSlice";
import Shopping from "./components/Shopping/Shopping";
import Cart from "./components/Cart/Cart";
import AllProducts from "./components/AllProducts/AllProducts.jsx";
import Profile from "./components/Profile/Profile.jsx";

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token) {
      dispatch(setLogin());
    } else {
      dispatch(setLogout());
    }
  }, [dispatch]);

  const router = createBrowserRouter([
    {
      path: '/', element: <Layout />, children: [
        { index: true, element: <ProtectedRoute><Home /></ProtectedRoute> },
        { path: 'shopping', element: <ProtectedRoute><Shopping /></ProtectedRoute> },
        { path: 'productdetails/:id/:category', element: <ProtectedRoute><ProductDetails /></ProtectedRoute> },
        { path: 'wishlist', element: <ProtectedRoute><WishList /></ProtectedRoute> },
        { path: 'cart', element: <ProtectedRoute><Cart /></ProtectedRoute> },
        { path: 'allorders', element: <ProtectedRoute><AllProducts /></ProtectedRoute> },
        { path: 'register', element: <Register /> },
        { path: 'login', element: <Login /> },
        { path: 'profile', element: <ProtectedRoute><Profile /> </ProtectedRoute>},
      ]
    }
  ])

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;