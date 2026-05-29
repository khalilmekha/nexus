// services/api.js — Service layer (swap mock* for real fetch calls later)
import { mockAuth, mockDashboard, mockProducts, mockOrders, mockUsers } from './mockData'

const handleError = (e) => { throw new Error(e?.message || 'Something went wrong') }

export const authService = {
  login:  (email, password) => mockAuth.login(email, password).catch(handleError),
  me:     (token)           => mockAuth.me(token).catch(handleError),
}

export const dashboardService = {
  getStats: () => mockDashboard.getStats().catch(handleError),
}

export const productService = {
  list:   (params) => mockProducts.list(params).catch(handleError),
  create: (data)   => mockProducts.create(data).catch(handleError),
  update: (id, d)  => mockProducts.update(id, d).catch(handleError),
  delete: (id)     => mockProducts.delete(id).catch(handleError),
}

export const orderService = {
  list:         (params)       => mockOrders.list(params).catch(handleError),
  updateStatus: (id, status)   => mockOrders.updateStatus(id, status).catch(handleError),
  getPendingCount: ()          => mockOrders.getPendingCount(),
}

export const userService = {
  list:         ()             => mockUsers.list().catch(handleError),
  updateRole:   (id, role)     => mockUsers.updateRole(id, role).catch(handleError),
  updateStatus: (id, status)   => mockUsers.updateStatus(id, status).catch(handleError),
  create:       (data)         => mockUsers.create(data).catch(handleError),
}
