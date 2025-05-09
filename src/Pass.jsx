import { useState, useEffect } from 'react';
import { EyeIcon, EyeOffIcon, Trash2Icon, KeyIcon, UserIcon, GlobeIcon, PlusIcon, LockIcon } from 'lucide-react';


const PasswordManager = () => {
  const [passwords, setPasswords] = useState(() => {
    const saved = localStorage.getItem('passwords');
    return saved ? JSON.parse(saved) : [];
  });
  const [formData, setFormData] = useState({
    website: '',
    username: '',
    password: ''
  });
  const [visiblePasswords, setVisiblePasswords] = useState({});

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('passwords', JSON.stringify(passwords));
  }, [passwords]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.website && formData.username && formData.password) {
      setPasswords([...passwords, formData]);
      setFormData({ website: '', username: '', password: '' });
    }
  };

  const handleDelete = (index) => {
    const newPasswords = passwords.filter((_, i) => i !== index);
    setPasswords(newPasswords);
  };

  const toggleVisibility = (index) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
    {/* Animated background */}
    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-cyan-500/5 to-blue-500/10 animate-gradient-rotate" />
    
    <div className="max-w-7xl mx-auto h-screen p-8 flex gap-8">
      {/* Left Side - Form */}
      <div className="w-1/3 h-full flex flex-col min-w-[420px]">
        <div className="h-full bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 sticky top-8 shadow-2xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4 flex items-center justify-center gap-3">
              <KeyIcon className="text-cyan-400" size={48} />
              SecureVault
            </h1>
            <p className="text-gray-400 text-lg font-medium">Password Manager</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-1">
            <div>
              <label className="text-gray-300 text-sm font-medium flex items-center gap-2 mb-2">
                <GlobeIcon className="text-cyan-400" size={18} />
                Website URL
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="https://example.com"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                required
              />
            </div>

              <div>
                <label className="text-gray-300 text-sm font-medium flex items-center gap-2 mb-3">
                  <UserIcon className="text-cyan-400" size={20} />
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter username"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="text-gray-300 text-sm font-medium flex items-center gap-2 mb-3">
                  <KeyIcon className="text-cyan-400" size={20} />
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-500 hover:to-blue-500 transition-all flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-cyan-500/20 text-base"
            >
              <PlusIcon size={20} />
              Add New Password
            </button>
          </form>
        </div>
      </div>

        {/* Right Side - Password Cards */}
      <div className="flex-1 h-full flex flex-col">
        <h2 className="text-3xl font-bold text-gray-200 mb-8 flex items-center gap-4">
          <LockIcon className="text-cyan-400" size={36} />
          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Secure Vault
          </span>
          <span className="text-gray-400 text-2xl">({passwords.length})</span>
        </h2>

        <div className="flex-1 pr-4 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {passwords.map((entry, index) => (
              <div 
                key={index}
                className="group bg-white/5 backdrop-blur-lg rounded-2xl border-2 border-white/10 p-6 hover:border-cyan-400/40 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/20 cursor-pointer"
              >
                {/* Card content with adjusted spacing */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3 truncate">
                    <GlobeIcon className="text-cyan-400" size={24} />
                    <span className="text-gray-200 font-semibold truncate text-lg">
                      {new URL(entry.website).hostname}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(index)}
                    className="text-red-400 hover:text-red-300 p-1.5 rounded-full hover:bg-red-400/10 transition-colors"
                  >
                    <Trash2Icon size={22} />
                  </button>
                </div>

                  <div className="space-y-5">
                    <div className="flex items-center gap-3 text-gray-300">
                      <UserIcon size={20} className="flex-shrink-0" />
                      <span className="truncate font-medium">{entry.username}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-gray-400">
                      <KeyIcon size={20}  className="flex-shrink-0"/>
                      <span className="truncate font-medium">
                        {visiblePasswords[index] ? entry.password : '•'.repeat(14)}
                      </span>
                      <button
                        onClick={() => toggleVisibility(index)}
                        className="text-cyan-400 hover:text-cyan-300 ml-auto transition-colors p-1"
                      >
                        {visiblePasswords[index] ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-6 text-sm text-gray-400">
                    <span className="font-medium">Added {new Date().toLocaleDateString()}</span>
                    <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                      <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse" />
                      AES-256 Encrypted
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {passwords.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-6">
                <LockIcon className="text-gray-500 mb-4" size={80} />
                <h4 className="text-3xl text-gray-300 font-bold">No Passwords Found</h4>
                <p className="text-gray-500 text-xl max-w-md">
                  Start by adding your first credential using the form
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes gradient-rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .animate-gradient-rotate {
          animation: gradient-rotate 20s linear infinite;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

// Add these icon imports at the top with others
// import { LockIcon, PlusIcon } from 'lucide-react';

export default PasswordManager;