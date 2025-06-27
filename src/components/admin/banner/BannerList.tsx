import { Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { Banner } from '../../../types/Product';
interface BannerListProps {
  banners: Banner[];
  onEdit: (banner: Banner) => void;
  onDelete: (banner: Banner) => void;
  onToggleStatus: (banner: Banner) => void;
}
const BannerList = ({
  banners,
  onEdit,
  onDelete,
  onToggleStatus
}: BannerListProps) => {
  return <div className="bg-gray-800 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-white bg-zinc-800">Image</th>
              <th className="px-6 py-3 text-left text-white bg-zinc-800">Button Text</th>
              <th className="px-6 py-3 text-left text-white bg-zinc-800">Button Link</th>
              <th className="px-6 py-3 text-left text-white bg-zinc-800">Status</th>
              <th className="px-6 py-3 text-left text-white bg-zinc-800">Actions</th>
            </tr>
          </thead>
          <tbody>
            {banners.map(banner => <tr key={banner.id} className="border-b border-gray-700">
                <td className="px-6 py-4 bg-zinc-900">
                  <img src={banner.image_url} alt="Banner" className="w-24 h-12 object-cover rounded" onError={e => {
                e.currentTarget.src = '/placeholder.svg';
              }} />
                </td>
                <td className="px-6 py-4 text-white bg-zinc-900">{banner.button_text || '-'}</td>
                <td className="px-6 py-4 text-gray-300 bg-zinc-900">{banner.button_link || '-'}</td>
                <td className="px-6 py-4 bg-zinc-900">
                  <span className={`px-2 py-1 rounded text-xs ${banner.is_active ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'}`}>
                    {banner.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 bg-zinc-900">
                  <div className="flex gap-2">
                    <button onClick={() => onToggleStatus(banner)} className={`p-2 rounded ${banner.is_active ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'} text-white`} title={banner.is_active ? 'Deactivate' : 'Activate'}>
                      {banner.is_active ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <button onClick={() => onEdit(banner)} className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded" title="Edit">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => onDelete(banner)} className="bg-red-600 hover:bg-red-700 text-white p-2 rounded" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>)}
          </tbody>
        </table>
      </div>
      {banners.length === 0 && <div className="text-center py-8 text-gray-400 bg-zinc-800">
          No banners added yet. Create your first banner to get started!
        </div>}
    </div>;
};
export default BannerList;