import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { updatePassword } from '../../lib/authSlice.js'
import toast from 'react-hot-toast'

const Settings = () => {
  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.auth)

  const validationSchema = Yup.object({
    currentPassword: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Current password is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('New password is required'),
    rePassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Please confirm your password')
  })

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
      } catch (error) {
        console.error('Password update failed:', error)
      }
    }
  })

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-center text-2xl font-bold text-gray-800 mb-4">Settings</h2>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your current password"
                  value={formik.values.currentPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.currentPassword && formik.errors.currentPassword && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.currentPassword}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <input
                  type="password"
                  name="password"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your new password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.password && formik.errors.password && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  name="rePassword"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Confirm your new password"
                  value={formik.values.rePassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.rePassword && formik.errors.rePassword && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.rePassword}</p>
                )}
              </div>
              <div className='flex justify-center items-center'>
                <button 
                  type="submit"
                  disabled={loading || !formik.isValid}
                  className='p-3 m-2 bg-green-700 text-white font-medium hover:bg-green-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 rounded-md'
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default Settings