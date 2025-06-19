import { useState } from 'react';
import { Plus, Edit, Trash2, Upload, X, Eye, EyeOff } from 'lucide-react';
import { useProducts } from '../../context/ProductsContext';
import { Product } from '../../types/Product';
import { uploadImage, deleteImage } from '../../utils/imageUpload';
import { toast } from 'sonner';

type ProductCategory = 'drivers' | 'f1-classic' | 'teams';
const AVAILABLE_TAGS = ['Teams', 'Drivers', 'F1 Classic', 'New'];

const ProductManagement = () => {
  const {
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    refreshProducts
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
    image_url: '',
    images: [] as string[],
    tags: [] as string[],
    is_active: true
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(file => uploadImage(file, 'product-images'));
      const imageUrls = await Promise.all(uploadPromises);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...imageUrls],
        image_url: prev.images.length === 0 ? imageUrls[0] : prev.image_url
      }));
      toast.success(`${imageUrls.length} image(s) uploaded successfully`);
    } catch (error) {
      console.error('Failed to upload images:', error);
      toast.error('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setFormData(prev => {
      const newImages = prev.images.filter((_, index) => index !== indexToRemove);
      return {
        ...prev,
        images: newImages,
        image_url: newImages.length > 0 ? newImages[0] : ''
      };
    });
  };

  const handleTagChange = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag]
    }));
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
      image_url: formData.image_url,
      images: formData.images,
      tags: formData.tags,
      is_active: formData.is_active
    };
    
    console.log('Submitting product data:', productData);
    
    try {
      if (editingProduct) {
        await updateProduct({
          ...productData,
          id: editingProduct.id
        });
        setEditingProduct(null);
        console.log('Product updated successfully');
      } else {
        await addProduct(productData);
        setIsAddingProduct(false);
        console.log('Product added successfully');
      }
      
      // Refresh products to ensure we have the latest data
      await refreshProducts();
      
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'drivers',
        sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
        image_url: '',
        images: [],
        tags: [],
        is_active: true
      });
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    }
  };

  const handleEdit = (product: Product) => {
    console.log('Editing product:', product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      category: product.category as ProductCategory,
      sizes: product.sizes,
      image_url: product.image_url || '',
      images: product.images || [],
      tags: product.tags || [],
      is_active: product.is_active !== undefined ? product.is_active : true
    });
    setEditingProduct(product);
    setIsAddingProduct(true);
  };

  const toggleProductStatus = async (product: Product) => {
    try {
      console.log('Toggling product status for:', product.name, 'Current status:', product.is_active);
      await updateProduct({
        ...product,
        is_active: !product.is_active
      });
      // Refresh products after status change
      await refreshProducts();
    } catch (error) {
      console.error('Error toggling product status:', error);
    }
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
      image_url: '',
      images: [],
      tags: [],
      is_active: true
    });
  };

  const handleDelete = async (product: Product) => {
    try {
      if (product.image_url && product.image_url.includes('supabase')) {
        await deleteImage(product.image_url, 'product-images');
      }
      await deleteProduct(product.id);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-white">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Product Management</h2>
        {!isAddingProduct && (
          <button
            onClick={() => setIsAddingProduct(true)}
            className="text-white px-4 py-2 rounded flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700"
          >
            <Plus size={20} />
            Add Product
          </button>
        )}
      </div>

      {isAddingProduct && (
        <div className="p-6 rounded-lg bg-zinc-800">
          <h3 className="text-xl font-semibold text-white mb-4">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white mb-2">Product Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    name: e.target.value
                  }))}
                  required
                  className="w-full px-3 py-2 text-white rounded bg-zinc-900"
                />
              </div>
              <div>
                <label className="block text-white mb-2">Price (Taka) *</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    price: e.target.value
                  }))}
                  required
                  className="w-full px-3 py-2 text-white rounded bg-zinc-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-white mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  description: e.target.value
                }))}
                placeholder="Enter product description. Use line breaks for formatting."
                className="w-full px-3 py-2 text-white rounded h-32 bg-zinc-900"
              />
              <div className="text-sm text-gray-400 mt-1">
                Tip: Press Enter for line breaks. Use **text** for bold and *text* for italic.
              </div>
            </div>

            <div>
              <label className="block text-white mb-2">Category</label>
              <select
                value={formData.category}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  category: e.target.value as any
                }))}
                className="w-full px-3 py-2 text-white rounded bg-zinc-900"
              >
                <option value="drivers">Drivers</option>
                <option value="f1-classic">F1 Classic</option>
                <option value="teams">Teams</option>
              </select>
            </div>

            <div>
              <label className="block text-white mb-2">Tags</label>
              <div className="grid grid-cols-2 gap-2">
                {AVAILABLE_TAGS.map(tag => (
                  <label key={tag} className="flex items-center space-x-2 text-white">
                    <input
                      type="checkbox"
                      checked={formData.tags.includes(tag)}
                      onChange={() => handleTagChange(tag)}
                      className="rounded"
                    />
                    <span>{tag}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-white mb-2">Product Images *</label>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-4">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                    disabled={uploading}
                  />
                  <label
                    htmlFor="image-upload"
                    className={`cursor-pointer flex flex-col items-center justify-center text-gray-400 hover:text-white transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Upload size={32} className="mb-2" />
                    <span className="text-center">
                      {uploading ? 'Uploading...' : 'Click to upload multiple product images'}
                      <br />
                      <span className="text-sm text-gray-500">First image will be the main display image</span>
                    </span>
                  </label>
                </div>
                
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-4 gap-4">
                    {formData.images.map((imageUrl, index) => (
                      <div key={index} className="relative">
                        <img
                          src={imageUrl}
                          alt={`Product ${index + 1}`}
                          className="w-full h-24 object-cover rounded border-2 border-gray-600"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                        >
                          <X size={14} />
                        </button>
                        {index === 0 && (
                          <div className="absolute bottom-0 left-0 right-0 bg-blue-600 text-white text-xs text-center py-1">
                            Main Image
                          </div>
                        )}
                        {index === 1 && (
                          <div className="absolute bottom-0 left-0 right-0 bg-green-600 text-white text-xs text-center py-1">
                            Hover Image
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActiveProduct"
                checked={formData.is_active}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  is_active: e.target.checked
                }))}
                className="w-4 h-4"
              />
              <label htmlFor="isActiveProduct" className="text-white">Active Product</label>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={uploading || !formData.image_url}
                className="text-white px-6 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed bg-zinc-900 hover:bg-zinc-800"
              >
                {editingProduct ? 'Update Product' : 'Add Product'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="text-white px-6 py-2 rounded bg-zinc-900 hover:bg-zinc-800"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products List */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-white bg-zinc-800">Image</th>
                <th className="px-6 py-3 text-left text-white bg-zinc-800">Name</th>
                <th className="px-6 py-3 text-left text-white bg-zinc-800">Category</th>
                <th className="px-6 py-3 text-left text-white bg-zinc-800">Tags</th>
                <th className="px-6 py-3 text-left text-white bg-zinc-800">Price</th>
                <th className="px-6 py-3 text-left text-white bg-zinc-800">Status</th>
                <th className="px-6 py-3 text-left text-white bg-zinc-800">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-gray-700">
                  <td className="px-6 py-4 bg-zinc-800">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="px-6 py-4 text-white bg-zinc-800">{product.name}</td>
                  <td className="px-6 py-4 text-gray-300 capitalize bg-zinc-800">{product.category}</td>
                  <td className="px-6 py-4 text-gray-300 bg-zinc-800">
                    {product.tags && product.tags.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {product.tags.map((tag) => (
                          <span key={tag} className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-500">No tags</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-white bg-zinc-800">৳{product.price}</td>
                  <td className="px-6 py-4 bg-zinc-800">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        product.is_active !== false
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-600 text-gray-300'
                      }`}
                    >
                      {product.is_active !== false ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-6 py-4 bg-zinc-800">
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleProductStatus(product)}
                        className={`p-2 rounded ${
                          product.is_active !== false
                            ? 'bg-yellow-600 hover:bg-yellow-700'
                            : 'bg-green-600 hover:bg-green-700'
                        } text-white`}
                      >
                        {product.is_active !== false ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-white p-2 rounded bg-slate-700 hover:bg-slate-600"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(product)}
                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {products.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No products found. Add your first product to get started!
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;
