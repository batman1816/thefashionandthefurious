
import { useState } from 'react';
import { Plus, Edit, Trash2, Upload } from 'lucide-react';
import { useProducts } from '../../context/ProductsContext';
import { Product } from '../../types/Product';
import { uploadImage, deleteImage } from '../../utils/imageUpload';
import { toast } from 'sonner';

type ProductCategory = 'drivers' | 'f1-classic' | 'teams';

const ProductManagement = () => {
  const {
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct
  } = useProducts();
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'drivers' as ProductCategory,
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    image_url: ''
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log('Starting image upload for product:', file.name);
    setUploading(true);
    try {
      const imageUrl = await uploadImage(file, 'product-images');
      console.log('Image uploaded successfully:', imageUrl);
      setFormData(prev => ({
        ...prev,
        image_url: imageUrl
      }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Failed to upload image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.image_url) {
      toast.error('Please fill in all required fields and upload an image');
      return;
    }

    const productData = {
      name: formData.name,
      description: formData.description,
      price: parseInt(formData.price),
      category: formData.category,
      sizes: formData.sizes,
      image_url: formData.image_url
    };

    console.log('Submitting product data:', productData);
    try {
      if (editingProduct) {
        await updateProduct({
          ...productData,
          id: editingProduct.id
        });
        setEditingProduct(null);
      } else {
        await addProduct(productData);
        setIsAddingProduct(false);
      }

      // Reset form
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'drivers',
        sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
        image_url: ''
      });
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    }
  };

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category as ProductCategory,
      sizes: product.sizes,
      image_url: product.image_url
    });
    setEditingProduct(product);
    setIsAddingProduct(true);
  };

  const handleCancel = () => {
    setIsAddingProduct(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'drivers',
      sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
      image_url: ''
    });
  };

  const handleDelete = async (product: Product) => {
    try {
      // Delete image from storage if it's hosted on Supabase
      if (product.image_url.includes('supabase')) {
        await deleteImage(product.image_url, 'product-images');
      }
      await deleteProduct(product.id);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
        <div className="text-white">Loading products...</div>
      </div>;
  }

  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Product Management</h2>
        {!isAddingProduct && <button onClick={() => setIsAddingProduct(true)} className="text-white px-4 py-2 rounded flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700">
            <Plus size={20} />
            Add Product
          </button>}
      </div>

      {isAddingProduct && <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-white mb-4">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white mb-2">Product Name *</label>
                <input type="text" value={formData.name} onChange={e => setFormData(prev => ({
              ...prev,
              name: e.target.value
            }))} className="w-full px-3 py-2 bg-gray-700 text-white rounded" required />
              </div>
              <div>
                <label className="block text-white mb-2">Price (Taka) *</label>
                <input type="number" value={formData.price} onChange={e => setFormData(prev => ({
              ...prev,
              price: e.target.value
            }))} className="w-full px-3 py-2 bg-gray-700 text-white rounded" required />
              </div>
            </div>

            <div>
              <label className="block text-white mb-2">Description</label>
              <textarea value={formData.description} onChange={e => setFormData(prev => ({
            ...prev,
            description: e.target.value
          }))} className="w-full px-3 py-2 bg-gray-700 text-white rounded h-24" />
            </div>

            <div>
              <label className="block text-white mb-2">Category</label>
              <select value={formData.category} onChange={e => setFormData(prev => ({
            ...prev,
            category: e.target.value as any
          }))} className="w-full px-3 py-2 bg-gray-700 text-white rounded">
                <option value="drivers">Drivers</option>
                <option value="f1-classic">F1 Classic</option>
                <option value="teams">Teams</option>
              </select>
            </div>

            <div>
              <label className="block text-white mb-2">Product Image *</label>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-4">
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" disabled={uploading} />
                  <label htmlFor="image-upload" className={`cursor-pointer flex flex-col items-center justify-center text-gray-400 hover:text-white transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <Upload size={32} className="mb-2" />
                    <span className="text-center">
                      {uploading ? 'Uploading...' : 'Click to upload product image'}
                      <br />
                      <span className="text-sm text-gray-500">Supports JPG, PNG, WebP</span>
                    </span>
                  </label>
                </div>
                
                {formData.image_url && <div className="mt-4">
                    <img src={formData.image_url} alt="Preview" className="w-32 h-32 object-cover rounded border-2 border-gray-600" onError={e => {
                console.error('Image failed to load:', formData.image_url);
                e.currentTarget.src = 'https://via.placeholder.com/128x128?text=Image+Error';
              }} />
                  </div>}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button type="submit" disabled={uploading || !formData.image_url} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed">
                {editingProduct ? 'Update Product' : 'Add Product'}
              </button>
              <button type="button" onClick={handleCancel} className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded">
                Cancel
              </button>
            </div>
          </form>
        </div>}

      {/* Products List */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-white bg-zinc-800">Image</th>
                <th className="px-6 py-3 text-left text-white bg-zinc-800">Name</th>
                <th className="px-6 py-3 text-left text-white bg-zinc-800">Category</th>
                <th className="px-6 py-3 text-left text-white bg-zinc-800">Price</th>
                <th className="px-6 py-3 text-left text-white bg-zinc-800">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => <tr key={product.id} className="border-b border-gray-700">
                  <td className="px-6 py-4 bg-zinc-800">
                    <img src={product.image_url} alt={product.name} className="w-16 h-16 object-cover rounded" />
                  </td>
                  <td className="px-6 py-4 text-white bg-zinc-800">{product.name}</td>
                  <td className="px-6 py-4 text-gray-300 capitalize bg-zinc-800">{product.category}</td>
                  <td className="px-6 py-4 text-white bg-zinc-800">৳{product.price}</td>
                  <td className="px-6 py-4 bg-zinc-800">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(product)} className="text-white p-2 rounded bg-slate-700 hover:bg-slate-600">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(product)} className="bg-red-600 hover:bg-red-700 text-white p-2 rounded">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
        {products.length === 0 && <div className="text-center py-8 text-gray-400">
            No products found. Add your first product to get started!
          </div>}
      </div>
    </div>;
};

export default ProductManagement;
