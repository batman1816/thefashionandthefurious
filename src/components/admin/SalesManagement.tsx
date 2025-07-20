import { useState, useEffect } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Calendar, Tag, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

interface Sale {
  id: string;
  product_id: string;
  original_price: number;
  sale_price: number;
  sale_title: string;
  sale_description: string;
  is_active: boolean;
  start_date: string;
  end_date: string;
  product?: {
    name: string;
    image_url: string;
  };
}

interface BundleDeal {
  id: string;
  name: string;
  description: string;
  deal_type: string;
  minimum_quantity: number;
  discount_percentage: number;
  applicable_categories: string[];
  max_discount_items: number;
  is_active: boolean;
  start_date: string;
  end_date: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image_url: string;
}

const SalesManagement = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [bundleDeals, setBundleDeals] = useState<BundleDeal[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSaleForm, setShowSaleForm] = useState(false);
  const [showBundleForm, setShowBundleForm] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [editingBundle, setEditingBundle] = useState<BundleDeal | null>(null);

  // Form states
  const [saleForm, setSaleForm] = useState({
    product_id: '',
    original_price: 0,
    sale_price: 0,
    sale_title: '',
    sale_description: '',
    start_date: '',
    end_date: '',
    is_active: false
  });

  const [bundleForm, setBundleForm] = useState({
    name: '',
    description: '',
    deal_type: 'buy_2_get_1_half_off',
    minimum_quantity: 2,
    discount_percentage: 50,
    applicable_categories: ['drivers', 'f1-classic', 'teams'],
    max_discount_items: 1,
    start_date: '',
    end_date: '',
    is_active: false
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      console.log('Fetching sales data...');
      
      // Fetch sales with product info
      const { data: salesData, error: salesError } = await supabase
        .from('sales')
        .select(`
          *,
          products (name, image_url)
        `)
        .order('created_at', { ascending: false });

      if (salesError) {
        console.error('Sales fetch error:', salesError);
        throw salesError;
      }

      // Fetch bundle deals
      const { data: bundleData, error: bundleError } = await supabase
        .from('bundle_deals')
        .select('*')
        .order('created_at', { ascending: false });

      if (bundleError) {
        console.error('Bundle deals fetch error:', bundleError);
        throw bundleError;
      }

      // Fetch products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('id, name, price, category, image_url')
        .eq('is_active', true);

      if (productsError) {
        console.error('Products fetch error:', productsError);
        throw productsError;
      }

      console.log('Data fetched successfully:', {
        sales: salesData?.length || 0,
        bundles: bundleData?.length || 0,
        products: productsData?.length || 0
      });

      setSales(salesData || []);
      setBundleDeals(bundleData || []);
      setProducts(productsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load sales data');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSale = async () => {
    if (!saleForm.product_id) {
      toast.error('Please select a product');
      return;
    }

    if (saleForm.sale_price >= saleForm.original_price) {
      toast.error('Sale price must be lower than original price');
      return;
    }

    try {
      console.log('Saving sale:', saleForm);
      
      // Prepare form data with proper null handling for empty dates
      const formData = {
        ...saleForm,
        start_date: saleForm.start_date || null,
        end_date: saleForm.end_date || null
      };

      if (editingSale) {
        const { error } = await supabase
          .from('sales')
          .update(formData)
          .eq('id', editingSale.id);
        
        if (error) {
          console.error('Sale update error:', error);
          throw error;
        }
        
        console.log('Sale updated successfully');
        toast.success('Sale updated successfully');
      } else {
        const { error } = await supabase
          .from('sales')
          .insert([formData]);
        
        if (error) {
          console.error('Sale insert error:', error);
          throw error;
        }
        
        console.log('Sale created successfully');
        toast.success('Sale created successfully');
      }
      
      setShowSaleForm(false);
      setEditingSale(null);
      resetSaleForm();
      fetchData();
    } catch (error) {
      console.error('Error saving sale:', error);
      toast.error(`Failed to save sale: ${error.message}`);
    }
  };

  const handleSaveBundle = async () => {
    if (!bundleForm.name.trim()) {
      toast.error('Please enter a bundle name');
      return;
    }

    try {
      console.log('Saving bundle deal:', bundleForm);
      
      // Prepare form data with proper null handling for empty dates
      const formData = {
        ...bundleForm,
        start_date: bundleForm.start_date || null,
        end_date: bundleForm.end_date || null
      };

      if (editingBundle) {
        const { error } = await supabase
          .from('bundle_deals')
          .update(formData)
          .eq('id', editingBundle.id);
        
        if (error) {
          console.error('Bundle update error:', error);
          throw error;
        }
        
        console.log('Bundle deal updated successfully');
        toast.success('Bundle deal updated successfully');
      } else {
        const { error } = await supabase
          .from('bundle_deals')
          .insert([formData]);
        
        if (error) {
          console.error('Bundle insert error:', error);
          throw error;
        }
        
        console.log('Bundle deal created successfully');
        toast.success('Bundle deal created successfully');
      }
      
      setShowBundleForm(false);
      setEditingBundle(null);
      resetBundleForm();
      fetchData();
    } catch (error) {
      console.error('Error saving bundle deal:', error);
      toast.error(`Failed to save bundle deal: ${error.message}`);
    }
  };

  const handleDeleteSale = async (id: string) => {
    if (!confirm('Are you sure you want to delete this sale?')) return;
    
    try {
      const { error } = await supabase
        .from('sales')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast.success('Sale deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Error deleting sale:', error);
      toast.error('Failed to delete sale');
    }
  };

  const handleDeleteBundle = async (id: string) => {
    if (!confirm('Are you sure you want to delete this bundle deal?')) return;
    
    try {
      const { error } = await supabase
        .from('bundle_deals')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast.success('Bundle deal deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Error deleting bundle deal:', error);
      toast.error('Failed to delete bundle deal');
    }
  };

  const resetSaleForm = () => {
    setSaleForm({
      product_id: '',
      original_price: 0,
      sale_price: 0,
      sale_title: '',
      sale_description: '',
      start_date: '',
      end_date: '',
      is_active: false
    });
  };

  const resetBundleForm = () => {
    setBundleForm({
      name: '',
      description: '',
      deal_type: 'buy_2_get_1_half_off',
      minimum_quantity: 2,
      discount_percentage: 50,
      applicable_categories: ['drivers', 'f1-classic', 'teams'],
      max_discount_items: 1,
      start_date: '',
      end_date: '',
      is_active: false
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-white">Loading sales...</div>
      </div>
    );
  }

  return (
    <div className="text-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold">Sales Management</h2>
          <p className="text-gray-400">Create and manage product sales and bundle deals</p>
        </div>
        <div className="flex gap-4">
          <Button onClick={() => setShowSaleForm(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus size={16} className="mr-2" />
            Add Product Sale
          </Button>
          <Button onClick={() => setShowBundleForm(true)} className="bg-green-600 hover:bg-green-700">
            <Plus size={16} className="mr-2" />
            Add Bundle Deal
          </Button>
        </div>
      </div>

      {/* Connection Status */}
      <div className="mb-6 p-4 bg-zinc-800 rounded-lg border border-zinc-700">
        <div className="flex items-center gap-2">
          <AlertCircle size={16} className="text-blue-400" />
          <span className="text-sm text-gray-300">
            Admin Panel Status: Connected to database. Changes will appear on the website immediately.
          </span>
        </div>
      </div>

      {/* Product Sales Section */}
      <Card className="mb-8 bg-zinc-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Tag size={20} />
            Product Sales ({sales.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sales.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No product sales created yet. Create your first sale to get started!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sales.map((sale) => (
                <div key={sale.id} className="bg-zinc-900 p-4 rounded-lg border border-zinc-700">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-white">{sale.sale_title}</h3>
                    <Badge variant={sale.is_active ? "default" : "secondary"}>
                      {sale.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="text-gray-300 text-sm mb-2">{sale.product?.name}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-gray-400 line-through">Tk {sale.original_price}</span>
                    <span className="text-red-500 font-bold">Tk {sale.sale_price}</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">
                    {sale.start_date ? new Date(sale.start_date).toLocaleDateString() : 'No start date'} - {sale.end_date ? new Date(sale.end_date).toLocaleDateString() : 'No end date'}
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setEditingSale(sale);
                        setSaleForm({
                          product_id: sale.product_id,
                          original_price: sale.original_price,
                          sale_price: sale.sale_price,
                          sale_title: sale.sale_title,
                          sale_description: sale.sale_description,
                          start_date: sale.start_date,
                          end_date: sale.end_date,
                          is_active: sale.is_active
                        });
                        setShowSaleForm(true);
                      }}
                    >
                      <Edit size={14} />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleDeleteSale(sale.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bundle Deals Section */}
      <Card className="mb-8 bg-zinc-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar size={20} />
            Bundle Deals ({bundleDeals.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {bundleDeals.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No bundle deals created yet. Create your first bundle deal to get started!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bundleDeals.map((bundle) => (
                <div key={bundle.id} className="bg-zinc-900 p-4 rounded-lg border border-zinc-700">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-white">{bundle.name}</h3>
                    <Badge variant={bundle.is_active ? "default" : "secondary"}>
                      {bundle.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="text-gray-300 text-sm mb-2">{bundle.description}</p>
                  <p className="text-blue-400 text-sm mb-2">
                    Buy {bundle.minimum_quantity}, get {bundle.max_discount_items} at {bundle.discount_percentage}% off
                  </p>
                  <p className="text-xs text-gray-400 mb-3">
                    Categories: {bundle.applicable_categories?.join(', ')}
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setEditingBundle(bundle);
                        setBundleForm({
                          name: bundle.name,
                          description: bundle.description,
                          deal_type: bundle.deal_type,
                          minimum_quantity: bundle.minimum_quantity,
                          discount_percentage: bundle.discount_percentage,
                          applicable_categories: bundle.applicable_categories || [],
                          max_discount_items: bundle.max_discount_items,
                          start_date: bundle.start_date,
                          end_date: bundle.end_date,
                          is_active: bundle.is_active
                        });
                        setShowBundleForm(true);
                      }}
                    >
                      <Edit size={14} />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleDeleteBundle(bundle.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sale Form Modal */}
      {showSaleForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-zinc-800 p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white mb-4">
              {editingSale ? 'Edit Sale' : 'Add New Sale'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Product *</label>
                <select 
                  value={saleForm.product_id}
                  onChange={(e) => {
                    const product = products.find(p => p.id === e.target.value);
                    setSaleForm({
                      ...saleForm, 
                      product_id: e.target.value,
                      original_price: product?.price || 0
                    });
                  }}
                  className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-white"
                  required
                >
                  <option value="">Select a product</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name} - Tk {product.price}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Sale Title *</label>
                <input 
                  type="text"
                  value={saleForm.sale_title}
                  onChange={(e) => setSaleForm({...saleForm, sale_title: e.target.value})}
                  className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-white"
                  placeholder="e.g., Summer Sale"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Sale Description</label>
                <textarea 
                  value={saleForm.sale_description}
                  onChange={(e) => setSaleForm({...saleForm, sale_description: e.target.value})}
                  className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-white"
                  rows={3}
                  placeholder="Describe the sale..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Original Price *</label>
                  <input 
                    type="number"
                    value={saleForm.original_price}
                    onChange={(e) => setSaleForm({...saleForm, original_price: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-white"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Sale Price *</label>
                  <input 
                    type="number"
                    value={saleForm.sale_price}
                    onChange={(e) => setSaleForm({...saleForm, sale_price: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-white"
                    min="0"
                    max={saleForm.original_price - 1}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Start Date (Optional)</label>
                  <input 
                    type="datetime-local"
                    value={saleForm.start_date}
                    onChange={(e) => setSaleForm({...saleForm, start_date: e.target.value})}
                    className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">End Date (Optional)</label>
                  <input 
                    type="datetime-local"
                    value={saleForm.end_date}
                    onChange={(e) => setSaleForm({...saleForm, end_date: e.target.value})}
                    className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-white"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input 
                  type="checkbox"
                  checked={saleForm.is_active}
                  onChange={(e) => setSaleForm({...saleForm, is_active: e.target.checked})}
                  className="mr-2"
                />
                <label className="text-sm text-gray-300">Active</label>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <Button onClick={handleSaveSale} className="flex-1 bg-blue-600 hover:bg-blue-700">
                {editingSale ? 'Update' : 'Create'}
              </Button>
              <Button 
                onClick={() => {
                  setShowSaleForm(false);
                  setEditingSale(null);
                  resetSaleForm();
                }} 
                variant="outline" 
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Bundle Form Modal */}
      {showBundleForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-zinc-800 p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white mb-4">
              {editingBundle ? 'Edit Bundle Deal' : 'Add New Bundle Deal'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Name *</label>
                <input 
                  type="text"
                  value={bundleForm.name}
                  onChange={(e) => setBundleForm({...bundleForm, name: e.target.value})}
                  className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-white"
                  placeholder="e.g., Buy 2 Get 1 Half Off"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea 
                  value={bundleForm.description}
                  onChange={(e) => setBundleForm({...bundleForm, description: e.target.value})}
                  className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-white"
                  rows={3}
                  placeholder="Describe the bundle deal..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Minimum Quantity *</label>
                  <input 
                    type="number"
                    value={bundleForm.minimum_quantity}
                    onChange={(e) => setBundleForm({...bundleForm, minimum_quantity: parseInt(e.target.value) || 2})}
                    className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-white"
                    min="2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Discount % *</label>
                  <input 
                    type="number"
                    value={bundleForm.discount_percentage}
                    onChange={(e) => setBundleForm({...bundleForm, discount_percentage: parseInt(e.target.value) || 50})}
                    className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-white"
                    min="1"
                    max="99"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Max Discount Items *</label>
                <input 
                  type="number"
                  value={bundleForm.max_discount_items}
                  onChange={(e) => setBundleForm({...bundleForm, max_discount_items: parseInt(e.target.value) || 1})}
                  className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-white"
                  min="1"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Start Date (Optional)</label>
                  <input 
                    type="datetime-local"
                    value={bundleForm.start_date}
                    onChange={(e) => setBundleForm({...bundleForm, start_date: e.target.value})}
                    className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">End Date (Optional)</label>
                  <input 
                    type="datetime-local"
                    value={bundleForm.end_date}
                    onChange={(e) => setBundleForm({...bundleForm, end_date: e.target.value})}
                    className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-white"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input 
                  type="checkbox"
                  checked={bundleForm.is_active}
                  onChange={(e) => setBundleForm({...bundleForm, is_active: e.target.checked})}
                  className="mr-2"
                />
                <label className="text-sm text-gray-300">Active</label>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <Button onClick={handleSaveBundle} className="flex-1 bg-green-600 hover:bg-green-700">
                {editingBundle ? 'Update' : 'Create'}
              </Button>
              <Button 
                onClick={() => {
                  setShowBundleForm(false);
                  setEditingBundle(null);
                  resetBundleForm();
                }} 
                variant="outline" 
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesManagement;
