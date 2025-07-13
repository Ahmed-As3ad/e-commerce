
const Loading = () => {
  return (
   <>
   <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50'>
        <div className='text-center'>
          <div className='relative'>
            <div className='animate-spin rounded-full h-32 w-32 border-4 border-indigo-200 border-t-indigo-600 mx-auto'></div>
            <div className='absolute inset-0 rounded-full h-32 w-32 border-4 border-transparent border-r-purple-600 animate-pulse mx-auto'></div>
          </div>
          <p className='mt-6 text-xl font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>
            Loading products...
          </p>
        </div>
      </div>
   </>
  )
}

export default Loading