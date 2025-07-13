import React, { useEffect, useState } from 'react'
import Settings from '../Settings/Settings.jsx'
import { getUserProfile, UserData } from '../../lib/authSlice.js'
import { useDispatch, useSelector } from 'react-redux'
import { deleteAddress } from '../../lib/userAddressSlice.js'
import toast from 'react-hot-toast'

const Profile = () => {
    const [activeTab, setActiveTab] = useState('profile')
    const dispatch = useDispatch()
    const userData = useSelector(UserData)


    useEffect(() => {
        dispatch(getUserProfile())
    }, [dispatch])
    
    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <div className="bg-white rounded-lg shadow-lg p-4 lg:p-6">
                        <h2 className="text-center text-xl lg:text-2xl font-bold text-gray-800 mb-4">Profile Information</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-gray-300 bg-gray-50"
                                    placeholder="Your Name"
                                    value={userData?.name || 'Guest'}
                                    readOnly
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-gray-300 bg-gray-50"
                                    placeholder="Your Email"
                                    value={userData?.email || ''}
                                    readOnly
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Phone</label>
                                <input
                                    type="tel"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-gray-300 bg-gray-50"
                                    placeholder="Your Phone"
                                    value={userData?.phone || ''}
                                    readOnly
                                />
                            </div>

                            <h3 className="text-center text-xl lg:text-2xl font-bold text-gray-800 mb-4">Addresses</h3>
                            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-6'>
                                {userData?.addresses && userData.addresses.length > 0 ? (
                                    userData.addresses.map((address, index) => (
                                        <div key={index} className='bg-gray-100 rounded-lg p-4 shadow-sm relative hover:shadow-2xl hover:bg-gray-200 hover:scale-105 transition-all duration-300 hover:rounded-2xl'>
                                            <div className="space-y-2 mb-8">
                                                <p className="font-medium text-gray-800">Address</p>
                                                <p className="text-sm text-gray-600 break-words">📍{address.details}</p>
                                                <p className="text-sm text-gray-600">🏙️{address.city}</p>
                                                <p className="text-sm text-gray-600">📞{address.phone}</p>
                                            </div>
                                            <button className="absolute bottom-3 right-3 flex items-center space-x-1 lg:space-x-2 px-2 lg:px-3 py-1 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors duration-200"
                                                onClick={async () => {
                                                    try {
                                                        await dispatch(deleteAddress(address._id)).unwrap()
                                                        toast.success('Address Deleted Success🗑️');
                                                        dispatch(getUserProfile());
                                                    } catch (err) {
                                                        toast.error('Fail to Delete Address❌');
                                                    }
                                                }}
                                            >
                                                <span className="text-xs lg:text-sm hidden sm:inline">Delete</span>
                                                <i className="fa-solid fa-trash text-xs lg:text-sm" />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full text-center py-8 text-gray-500">
                                        <i className="fa-solid fa-map-location-dot text-3xl mb-2"></i>
                                        <p>No addresses found</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )
            case 'settings':
                return (
                    <Settings />
                )
            default:
                return <div>Select a section</div>
        }
    }

    return (
        <>
            <div className='container mx-auto min-h-screen bg-gray-50 dark:bg-gradient-to-r dark:from-gray-900 dark:via-slate-900 dark:to-blue-950'>
                <div className='flex flex-col lg:flex-row w-full p-3 lg:p-5 gap-4 lg:gap-6 min-h-[600px]'>
                    {/* sidebar */}
                    <div className='w-full lg:w-1/5 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700'>
                        <ul className='flex flex-row lg:flex-col p-2 lg:p-4 space-x-2 lg:space-x-0 lg:space-y-2 overflow-x-auto lg:overflow-x-visible'>
                            <li className="flex-shrink-0 lg:flex-shrink">
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className={`w-full whitespace-nowrap lg:whitespace-normal text-left px-3 lg:px-4 py-2 lg:py-3 rounded-lg transition-colors duration-200 flex items-center justify-between text-sm lg:text-base ${activeTab === 'profile'
                                        ? 'bg-purple-500 text-white shadow-md'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    <div className="flex items-center space-x-2 lg:space-x-3">
                                        <i className="fa-solid fa-user"></i>
                                        <span className="hidden sm:inline">Profile</span>
                                    </div>
                                    <div className={`${userData?.role === 'user' ? 'bg-yellow-200 text-orange-600' : 'bg-green-200 text-green-800'} px-1 lg:px-2 py-1 text-center rounded-full font-medium text-xs hidden lg:block`}>
                                        <span>
                                            {userData?.role || 'Guest'}
                                        </span>
                                    </div>
                                </button>
                            </li>
                            <li className="flex-shrink-0 lg:flex-shrink">
                                <button
                                    onClick={() => setActiveTab('settings')}
                                    className={`w-full whitespace-nowrap lg:whitespace-normal text-left px-3 lg:px-4 py-2 lg:py-3 rounded-lg transition-colors duration-200 flex items-center space-x-2 lg:space-x-3 text-sm lg:text-base ${activeTab === 'settings'
                                        ? 'bg-purple-500 text-white shadow-md'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    <i className="fa-solid fa-cog"></i>
                                    <span className="hidden sm:inline">Settings</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                    {/* content */}
                    <div className='w-full lg:w-4/5'>
                        {renderContent()}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile