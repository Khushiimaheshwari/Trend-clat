import React, { useState, useRef, useEffect } from 'react';
import Container from '../Container/Container';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X, User, Heart, Package, LogOut, LogIn } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../store/authSlice';

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
    const [avatar, setAvatar] = useState(null);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { isAuthenticated, user } = useSelector(state => state.auth);
    const cartCount = 3;

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
            navigate('/user');
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <header className='sticky top-0 z-10 w-full bg-slate-950 text-white shadow-md transition-colors duration-300'>
            <Container>
                <nav className='flex items-center justify-between py-4'>
                    {/* Mobile menu button */}
                    <button
                        className="md:hidden"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/user" className="flex items-center">
                            {/* <h1 className="text-2xl font-bold text-red-500">MARVEL<span className="text-white">STORE</span></h1> */}
                            <img src="logo.png" width={"50"} alt="" />
                        </Link>
                    </div>

                    {/* Desktop navigation */}
                    <ul className="hidden md:flex items-center space-x-8">
                        <li>
                            <Link to="/shop" className="hover:text-lime-100 transition-colors font-medium">Shop</Link>
                        </li>
                        <li>
                            <Link to="/collections" className="hover:text-lime-100 transition-colors font-medium">Collections</Link>
                        </li>
                        <li>
                            <Link to="/about" className="hover:text-lime-100 transition-colors font-medium">About</Link>
                        </li>
                        <li>
                            <Link to="/contact" className="hover:text-lime-100 transition-colors font-medium">Contact</Link>
                        </li>
                    </ul>

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
                                                to="/profile"
                                                className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-dark-text-primary hover:bg-slate-100 dark:hover:bg-dark-bg-tertiary"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                <User size={16} className="mr-2" />
                                                Profile
                                            </Link>
                                            <Link
                                                to="/wishlist"
                                                className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-dark-text-primary hover:bg-slate-100 dark:hover:bg-dark-bg-tertiary"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                <Heart size={16} className="mr-2" />
                                                Wishlist
                                            </Link>
                                            <Link
                                                to="/orders"
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
                                            <Link
                                                to="/signup"
                                                className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-dark-text-primary hover:bg-slate-100 dark:hover:bg-dark-bg-tertiary"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                <LogIn size={16} className="mr-2" />
                                                Sign Up
                                            </Link>
                                            <div className="border-t border-slate-100 dark:border-dark-bg-tertiary my-1"></div>
                                            <div className="px-4 py-2 text-xs text-slate-500 dark:text-dark-text-tertiary">
                                                Sign in to access:
                                            </div>
                                            <Link
                                                to="/profile"
                                                className="flex items-center px-4 py-2 text-sm text-slate-400 dark:text-dark-text-tertiary"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                <User size={16} className="mr-2" />
                                                Profile
                                            </Link>
                                            <div className="flex items-center px-4 py-2 text-sm text-slate-400 dark:text-dark-text-tertiary">
                                                <Heart size={16} className="mr-2" />
                                                Wishlist
                                            </div>
                                            <div className="flex items-center px-4 py-2 text-sm text-slate-400 dark:text-dark-text-tertiary">
                                                <Package size={16} className="mr-2" />
                                                Orders
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </li>
                        <li>
                            <button
                                className="relative hover:text-lime-100 transition-colors"
                                onClick={() => navigate("/cart")}
                            >
                                <ShoppingCart size={20} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-rose-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </button>
                        </li>
                    </ul>
                </nav>
            </Container>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-gray-800 dark:bg-dark-bg-secondary text-white">
                    <Container>
                        <ul className="py-4 space-y-4">
                            <li>
                                <Link
                                    to="/"
                                    className="block hover:text-lime-100 transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/shop"
                                    className="block hover:text-lime-100 transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Shop
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/collections"
                                    className="block hover:text-lime-100 transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Collections
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/orders"
                                    className="block hover:text-lime-100 transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Orders
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/about"
                                    className="block hover:text-lime-100 transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/contact"
                                    className="block hover:text-lime-100 transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </Container>
                </div>
            )}
        <hr />
        </header>
    );
}

export default Header;
