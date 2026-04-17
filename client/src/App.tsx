import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import AdminLayout from './layouts/AdminLayout';

import Home from './pages/public/Home';
import Blogs from './pages/public/Blogs';
import SinglePost from './pages/public/SinglePost';
import Profile from './pages/public/Profile';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

import Dashboard from './pages/admin/Dashboard';
import CreatePost from './pages/admin/CreatePost';
import Library from './pages/admin/Library';
import Categories from './pages/admin/Categories';
import Moderation from './pages/admin/Moderation';
import NotFound from './pages/public/NotFound';

import { PrivateRoute, AdminRoute } from './components/RouteGuards';
import { useAuth } from './context/AuthContext';
import Loader from './components/Loader';

function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-background-dark">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/article/:slug" element={<SinglePost />} />
          <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />
        </Route>

        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Route>

        {/* Admin Routes (strict /admin umbrella) */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="posts" element={<Dashboard />} />
          <Route path="library" element={<Library />} />
          <Route path="posts/new" element={<CreatePost />} />
          <Route path="posts/:id/edit" element={<CreatePost />} />
          <Route path="categories" element={<Categories />} />
          <Route path="moderation" element={<Moderation />} />
        </Route>

        {/* Catch-all 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
