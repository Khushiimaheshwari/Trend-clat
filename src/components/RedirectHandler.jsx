import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const RedirectHandler = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

useEffect(() => {    
    if (isAuthenticated && user) {
      if (user.role === "admin") {
        console.log("admin");
        navigate("/admin");
      } else if (user.role === "vendor") {
        console.log("vendor");
        navigate("/vendor");
      } else {
        console.log("user");
        navigate("/user"); 
      }
    }
  }, [isAuthenticated, user, navigate]); 

  return <p>Redirecting...</p>;
}

export default RedirectHandler;