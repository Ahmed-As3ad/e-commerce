import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { productsUser, selectCartError, selectCartLoading, selectUserProducts } from '../../lib/cartSlice.js';
import Loading from '../Loading/Loading.jsx';

const AllProducts = () => {
    const dispatch = useDispatch();
    const isLoading = useSelector(selectCartLoading);
    const isError = useSelector(selectCartError)
    const data = useSelector(selectUserProducts)

    useEffect(() => {
        dispatch(productsUser())
    }, [dispatch])

    if (isLoading) {
        return (
          <Loading/>
        )
    }

    if (isError) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <div className="text-4xl mb-4">❌</div>
                    <div className="text-red-500 text-lg">Something went wrong!</div>
                </div>
            </div>
        )
    }

    return (
        <div className=" mx-auto p-6 dark:bg-gradient-to-r dark:from-gray-900 dark:via-slate-900 dark:to-blue-950 min-h-screen">
            <div className="text-center mb-6">
                <h2 className="text-6xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-cyan-400 dark:via-violet-400 dark:to-fuchsia-400 bg-clip-text text-transparent mb-8 tracking-tight">
                            Browse All Orders
                        </h2>
                        <div className="flex items-center justify-center space-x-3">
                            <div className="w-16 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full animate-pulse"></div>
                            <div className="w-4 h-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full animate-bounce"></div>
                            <div className="w-16 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full animate-pulse"></div>
                        </div>
                <p className="text-gray-600 dark:text-gray-300 mt-2">{data?.length || 0} orders found</p>
            </div>

            <div className="space-y-6 ">
                {data?.map((order, orderIndex) => (
                    <div key={order._id || orderIndex} className="bg-white max-w-6xl m-auto mb-4 rounded-lg shadow-md p-6 border">

                        <div className="flex justify-between items-start mb-4 pb-4 border-b">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">Order #{order.id}</h2>
                                <p className="text-gray-500 text-sm mt-1">
                                    {new Date(order.createdAt).toLocaleDateString()}📅
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-green-600 mb-2">
                                    ${order.totalOrderPrice}
                                </div>
                                <div className="flex gap-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {order.isPaid ? 'Paid' : 'Unpaid'}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.isDelivered ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {order.isDelivered ? 'Delivered' : 'Processing'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <h3 className="text-lg font-medium text-gray-700 mb-3">Items ({order.cartItems?.length})</h3>
                            <div className="space-y-3">
                                {order.cartItems?.map((product, productIndex) => (
                                    <div key={product._id || productIndex} className="flex items-center bg-gray-50 rounded-lg p-3">
                                        <img
                                            className="w-16 h-16 object-cover rounded-md"
                                            src={product?.product?.imageCover}
                                            alt={product?.product?.title}
                                        />
                                        <div className="ml-4 flex-1">
                                            <h4 className="font-medium text-gray-800 text-sm">
                                                {product?.product?.title}
                                            </h4>
                                            <div className="flex justify-between items-center mt-1">
                                                <span className="text-gray-500 text-sm">
                                                    ${product?.price} × {product?.count}
                                                </span>
                                                <span className="font-semibold text-gray-700">
                                                    ${(product?.count * product?.price).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-medium text-gray-700">Shipping Details</h4>
                            <div className="flex justify-between items-start">
                                <div className="bg-green-50 border border-green-200 p-3 rounded-lg mt-3">
                                    <h6 className="font-semibold text-green-800 mb-2 underline">📋 Order Status</h6>
                                    <p className="text-sm text-gray-600 mb-1">📍 {order?.shippingAddress?.details}</p>
                                    <p className="text-sm text-gray-600 mb-1">🏙️ {order?.shippingAddress?.city}</p>
                                    <p className="text-sm text-gray-600 mb-1">📞 {order?.shippingAddress?.phone}</p>
                                    <p className="text-green-700">
                                        {order?.isDelivered ? '✅ Delivered' : '⏳ Not Arrived Yet'}
                                    </p>
                                    <p className="text-green-700">
                                        {order?.isPaid ? '💰 Paid' : '❌ Not Paid'}
                                    </p>
                                    <p className="text-green-700">
                                        {order?.paymentMethodType === 'card' ? '💳 Card Payment' : '💵 Cash Payment'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {(!data || data.length === 0) && !isLoading && (
                <div className="text-center py-12 dark:bg-gradient-to-r dark:from-gray-900 dark:via-slate-900 dark:to-blue-950">
                    <div className="text-6xl mb-4">📦</div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2 dark:text-gray-300">No orders yet</h3>
                    <p className="text-gray-500 dark:text-gray-300">Your orders will appear here when you make a purchase.</p>
                </div>
            )}
        </div>
    )
}

export default AllProducts