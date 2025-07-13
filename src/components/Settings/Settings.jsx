import React, { useMemo } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { updatePassword, selectAuthLoading, selectAuthError } from '../../lib/authSlice.js'
import toast from 'react-hot-toast'

const Settings = () => {
  const dispatch = useDispatch()
  const loading = useSelector(selectAuthLoading)
  const error = useSelector(selectAuthError)

  const validationSchema = useMemo(() => Yup.object({
    currentPassword: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Current password is required'),
    password: Yup.string()
      .min(6, 'New password must be at least 6 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      )
      .required('New password is required'),
    rePassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Please confirm your password')
  }), [])

  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      password: '',
      rePassword: ''
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await dispatch(updatePassword({
          currentPassword: values.currentPassword,
          password: values.password,
          rePassword: values.rePassword
        })).unwrap()
        
        resetForm()
        toast.success('Password updated successfully! 🎉')
        
      } catch (error) {
        console.error('Password update failed:', error)
      }
    }
  })

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mx-auto mb-4 flex items-center justify-center">
          <i className="fa-solid fa-cog text-2xl text-white"></i>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Account Settings</h2>
        <p className="text-gray-600">Update your password to keep your account secure</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <i className="fa-solid fa-exclamation-triangle text-red-600 mr-2"></i>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Current Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <i className="fa-solid fa-lock mr-2 text-gray-500"></i>
            Current Password
          </label>
          <input
            type="password"
            name="currentPassword"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
              formik.touched.currentPassword && formik.errors.currentPassword
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }`}
            placeholder="Enter your current password"
            value={formik.values.currentPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={loading}
          />
          {formik.touched.currentPassword && formik.errors.currentPassword && (
            <p className="text-red-500 text-sm mt-2 flex items-center">
              <i className="fa-solid fa-exclamation-circle mr-1"></i>
              {formik.errors.currentPassword}
            </p>
          )}
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <i className="fa-solid fa-key mr-2 text-gray-500"></i>
            New Password
          </label>
          <input
            type="password"
            name="password"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
              formik.touched.password && formik.errors.password
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }`}
            placeholder="Enter your new password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={loading}
          />
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-500 text-sm mt-2 flex items-center">
              <i className="fa-solid fa-exclamation-circle mr-1"></i>
              {formik.errors.password}
            </p>
          )}
          
          {/* Password strength indicator */}
          {formik.values.password && (
            <div className="mt-2">
              <div className="text-xs text-gray-600 mb-1">Password strength:</div>
              <div className="flex space-x-1">
                <div className={`h-1 w-1/4 rounded ${formik.values.password.length >= 6 ? 'bg-red-400' : 'bg-gray-200'}`}></div>
                <div className={`h-1 w-1/4 rounded ${/[A-Z]/.test(formik.values.password) ? 'bg-yellow-400' : 'bg-gray-200'}`}></div>
                <div className={`h-1 w-1/4 rounded ${/[a-z]/.test(formik.values.password) ? 'bg-blue-400' : 'bg-gray-200'}`}></div>
                <div className={`h-1 w-1/4 rounded ${/\d/.test(formik.values.password) ? 'bg-green-400' : 'bg-gray-200'}`}></div>
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <i className="fa-solid fa-check-circle mr-2 text-gray-500"></i>
            Confirm New Password
          </label>
          <input
            type="password"
            name="rePassword"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
              formik.touched.rePassword && formik.errors.rePassword
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : formik.values.rePassword && formik.values.password === formik.values.rePassword
                ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }`}
            placeholder="Confirm your new password"
            value={formik.values.rePassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={loading}
          />
          {formik.touched.rePassword && formik.errors.rePassword && (
            <p className="text-red-500 text-sm mt-2 flex items-center">
              <i className="fa-solid fa-exclamation-circle mr-1"></i>
              {formik.errors.rePassword}
            </p>
          )}
          {formik.values.rePassword && formik.values.password === formik.values.rePassword && !formik.errors.rePassword && (
            <p className="text-green-500 text-sm mt-2 flex items-center">
              <i className="fa-solid fa-check-circle mr-1"></i>
              Passwords match
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button 
            type="submit"
            disabled={loading || !formik.isValid || !formik.dirty}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
              loading || !formik.isValid || !formik.dirty
                ? 'bg-gray-400 cursor-not-allowed text-white'
                : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Updating Password...</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-save"></i>
                <span>Update Password</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Settings