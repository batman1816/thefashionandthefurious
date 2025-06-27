
import { LogOut } from 'lucide-react';
import SalesChart from './SalesChart';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-black border-b border-gray-800">
        <div className="px-6 py-4 flex justify-between items-center">
          <h1 className="text-white text-2xl font-bold">Dashboard</h1>
          <button 
            onClick={onLogout} 
            className="flex items-center gap-2 px-4 py-2 rounded transition-colors text-slate-50 bg-zinc-800 hover:bg-zinc-700 font-normal"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 bg-zinc-950">
        <div className="rounded-lg p-6 bg-zinc-800">
          <h3 className="text-xl font-semibold mb-6 text-white">Sales Overview</h3>
          <SalesChart />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
