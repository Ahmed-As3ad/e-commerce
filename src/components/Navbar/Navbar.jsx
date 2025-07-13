import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import './Navbar.module.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { setLogout } from '../../lib/authSlice';
import { getUserCart, selectNumOfCartItems } from '../../lib/cartSlice';
import { jwtDecode } from 'jwt-decode';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLogin } = useSelector(store => store.auth)
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState(null)
  const token = localStorage.getItem('userToken')

  useEffect(() => {
    if (token) {
      try {
        const jwt = jwtDecode(token);
        setName(jwt.name);
      } catch (error) {
        console.error('Error decoding token:', error);
        setName(null);
      }
    } else {
      setName(null);
    }
  }, [token]);

  const numOfCart = useSelector(selectNumOfCartItems)

  useEffect(() => {
    dispatch(getUserCart());
  }, [dispatch])


  const profileControl = [
    { name: 'Profile', icon: 'fa-user', link: '/profile' },
    { name: 'My Orders', icon: 'fa-shopping-bag', link: '/allorders' },
  ]
  const handleLogout = () => {
    localStorage.removeItem('userToken');
    dispatch(setLogout())
    navigate('/login');
    toast.success('Logout Successful, See you soon.')
  };
  
  return (
    <nav className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 backdrop-blur-lg border-b border-purple-500/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <i className="fa-solid fa-shop text-2xl text-purple-400 group-hover:text-purple-300 transition-all duration-300 group-hover:scale-110"></i>
              <div className="absolute inset-0 bg-purple-400 rounded-full blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent group-hover:from-purple-200 group-hover:to-pink-200 transition-all duration-300">
              Markit
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `relative text-gray-300 hover:text-white transition-colors duration-300 group ${isActive ? 'text-white' : ''
                }`
              }
            >
              <i className="fa-solid fa-home mr-2"></i>
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 group-hover:w-full transition-all duration-300"></span>
            </NavLink>

            <NavLink
              to="/shopping"
              className={({ isActive }) =>
                `relative text-gray-300 hover:text-white transition-colors duration-300 group ${isActive ? 'text-white' : ''
                }`
              }
            >
              <i className="fa-solid fa-box mr-2"></i>
              Shopping
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 group-hover:w-full transition-all duration-300"></span>
            </NavLink>

            <NavLink
              to="/wishlist"
              className={({ isActive }) =>
                `relative text-gray-300 hover:text-white transition-colors duration-300 group ${isActive ? 'text-white' : ''
                }`
              }
            >
              <i className="fa-solid fa-heart mr-2"></i>
              Wishlist
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 group-hover:w-full transition-all duration-300"></span>
            </NavLink>

          </div>

          {/* Search and Auth */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative group">
              <i className="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-400 transition-colors duration-300"></i>
              <input
                type="text"
                id="search-navbar"
                placeholder="Search products..."
                className="w-64 pl-10 pr-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 hover:bg-white/20"
              />
            </div>

            {/* Auth Buttons */}
            {!isLogin ? (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="flex items-center space-x-2 px-4 py-2 text-purple-300 hover:text-white border border-purple-400/30 rounded-full hover:bg-purple-500/20 transition-all duration-300 hover:border-purple-400"
                >
                  <i className="fa-solid fa-sign-in-alt"></i>
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
                >
                  <i className="fa-solid fa-user-plus"></i>
                  <span>Register</span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center space-x-2 px-3 py-2 bg-white/10 rounded-full hover:bg-white/20 transition-all duration-300 group"
                  >
                    <i className="fa-solid fa-user text-purple-300 group-hover:text-purple-200"></i>
                    <span className="text-gray-300 text-sm group-hover:text-white">{name || 'Welcome!'}</span>
                    <i className={`fa-solid fa-chevron-down text-xs text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}></i>
                  </button>

                  {isOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
                      <div className="py-2">
                        {profileControl.map((item, index) => (
                          <Link
                            key={index}
                            to={item.link}
                            className="flex items-center space-x-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                            onClick={() => setIsOpen(false)}
                          >
                            <i className={`fa-solid ${item.icon} text-purple-500`}></i>
                            <span>{item.name}</span>
                          </Link>
                        ))}
                        <hr className="my-2 border-gray-200 dark:border-gray-600" />
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsOpen(false);
                          }}
                          className="flex items-center space-x-3 px-4 py-2 w-full text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                        >
                          <i className="fa-solid fa-sign-out-alt"></i>
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                {
                  <Link
                    to="/cart"
                    className="relative group flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/40 hover:to-pink-500/40 transition-all duration-300 transform hover:scale-110 hover:rotate-3"
                  >
                    <i className="fa-solid fa-cart-shopping text-xl text-white group-hover:text-purple-200 transition-colors duration-300"></i>

                    {/* Cart badge */}
                    {numOfCart > 0 && (
                      <div className="absolute -top-2 -right-2 flex items-center justify-center">
                        <span className="relative z-10 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 animate-pulse">
                          {numOfCart > 99 ? '99+' : numOfCart}
                        </span>
                        <span className="absolute inset-0 bg-red-500 rounded-full blur-sm opacity-60 animate-ping"></span>
                      </div>
                    )}
                  </Link>
                }
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300"
          >
            <i className={`fa-solid ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="py-4 space-y-4 border-t border-white/10">
            {/* Mobile Search */}
            <div className="relative group">
              <i className="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            {/* Mobile Navigation */}
            <div className="space-y-2">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors duration-300 ${isActive
                    ? 'text-white bg-purple-500/20'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fa-solid fa-home"></i>
                <span>Home</span>
              </NavLink>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors duration-300 ${isActive
                    ? 'text-white bg-purple-500/20'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fa-solid fa-info-circle"></i>
                <span>About</span>
              </NavLink>
              <NavLink
                to="/products"
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors duration-300 ${isActive
                    ? 'text-white bg-purple-500/20'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fa-solid fa-box"></i>
                <span>Products</span>
              </NavLink>
            </div>

            {/* Mobile Auth */}
            {!isLogin ? (
              <div className="flex flex-col space-y-2 pt-4 border-t border-white/10">
                <Link
                  to="/login"
                  className="flex items-center space-x-3 px-4 py-2 text-purple-300 hover:text-white border border-purple-400/30 rounded-lg hover:bg-purple-500/20 transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className="fa-solid fa-sign-in-alt"></i>
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className="fa-solid fa-user-plus"></i>
                  <span>Register</span>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col space-y-2 pt-4 border-t border-white/10">
                <div className="flex items-center space-x-3 px-4 py-2 bg-white/10 rounded-lg">
                  <i className="fa-solid fa-user text-purple-300"></i>
                  <span className="text-gray-300">{name || 'Welcome!'}</span>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 px-4 py-2 text-red-300 hover:text-white border border-red-400/30 rounded-lg hover:bg-red-500/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                >
                  <i className="fa-solid fa-sign-out-alt"></i>
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;