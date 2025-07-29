import { useState } from 'react';
import { Plus, Edit, Trash2, Upload, X } from 'lucide-react';
import { useProducts } from '../../context/ProductsContext';
import { Product, ColorVariant, SizeVariant } from '../../types/Product';
import { uploadImage, deleteImage } from '../../utils/imageUpload';
import { toast } from 'sonner';
import { Switch } from '../ui/switch';

const AVAILABLE_TAGS = ['Teams', 'Drivers', 'F1 Classic', 'New'];
const MOUSEPAD_SIZES = ['900 X 400 MM', '700 X 300 MM', '350 X 300 MM'];

interface FormData {
  name: string;
  description: string;
  price: string;
  sizes: string[];
  image_url: string;
  images: string[];
  tags: string[];
  is_active: boolean;
  color_variants: ColorVariant[];
  size_variants: SizeVariant[];
  main_image: string;
  size_pricing: { [key: string]: number };
}

const MousepadManagement = () => {
  const {
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    refreshProducts
  } = useProducts();

  const mousepadProducts = products.filter(p => p.category === 'mousepads');
  
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    price: '',
    sizes: MOUSEPAD_SIZES,
    image_url: '',
    images: [],
    tags: [],
    is_active: true,
    color_variants: [],
    size_variants: [],
    main_image: '',
    size_pricing: {}
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

  const handleSizePricingChange = (size: string, price: string) => {
    setFormData(prev => ({
      ...prev,
      size_pricing: {
        ...prev.size_pricing,
        [size]: price ? parseInt(price) : 0
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.image_url) {
      toast.error('Please fill in all required fields and upload an image');
      return;
    }
    
    const productData = {
      name: formData.name,
      description: formData.description,
      price: Object.keys(formData.size_pricing).length > 0 ? 
        Math.min(...Object.values(formData.size_pricing).filter(p => p > 0)) : 
        parseInt(formData.price || '0'),
      category: 'mousepads',
      sizes: formData.sizes,
      image_url: formData.image_url,
      images: formData.images,
      tags: formData.tags,
      is_active: formData.is_active,
      color_variants: formData.color_variants.length > 0 ? formData.color_variants : undefined,
      size_variants: formData.size_variants.length > 0 ? formData.size_variants : undefined,
      main_image: formData.main_image || formData.image_url,
      size_pricing: Object.keys(formData.size_pricing).length > 0 ? formData.size_pricing : undefined
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
        sizes: MOUSEPAD_SIZES,
        image_url: '',
        images: [],
        tags: [],
        is_active: true,
        color_variants: [],
        size_variants: [],
        main_image: '',
        size_pricing: {}
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
      sizes: product.sizes.length > 0 ? product.sizes : MOUSEPAD_SIZES,
      image_url: product.image_url || '',
      images: product.images || [],
      tags: product.tags || [],
      is_active: product.is_active !== undefined ? product.is_active : true,
      color_variants: product.color_variants || [],
      size_variants: product.size_variants || [],
      main_image: product.main_image || product.image_url || '',
      size_pricing: (product as any).size_pricing || {}
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
      sizes: MOUSEPAD_SIZES,
      image_url: '',
      images: [],
      tags: [],
      is_active: true,
      color_variants: [],
      size_variants: [],
      main_image: '',
      size_pricing: {}
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
        <div className="text-white">Loading mousepads...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Mousepad Management</h2>
        {!isAddingProduct && (
          <button
            onClick={() => setIsAddingProduct(true)}
            className="text-white px-4 py-2 rounded flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700"
          >
            <Plus size={20} />
            Add Mousepad
          </button>
        )}
      </div>

      {isAddingProduct && (
        <div className="p-6 rounded-lg bg-zinc-800">
          <h3 className="text-xl font-semibold text-white mb-4">
            {editingProduct ? 'Edit Mousepad' : 'Add New Mousepad'}
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
                <label className="block text-white mb-2">Base Price (Taka)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    price: e.target.value
                  }))}
                  className="w-full px-3 py-2 text-white rounded bg-zinc-900"
                  placeholder="Optional - will use size pricing if set"
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
            </div>

            {/* Size-specific Pricing */}
            <div>
              <label className="block text-white mb-2">Size-specific Pricing</label>
              <div className="space-y-2">
                 {MOUSEPAD_SIZES.map((size) => (
                   <div key={size} className="flex items-center gap-4">
                     <label className="flex items-center space-x-2 text-white min-w-[150px]">
                       <input
                         type="checkbox"
                         checked={formData.sizes.includes(size)}
                         onChange={(e) => {
                           if (e.target.checked) {
                             setFormData(prev => ({
                               ...prev,
                               sizes: [...prev.sizes, size],
                               size_pricing: {
                                 ...prev.size_pricing,
                                 [size]: size === '900 X 400 MM' ? 2499 : 
                                        size === '700 X 300 MM' ? 1999 : 
                                        size === '350 X 300 MM' ? 1499 : 0
                               }
                             }));
                           } else {
                             setFormData(prev => ({
                               ...prev,
                               sizes: prev.sizes.filter(s => s !== size),
                               size_pricing: {
                                 ...prev.size_pricing,
                                 [size]: 0
                               }
                             }));
                           }
                         }}
                         className="rounded"
                       />
                       <span>{size}</span>
                     </label>
                     {formData.sizes.includes(size) && (
                       <input
                         type="number"
                         placeholder="Price in Taka"
                         value={formData.size_pricing[size] || ''}
                         onChange={(e) => handleSizePricingChange(size, e.target.value)}
                         className="px-3 py-2 text-white rounded bg-zinc-900 w-32"
                       />
                     )}
                   </div>
                 ))}
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

            {/* Size Variants */}
            <div>
              <label className="block text-white mb-2">Size-specific Images</label>
              <div className="space-y-4">
                {formData.sizes.map((size) => (
                  <div key={size} className="border border-gray-600 rounded p-4">
                    <h4 className="text-white font-medium mb-2">Size: {size}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white mb-2">Upload Image for {size}</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            
                            setUploading(true);
                            try {
                              const imageUrl = await uploadImage(file, 'product-images');
                              setFormData(prev => ({
                                ...prev,
                                size_variants: [
                                  ...prev.size_variants.filter(sv => sv.size !== size),
                                  { size, image_url: imageUrl }
                                ]
                              }));
                              toast.success(`Image uploaded for ${size}`);
                            } catch (error) {
                              toast.error('Failed to upload image');
                            } finally {
                              setUploading(false);
                            }
                          }}
                          className="w-full px-3 py-2 text-white rounded bg-zinc-900"
                        />
                      </div>
                      {formData.size_variants.find(sv => sv.size === size) && (
                        <div>
                          <label className="block text-white mb-2">Current Image</label>
                          <img
                            src={formData.size_variants.find(sv => sv.size === size)?.image_url}
                            alt={`${size} variant`}
                            className="w-full h-20 object-cover rounded"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
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
                {editingProduct ? 'Update Mousepad' : 'Add Mousepad'}
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
                <th className="px-4 py-3 text-left text-white">Price</th>
                <th className="px-4 py-3 text-left text-white">Sizes</th>
                <th className="px-4 py-3 text-left text-white">Status</th>
                <th className="px-4 py-3 text-left text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mousepadProducts.map(product => (
                <tr key={product.id} className="border-b border-gray-700">
                  <td className="px-4 py-3">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="px-4 py-3 text-white">{product.name}</td>
                  <td className="px-4 py-3 text-white">
                    {product.size_pricing ? 
                      `From Tk${Math.min(...Object.values(product.size_pricing).filter((p: number) => p > 0))}` :
                      `Tk${product.price}`
                    }
                  </td>
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
        {mousepadProducts.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No mousepads found. Add your first mousepad above.
          </div>
        )}
      </div>
    </div>
  );
};

export default MousepadManagement;