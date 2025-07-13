import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserWishList, deleteFromWishList, selectWishList, selectProductsLoading, selectError } from '../../lib/productsSlice';
import { Link, useNavigate } from 'react-router-dom';
import Loading from "../Loading/Loading";
import toast from "react-hot-toast";

const WishList = () => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [removingItemId, setRemovingItemId] = useState(null);
  const dispatch = useDispatch();
  const wishListItems = useSelector(selectWishList);
  const isLoading = useSelector(selectProductsLoading);
  const error = useSelector(selectError);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getUserWishList());
  }, [dispatch]);

  const handleRemoveFromWishlist = async (productId) => {
    try {
      setRemovingItemId(productId);
      await dispatch(deleteFromWishList(productId)).unwrap();
      toast.success(`removed from wishlist`);
      dispatch(getUserWishList());
    } catch (error) {
      toast.error(`Failed to remove item: ${error.message}`);
    } finally {
      setRemovingItemId(null);
    }
  }; if (isLoading && !wishListItems.length) {
    return <Loading />;
  } if (error) {
    return (
      <div className="text-center py-24">
        <div className="w-40 h-40 mx-auto mb-8 bg-gradient-to-br from-red-50 via-red-100 to-orange-100 dark:from-red-900/30 dark:via-red-900/20 dark:to-orange-900/20 rounded-3xl flex items-center justify-center border border-red-200/50 dark:border-red-700/50 shadow-xl">
          <i className="fa-solid fa-triangle-exclamation w-20 h-20 text-red-500 dark:text-red-400" />
        </div>
        <h3 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-400 bg-clip-text text-transparent mb-6">
          Error Loading Wishlist
        </h3>
        <p className="text-slate-600 dark:text-slate-400 max-w-lg mx-auto text-lg leading-relaxed mb-6">
          {error}
        </p>
        <button
          onClick={() => dispatch(getUserWishList())}
          className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300"
        >
          Try Again
        </button>
      </div>
    );
  } if (!wishListItems || wishListItems.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="w-40 h-40 mx-auto mb-8 bg-gradient-to-br from-purple-50 via-pink-100 to-indigo-100 dark:from-purple-900/30 dark:via-pink-900/20 dark:to-indigo-900/20 rounded-3xl flex items-center justify-center border border-purple-200/50 dark:border-purple-700/50 shadow-xl">
          <i className="fa-solid fa-heart w-20 h-20 text-pink-500 dark:text-pink-400" />
        </div>
        <h3 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-6">
          Your Wishlist is Empty
        </h3>
        <p className="text-slate-600 dark:text-slate-400 max-w-lg mx-auto text-lg leading-relaxed mb-6">
          Add your favorite items to wishlist to save them for later
        </p>
        <Link to="/shopping">
          <button className="group relative px-10 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-2xl hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-500 transform hover:scale-105 hover:-rotate-1 font-bold text-lg shadow-2xl hover:shadow-indigo-500/25">
            <span className="relative z-10">Browse Products</span>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
          </button>
        </Link>
      </div>
    );
  } return (
    <div className="mx-auto px-4 py-10 bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-slate-900 dark:to-blue-950">
      <div className="text-center mb-20">
        <div className="inline-block">
          <h2 className="text-6xl h-20 font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-cyan-400 dark:via-violet-400 dark:to-fuchsia-400 bg-clip-text text-transparent mb-5 tracking-tight">
            My Wishlist
          </h2>
          <div className="flex items-center justify-center space-x-3">
            <div className="w-16 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full animate-pulse"></div>
            <div className="w-4 h-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full animate-bounce"></div>
            <div className="w-16 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full animate-pulse"></div>
          </div>
        </div>
        <p className="text-slate-600 dark:text-slate-300 text-xl mt-8 max-w-3xl mx-auto font-medium leading-relaxed">
          {wishListItems.length} items you've saved to revisit later
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {wishListItems.map((item) => (<div key={item._id} className="h-full">
          <div
            className="group relative bg-white/80 dark:bg-slate-800/90 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-3 hover:rotate-1  border border-slate-200/50 dark:border-slate-700/50 max-h-2/4 hover:max-h-screen"
            onMouseEnter={() => setHoveredItem(item._id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl opacity-0 group-hover:opacity-75 transition-opacity duration-700 blur-sm"></div>

            <div className="relative bg-white dark:bg-slate-800 rounded-3xl">
              <div className="relative overflow-hidden rounded-t-3xl">
                <img
                  src={item.imageCover || 'https://via.placeholder.com/300'}
                  alt={item.title}
                  loading='lazy'
                  className="w-full h-64 object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>

                {item.priceAfterDiscount && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold py-1 px-2 rounded-lg">
                    Save {Math.round(((item.price - item.priceAfterDiscount) / item.price) * 100)}%
                  </div>
                )}

                <div className={`absolute inset-0 bg-gradient-to-br from-indigo-600/80 via-purple-600/80 to-pink-600/80 flex items-center justify-center space-x-4 transition-all duration-500 ${hoveredItem === item._id ? 'opacity-100 backdrop-blur-sm' : 'opacity-0'
                  }`}>
                  <button className="p-4 bg-white/90 hover:bg-white rounded-2xl transition-all duration-300 transform hover:scale-110 hover:rotate-12 shadow-lg"
                    onClick={() => navigate(`/productdetails/${item._id}/${item.category.name}`)}
                  >
                    <i className="fa-solid fa-eye w-5 h-5 text-indigo-600" />
                  </button>
                  <button
                    className="p-4 bg-white/90 hover:bg-white rounded-2xl transition-all duration-300 transform hover:scale-110 hover:rotate-12 shadow-lg"
                    onClick={() => handleRemoveFromWishlist(item._id)}
                    disabled={removingItemId === item._id}
                  >
                    {removingItemId === item._id ? (
                      <div className="w-5 h-5 border-t-2 border-rose-500 rounded-full animate-spin"></div>
                    ) : (
                      <i className="fa-solid fa-trash w-5 h-5 text-rose-500" />
                    )}
                  </button>

                </div>
              </div>

              <div className="p-8">
                <span className="inline-block px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 text-indigo-700 dark:text-indigo-300 text-sm font-semibold rounded-2xl mb-4 border border-indigo-200/50 dark:border-indigo-700/50">
                  {item.category?.name}
                </span>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-500 leading-tight">
                  {item.title}
                </h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      ${item.price}
                    </span>
                  </div>
                  <button className="px-6 py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-2xl hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 hover:-rotate-1 text-sm font-semibold shadow-lg hover:shadow-xl">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>))}
      </div>
    </div>
  );
};

export default WishList;