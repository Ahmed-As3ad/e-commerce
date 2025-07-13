import React, { useEffect, useMemo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { productsUser, selectCartError, selectCartLoading, selectUserProducts } from '../../lib/cartSlice.js';
import Loading from '../Loading/Loading.jsx';
import toast from 'react-hot-toast';

const AllProducts = () => {
    const dispatch = useDispatch();
    const isLoading = useSelector(selectCartLoading);
    const isError = useSelector(selectCartError);
    const data = useSelector(selectUserProducts);

    const orderStats = useMemo(() => {
        if (!data || !Array.isArray(data)) return { total: 0, delivered: 0, paid: 0, totalValue: 0 };
        
        return {
            total: data.length,
            delivered: data.filter(order => order?.isDelivered).length,
            paid: data.filter(order => order?.isPaid).length,
            totalValue: data.reduce((sum, order) => sum + (order?.totalOrderPrice || 0), 0)
        };
    }, [data]);

    const formatDate = useCallback((dateString) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return 'Invalid Date';
        }
    }, []);

    const formatPrice = useCallback((price) => {
        const numPrice = Number(price);
        return isNaN(numPrice) ? '$0.00' : `$${numPrice.toFixed(2)}`;
    }, []);

    useEffect(() => {
        dispatch(productsUser()).catch((error) => {
            toast.error('Failed to load orders');
            console.error('Failed to load orders:', error);
        });
    }, [dispatch]);

    if (isLoading) {
        return (
          <Loading/>
        )
    }

    if (isError) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
                    <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <i className="fa-solid fa-exclamation-triangle text-2xl text-red-600"></i>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Failed to load orders</h2>
                    <p className="text-gray-600 mb-4">{isError || 'Something went wrong!'}</p>
                    <button 
                        onClick={() => dispatch(productsUser())}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="mx-auto p-6 dark:bg-gradient-to-r dark:from-gray-900 dark:via-slate-900 dark:to-blue-950 min-h-screen">
            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-cyan-400 dark:via-violet-400 dark:to-fuchsia-400 bg-clip-text text-transparent mb-6 tracking-tight">
                    My Orders
                </h2>
                <div className="flex items-center justify-center space-x-3 mb-4">
                    <div className="w-16 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full animate-pulse"></div>
                    <div className="w-4 h-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full animate-bounce"></div>
                    <div className="w-16 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full animate-pulse"></div>
                </div>
                
                {/* Order Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                        <div className="text-2xl font-bold text-indigo-600">{orderStats.total}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Total Orders</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                        <div className="text-2xl font-bold text-green-600">{orderStats.delivered}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Delivered</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                        <div className="text-2xl font-bold text-blue-600">{orderStats.paid}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Paid</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                        <div className="text-2xl font-bold text-purple-600">{formatPrice(orderStats.totalValue)}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Total Value</div>
                    </div>
                </div>
            </div>

            {/* Orders List */}
            <div className="space-y-6 max-w-6xl mx-auto">
                {data && Array.isArray(data) && data.map((order, orderIndex) => {
                    if (!order || typeof order !== 'object') return null;
                    
                    const orderId = order._id || order.id || `order-${orderIndex}`;
                    const orderDate = order.createdAt ? formatDate(order.createdAt) : 'Unknown Date';
                    const totalPrice = formatPrice(order.totalOrderPrice);
                    const cartItems = Array.isArray(order.cartItems) ? order.cartItems : [];
                    
                    return (
                        <div key={orderId} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                            {/* Order Header */}
                            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6 pb-4 border-b border-gray-200 dark:border-gray-600">
                                <div className="mb-4 md:mb-0">
                                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
                                        <i className="fa-solid fa-receipt mr-2 text-indigo-600"></i>
                                        Order #{order.id || orderId.slice(-8)}
                                    </h2>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 flex items-center">
                                        <i className="fa-regular fa-calendar mr-1"></i>
                                        {orderDate}
                                    </p>
                                </div>
                                <div className="text-left md:text-right">
                                    <div className="text-2xl font-bold text-green-600 mb-3 flex items-center md:justify-end">
                                        <i className="fa-solid fa-dollar-sign mr-1"></i>
                                        {totalPrice}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${
                                            order.isPaid 
                                                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                                                : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                                        }`}>
                                            <i className={`fa-solid ${order.isPaid ? 'fa-check-circle' : 'fa-times-circle'} mr-1`}></i>
                                            {order.isPaid ? 'Paid' : 'Unpaid'}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${
                                            order.isDelivered 
                                                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                                                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                                        }`}>
                                            <i className={`fa-solid ${order.isDelivered ? 'fa-truck' : 'fa-clock'} mr-1`}></i>
                                            {order.isDelivered ? 'Delivered' : 'Processing'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center">
                                    <i className="fa-solid fa-shopping-cart mr-2 text-purple-600"></i>
                                    Items ({cartItems.length})
                                </h3>
                                <div className="grid gap-3">
                                    {cartItems.map((product, productIndex) => {
                                        if (!product || !product.product) return null;
                                        
                                        const productId = product._id || `product-${productIndex}`;
                                        const productTitle = product.product.title || 'Unknown Product';
                                        const productImage = product.product.imageCover || '/placeholder-image.jpg';
                                        const productPrice = formatPrice(product.price || 0);
                                        const productCount = product.count || 0;
                                        const totalProductPrice = formatPrice((product.price || 0) * productCount);
                                        
                                        return (
                                            <div key={productId} className="flex items-center bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200">
                                                <div className="flex-shrink-0">
                                                    <img
                                                        className="w-16 h-16 object-cover rounded-md border border-gray-200 dark:border-gray-600"
                                                        src={productImage}
                                                        alt={productTitle}
                                                        onError={(e) => {
                                                            e.target.src = '/placeholder-image.jpg';
                                                        }}
                                                    />
                                                </div>
                                                <div className="ml-4 flex-1">
                                                    <h4 className="font-medium text-gray-800 dark:text-white text-sm line-clamp-2">
                                                        {productTitle}
                                                    </h4>
                                                    <div className="flex justify-between items-center mt-2">
                                                        <span className="text-gray-500 dark:text-gray-400 text-sm flex items-center">
                                                            <i className="fa-solid fa-tag mr-1"></i>
                                                            {productPrice} × {productCount}
                                                        </span>
                                                        <span className="font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                                                            <i className="fa-solid fa-equals mr-1"></i>
                                                            {totalProductPrice}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Shipping Details */}
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 rounded-lg p-4">
                                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                                    <i className="fa-solid fa-truck mr-2 text-blue-600"></i>
                                    Shipping & Payment Details
                                </h4>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {/* Shipping Address */}
                                    <div className="space-y-2">
                                        <h5 className="font-semibold text-gray-800 dark:text-white text-sm flex items-center">
                                            <i className="fa-solid fa-map-marker-alt mr-1 text-red-500"></i>
                                            Shipping Address
                                        </h5>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                                            <i className="fa-solid fa-home mr-2 text-gray-400"></i>
                                            {order.shippingAddress?.details || 'Not provided'}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                                            <i className="fa-solid fa-city mr-2 text-gray-400"></i>
                                            {order.shippingAddress?.city || 'Not provided'}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                                            <i className="fa-solid fa-phone mr-2 text-gray-400"></i>
                                            {order.shippingAddress?.phone || 'Not provided'}
                                        </p>
                                    </div>
                                    
                                    {/* Order Status */}
                                    <div className="space-y-2">
                                        <h5 className="font-semibold text-gray-800 dark:text-white text-sm flex items-center">
                                            <i className="fa-solid fa-info-circle mr-1 text-blue-500"></i>
                                            Order Status
                                        </h5>
                                        <p className={`text-sm flex items-center ${order.isDelivered ? 'text-green-600' : 'text-yellow-600'}`}>
                                            <i className={`fa-solid ${order.isDelivered ? 'fa-check-circle' : 'fa-clock'} mr-2`}></i>
                                            {order.isDelivered ? 'Delivered' : 'Processing'}
                                        </p>
                                        <p className={`text-sm flex items-center ${order.isPaid ? 'text-green-600' : 'text-red-600'}`}>
                                            <i className={`fa-solid ${order.isPaid ? 'fa-credit-card' : 'fa-times-circle'} mr-2`}></i>
                                            {order.isPaid ? 'Payment Completed' : 'Payment Pending'}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                                            <i className={`fa-solid ${order.paymentMethodType === 'card' ? 'fa-credit-card' : 'fa-money-bill'} mr-2 text-gray-400`}></i>
                                            {order.paymentMethodType === 'card' ? 'Card Payment' : 'Cash Payment'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Empty State */}
            {(!data || !Array.isArray(data) || data.length === 0) && !isLoading && (
                <div className="text-center py-16 max-w-md mx-auto">
                    <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                        <i className="fa-solid fa-shopping-bag text-4xl text-gray-400"></i>
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-3">No orders yet</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                        Your order history will appear here when you make your first purchase. 
                        Start shopping to see your orders!
                    </p>
                    <button 
                        onClick={() => window.location.href = '/shopping'}
                        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center mx-auto"
                    >
                        <i className="fa-solid fa-shopping-cart mr-2"></i>
                        Start Shopping
                    </button>
                </div>
            )}
        </div>
    )
}

export default AllProducts