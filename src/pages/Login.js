import React, { useState, useEffect } from "react";
import { FaGoogle, FaFacebook, FaTwitter } from "react-icons/fa";
import { FcGoogle } from 'react-icons/fc';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';

const SignInModal = ({ setIsAuthenticated, setUsername}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

   // Kiểm tra nếu đã đăng nhập thì chuyển hướng tới trang Main
   useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (isAuthenticated) {
      navigate('/Main');
    }
  }, [navigate]);

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(value.length < 8 ? "Password must be at least 8 characters long" : "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passwordError && email && password) {
      setIsLoading(true);
      const loginData = { username: email, password };

      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(loginData),
        });

        const data = await response.json();

        if (response.ok) {

          setIsAuthenticated(data.comment);
          setUsername(data.comment);
         
          localStorage.setItem('token', data.token);
          localStorage.setItem('isAuthenticated', 'true'); // Lưu trạng thái đăng nhập
          localStorage.setItem('username', data.comment); 

          navigate('/Main', { replace: true });
        } else {
          setPasswordError(data.message || 'Login failed');
        }
      } catch (error) {
        console.error(error.message);
        setPasswordError('Có lỗi xảy ra khi kết nối đến server');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSocialSignIn = (platform) => {
    setIsLoading(true);
      setTimeout(() => {
      setIsLoading(false);
      alert(`Signed in with ${platform}`);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-white">
          <h2 className="text-3xl font-bold mb-2">Fast e-Invoice</h2>
          <p className="text-sm opacity-80">Sign in to continue your journey</p>
        </div>
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center space-x-4 mb-6">
              <button onClick={() => handleSocialSignIn("Google")} aria-label="Sign in with Google" className="flex items-center justify-center w-12 h-12 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors">
                <FcGoogle className="text-2xl" />
              </button>
              <button onClick={() => handleSocialSignIn("Facebook")} aria-label="Sign in with Facebook" className="flex items-center justify-center w-12 h-12 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors">
                <FaFacebook className="text-2xl text-blue-600" />
              </button>
              <button onClick={() => handleSocialSignIn("Twitter")} aria-label="Sign in with Twitter" className="flex items-center justify-center w-12 h-12 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors">
                <FaTwitter className="text-2xl text-blue-400" />
              </button>
            </div>
            <div className="flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-400">Or</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email address Or User Name</label>
              <div className="mt-1">
                <input
                  id="email"
                  name="text"
                  type="string"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={handlePasswordChange}
                  className={`appearance-none block w-full px-3 py-2 border ${passwordError ? "border-red-300" : "border-gray-300"} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out`}
                />
                <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <AiOutlineEyeInvisible className="h-5 w-5 text-gray-400" aria-hidden="true" /> : <AiOutlineEye className="h-5 w-5 text-gray-400" aria-hidden="true" />}
                </button>
              </div>
              {passwordError && <p className="mt-2 text-sm text-red-600">{passwordError}</p>}
            </div>
            <div>
              <button
                type="submit"
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out ${isLoading ? "opacity-75 cursor-not-allowed" : ""}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : "Sign in"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignInModal;