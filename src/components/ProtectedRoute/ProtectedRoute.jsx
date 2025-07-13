import toast from 'react-hot-toast';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = (props) => {

  if (localStorage.getItem('userToken') !== null) {
    return props.children;
  } else {
     toast.error('Please login first.');
    return <Navigate to={'/login'} />;
  }
};

export default ProtectedRoute;

