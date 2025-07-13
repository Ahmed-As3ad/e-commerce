import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addToWishList, deleteFromWishList, getAllProducts, getUserWishList, selectError, selectProducts, selectProductsLoading, selectWishList } from "../../lib/productsSlice";
import { ScrollRestoration, useNavigate } from "react-router-dom";
import Loading from "../Loading/Loading";
import toast from "react-hot-toast";
import { addToCart, getUserCart } from "../../lib/cartSlice";

const Shopping = () => {
    const dispatch = useDispatch();

    const products = useSelector(selectProducts);
    const isLoading = useSelector(selectProductsLoading);
    const error = useSelector(selectError);
    const wishList = useSelector(selectWishList);
    const [hoveredProduct, setHoveredProduct] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getAllProducts());
        dispatch(getUserWishList());

    }, [dispatch]);

    if (isLoading) {
        return (
            <Loading />
        )
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

                                        <button className="
                                            p-4 bg-white/90 hover:bg-white rounded-2xl transition-all duration-300 transform hover:scale-110 hover:rotate-12 shadow-lg"
                                            onClick={() => navigate(`/productdetails/${item.id}/${item.category.name}`)}
                                        >
                                            <i className="fa-solid fa-eye w-5 h-5 text-indigo-600" />
                                        </button>

                                        <button className="p-4 bg-white/90 hover:bg-white rounded-2xl transition-all duration-300 transform hover:scale-110 hover:rotate-12 shadow-lg"
                                            onClick={async () => {
                                                try {
                                                    const isInWishlist = wishList.find(wishItem => wishItem.id === item.id);

                                                    if (!isInWishlist) {
                                                        await dispatch(addToWishList(item.id)).unwrap();
                                                        toast.success(`Item added to Wish List❤️`);
                                                    } else {
                                                        await dispatch(deleteFromWishList(item.id)).unwrap();
                                                        toast.success(`Item removed from Wish List🗑️`);
                                                    }
                                                    dispatch(getUserWishList());
                                                } catch (error) {
                                                    toast.error("Operation failed");
                                                }
                                            }}
                                        >
                                            <i className={`fa-${wishList.find(wishItem => wishItem.id === item.id) ? 'solid' : 'regular'} fa-heart w-5 h-5 text-rose-500`} />
                                        </button>
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
                                        <button className="px-6 py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-2xl hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 hover:-rotate-1 text-sm font-semibold shadow-lg hover:shadow-xl"
                                            onClick={() => {
                                                dispatch(addToCart(item.id))
                                                    .unwrap()
                                                    .then(() => {
                                                        dispatch(getUserCart());
                                                        toast.success(`Item added to Cart 🛒`);
                                                    })
                                                    .catch(() => {
                                                        toast.error(`Failed to add item to Cart 🛒`);
                                                    });
                                            }}
                                        >
                                            Add to Cart
                                        </button>
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