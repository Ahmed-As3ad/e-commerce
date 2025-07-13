import React, { useEffect, useState, useCallback } from 'react';
import Settings from '../Settings/Settings.jsx';
import { getUserProfile, UserData, selectAuthLoading, selectAuthError } from '../../lib/authSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import { deleteAddress } from '../../lib/userAddressSlice.js';
import toast from 'react-hot-toast';
import Loading from '../Loading/Loading';

const Profile = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [isLoading, setIsLoading] = useState(false);
    const [deletingAddresses, setDeletingAddresses] = useState(new Set());
    
    const dispatch = useDispatch();
    const userData = useSelector(UserData);
    const authLoading = useSelector(selectAuthLoading);
    const authError = useSelector(selectAuthError);

    // Handle tab change
    const handleTabChange = useCallback((tab) => {
        setActiveTab(tab);
    }, []);

    // Fetch user profile on component mount
    useEffect(() => {
        const fetchProfile = async () => {
            // Only fetch if we don't have user data and we're not currently loading
            if (!userData && !authLoading) {
                try {
                    setIsLoading(true);
                    await dispatch(getUserProfile()).unwrap();
                } catch (error) {
                    toast.error('Failed to load profile data');
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchProfile();
    }, [dispatch, userData, authLoading]);

    // Handle delete address
    const handleDeleteAddress = useCallback(async (addressId) => {
        if (!addressId || deletingAddresses.has(addressId)) return;

        setDeletingAddresses(prev => new Set([...prev, addressId]));

        try {
            await dispatch(deleteAddress(addressId)).unwrap();
            toast.success('Address deleted successfully 🗑️');
            // Refresh profile data after successful deletion without showing loading overlay
            dispatch(getUserProfile());
        } catch (error) {
            toast.error('Failed to delete address ❌');
        } finally {
            setDeletingAddresses(prev => {
                const newSet = new Set(prev);
                newSet.delete(addressId);
                return newSet;
            });
        }
    }, [dispatch, deletingAddresses]);
    
    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <div className="bg-white rounded-lg shadow-lg p-4 lg:p-6">
                        {/* Profile Header */}
                        <div className="text-center mb-6">
                            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <i className="fa-solid fa-user text-2xl text-white"></i>
                            </div>
                            <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-2">
                                {userData?.name || 'Guest User'}
                            </h2>
                            <div className="flex justify-center items-center space-x-4 text-sm text-gray-600">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    userData?.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                }`}>
                                    {userData?.role || 'User'}
                                </span>
                            </div>
                        </div>

                        {/* Profile Statistics */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg text-center">
                                <i className="fa-solid fa-map-marker-alt text-blue-600 text-xl mb-2"></i>
                                <p className="text-2xl font-bold text-blue-600">{userData?.addresses?.length || 0}</p>
                                <p className="text-sm text-gray-600">Addresses</p>
                            </div>
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg text-center">
                                <i className={`fa-solid fa-phone text-xl mb-2 ${userData?.phone ? 'text-green-600' : 'text-gray-400'}`}></i>
                                <p className={`text-sm ${userData?.phone ? 'text-green-600' : 'text-gray-400'}`}>
                                    {userData?.phone ? 'Verified' : 'No Phone'}
                                </p>
                            </div>
                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg text-center md:col-span-1 col-span-2">
                                <i className="fa-solid fa-shield-check text-purple-600 text-xl mb-2"></i>
                                <p className="text-sm text-purple-600">Account Secure</p>
                            </div>
                        </div>

                        {/* Profile Information */}
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <i className="fa-solid fa-info-circle mr-2 text-indigo-600"></i>
                            Personal Information
                        </h3>
                        <div className="space-y-4 mb-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <i className="fa-solid fa-user mr-1"></i>Full Name
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50"
                                        placeholder="Your Name"
                                        value={userData?.name || 'Not provided'}
                                        readOnly
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <i className="fa-solid fa-envelope mr-1"></i>Email Address
                                    </label>
                                    <input
                                        type="email"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50"
                                        placeholder="Your Email"
                                        value={userData?.email || 'Not provided'}
                                        readOnly
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <i className="fa-solid fa-phone mr-1"></i>Phone Number
                                </label>
                                <input
                                    type="tel"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50"
                                    placeholder="Your Phone Number"
                                    value={userData?.phone || 'Not provided'}
                                    readOnly
                                />
                            </div>
                        </div>

                        {/* Addresses Section */}
                        <div className="border-t pt-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                                    <i className="fa-solid fa-map-location-dot mr-2 text-indigo-600"></i>
                                    Saved Addresses ({userData?.addresses?.length || 0})
                                </h3>
                            </div>
                            
                            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
                                {userData?.addresses && userData.addresses.length > 0 ? (
                                    userData.addresses.map((address, index) => (
                                        <div 
                                            key={address._id || index} 
                                            className='bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300 relative group'
                                        >
                                            <div className="space-y-3 mb-4">
                                                <div className="flex items-start space-x-2">
                                                    <i className="fa-solid fa-location-dot text-indigo-600 mt-1"></i>
                                                    <div>
                                                        <p className="font-medium text-gray-800 text-sm">Address</p>
                                                        <p className="text-gray-600 text-sm break-words leading-relaxed">
                                                            {address.details || 'No details provided'}
                                                        </p>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center space-x-2">
                                                    <i className="fa-solid fa-city text-blue-600"></i>
                                                    <div>
                                                        <p className="font-medium text-gray-800 text-sm">City</p>
                                                        <p className="text-gray-600 text-sm">{address.city || 'Not specified'}</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center space-x-2">
                                                    <i className="fa-solid fa-phone text-green-600"></i>
                                                    <div>
                                                        <p className="font-medium text-gray-800 text-sm">Contact</p>
                                                        <p className="text-gray-600 text-sm">{address.phone || 'No phone provided'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {address._id && (
                                                <button 
                                                    className={`absolute top-3 right-3 p-2 rounded-lg transition-all duration-200 ${
                                                        deletingAddresses.has(address._id) 
                                                            ? 'bg-gray-100 cursor-not-allowed' 
                                                            : 'bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 opacity-0 group-hover:opacity-100'
                                                    }`}
                                                    onClick={() => handleDeleteAddress(address._id)}
                                                    disabled={deletingAddresses.has(address._id)}
                                                    title="Delete this address"
                                                >
                                                    {deletingAddresses.has(address._id) ? (
                                                        <svg className="animate-spin h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                    ) : (
                                                        <i className="fa-solid fa-trash text-sm" />
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full text-center py-12 bg-gradient-to-br from-gray-50 to-indigo-50 rounded-xl border border-gray-200">
                                        <div className="w-16 h-16 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                            <i className="fa-solid fa-map-location-dot text-2xl text-indigo-600"></i>
                                        </div>
                                        <h4 className="text-lg font-medium text-gray-800 mb-2">No addresses found</h4>
                                        <p className="text-gray-600 text-sm">Add your first address to get started with deliveries</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            case 'settings':
                return <Settings />;
            default:
                return <div>Select a section</div>;
        }
    };

    // Show loading state only if we don't have any user data yet
    if ((isLoading || authLoading) && !userData) {
        return <Loading />;
    }

    // Show error state
    if (authError && !userData) {
        return (
            <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
                <div className='text-center bg-white p-8 rounded-lg shadow-lg max-w-md'>
                    <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <i className="fa-solid fa-exclamation-triangle text-2xl text-red-600"></i>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Failed to load profile</h2>
                    <p className="text-gray-600 mb-4">{authError}</p>
                    <button 
                        onClick={() => dispatch(getUserProfile())}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className='container mx-auto min-h-screen bg-gray-50 dark:bg-gradient-to-r dark:from-gray-900 dark:via-slate-900 dark:to-blue-950'>
            <div className='flex flex-col lg:flex-row w-full p-3 lg:p-5 gap-4 lg:gap-6 min-h-[600px]'>
                {/* Sidebar */}
                <div className='w-full lg:w-1/5 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700'>
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                                <i className="fa-solid fa-user text-white"></i>
                            </div>
                            <div className="hidden lg:block">
                                <p className="font-medium text-gray-800 dark:text-white truncate">
                                    {userData?.name || 'Guest'}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    {userData?.email || 'No email'}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <ul className='flex flex-row lg:flex-col p-2 lg:p-4 space-x-2 lg:space-x-0 lg:space-y-2 overflow-x-auto lg:overflow-x-visible'>
                        <li className="flex-shrink-0 lg:flex-shrink">
                            <button
                                onClick={() => handleTabChange('profile')}
                                className={`w-full whitespace-nowrap lg:whitespace-normal text-left px-3 lg:px-4 py-2 lg:py-3 rounded-lg transition-all duration-200 flex items-center justify-between text-sm lg:text-base transform hover:scale-105 ${activeTab === 'profile'
                                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                aria-label="View profile information"
                            >
                                <div className="flex items-center space-x-2 lg:space-x-3">
                                    <i className="fa-solid fa-user"></i>
                                    <span className="hidden sm:inline">Profile</span>
                                </div>
                                <div className={`${userData?.role === 'admin' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-orange-600'} px-1 lg:px-2 py-1 text-center rounded-full font-medium text-xs hidden lg:block`}>
                                    <span>
                                        {userData?.role || 'Guest'}
                                    </span>
                                </div>
                            </button>
                        </li>
                        <li className="flex-shrink-0 lg:flex-shrink">
                            <button
                                onClick={() => handleTabChange('settings')}
                                className={`w-full whitespace-nowrap lg:whitespace-normal text-left px-3 lg:px-4 py-2 lg:py-3 rounded-lg transition-all duration-200 flex items-center space-x-2 lg:space-x-3 text-sm lg:text-base transform hover:scale-105 ${activeTab === 'settings'
                                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                aria-label="View settings"
                            >
                                <i className="fa-solid fa-cog"></i>
                                <span className="hidden sm:inline">Settings</span>
                            </button>
                        </li>
                    </ul>
                </div>
                
                {/* Content */}
                <div className='w-full lg:w-4/5 relative'>
                    {/* Loading overlay for content area - only show during address deletion */}
                    {(isLoading || authLoading) && userData && (
                        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
                            <div className="flex items-center space-x-2">
                                <svg className="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span className="text-gray-600">Updating...</span>
                            </div>
                        </div>
                    )}
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}

export default Profile