
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CalendarIcon, Plus, Edit, Trash2, Tag, Clock, Package } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../../lib/utils';
import { useSales } from '../../hooks/useSales';
import { useProducts } from '../../context/ProductsContext';
import { toast } from 'sonner';

const SalesManagement = () => {
  const { 
    sales, 
    bundleDeals, 
    salesSettings, 
    loading, 
    createSale, 
    updateSale, 
    deleteSale,
    createBundleDeal,
    updateBundleDeal,
    updateSalesSettings 
  } = useSales();
  const { products } = useProducts();

  const [showCreateSale, setShowCreateSale] = useState(false);
  const [showCreateBundle, setShowCreateBundle] = useState(false);
  const [editingSale, setEditingSale] = useState<any>(null);
  const [editingBundle, setEditingBundle] = useState<any>(null);

  // Sale form state
  const [saleForm, setSaleForm] = useState({
    product_id: '',
    original_price: 0,
    sale_price: 0,
    is_active: false,
    start_date: undefined as Date | undefined,
    end_date: undefined as Date | undefined
  });

  // Bundle form state
  const [bundleForm, setBundleForm] = useState({
    name: 'Buy 2 Get 1 Half Off',
    description: 'Buy any 2 t-shirts and get the 3rd one at 50% off',
    deal_type: 'buy_2_get_1_half_off',
    is_active: false,
    discount_percentage: 50,
    minimum_quantity: 2,
    start_date: undefined as Date | undefined,
    end_date: undefined as Date | undefined
  });

  // Global sale settings state
  const [globalSaleForm, setGlobalSaleForm] = useState({
    global_sale_active: salesSettings?.global_sale_active || false,
    global_sale_title: salesSettings?.global_sale_title || '',
    global_sale_start: salesSettings?.global_sale_start ? new Date(salesSettings.global_sale_start) : undefined as Date | undefined,
    global_sale_end: salesSettings?.global_sale_end ? new Date(salesSettings.global_sale_end) : undefined as Date | undefined
  });

  React.useEffect(() => {
    if (salesSettings) {
      setGlobalSaleForm({
        global_sale_active: salesSettings.global_sale_active,
        global_sale_title: salesSettings.global_sale_title || '',
        global_sale_start: salesSettings.global_sale_start ? new Date(salesSettings.global_sale_start) : undefined,
        global_sale_end: salesSettings.global_sale_end ? new Date(salesSettings.global_sale_end) : undefined
      });
    }
  }, [salesSettings]);

  const handleCreateSale = async () => {
    try {
      if (!saleForm.product_id || saleForm.original_price <= 0 || saleForm.sale_price <= 0) {
        toast.error('Please fill in all required fields');
        return;
      }

      await createSale({
        product_id: saleForm.product_id,
        original_price: saleForm.original_price,
        sale_price: saleForm.sale_price,
        is_active: saleForm.is_active,
        start_date: saleForm.start_date?.toISOString(),
        end_date: saleForm.end_date?.toISOString()
      });

      setSaleForm({
        product_id: '',
        original_price: 0,
        sale_price: 0,
        is_active: false,
        start_date: undefined,
        end_date: undefined
      });
      setShowCreateSale(false);
    } catch (error) {
      console.error('Error creating sale:', error);
    }
  };

  const handleUpdateSale = async () => {
    try {
      if (!editingSale) return;

      await updateSale(editingSale.id, {
        original_price: saleForm.original_price,
        sale_price: saleForm.sale_price,
        is_active: saleForm.is_active,
        start_date: saleForm.start_date?.toISOString(),
        end_date: saleForm.end_date?.toISOString()
      });

      setEditingSale(null);
      setSaleForm({
        product_id: '',
        original_price: 0,
        sale_price: 0,
        is_active: false,
        start_date: undefined,
        end_date: undefined
      });
    } catch (error) {
      console.error('Error updating sale:', error);
    }
  };

  const handleCreateBundle = async () => {
    try {
      await createBundleDeal({
        name: bundleForm.name,
        description: bundleForm.description,
        deal_type: bundleForm.deal_type,
        is_active: bundleForm.is_active,
        discount_percentage: bundleForm.discount_percentage,
        minimum_quantity: bundleForm.minimum_quantity,
        start_date: bundleForm.start_date?.toISOString(),
        end_date: bundleForm.end_date?.toISOString()
      });

      setBundleForm({
        name: 'Buy 2 Get 1 Half Off',
        description: 'Buy any 2 t-shirts and get the 3rd one at 50% off',
        deal_type: 'buy_2_get_1_half_off',
        is_active: false,
        discount_percentage: 50,
        minimum_quantity: 2,
        start_date: undefined,
        end_date: undefined
      });
      setShowCreateBundle(false);
    } catch (error) {
      console.error('Error creating bundle deal:', error);
    }
  };

  const handleUpdateGlobalSale = async () => {
    try {
      await updateSalesSettings({
        global_sale_active: globalSaleForm.global_sale_active,
        global_sale_title: globalSaleForm.global_sale_title,
        global_sale_start: globalSaleForm.global_sale_start?.toISOString(),
        global_sale_end: globalSaleForm.global_sale_end?.toISOString()
      });
    } catch (error) {
      console.error('Error updating global sale settings:', error);
    }
  };

  const startEditSale = (sale: any) => {
    setEditingSale(sale);
    setSaleForm({
      product_id: sale.product_id,
      original_price: sale.original_price,
      sale_price: sale.sale_price,
      is_active: sale.is_active,
      start_date: sale.start_date ? new Date(sale.start_date) : undefined,
      end_date: sale.end_date ? new Date(sale.end_date) : undefined
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Sales Management</h2>
      </div>

      <Tabs defaultValue="product-sales" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="product-sales" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Product Sales
          </TabsTrigger>
          <TabsTrigger value="bundle-deals" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Bundle Deals
          </TabsTrigger>
          <TabsTrigger value="global-settings" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Global Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="product-sales" className="space-y-4">
          <Card className="bg-zinc-900 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Product Sales</CardTitle>
              <Button 
                onClick={() => setShowCreateSale(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Sale
              </Button>
            </CardHeader>
            <CardContent>
              {showCreateSale && (
                <Card className="bg-zinc-800 border-gray-600 mb-4">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Create New Sale</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-gray-300 text-sm font-medium">Select Product</label>
                      <select
                        value={saleForm.product_id}
                        onChange={(e) => setSaleForm({...saleForm, product_id: e.target.value})}
                        className="w-full mt-1 p-2 bg-zinc-700 border border-gray-600 rounded text-white"
                      >
                        <option value="">Choose a product</option>
                        {products.map(product => (
                          <option key={product.id} value={product.id}>
                            {product.name} - TK {product.price}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-gray-300 text-sm font-medium">Original Price</label>
                        <Input
                          type="number"
                          value={saleForm.original_price}
                          onChange={(e) => setSaleForm({...saleForm, original_price: parseInt(e.target.value) || 0})}
                          className="bg-zinc-700 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-gray-300 text-sm font-medium">Sale Price</label>
                        <Input
                          type="number"
                          value={saleForm.sale_price}
                          onChange={(e) => setSaleForm({...saleForm, sale_price: parseInt(e.target.value) || 0})}
                          className="bg-zinc-700 border-gray-600 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-gray-300 text-sm font-medium">Start Date</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal bg-zinc-700 border-gray-600 text-white",
                                !saleForm.start_date && "text-gray-400"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {saleForm.start_date ? format(saleForm.start_date, "PPP") : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={saleForm.start_date}
                              onSelect={(date) => setSaleForm({...saleForm, start_date: date})}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div>
                        <label className="text-gray-300 text-sm font-medium">End Date</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal bg-zinc-700 border-gray-600 text-white",
                                !saleForm.end_date && "text-gray-400"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {saleForm.end_date ? format(saleForm.end_date, "PPP") : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={saleForm.end_date}
                              onSelect={(date) => setSaleForm({...saleForm, end_date: date})}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={saleForm.is_active}
                        onCheckedChange={(checked) => setSaleForm({...saleForm, is_active: checked})}
                      />
                      <label className="text-gray-300">Sale Active</label>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={handleCreateSale} className="bg-green-600 hover:bg-green-700">
                        Create Sale
                      </Button>
                      <Button 
                        onClick={() => setShowCreateSale(false)} 
                        variant="outline"
                        className="border-gray-600 text-gray-300"
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid gap-4">
                {sales.map(sale => {
                  const product = products.find(p => p.id === sale.product_id);
                  return (
                    <Card key={sale.id} className="bg-zinc-800 border-gray-600">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <h3 className="text-white font-medium">{product?.name || 'Unknown Product'}</h3>
                            <div className="flex items-center gap-4">
                              <span className="text-gray-400 line-through">TK {sale.original_price}</span>
                              <span className="text-red-400 font-bold">TK {sale.sale_price}</span>
                              <Badge variant={sale.is_active ? "default" : "secondary"}>
                                {sale.is_active ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                            {sale.start_date && (
                              <p className="text-gray-400 text-sm">
                                {format(new Date(sale.start_date), "PPP")} - {sale.end_date ? format(new Date(sale.end_date), "PPP") : 'No end date'}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => startEditSale(sale)}
                              className="border-gray-600 text-gray-300"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteSale(sale.id)}
                              className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bundle-deals" className="space-y-4">
          <Card className="bg-zinc-900 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Bundle Deals</CardTitle>
              <Button 
                onClick={() => setShowCreateBundle(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Bundle Deal
              </Button>
            </CardHeader>
            <CardContent>
              {showCreateBundle && (
                <Card className="bg-zinc-800 border-gray-600 mb-4">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Create Bundle Deal</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-gray-300 text-sm font-medium">Deal Name</label>
                      <Input
                        value={bundleForm.name}
                        onChange={(e) => setBundleForm({...bundleForm, name: e.target.value})}
                        className="bg-zinc-700 border-gray-600 text-white"
                      />
                    </div>

                    <div>
                      <label className="text-gray-300 text-sm font-medium">Description</label>
                      <Input
                        value={bundleForm.description}
                        onChange={(e) => setBundleForm({...bundleForm, description: e.target.value})}
                        className="bg-zinc-700 border-gray-600 text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-gray-300 text-sm font-medium">Discount Percentage</label>
                        <Input
                          type="number"
                          value={bundleForm.discount_percentage}
                          onChange={(e) => setBundleForm({...bundleForm, discount_percentage: parseInt(e.target.value) || 0})}
                          className="bg-zinc-700 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-gray-300 text-sm font-medium">Minimum Quantity</label>
                        <Input
                          type="number"
                          value={bundleForm.minimum_quantity}
                          onChange={(e) => setBundleForm({...bundleForm, minimum_quantity: parseInt(e.target.value) || 0})}
                          className="bg-zinc-700 border-gray-600 text-white"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={bundleForm.is_active}
                        onCheckedChange={(checked) => setBundleForm({...bundleForm, is_active: checked})}
                      />
                      <label className="text-gray-300">Bundle Deal Active</label>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={handleCreateBundle} className="bg-green-600 hover:bg-green-700">
                        Create Bundle Deal
                      </Button>
                      <Button 
                        onClick={() => setShowCreateBundle(false)} 
                        variant="outline"
                        className="border-gray-600 text-gray-300"
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid gap-4">
                {bundleDeals.map(deal => (
                  <Card key={deal.id} className="bg-zinc-800 border-gray-600">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <h3 className="text-white font-medium">{deal.name}</h3>
                          <p className="text-gray-400 text-sm">{deal.description}</p>
                          <div className="flex items-center gap-4">
                            <span className="text-green-400 font-bold">{deal.discount_percentage}% OFF</span>
                            <Badge variant={deal.is_active ? "default" : "secondary"}>
                              {deal.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateBundleDeal(deal.id, { is_active: !deal.is_active })}
                            className="border-gray-600 text-gray-300"
                          >
                            {deal.is_active ? 'Deactivate' : 'Activate'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="global-settings" className="space-y-4">
          <Card className="bg-zinc-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Global Sale Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-gray-300 text-sm font-medium">Sale Title</label>
                <Input
                  value={globalSaleForm.global_sale_title}
                  onChange={(e) => setGlobalSaleForm({...globalSaleForm, global_sale_title: e.target.value})}
                  placeholder="e.g., MEGA SALE - 50% OFF"
                  className="bg-zinc-700 border-gray-600 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-300 text-sm font-medium">Sale Start Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal bg-zinc-700 border-gray-600 text-white",
                          !globalSaleForm.global_sale_start && "text-gray-400"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {globalSaleForm.global_sale_start ? format(globalSaleForm.global_sale_start, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={globalSaleForm.global_sale_start}
                        onSelect={(date) => setGlobalSaleForm({...globalSaleForm, global_sale_start: date})}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <label className="text-gray-300 text-sm font-medium">Sale End Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal bg-zinc-700 border-gray-600 text-white",
                          !globalSaleForm.global_sale_end && "text-gray-400"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {globalSaleForm.global_sale_end ? format(globalSaleForm.global_sale_end, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={globalSaleForm.global_sale_end}
                        onSelect={(date) => setGlobalSaleForm({...globalSaleForm, global_sale_end: date})}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={globalSaleForm.global_sale_active}
                  onCheckedChange={(checked) => setGlobalSaleForm({...globalSaleForm, global_sale_active: checked})}
                />
                <label className="text-gray-300">Global Sale Active</label>
              </div>

              <Button onClick={handleUpdateGlobalSale} className="bg-green-600 hover:bg-green-700">
                Update Global Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Sale Modal */}
      {editingSale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="bg-zinc-900 border-gray-700 w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="text-white">Edit Sale</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-300 text-sm font-medium">Original Price</label>
                  <Input
                    type="number"
                    value={saleForm.original_price}
                    onChange={(e) => setSaleForm({...saleForm, original_price: parseInt(e.target.value) || 0})}
                    className="bg-zinc-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <label className="text-gray-300 text-sm font-medium">Sale Price</label>
                  <Input
                    type="number"
                    value={saleForm.sale_price}
                    onChange={(e) => setSaleForm({...saleForm, sale_price: parseInt(e.target.value) || 0})}
                    className="bg-zinc-700 border-gray-600 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={saleForm.is_active}
                  onCheckedChange={(checked) => setSaleForm({...saleForm, is_active: checked})}
                />
                <label className="text-gray-300">Sale Active</label>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleUpdateSale} className="bg-green-600 hover:bg-green-700">
                  Update Sale
                </Button>
                <Button 
                  onClick={() => setEditingSale(null)} 
                  variant="outline"
                  className="border-gray-600 text-gray-300"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SalesManagement;
