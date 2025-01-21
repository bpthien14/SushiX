import { createRouter, RouterProvider } from '@tanstack/react-router'
import { createRootRoute, createRoute } from '@tanstack/react-router'
import UserAuthForm from './app/auth/login/page'

// Định nghĩa root route
const rootRoute = createRootRoute({
  component: () => <Outlet />,
})

// Định nghĩa các routes
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: UserAuthForm,
})

const forgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/forgot-password',
  component: () => <div>Forgot Password Page</div>, // Thay thế bằng component thực tế
})

// Tạo router với các routes đã định nghĩa
const routeTree = rootRoute.addChildren([loginRoute, forgotPasswordRoute])

export const router = createRouter({ routeTree })

