import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { OrderProvider } from "@/context/OrderContext";
import { SearchProvider } from "@/context/SearchContext";
import { AuthProvider } from "@/context/AuthContext";
import { InventoryProvider } from "@/context/InventoryContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileNav from "@/components/layout/MobileNav";
import HomePage from "@/pages/HomePage";
import SearchPage from "@/pages/SearchPage";
import CategoryPage from "@/pages/CategoryPage";
import BrandPage from "@/pages/BrandPage";
import BrandsPage from "@/pages/BrandsPage";
import PhoneDetailPage from "@/pages/PhoneDetailPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import OrderConfirmationPage from "@/pages/OrderConfirmationPage";
import TrackOrderPage from "@/pages/TrackOrderPage";
import OrdersPage from "@/pages/OrdersPage";
import AuthPage from "@/pages/AuthPage";
import AdminDashboard from "@/pages/AdminDashboard";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <InventoryProvider>
          <CartProvider>
            <OrderProvider>
              <SearchProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <div className="min-h-screen flex flex-col">
                  <Header />
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/search" element={<SearchPage />} />
                      <Route path="/category/:slug" element={<CategoryPage />} />
                      <Route path="/brand/:name" element={<BrandPage />} />
                      <Route path="/brands" element={<BrandsPage />} />
                      <Route path="/phone/:id" element={<PhoneDetailPage />} />
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/checkout" element={<CheckoutPage />} />
                      <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
                      <Route path="/track-order/:orderId" element={<TrackOrderPage />} />
                      <Route path="/orders" element={<OrdersPage />} />
                      <Route path="/auth" element={<AuthPage />} />
                      <Route path="/admin" element={<AdminDashboard />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                  <Footer />
                  <MobileNav />
                </div>
              </BrowserRouter>
              </SearchProvider>
            </OrderProvider>
          </CartProvider>
        </InventoryProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
