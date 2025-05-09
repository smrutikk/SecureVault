import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { Mail, Lock, Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { FaGoogle, FaGithub } from 'react-icons/fa';

const AuthPage = ({ isLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
        toast.success('Logged in successfully!');
        navigate('/mainpage');
      } else {
        await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        toast.success('Account created successfully!');
        navigate('/mainpage');
      }
    } catch (error) {
      console.error('Auth error:', error);
      let errorMessage = 'An error occurred';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Email already in use';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password should be at least 6 characters';
          break;
        case 'auth/user-not-found':
          errorMessage = 'User not found';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password';
          break;
        default:
          errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      setErrors({ firebase: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleForm = () => {
    // Reset form and errors when switching
    setFormData({
      email: '',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
    navigate(isLogin ? '/register' : '/login');
  };

  const handleSocialLogin = (provider) => {
    // Implement your social login logic here
    console.log(`Logging in with ${provider}`);
    toast(`Sign in with ${provider} coming soon!`);
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">
      <Toaster position="top-center" />
      <motion.div
        className="bg-white/5 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden w-full max-w-md flex border border-white/10 hover:shadow-2xl transition-all duration-300"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
      >
        <div className="w-full p-8 md:p-10 relative flex flex-col">
          <div className="self-end mb-4">
            <button
              onClick={toggleForm}
              className="text-sm bg-white/5 px-4 py-2 rounded-full backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
              disabled={isSubmitting}
            >
              {isLogin ? 'Create an account' : 'Already have an account?'}
            </button>
          </div>
          
          <div className="flex-1 flex flex-col justify-between">
            <AnimatePresence mode='wait'>
              <motion.div
                key={isLogin ? 'login' : 'register'}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="mb-8"
              >
                <div className="inline-flex items-center justify-center bg-cyan-500/10 rounded-full p-4 mb-4">
                  {isLogin ? (
                    <LogIn className="text-cyan-400" size={36} />
                  ) : (
                    <UserPlus className="text-cyan-400" size={36} />
                  )}
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {isLogin ? 'Welcome back!' : 'Create your account'}
                </h2>
                <p className="text-white/70 text-sm">
                  {isLogin 
                    ? 'Sign in to continue to your account' 
                    : 'Get started with our secure platform'}
                </p>
              </motion.div>
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
                  <div className={`relative flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-xl px-4 py-3 border ${
                    errors.email ? 'border-red-400/50' : 'border-white/10'
                  }`}>
                    <Mail className="text-lg text-purple-300/80" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email address"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-sm"
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-400 text-xs mt-1 ml-1">{errors.email}</p>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
                  <div className={`relative flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-xl px-4 py-3 border ${
                    errors.password ? 'border-red-400/50' : 'border-white/10'
                  }`}>
                    <Lock className="text-lg text-blue-300/80" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-sm pr-8"
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-cyan-400 hover:text-cyan-300"
                      disabled={isSubmitting}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-400 text-xs mt-1 ml-1">{errors.password}</p>
                  )}
                </div>
              </motion.div>

              <AnimatePresence>
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="relative group mt-3">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
                      <div className={`relative flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-xl px-4 py-3 border ${
                        errors.confirmPassword ? 'border-red-400/50' : 'border-white/10'
                      }`}>
                        <Lock className="text-lg text-indigo-300/80" />
                        <input
                          type="password"
                          name="confirmPassword"
                          placeholder="Confirm password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-sm"
                          disabled={isSubmitting}
                        />
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-red-400 text-xs mt-1 ml-1">{errors.confirmPassword}</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {errors.firebase && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm text-center"
                >
                  {errors.firebase}
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium py-3 rounded-xl relative overflow-hidden group mt-4"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 flex items-center justify-center gap-2 text-sm">
                  {isSubmitting ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                      {isLogin ? 'Signing in...' : 'Creating account...'}
                    </>
                  ) : isLogin ? (
                    'Sign in'
                  ) : (
                    'Create account'
                  )}
                </span>
              </motion.button>
            </form>

            <div className="mt-8">
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-3 text-xs text-white/50 bg-white/5 backdrop-blur-sm rounded-full">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="flex justify-center gap-3">
                <motion.button
                  type="button"
                  onClick={() => handleSocialLogin('Google')}
                  className="p-2.5 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 relative group"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isSubmitting}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <FaGoogle className="text-lg text-white/80 group-hover:text-white transition-colors" />
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => handleSocialLogin('GitHub')}
                  className="p-2.5 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 relative group"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isSubmitting}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <FaGithub className="text-lg text-white/80 group-hover:text-white transition-colors" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;