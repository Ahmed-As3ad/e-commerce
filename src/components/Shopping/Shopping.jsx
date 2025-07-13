import { useEffect, useState, useMemo, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addToWishList, deleteFromWishList, getAllProducts, getUserWishList, selectError, selectProducts, selectProductsLoading, selectWishList } from "../../lib/productsSlice";
import { ScrollRestoration, useNavigate } from "react-router-dom";
import Loading from "../Loading/Loading";
import toast from "react-hot-toast";
import { addToCart, getUserCart, selectCartLoading } from "../../lib/cartSlice";
import { selectIsLogin } from "../../lib/authSlice";

const Shopping = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Redux selectors
    const products = useSelector(selectProducts);
    const isLoading = useSelector(selectProductsLoading);
    const cartLoading = useSelector(selectCartLoading);
    const error = useSelector(selectError);
    const wishList = useSelector(selectWishList);
    const isLogin = useSelector(selectIsLogin);

    // Local state
    const [hoveredProduct, setHoveredProduct] = useState(null);
    const [loadingStates, setLoadingStates] = useState({
        cart: {},
        wishlist: {}
    });

    // Memoized values
    const wishlistIds = useMemo(() => 
        new Set(wishList.map(item => item.id)), 
        [wishList]
    );

    // Authentication check helper
    const checkAuth = useCallback(() => {
        if (!isLogin) {
            toast.error('Please login to continue');
            navigate('/login');
            return false;
        }
        return true;
    }, [isLogin, navigate]);

    // Optimized handlers
    const handleAddToCart = useCallback(async (itemId) => {
        if (!checkAuth()) return;

        setLoadingStates(prev => ({
            ...prev,
            cart: { ...prev.cart, [itemId]: true }
        }));

        try {
            await dispatch(addToCart(itemId)).unwrap();
            toast.success('Item added to Cart 🛒');
            // Only refresh cart, not full reload
            dispatch(getUserCart());
        } catch (error) {
            toast.error('Failed to add item to Cart 🛒');
        } finally {
            setLoadingStates(prev => ({
                ...prev,
                cart: { ...prev.cart, [itemId]: false }
            }));
        }
    }, [dispatch, checkAuth]);

    const handleWishlistToggle = useCallback(async (item) => {
        if (!checkAuth()) return;

        setLoadingStates(prev => ({
            ...prev,
            wishlist: { ...prev.wishlist, [item.id]: true }
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
            // Only refresh wishlist when needed
            dispatch(getUserWishList());
        } catch (error) {
            toast.error('Operation failed');
        } finally {
            setLoadingStates(prev => ({
                ...prev,
                wishlist: { ...prev.wishlist, [item.id]: false }
            }));
        }
    }, [dispatch, checkAuth, wishlistIds]);

    useEffect(() => {
        dispatch(getAllProducts());
        if (isLogin) {
            dispatch(getUserWishList());
        }
    }, [dispatch, isLogin]);

    // Reusable button styles
    const buttonStyles = {
        action: "p-4 bg-white/90 hover:bg-white rounded-2xl transition-all duration-300 transform hover:scale-110 hover:rotate-12 shadow-lg",
        primary: "px-6 py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-2xl hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 hover:-rotate-1 text-sm font-semibold shadow-lg hover:shadow-xl"
    };

    // Action Button Component
    const ActionButton = ({ onClick, ariaLabel, icon, isLoading = false, disabled = false, isWishlist = false, inWishlist = false }) => (
        <button 
            className={`${buttonStyles.action} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={onClick}
            aria-label={ariaLabel}
            disabled={disabled || isLoading}
        >
            {isLoading ? (
                <i className="fa-solid fa-spinner fa-spin w-5 h-5 text-indigo-600" />
            ) : (
                <i className={`fa-${isWishlist && inWishlist ? 'solid' : isWishlist ? 'regular' : 'solid'} ${icon} w-5 h-5 ${isWishlist ? 'text-rose-500' : 'text-indigo-600'}`} />
            )}
        </button>
    );

    if (isLoading) {
        return <Loading />
    }

    if (error) {
        return (
            <div className="text-center py-24">
                <div className="w-40 h-40 mx-auto mb-8 bg-gradient-to-br from-red-50 via-red-100 to-orange-100 dark:from-red-900/30 dark:via-red-900/20 dark:to-orange-900/20 rounded-3xl flex items-center justify-center border border-red-200/50 dark:border-red-700/50 shadow-xl">
                    <i className="fa-solid fa-triangle-exclamation w-20 h-20 text-red-500 dark:text-red-400" />
                </div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-400 bg-clip-text text-transparent mb-6">
                    Error Loading Products
                </h3>
                <p className="text-slate-600 dark:text-slate-400 max-w-lg mx-auto text-lg leading-relaxed mb-6">
                    {error}
                </p>
                <button
                    onClick={() => dispatch(getAllProducts())}
                    className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300"
                >
                    Try Again
                </button>
            </div>
        );
    }
    return (
        <>
            <div className="mx-auto px-4 py-10 bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-slate-900 dark:to-blue-950">
                <div className="text-center mb-20">
                    <div className="inline-block">
                        <h2 className="text-6xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-cyan-400 dark:via-violet-400 dark:to-fuchsia-400 bg-clip-text text-transparent mb-8 tracking-tight">
                            Browse All Products
                        </h2>
                        <div className="flex items-center justify-center space-x-3">
                            <div className="w-16 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full animate-pulse"></div>
                            <div className="w-4 h-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full animate-bounce"></div>
                            <div className="w-16 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-xl mt-8 max-w-3xl mx-auto font-medium leading-relaxed">
                        Discover our curated collection of premium products designed to enhance your lifestyle with cutting-edge innovation
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                    {products.map((item) => (
                        <div
                            key={item?.id}
                            className="group relative bg-white/80 dark:bg-slate-800/90 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-3 hover:rotate-1  border border-slate-200/50 dark:border-slate-700/50"
                            onMouseEnter={() => setHoveredProduct(item.id)}
                            onMouseLeave={() => setHoveredProduct(null)}
                        >
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl opacity-0 group-hover:opacity-75 transition-opacity duration-700 blur-sm"></div>

                            <div className="relative bg-white dark:bg-slate-800 rounded-3xl">
                                <div className="relative overflow-hidden rounded-t-3xl">
                                    <img
                                        src={item?.imageCover}
                                        alt={item?.title}
                                        loading="lazy"
                                        className="w-full h-64 object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                                    <div className={`absolute inset-0 bg-gradient-to-br from-indigo-600/80 via-purple-600/80 to-pink-600/80 flex items-center justify-center space-x-4 transition-all duration-500 ${hoveredProduct === item.id ? 'opacity-100 backdrop-blur-sm' : 'opacity-0'
                                        }`}>

                                        <ActionButton
                                            onClick={() => navigate(`/productdetails/${item.id}/${item.category.name}`)}
                                            ariaLabel={`View details for ${item.title}`}
                                            icon="fa-eye"
                                        />

                                        <ActionButton
                                            onClick={() => handleWishlistToggle(item)}
                                            ariaLabel={`${wishlistIds.has(item.id) ? 'Remove from' : 'Add to'} wishlist`}
                                            icon="fa-heart"
                                            isLoading={loadingStates.wishlist[item.id]}
                                            isWishlist={true}
                                            inWishlist={wishlistIds.has(item.id)}
                                        />
                                    </div>
                                </div>

                                <div className="p-8">
                                    <span className="inline-block px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 text-indigo-700 dark:text-indigo-300 text-sm font-semibold rounded-2xl mb-4 border border-indigo-200/50 dark:border-indigo-700/50">
                                        {item?.category?.name}
                                    </span>
                                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-500 leading-tight">
                                        {item?.title}
                                    </h3>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                                ${item?.price}
                                            </span>
                                        </div>
                                        {!isLogin ? (
                                            <button 
                                                className="px-6 py-3 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-2xl hover:from-gray-500 hover:to-gray-600 transition-all duration-300 text-sm font-semibold shadow-lg"
                                                onClick={() => {
                                                    toast.error('Please login to add items to cart');
                                                    navigate('/login');
                                                }}
                                                aria-label="Login required to add to cart"
                                            >
                                                Login to Buy
                                            </button>
                                        ) : (
                                            <button 
                                                className={`${buttonStyles.primary} ${loadingStates.cart[item.id] ? 'opacity-75' : ''}`}
                                                onClick={() => handleAddToCart(item.id)}
                                                disabled={loadingStates.cart[item.id]}
                                                aria-label={`Add ${item.title} to cart`}
                                            >
                                                {loadingStates.cart[item.id] ? (
                                                    <>
                                                        <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                                                        Adding...
                                                    </>
                                                ) : (
                                                    'Add to Cart'
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <ScrollRestoration />
        </>
    )
}

export default Shopping