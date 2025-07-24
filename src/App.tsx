
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { ProductsProvider } from "./context/ProductsContext";
import { BannerProvider } from "./context/BannerContext";
import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail";
import CategoryPage from "./pages/CategoryPage";
import ShopAll from "./pages/ShopAll";
import NewProducts from "./pages/NewProducts";
import DriversProducts from "./pages/DriversProducts";
import Sales from "./pages/Sales";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Shipping from "./pages/Shipping";
import Returns from "./pages/Returns";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ProductsProvider>
        <BannerProvider>
          <CartProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/product/:slug" element={<ProductDetail />} />
                <Route path="/shop-all" element={<ShopAll />} />
                <Route path="/drivers" element={<CategoryPage />} />
                <Route path="/f1-classic" element={<CategoryPage />} />
                <Route path="/teams" element={<CategoryPage />} />
                <Route path="/mousepads" element={<CategoryPage />} />
                <Route path="/new-products" element={<NewProducts />} />
                <Route path="/drivers-products" element={<DriversProducts />} />
                <Route path="/sales" element={<Sales />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-success" element={<OrderSuccess />} />
                <Route path="/shipping" element={<Shipping />} />
                <Route path="/returns" element={<Returns />} />
                <Route path="/admin" element={<Admin />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </BannerProvider>
      </ProductsProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
