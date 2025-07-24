
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../types/Product';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';

interface ProductsContextType {
  products: Product[];
  loading: boolean;
  updateProduct: (product: Product) => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  refreshProducts: () => Promise<void>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      console.log('Fetching products from database...');
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (productsError) throw productsError;

      // Fetch active sales
      const { data: salesData, error: salesError } = await supabase
        .from('sales')
        .select('*')
        .eq('is_active', true)
        .gte('end_date', new Date().toISOString());

      if (salesError) throw salesError;

      // Transform database fields to match our Product interface
      const transformedProducts = productsData.map(product => {
        const sale = salesData?.find(s => s.product_id === product.id);
        
        // Convert color_variants from Json to ColorVariant[]
        let colorVariants: any = undefined;
        if (product.color_variants) {
          try {
            colorVariants = Array.isArray(product.color_variants) 
              ? product.color_variants 
              : JSON.parse(product.color_variants as string);
          } catch (error) {
            console.error('Error parsing color_variants:', error);
            colorVariants = undefined;
          }
        }
        
        return {
          ...product,
          category: product.category as 'drivers' | 'f1-classic' | 'teams' | 'mousepads',
          images: product.images || (product.image_url ? [product.image_url] : []),
          tags: product.tags || [],
          is_active: product.is_active !== undefined ? product.is_active : true,
          slug: product.slug,
          color_variants: colorVariants,
          size_variants: product.size_variants ? (Array.isArray(product.size_variants) ? product.size_variants : JSON.parse(product.size_variants as string)) : undefined,
          main_image: product.main_image,
          // Add sale information if available
          ...(sale && {
            originalPrice: sale.original_price,
            price: sale.sale_price,
            saleInfo: {
              title: sale.sale_title,
              description: sale.sale_description,
              endDate: sale.end_date
            }
          })
        };
      });

      console.log('Fetched products:', transformedProducts);
      setProducts(transformedProducts);
      
      // Update cart with current product prices
      if ((window as any).updateCartProducts) {
        (window as any).updateCartProducts(transformedProducts);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const updateProduct = async (updatedProduct: Product) => {
    try {
      console.log('Updating product:', updatedProduct);
      const { error } = await supabase
        .from('products')
        .update({
          name: updatedProduct.name,
          description: updatedProduct.description,
          price: updatedProduct.price,
          category: updatedProduct.category,
          sizes: updatedProduct.sizes,
          image_url: updatedProduct.image_url,
          images: updatedProduct.images,
          tags: updatedProduct.tags,
          is_active: updatedProduct.is_active,
          color_variants: updatedProduct.color_variants as any || null,
          size_variants: updatedProduct.size_variants as any || null,
          main_image: updatedProduct.main_image
        })
        .eq('id', updatedProduct.id);

      if (error) throw error;

      setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
      toast.success('Product updated successfully');
      console.log('Product updated in database successfully');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    }
  };

  const addProduct = async (newProduct: Omit<Product, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert({
          name: newProduct.name,
          description: newProduct.description,
          price: newProduct.price,
          category: newProduct.category,
          sizes: newProduct.sizes,
          image_url: newProduct.image_url,
          images: newProduct.images,
          tags: newProduct.tags,
          is_active: newProduct.is_active !== undefined ? newProduct.is_active : true,
          color_variants: newProduct.color_variants as any || null,
          size_variants: newProduct.size_variants as any || null,
          main_image: newProduct.main_image
        })
        .select()
        .single();

      if (error) throw error;

      const product = { 
        ...data, 
        category: data.category as 'drivers' | 'f1-classic' | 'teams' | 'mousepads',
        images: data.images || (data.image_url ? [data.image_url] : []),
        tags: data.tags || [],
        is_active: data.is_active !== undefined ? data.is_active : true,
        slug: data.slug,
        color_variants: data.color_variants ? (Array.isArray(data.color_variants) ? data.color_variants : JSON.parse(data.color_variants as string)) : undefined,
        size_variants: data.size_variants ? (Array.isArray(data.size_variants) ? data.size_variants : JSON.parse(data.size_variants as string)) : undefined,
        main_image: data.main_image
      };
      setProducts(prev => [product, ...prev]);
      toast.success('Product added successfully');
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product');
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProducts(prev => prev.filter(p => p.id !== id));
      toast.success('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const refreshProducts = async () => {
    console.log('Refreshing products...');
    await fetchProducts();
  };

  return (
    <ProductsContext.Provider value={{ 
      products, 
      loading, 
      updateProduct, 
      addProduct, 
      deleteProduct, 
      refreshProducts 
    }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};
