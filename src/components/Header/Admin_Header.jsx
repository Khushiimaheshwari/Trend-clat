import React, { useState, useRef, useEffect } from 'react';
import Container from '../Container/Container';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, Heart, Package, LogOut, LogIn } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../store/authSlice';

function Admin_Header() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [avatar, setAvatar] = useState(null);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { isAuthenticated, user } = useSelector(state => state.auth);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    useEffect(() => {
            const fetchAvatar = async () => {            
                try {
                    const res = await fetch("http://localhost:5000/getAvatar", {
                        method: "GET",
                        credentials: "include", 
                    });
                    
                    const data = await res.json();
                    console.log(data);
                    
                    if (data.avatar) {
                        setAvatar(data.avatar);
                    }
                } catch (error) {
                    console.error("Failed to fetch avatar:", error);
                }
            };
        
            if (isAuthenticated) {
                fetchAvatar();
            }
        }, [isAuthenticated]);

    const handleLogout = async () => {
        try {
            await dispatch(logoutUser());
            setIsDropdownOpen(false);
            alert("Logout Successful!")
            navigate('/admin');
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <header className='sticky top-0 z-10 w-full bg-slate-950 text-white shadow-md transition-colors duration-300'>
            <Container>
                <nav className='flex items-center justify-between py-4'>
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/admin" className="flex items-center">
                            <img src="logo.png" width={"50"} alt="" />
                        </Link>
                    </div>

                    {/* Right side icons and buttons */}
                    <ul className="flex items-center space-x-4">
                        <li>
                            <button className="hover:text-lime-100 transition-colors">
                                <Search size={20} />
                            </button>
                        </li>
                        <li className="relative" ref={dropdownRef}>
                            <button
                                className="hover:text-lime-100 transition-colors flex items-center"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                onMouseEnter={() => setIsDropdownOpen(true)}>
                                {isAuthenticated && avatar ? (
                                    <img
                                        src={`/avatars/${avatar}`}
                                        alt="User Avatar"
                                        className="w-8 h-8 rounded-full object-cover border-2 border-white"
                                    />
                                ) : (
                                    <User size={20} />
                                )}
                            </button>

                            {/* Dropdown menu */}
                            {isDropdownOpen && (
                                <div
                                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-bg-secondary rounded-md shadow-lg py-1 z-20"
                                    onMouseLeave={() => setIsDropdownOpen(false)}
                                >
                                    {isAuthenticated ? (
                                        <>
                                            <Link
                                                to="/admin_dashboard"
                                                className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-dark-text-primary hover:bg-slate-100 dark:hover:bg-dark-bg-tertiary"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                <User size={16} className="mr-2" />
                                                Dashboard
                                            </Link>
                                            <Link
                                                to="/admin_products"
                                                className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-dark-text-primary hover:bg-slate-100 dark:hover:bg-dark-bg-tertiary"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                <Heart size={16} className="mr-2" />
                                                Products
                                            </Link>
                                            <Link
                                                to="/admin_customers"
                                                className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-dark-text-primary hover:bg-slate-100 dark:hover:bg-dark-bg-tertiary"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                <Heart size={16} className="mr-2" />
                                                Customers
                                            </Link>
                                            <Link
                                                to="/admin_orders"
                                                className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-dark-text-primary hover:bg-slate-100 dark:hover:bg-dark-bg-tertiary"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                <Package size={16} className="mr-2" />
                                                Orders
                                            </Link>
                                            <button
                                                className="flex items-center w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-dark-text-primary hover:bg-slate-100 dark:hover:bg-dark-bg-tertiary"
                                                onClick={handleLogout}
                                            >
                                                <LogOut size={16} className="mr-2" />
                                                Logout
                                            </button>
                                        </> 
                                    ) : (
                                        <>
                                            <Link
                                                to="/login"
                                                className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-dark-text-primary hover:bg-slate-100 dark:hover:bg-dark-bg-tertiary"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                <LogIn size={16} className="mr-2" />
                                                Login
                                            </Link>
                                            <div className="border-t border-slate-100 dark:border-dark-bg-tertiary my-1"></div>
                                            <div className="px-4 py-2 text-xs text-slate-500 dark:text-dark-text-tertiary">
                                                Sign in to access:
                                            </div>
                                            <Link
                                                to="/admin_dashboard"
                                                className="flex items-center px-4 py-2 text-sm text-slate-400 dark:text-dark-text-tertiary"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                <User size={16} className="mr-2" />
                                                Dashboard
                                            </Link>
                                            <Link
                                                to="/admin_products"
                                                className="flex items-center px-4 py-2 text-sm text-slate-400 dark:text-dark-text-tertiary"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                <User size={16} className="mr-2" />
                                                Products
                                            </Link>
                                            <Link
                                                to="/admin_customer"
                                                className="flex items-center px-4 py-2 text-sm text-slate-400 dark:text-dark-text-tertiary"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                <User size={16} className="mr-2" />
                                                Customers
                                            </Link>
                                            <Link
                                                to="/admin_orders"
                                                className="flex items-center px-4 py-2 text-sm text-slate-400 dark:text-dark-text-tertiary"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                <User size={16} className="mr-2" />
                                                Orders
                                            </Link>
                                        </>
                                    )}
                                </div>
                            )}
                        </li>
                    </ul>
                </nav>
            </Container>
        <hr />
        </header>
    );
}

export default Admin_Header;
