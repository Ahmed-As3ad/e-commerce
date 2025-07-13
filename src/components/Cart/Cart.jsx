import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUserCart, updateCartItemQuantity, removeFromCart, clearCart, selectCartError, selectCartLoading, selectCartProducts, selectNumOfCartItems, selectTotalCartPrice, strip } from '../../lib/cartSlice'
import Address from '../Address/Address'
import toast from 'react-hot-toast'

const Cart = () => {
  const dispatch = useDispatch()
  const CartProducts = useSelector(selectCartProducts)
  const CartLoading = useSelector(selectCartLoading)
  const CartError = useSelector(selectCartError)
  const NumOfCartItems = useSelector(selectNumOfCartItems)
  const TotalCartPrice = useSelector(selectTotalCartPrice) 
  const [showAddress, setShowAddress] = useState(false) 
  const [selectedAddress, setSelectedAddress] = useState(null)

  const cartId = CartProducts?.cartId;

  useEffect(() => {
    dispatch(getUserCart())
  }, [dispatch])

  const handleAddressSubmit = (address) => {
     setSelectedAddress(address)
  }

  const handleBackToCart = () => {
    setShowAddress(false)
  }

  const handleProceedToCheckout = () => {
    setShowAddress(true) 
  }

  if (showAddress) {
    return (
      <Address
        onAddressSubmit={handleAddressSubmit} 
        onBack={handleBackToCart} 
      />
    )
  }

  if (CartError) {
    return (
      <div className="p-10 text-center">
        <div className="text-red-500 text-lg">Error: {CartError}</div>
        <button
          onClick={() => dispatch(getUserCart())}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    )
  }
  if (!CartProducts?.data?.products || CartProducts.data.products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
            <button className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Shopping Cart</h1>
                <p className="text-gray-600 mt-1">{NumOfCartItems} items in your cart</p>
              </div>
              <button
                onClick={() => { dispatch(clearCart()) }}
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear Cart
              </button>
            </div>
          </div>

          <div className="space-y-4 mb-8">{CartProducts?.data?.products?.map((prod) => (
            <div key={prod.product._id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="flex-shrink-0">
                  <img
                    src={prod?.product?.imageCover}
                    className="w-24 h-24 object-cover rounded-lg"
                    alt={prod?.product?.title}
                  />
                </div>

                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {prod?.product?.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Price per item: ${prod?.price}
                  </p>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">Quantity:</span>
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => dispatch(updateCartItemQuantity({ productId: prod?.product?._id, count: prod?.count - 1 }))}
                        className="p-2 hover:bg-gray-100 transition-colors duration-200"
                        disabled={prod?.count <= 1}
                      >
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <div>
                        <span className="px-4 py-2 text-sm font-medium text-gray-800 min-w-[3rem] text-center">
                          {prod?.count}
                        </span>
                      </div>
                      <button
                        onClick={() => dispatch(updateCartItemQuantity({ productId: prod?.product?._id, count: prod?.count + 1 }))}
                        className="p-2 hover:bg-gray-100 transition-colors duration-200"
                      >
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <div className="text-xl font-bold text-gray-800">
                    ${prod?.price * prod?.count}
                  </div>
                  <button
                    onClick={() => dispatch(removeFromCart(prod?.product?._id))}
                    className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}</div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="border-b border-gray-200 pb-4 mb-4">
              <h2 className="text-xl font-bold text-gray-800 mb-3">Order Summary</h2>
              <div className="flex justify-between text-gray-600 mb-2">
                <span>Items ({NumOfCartItems})</span>
                <span>${TotalCartPrice.toFixed(2)}</span>
              </div>
              {selectedAddress ?
                <>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-2">{selectedAddress.name}</h3>
                      <p className="text-sm text-gray-600 mb-1">📍 {selectedAddress.details}</p>
                      <p className="text-sm text-gray-600 mb-1">🏙️ {selectedAddress.city}</p>
                      <p className="text-sm text-gray-600">📞 {selectedAddress.phone}</p>
                    </div>
                  </div>
                </>
                : null
              }
              <div className="flex justify-between text-gray-600 mb-2">
                <span>Shipping</span>
                <span>Free</span>
              </div>

            </div>            <div className="flex justify-between text-xl font-bold text-gray-800 mb-6">
              <span>Total</span>
              <span>${TotalCartPrice ? TotalCartPrice.toFixed(2) : '0.00'}</span>
            </div>
            <button
              onClick={() => {
                selectedAddress ? dispatch(strip({selectedAddress,cartId})) : handleProceedToCheckout()
              }}
              className="w-full bg-blue-500 text-white py-4 px-6 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              {selectedAddress ? 'PAY NOW' : 'Proceed to Checkout'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Cart