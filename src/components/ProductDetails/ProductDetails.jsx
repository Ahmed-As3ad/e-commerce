import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  getProductDetails,
  getRelatedProducts,
  selectProductDetails,
  selectRelatedProducts,
  selectProductsLoading,
  selectError,
  addToWishList,
  deleteFromWishList,
  getUserWishList,
  selectWishList
} from '../../lib/productsSlice';
import Loading from '../Loading/Loading';
import { addToCart, getUserCart, selectCartLoading } from '../../lib/cartSlice.js';
import { selectIsLogin } from '../../lib/authSlice';
import toast from 'react-hot-toast';

const ProductDetails = () => {
  const [selectedImage, setSelectedImage] = useState('');
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [loadingStates, setLoadingStates] = useState({
    cart: false,
    wishlist: false,
    relatedCart: {},
    relatedWishlist: {}
  });

  const { id, category } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const product = useSelector(selectProductDetails);
  const relatedProducts = useSelector(selectRelatedProducts);
  const isLoading = useSelector(selectProductsLoading);
  const cartLoading = useSelector(selectCartLoading);
  const error = useSelector(selectError);
  const wishList = useSelector(selectWishList);
  const isLogin = useSelector(selectIsLogin);

  const wishlistIds = useMemo(() => 
    new Set(wishList.map(item => item.id)), 
    [wishList]
  );

  const checkAuth = useCallback(() => {
    if (!isLogin) {
      toast.error('Please login to continue');
      navigate('/login');
      return false;
    }
    return true;
  }, [isLogin, navigate]);

  const handleAddToCart = useCallback(async () => {
    if (!checkAuth()) return;

    setLoadingStates(prev => ({ ...prev, cart: true }));

    try {
      await dispatch(addToCart(product.id)).unwrap();
      toast.success('Item added to Cart 🛒');
      dispatch(getUserCart());
    } catch (error) {
      toast.error('Failed to add item to Cart 🛒');
    } finally {
      setLoadingStates(prev => ({ ...prev, cart: false }));
    }
  }, [dispatch, checkAuth, product?.id]);

  const handleWishlistToggle = useCallback(async () => {
    if (!checkAuth()) return;

    setLoadingStates(prev => ({ ...prev, wishlist: true }));

    try {
      const isInWishlist = wishlistIds.has(product.id);

      if (!isInWishlist) {
        await dispatch(addToWishList(product.id)).unwrap();
        toast.success('Item added to Wish List ❤️');
      } else {
        await dispatch(deleteFromWishList(product.id)).unwrap();
        toast.success('Item removed from Wish List 🗑️');
      }
      dispatch(getUserWishList());
    } catch (error) {
      toast.error('Operation failed');
    } finally {
      setLoadingStates(prev => ({ ...prev, wishlist: false }));
    }
  }, [dispatch, checkAuth, wishlistIds, product?.id]);

  const handleRelatedAddToCart = useCallback(async (itemId) => {
    if (!checkAuth()) return;

    setLoadingStates(prev => ({
      ...prev,
      relatedCart: { ...prev.relatedCart, [itemId]: true }
    }));

    try {
      await dispatch(addToCart(itemId)).unwrap();
      toast.success('Item added to Cart 🛒');
      dispatch(getUserCart());
    } catch (error) {
      toast.error('Failed to add item to Cart 🛒');
    } finally {
      setLoadingStates(prev => ({
        ...prev,
        relatedCart: { ...prev.relatedCart, [itemId]: false }
      }));
    }
  }, [dispatch, checkAuth]);

  const handleRelatedWishlistToggle = useCallback(async (item) => {
    if (!checkAuth()) return;

    setLoadingStates(prev => ({
      ...prev,
      relatedWishlist: { ...prev.relatedWishlist, [item.id]: true }
    }));

    try {
      const isInWishlist = wishlistIds.has(item.id);

      if (!isInWishlist) {
        await dispatch(addToWishList(item.id)).unwrap();
        toast.success('Item added to Wish List ❤️');
      } else {
        await dispatch(deleteFromWishList(item.id)).unwrap();
        toast.success('Item removed from Wish List 🗑️');
      }
      dispatch(getUserWishList());
    } catch (error) {
      toast.error('Operation failed');
    } finally {
      setLoadingStates(prev => ({
        ...prev,
        relatedWishlist: { ...prev.relatedWishlist, [item.id]: false }
      }));
    }
  }, [dispatch, checkAuth, wishlistIds]);

  useEffect(() => {
    if (id) {
      dispatch(getProductDetails(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (category) {
      dispatch(getRelatedProducts(category));
    }
  }, [category, dispatch]);

  useEffect(() => {
    dispatch(getUserWishList());
  }, [dispatch]);

  useEffect(() => {
    if (product) {
      setSelectedImage(product.imageCover);
    }
  }, [product]);

  const handleShareProduct = async () => {
    try {
      const productUrl = `${window?.location?.origin}/productdetails/${product?.id}/${product?.category?.name}`;

      if (navigator?.clipboard && navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(productUrl);
        toast.success('Product link copied to clipboard! 📋');
      }
    } catch {
      toast.error('Failed to share or copy link.');
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-gray-800 mb-4'>Error loading product</h2>
          <p className="text-red-500 mb-4">{error}</p>
          <Link to="/" className='text-indigo-600 hover:text-indigo-800 underline'>
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-gray-800 mb-4'>Product not found</h2>
          <Link to="/" className='text-indigo-600 hover:text-indigo-800 underline'>
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className='container mx-auto px-4 py-8'>
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link to={'/'} className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors duration-200">
                <i className="fa-solid fa-home mr-2"></i>
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <Link to={'/shopping'} className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors duration-200">
                  <svg className="w-3 h-3 text-gray-400 mx-1" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                  </svg>
                  <i className="fa-solid fa-box mr-2"></i>
                  Shopping
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg className="w-3 h-3 text-gray-400 mx-1" fill="none" viewBox="0 0 6 10">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                </svg>
                <span className="text-sm font-medium text-gray-500 truncate max-w-[200px]">{product.title}</span>
              </div>
            </li>
          </ol>
        </nav>


        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16'>
          <div className='space-y-6'>
            <div className='relative group overflow-hidden rounded-2xl shadow-2xl bg-white'>
              <img
                className='w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-105'
                src={selectedImage || product?.imageCover}
                alt={product?.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            {product?.images && product.images.length > 0 && (
              <div className='flex space-x-3 overflow-x-auto pb-2'>
                <div className="relative flex-shrink-0">
                  <img
                    className={`w-24 h-24 object-cover rounded-xl cursor-pointer border-3 transition-all duration-300 hover:scale-105 ${selectedImage === product.imageCover
                      ? 'border-indigo-500 ring-2 ring-indigo-200 shadow-lg'
                      : 'border-gray-200 hover:border-indigo-300'
                      }`}
                    src={product.imageCover}
                    alt={product.title}
                    onClick={() => setSelectedImage(product.imageCover)}
                  />
                </div>

                {product.images.map((img, index) => (
                  <div key={index} className="relative flex-shrink-0">
                    <img
                      className={`w-24 h-24 object-cover rounded-xl cursor-pointer border-3 transition-all duration-300 hover:scale-105 ${selectedImage === img
                        ? 'border-indigo-500 ring-2 ring-indigo-200 shadow-lg'
                        : 'border-gray-200 hover:border-indigo-300'
                        }`}
                      src={img}
                      alt={`${product.title} ${index + 1}`}
                      onClick={() => setSelectedImage(img)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className='space-y-8'>
            <div>
              <h1 className='text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent leading-tight mb-2'>
                {product?.title}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-6 h-6 transition-colors duration-200 ${i < Math.floor(product?.ratingsAverage || 0)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                      }`}
                    fill="currentColor"
                    viewBox="0 0 22 20"
                  >
                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                  </svg>
                ))}
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-semibold text-gray-800">
                  {product?.ratingsAverage}
                </span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-600">
                  {product?.ratingsQuantity} reviews
                </span>
              </div>
            </div>

            <div className='space-y-2'>
              <div className='flex items-center space-x-4'>
                {product?.priceAfterDiscount ? (
                  <>
                    <span className='text-2xl text-gray-400 line-through font-medium'>
                      ${product?.price}
                    </span>
                    <span className='text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent'>
                      ${product?.priceAfterDiscount}
                    </span>
                    <span className='px-3 py-1 bg-red-100 text-red-700 text-sm font-semibold rounded-full'>
                      Save ${(product?.price - product?.priceAfterDiscount).toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className='text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>
                    ${product?.price}
                  </span>
                )}
              </div>
            </div>

            <div className='bg-gray-50 rounded-2xl p-6'>
              <h3 className='text-xl font-bold text-gray-900 mb-4'>Description</h3>
              <p className='text-gray-700 leading-relaxed text-lg'>{product?.description}</p>
            </div>

            <div className='flex flex-wrap gap-4'>
              {product?.category && (
                <div className='flex items-center space-x-3'>
                  <span className='text-gray-600 font-medium'>Category:</span>
                  <span className='px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 font-semibold rounded-full border border-indigo-200'>
                    {product.category.name}
                  </span>
                </div>
              )}
              {product?.brand && (
                <div className='flex items-center space-x-3'>
                  <span className='text-gray-600 font-medium'>Brand:</span>
                  <span className='px-4 py-2 bg-gray-100 text-gray-800 font-semibold rounded-full border border-gray-200'>
                    {product.brand.name}
                  </span>
                </div>
              )}
            </div>

            <div className='space-y-4'>
              <button 
                className={`w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl text-lg flex items-center justify-center ${loadingStates.cart ? 'opacity-75 cursor-not-allowed' : ''}`}
                onClick={handleAddToCart}
                disabled={loadingStates.cart || cartLoading}
                aria-label="Add product to cart"
              >
                {loadingStates.cart || cartLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </>
                ) : (
                  <>
                    <i className="fas fa-cart-plus mr-3"></i>
                    Add to Cart
                  </>
                )}
              </button>

              <div className='grid grid-cols-2 gap-4'>
                <button 
                  className={`flex items-center justify-center space-x-2 py-3 px-6 border-2 font-semibold rounded-xl transition-all duration-300 ${wishlistIds.has(product.id)
                    ? 'border-red-400 text-red-600 bg-red-50'
                    : 'border-gray-300 text-gray-700 hover:border-red-400 hover:text-red-600'
                  } ${loadingStates.wishlist ? 'opacity-75 cursor-not-allowed' : ''}`}
                  onClick={handleWishlistToggle}
                  disabled={loadingStates.wishlist}
                  aria-label={wishlistIds.has(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  {loadingStates.wishlist ? (
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <i className={`fa-${wishlistIds.has(product.id) ? 'solid' : 'regular'} fa-heart w-5 h-5`} />
                  )}
                  <span>{wishlistIds.has(product.id) ? 'Remove' : 'Wishlist'}</span>
                </button>
                <button
                  className='flex items-center justify-center space-x-2 py-3 px-6 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-blue-400 hover:text-blue-600 transition-all duration-300'
                  onClick={handleShareProduct}
                >
                  <i className="fas fa-share-alt"></i>
                  <span>Share</span>
                </button>
              </div>
            </div>

            <div className='bg-white border-2 border-gray-200 rounded-2xl overflow-hidden shadow-lg'>
              <div className='p-6 text-center border-b border-gray-200'>
                <div className='flex flex-col items-center space-y-4'>
                  <div className='w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center'>
                    <i className='fas fa-truck text-2xl text-green-600'></i>
                  </div>
                  <div>
                    <h3 className='text-xl font-bold text-gray-900 mb-2'>Free Delivery</h3>
                    <p className='text-gray-600'>
                      Enter your postal code for Delivery Availability
                    </p>
                    <div className="mt-3 flex space-x-2">
                      <input
                        type="text"
                        placeholder="Postal Code"
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm flex-1"
                      />
                      <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors">
                        Check
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className='p-6 text-center'>
                <div className='flex flex-col items-center space-y-4'>
                  <div className='w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center'>
                    <i className='fa-solid fa-truck-fast text-2xl text-blue-600'></i>
                  </div>
                  <div>
                    <h3 className='text-xl font-bold text-gray-900 mb-2'>Return Delivery</h3>
                    <p className='text-gray-600'>
                      Free 30 Days Delivery Returns.
                      <span className='text-indigo-600 hover:text-indigo-800 cursor-pointer font-medium ml-1'>
                        Details
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
              Related Products
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full"></div>
          </div>

          {relatedProducts && relatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {relatedProducts.map((item) => (
                <div
                  key={item?.id}
                  className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100"
                  onMouseEnter={() => setHoveredProduct(item.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  <div className="relative overflow-hidden rounded-t-3xl">
                    <img
                      src={item?.imageCover}
                      alt={item?.title}
                      className="w-full h-64 object-cover transition-all duration-700 group-hover:scale-110"
                    />

                    <div className={`absolute inset-0 bg-gradient-to-br from-indigo-600/90 via-purple-600/90 to-pink-600/90 flex items-center justify-center space-x-4 transition-all duration-500 ${hoveredProduct === item.id ? 'opacity-100' : 'opacity-0'
                      }`}>
                      <button
                        className="p-3 bg-white hover:bg-gray-50 rounded-2xl transition-all duration-300 transform hover:scale-110 shadow-lg"
                        onClick={() => navigate(`/productdetails/${item.id}/${item.category.name}`)}
                      >
                        <i className="fas fa-eye text-indigo-600" />
                      </button>

                      <button
                        className={`p-3 bg-white hover:bg-gray-50 rounded-2xl transition-all duration-300 transform hover:scale-110 shadow-lg flex items-center justify-center ${loadingStates.relatedWishlist[item.id] ? 'opacity-75 cursor-not-allowed' : ''}`}
                        onClick={() => handleRelatedWishlistToggle(item)}
                        disabled={loadingStates.relatedWishlist[item.id]}
                        aria-label={wishlistIds.has(item.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                      >
                        {loadingStates.relatedWishlist[item.id] ? (
                          <svg className="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <i className={`fa-${wishlistIds.has(item.id) ? 'solid' : 'regular'} fa-heart w-5 h-5 text-rose-500`} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    <span className="inline-block px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 text-xs font-bold rounded-full mb-3 border border-indigo-200">
                      {item?.category?.name}
                    </span>

                    <h3 className="text-lg font-bold text-gray-800 mb-4 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-300">
                      {item?.title}
                    </h3>

                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        ${item?.price}
                      </span>
                      <button 
                        className={`px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 text-sm font-semibold shadow-md flex items-center justify-center min-w-[100px] ${loadingStates.relatedCart[item.id] ? 'opacity-75 cursor-not-allowed' : ''}`}
                        onClick={() => handleRelatedAddToCart(item.id)}
                        disabled={loadingStates.relatedCart[item.id]}
                        aria-label="Add to cart"
                      >
                        {loadingStates.relatedCart[item.id] ? (
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          'Add to Cart'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-gray-100 to-indigo-100 rounded-3xl flex items-center justify-center shadow-lg">
                <i className="fas fa-shopping-cart text-4xl text-gray-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-4">
                No Related Products
              </h3>
              <p className="text-gray-600 max-w-lg mx-auto text-lg">
                We're currently updating our inventory. Check back soon for more amazing products!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;