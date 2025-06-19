
import { Search } from 'lucide-react';

interface OrderSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const OrderSearch = ({ searchTerm, onSearchChange }: OrderSearchProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      <input
        type="text"
        placeholder="Search by order ID, name, email, or phone..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-red-600 text-white placeholder-gray-400"
      />
    </div>
  );
};

export default OrderSearch;
