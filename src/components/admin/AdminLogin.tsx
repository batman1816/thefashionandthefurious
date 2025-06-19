import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
interface AdminLoginProps {
  onLogin: (password: string) => void;
}
const AdminLogin = ({
  onLogin
}: AdminLoginProps) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate loading
      onLogin(password);
      toast.success('Welcome to admin panel');
    } catch (error) {
      toast.error('Invalid password');
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <div className="p-8 rounded-lg shadow-xl w-full max-w-md bg-zinc-800">
        <div className="text-center mb-8">
          <h1 className="text-2xl mb-2 font-extrabold text-slate-50">Admin Panel</h1>
          
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required placeholder="Enter admin password" className="w-full px-3 py-2 border border-gray-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 bg-zinc-700" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2 text-gray-400 hover:text-white">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="w-full text-white py-2 px-4 rounded font-semibold transition-colors duration-300 bg-zinc-800 hover:bg-zinc-700">
            {isLoading ? 'Authenticating...' : 'LOGIN'}
          </button>
        </form>
      </div>
    </div>;
};
export default AdminLogin;