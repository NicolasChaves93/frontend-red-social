import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import PrivateRoute from "../shared/components/PrivateRoute";
import Spinner from "../shared/components/Spinner";

// Lazy load de páginas
const LoginPage = lazy(() => import("../features/auth/pages/LoginPage"));
const RegisterPage = lazy(() => import("../features/auth/pages/RegisterPage"));
const PostsPage = lazy(() => import("../features/posts/pages/PostsPage"));
const ProfilePage = lazy(() => import("../features/profile/pages/ProfilePage"));

export default function AppRouter() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="/" element={<Navigate to="/posts" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route element={<AppLayout />}>
          <Route path="/posts" element={
            <PrivateRoute>
              <PostsPage />
            </PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          } />
          <Route path="/profile/:id" element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          } />
        </Route>
      </Routes>
    </Suspense>
  );
}
