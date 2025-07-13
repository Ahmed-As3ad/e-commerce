import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ 
  item, 
  isInWishlist, 
  onWishlistToggle, 
  onAddToCart, 
  wishlistLoading = false, 
  cartLoading = false,
  className = "",
  showQuickActions = true
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className={`group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-t-3xl">
        <img
          src={item?.imageCover}
          alt={item?.title}
          className="w-full h-64 object-cover transition-all duration-700 group-hover:scale-110"
          loading="lazy"
        />

        {showQuickActions && (
          <div className={`absolute inset-0 bg-gradient-to-br from-indigo-600/90 via-purple-600/90 to-pink-600/90 flex items-center justify-center space-x-4 transition-all duration-500 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <button
              className="p-3 bg-white hover:bg-gray-50 rounded-2xl transition-all duration-300 transform hover:scale-110 shadow-lg"
              onClick={() => navigate(`/productdetails/${item.id}/${item.category.name}`)}
              aria-label="View product details"
            >
              <i className="fas fa-eye text-indigo-600" />
            </button>

            <button
              className={`p-3 bg-white hover:bg-gray-50 rounded-2xl transition-all duration-300 transform hover:scale-110 shadow-lg flex items-center justify-center ${
                wishlistLoading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
              onClick={() => onWishlistToggle(item)}
              disabled={wishlistLoading}
              aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              {wishlistLoading ? (
                <svg className="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <i className={`fa-${isInWishlist ? 'solid' : 'regular'} fa-heart w-5 h-5 text-rose-500`} />
              )}
            </button>
          </div>
        )}
      </div>

      <div className="p-6">
        <span className="inline-block px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 text-xs font-bold rounded-full mb-3 border border-indigo-200">
          {item?.category?.name}
        </span>

        <h3 className="text-lg font-bold text-gray-800 mb-4 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-300">
          {item?.title}
        </h3>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            {item?.priceAfterDiscount ? (
              <>
                <span className="text-sm text-gray-400 line-through">
                  ${item?.price}
                </span>
                <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  ${item?.priceAfterDiscount}
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                ${item?.price}
              </span>
            )}
          </div>
          
          <button
            className={`px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 text-sm font-semibold shadow-md flex items-center justify-center min-w-[100px] ${
              cartLoading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
            onClick={() => onAddToCart(item.id)}
            disabled={cartLoading}
            aria-label="Add to cart"
          >
            {cartLoading ? (
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
  );
};

export default ProductCard;
