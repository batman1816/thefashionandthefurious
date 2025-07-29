import { useState } from 'react';
import { Plus, Edit, Trash2, Upload, X } from 'lucide-react';
import { useProducts } from '../../context/ProductsContext';
import { Product, ColorVariant } from '../../types/Product';
import { uploadImage, deleteImage } from '../../utils/imageUpload';
import { toast } from 'sonner';
import { Switch } from '../ui/switch';
import RichTextEditor from './RichTextEditor';

type TShirtCategory = 'drivers' | 'f1-classic' | 'teams';
const AVAILABLE_TAGS = ['Teams', 'Drivers', 'F1 Classic', 'New'];
const TSHIRT_SIZES = ['M', 'L', 'XL', '2XL'];

interface FormData {
  name: string;
  description: string;
  price: string;
  category: TShirtCategory;
  sizes: string[];
  image_url: string;
  images: string[];
  tags: string[];
  is_active: boolean;
  color_variants: ColorVariant[];
  main_image: string;
}

const TShirtManagement = () => {
  const {
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    refreshProducts
  } = useProducts();

  const tshirtProducts = products.filter(p => p.category !== 'mousepads');
  
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    price: '',
    category: 'drivers',
    sizes: TSHIRT_SIZES,
    image_url: '',
    images: [],
    tags: [],
    is_active: true,
    color_variants: [],
    main_image: ''
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

  const handleColorVariantImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, color: string) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(file => uploadImage(file, 'product-images'));
      const imageUrls = await Promise.all(uploadPromises);
      
      setFormData(prev => ({
        ...prev,
        color_variants: prev.color_variants.map(variant =>
          variant.color === color 
            ? { ...variant, images: [...variant.images, ...imageUrls] }
            : variant
        )
      }));
      toast.success(`${imageUrls.length} color variant image(s) uploaded successfully`);
    } catch (error) {
      console.error('Failed to upload color variant images:', error);
      toast.error('Failed to upload color variant images');
    } finally {
      setUploading(false);
    }
  };

  const removeColorVariantImage = (color: string, imageIndex: number) => {
    setFormData(prev => ({
      ...prev,
      color_variants: prev.color_variants.map(variant =>
        variant.color === color 
          ? { ...variant, images: variant.images.filter((_, index) => index !== imageIndex) }
          : variant
      )
    }));
  };

  const addColorVariant = () => {
    setFormData(prev => ({
      ...prev,
      color_variants: [...prev.color_variants, { color: 'Black', images: [] }]
    }));
  };

  const removeColorVariant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      color_variants: prev.color_variants.filter((_, i) => i !== index)
    }));
  };

  const updateColorVariant = (index: number, field: keyof ColorVariant, value: any) => {
    setFormData(prev => ({
      ...prev,
      color_variants: prev.color_variants.map((variant, i) =>
        i === index ? { ...variant, [field]: value } : variant
      )
    }));
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
      is_active: formData.is_active,
      color_variants: formData.color_variants.length > 0 ? formData.color_variants : undefined,
      main_image: formData.main_image || formData.image_url
    };
    
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
      
      await refreshProducts();
      
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'drivers',
        sizes: TSHIRT_SIZES,
        image_url: '',
        images: [],
        tags: [],
        is_active: true,
        color_variants: [],
        main_image: ''
      });
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    }
  };

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      category: product.category as TShirtCategory,
      sizes: product.sizes.length > 0 ? product.sizes : TSHIRT_SIZES,
      image_url: product.image_url || '',
      images: product.images || [],
      tags: product.tags || [],
      is_active: product.is_active !== undefined ? product.is_active : true,
      color_variants: product.color_variants || [],
      main_image: product.main_image || product.image_url || ''
    });
    setEditingProduct(product);
    setIsAddingProduct(true);
  };

  const toggleProductStatus = async (product: Product) => {
    try {
      await updateProduct({
        ...product,
        is_active: !product.is_active
      });
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
      sizes: TSHIRT_SIZES,
      image_url: '',
      images: [],
      tags: [],
      is_active: true,
      color_variants: [],
      main_image: ''
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
        <div className="text-white">Loading t-shirts...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">T-Shirt Management</h2>
        {!isAddingProduct && (
          <button
            onClick={() => setIsAddingProduct(true)}
            className="text-white px-4 py-2 rounded flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700"
          >
            <Plus size={20} />
            Add T-Shirt
          </button>
        )}
      </div>

      {isAddingProduct && (
        <div className="p-6 rounded-lg bg-zinc-800">
          <h3 className="text-xl font-semibold text-white mb-4">
            {editingProduct ? 'Edit T-Shirt' : 'Add New T-Shirt'}
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
              <RichTextEditor
                value={formData.description}
                onChange={(value) => setFormData(prev => ({
                  ...prev,
                  description: value
                }))}
                placeholder="Enter product description. Use formatting buttons above for bold, italic, and bullet points."
              />
            </div>

            <div>
              <label className="block text-white mb-2">Category</label>
              <select
                value={formData.category}
                onChange={e => {
                  const newCategory = e.target.value as TShirtCategory;
                  setFormData(prev => ({
                    ...prev,
                    category: newCategory
                  }));
                }}
                className="w-full px-3 py-2 text-white rounded bg-zinc-900"
              >
                <option value="drivers">Drivers</option>
                <option value="f1-classic">F1 Classic</option>
                <option value="teams">Teams</option>
              </select>
            </div>

            {/* Sizes Section */}
            <div>
              <label className="block text-white mb-2">Sizes</label>
              <div className="grid grid-cols-2 gap-2">
                {TSHIRT_SIZES.map(size => {
                  const isChecked = formData.sizes.includes(size);
                  return (
                    <label key={size} className="flex items-center space-x-2 text-white">
                      <Switch
                        checked={isChecked}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData(prev => ({
                              ...prev,
                              sizes: [...prev.sizes, size]
                            }));
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              sizes: prev.sizes.filter(s => s !== size)
                            }));
                          }
                        }}
                      />
                      <span>{size}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-white mb-2">Tags</label>
              <div className="grid grid-cols-2 gap-2">
                {AVAILABLE_TAGS.map(tag => (
                  <label key={tag} className="flex items-center space-x-2 text-white">
                    <Switch
                      checked={formData.tags.includes(tag)}
                      onCheckedChange={() => handleTagChange(tag)}
                    />
                    <span>{tag}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Color Variants */}
            <div>
              <label className="block text-white mb-2">Color Variants</label>
              <div className="space-y-4">
                {formData.color_variants.map((variant, index) => (
                  <div key={index} className="border border-gray-600 rounded p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-white font-medium">Color Variant {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeColorVariant(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white mb-2">Color Name</label>
                        <input
                          type="text"
                          value={variant.color}
                          onChange={e => updateColorVariant(index, 'color', e.target.value)}
                          className="w-full px-3 py-2 text-white rounded bg-zinc-900"
                        />
                      </div>
                      <div>
                        <label className="block text-white mb-2">Upload Images</label>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={e => handleColorVariantImageUpload(e, variant.color)}
                          className="w-full px-3 py-2 text-white rounded bg-zinc-900"
                        />
                      </div>
                    </div>

                    {variant.images.length > 0 && (
                      <div className="mt-3">
                        <label className="block text-white mb-2">Color Images</label>
                        <div className="grid grid-cols-3 gap-2">
                          {variant.images.map((image, imgIndex) => (
                            <div key={imgIndex} className="relative">
                              <img
                                src={image}
                                alt={`${variant.color} variant`}
                                className="w-full h-20 object-cover rounded"
                              />
                              <button
                                type="button"
                                onClick={() => removeColorVariantImage(variant.color, imgIndex)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addColorVariant}
                  className="text-blue-400 hover:text-blue-300 flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add Color Variant
                </button>
              </div>
            </div>

            {/* Main Images */}
            <div>
              <label className="block text-white mb-2">Product Images *</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full px-3 py-2 text-white rounded bg-zinc-900"
              />
              {uploading && <p className="text-gray-400 mt-2">Uploading...</p>}
              
              {formData.images.length > 0 && (
                <div className="mt-4">
                  <label className="block text-white mb-2">Uploaded Images</label>
                  <div className="grid grid-cols-3 gap-2">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          className="w-full h-20 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
              />
              <label className="text-white">Product Active</label>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
              >
                {editingProduct ? 'Update T-Shirt' : 'Add T-Shirt'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded"
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
                <th className="px-4 py-3 text-left text-white">Image</th>
                <th className="px-4 py-3 text-left text-white">Name</th>
                <th className="px-4 py-3 text-left text-white">Category</th>
                <th className="px-4 py-3 text-left text-white">Price</th>
                <th className="px-4 py-3 text-left text-white">Sizes</th>
                <th className="px-4 py-3 text-left text-white">Status</th>
                <th className="px-4 py-3 text-left text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tshirtProducts.map(product => (
                <tr key={product.id} className="border-b border-gray-700">
                  <td className="px-4 py-3">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="px-4 py-3 text-white">{product.name}</td>
                  <td className="px-4 py-3 text-white capitalize">{product.category}</td>
                  <td className="px-4 py-3 text-white">Tk{product.price}</td>
                  <td className="px-4 py-3 text-white">{product.sizes.join(', ')}</td>
                  <td className="px-4 py-3">
                    <Switch
                      checked={product.is_active}
                      onCheckedChange={() => toggleProductStatus(product)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(product)}
                        className="text-red-400 hover:text-red-300"
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
        {tshirtProducts.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No t-shirts found. Add your first t-shirt above.
          </div>
        )}
      </div>
    </div>
  );
};

export default TShirtManagement;