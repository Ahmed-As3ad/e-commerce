import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { addAddress, getAddress, selectAddressLoading, selectAddressError, selectUserAddresses } from '../../lib/userAddressSlice'
import toast from 'react-hot-toast'

const Address = ({ onAddressSubmit, onBack }) => {
    const dispatch = useDispatch()
    const isLoading = useSelector(selectAddressLoading)
    const error = useSelector(selectAddressError)
    const userAddresses = useSelector(selectUserAddresses)

    const [showForm, setShowForm] = useState(false)
    const [selectedAddress, setSelectedAddress] = useState(null)

    const egyptianCities = [
        'Cairo', 'Alexandria', 'Giza', 'Shubra El Kheima', 'Port Said', 'Suez',
        'Luxor', 'Mansoura', 'Mahalla El Kubra', 'Tanta', 'Asyut', 'Ismailia',
        'Fayoum', 'Zagazig', 'Aswan', 'Damietta', 'Damanhur', 'Minya', 'Beni Suef']

    const validationSchema = Yup.object({
        name: Yup.string()
            .min(2, 'Name is too short')
            .required('Name is required'),
        details: Yup.string()
            .min(10, 'Address details are too short')
            .required('Address details are required'),
        phone: Yup.string()
            .matches(/^(\+20|0)?1[0125][0-9]{8}$/, 'Invalid Egyptian phone number')
            .required('Phone number is required'),
        city: Yup.string()
            .required('City is required')
    })

    const initialValues = {
        name: '',
        details: '',
        phone: '',
        city: ''
    }

    useEffect(() => {
        dispatch(getAddress())
    }, [dispatch])

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const result = await dispatch(addAddress(values))
            if (result.meta.requestStatus === 'fulfilled') {
                resetForm()
                setShowForm(false)
                dispatch(getAddress())
                toast.success('Address added successfully!')
            }
        } catch (error) {
            console.error('Error:', error)
            toast.error('An error occurred')
        }
        setSubmitting(false)
    }

    const handleSelectAddress = (address) => setSelectedAddress(address)
    const handleProceedWithAddress = () => {
        if (selectedAddress) {
            onAddressSubmit(selectedAddress)
        } else {
            toast.error('Please select an address first')
        }
    }

    const validAddresses = userAddresses?.filter(
        addr => addr?.name && addr?.details && addr?.city && addr?.phone
    ) || []

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">

                <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBack}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            ← Back
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Delivery Address</h1>
                            <p className="text-gray-600 mt-1">Select or add a new delivery address</p>
                        </div>
                    </div>
                </div>                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-red-600">{error}</p>
                    </div>
                )}                {validAddresses.length > 0 && (
                    <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
                        <h2 className="text-xl font-bold mb-4">
                            Saved Addresses ({validAddresses.length})
                        </h2>

                        <div className="space-y-3">
                            {validAddresses.map((address, index) => (
                                <div
                                    key={address._id || `address-${index}`}
                                    onClick={() => handleSelectAddress(address)}
                                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${selectedAddress?._id === address._id
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 bg-white hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900 mb-2">{address.name}</h3>
                                            <p className="text-sm text-gray-600 mb-1">🏠 {address.details}</p>
                                            <p className="text-sm text-gray-600 mb-1">🏙️ {address.city}</p>
                                            <p className="text-sm text-gray-600">📞 {address.phone}</p>
                                        </div>
                                        {selectedAddress?._id === address._id && (
                                            <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs animate-bounce">
                                                ✓
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}                        </div>
                        {userAddresses && userAddresses.length > validAddresses.length && (
                            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="text-yellow-800 text-sm">
                                    ⚠️ {userAddresses.length - validAddresses.length} incomplete address(es) hidden
                                </p>
                            </div>
                        )}
                    </div>
                )}                {!showForm && (
                    <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
                        <button
                            onClick={() => setShowForm(true)}
                            className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 hover:bg-blue-50 transition-colors"
                        >
                            <div className="text-center">
                                <div className="text-3xl mb-2">+</div>
                                <span className="text-gray-600">Add New Address</span>
                            </div>
                        </button>
                    </div>
                )}                {showForm && (
                    <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Add New Address</h2>
                            <button
                                onClick={() => setShowForm(false)}
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                            >
                                ×
                            </button>                        </div>
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ isSubmitting }) => (<Form className="space-y-4">

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name *
                                    </label>
                                    <Field
                                        name="name"
                                        type="text"
                                        placeholder="Enter your full name"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    />
                                    <ErrorMessage name="name" className="text-red-600 text-sm mt-1" />                                    </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Address Details *
                                    </label>
                                    <Field
                                        name="details"
                                        as="textarea"
                                        rows={3}
                                        placeholder="Enter detailed address (street, building, apartment)"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                                    />
                                    <ErrorMessage name="details" className="text-red-600 text-sm mt-1" />                                    </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number *
                                    </label>
                                    <Field
                                        name="phone"
                                        type="tel"
                                        placeholder="Example: 01012345678"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    />
                                    <ErrorMessage name="phone" className="text-red-600 text-sm mt-1" />                                    </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        City *
                                    </label>
                                    <Field
                                        name="city"
                                        as="select"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    >
                                        <option value="">Select your city</option>
                                        {egyptianCities.map((city) => (
                                            <option key={city} value={city}>{city}</option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="city" className="text-red-600 text-sm mt-1" />                                    </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || isLoading}
                                        className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {isSubmitting || isLoading ? 'Adding...' : 'Add Address'}
                                    </button>
                                </div>
                            </Form>
                            )}
                        </Formik>
                    </div>)}

                {selectedAddress && (
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                        <button
                            onClick={() => {
                                handleProceedWithAddress()
                                onBack()
                            }}
                            className="w-full bg-green-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <span>✓</span>
                            Continue with Selected Address
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Address