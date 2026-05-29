// services/mockData.js — Simulates a real REST API with artificial delay

const delay = (ms = 400) => new Promise(res => setTimeout(res, ms + Math.random() * 200))

// ─── Seed Data ────────────────────────────────────────────────────────────────

export const USERS = [
  { id: 1, name: 'Aria Chen',      email: 'aria@nexus.io',      role: 'admin', avatar: 'AC', status: 'active',   joined: '2024-01-10', orders: 24, spent: 4280 },
  { id: 2, name: 'Marcus Webb',    email: 'marcus@example.com', role: 'user',  avatar: 'MW', status: 'active',   joined: '2024-02-14', orders: 8,  spent: 890  },
  { id: 3, name: 'Sofia Reyes',    email: 'sofia@example.com',  role: 'user',  avatar: 'SR', status: 'inactive', joined: '2024-01-22', orders: 3,  spent: 230  },
  { id: 4, name: 'James Okafor',   email: 'james@example.com',  role: 'user',  avatar: 'JO', status: 'active',   joined: '2024-03-05', orders: 15, spent: 2140 },
  { id: 5, name: 'Lena Müller',    email: 'lena@example.com',   role: 'user',  avatar: 'LM', status: 'active',   joined: '2024-03-18', orders: 6,  spent: 670  },
]

let PRODUCTS = [
  { id: 1, name: 'Nexus Pro Keyboard', category: 'Electronics', price: 189.99, stock: 42, status: 'active',       sku: 'NPK-001', sales: 128, image: '⌨️' },
  { id: 2, name: 'ErgoFlow Mouse',     category: 'Electronics', price: 79.99,  stock: 87, status: 'active',       sku: 'EFM-002', sales: 256, image: '🖱️' },
  { id: 3, name: 'Apex Monitor 27"',   category: 'Electronics', price: 549.99, stock: 12, status: 'active',       sku: 'APM-003', sales: 64,  image: '🖥️' },
  { id: 4, name: 'CloudPad Pro',       category: 'Accessories', price: 49.99,  stock: 0,  status: 'out_of_stock', sku: 'CPP-004', sales: 389, image: '📱' },
  { id: 5, name: 'Zenith Headset',     category: 'Audio',       price: 299.99, stock: 28, status: 'active',       sku: 'ZHH-005', sales: 97,  image: '🎧' },
  { id: 6, name: 'HubLink USB-C',      category: 'Accessories', price: 39.99,  stock: 156,status: 'active',       sku: 'HLC-006', sales: 512, image: '🔌' },
  { id: 7, name: 'StreamCam 4K',       category: 'Electronics', price: 219.99, stock: 34, status: 'active',       sku: 'SC4-007', sales: 78,  image: '📷' },
  { id: 8, name: 'DeskPad XL',         category: 'Accessories', price: 34.99,  stock: 5,  status: 'low_stock',    sku: 'DPX-008', sales: 201, image: '🗂️' },
]

let ORDERS = [
  { id: 'ORD-7821', customer: 'Aria Chen',    email: 'aria@nexus.io',      items: 3, total: 449.97, status: 'delivered',  date: '2024-03-14', payment: 'card' },
  { id: 'ORD-7820', customer: 'James Okafor', email: 'james@example.com',  items: 1, total: 549.99, status: 'shipped',    date: '2024-03-14', payment: 'paypal' },
  { id: 'ORD-7819', customer: 'Lena Müller',  email: 'lena@example.com',   items: 2, total: 129.98, status: 'processing', date: '2024-03-13', payment: 'card' },
  { id: 'ORD-7818', customer: 'Marcus Webb',  email: 'marcus@example.com', items: 1, total: 299.99, status: 'pending',    date: '2024-03-13', payment: 'card' },
  { id: 'ORD-7817', customer: 'Sofia Reyes',  email: 'sofia@example.com',  items: 4, total: 219.96, status: 'cancelled',  date: '2024-03-12', payment: 'card' },
  { id: 'ORD-7816', customer: 'Aria Chen',    email: 'aria@nexus.io',      items: 2, total: 389.98, status: 'delivered',  date: '2024-03-12', payment: 'paypal' },
  { id: 'ORD-7815', customer: 'James Okafor', email: 'james@example.com',  items: 1, total: 189.99, status: 'delivered',  date: '2024-03-11', payment: 'card' },
  { id: 'ORD-7814', customer: 'Marcus Webb',  email: 'marcus@example.com', items: 3, total: 169.97, status: 'shipped',    date: '2024-03-11', payment: 'card' },
  { id: 'ORD-7813', customer: 'Lena Müller',  email: 'lena@example.com',   items: 1, total: 79.99,  status: 'delivered',  date: '2024-03-10', payment: 'paypal' },
  { id: 'ORD-7812', customer: 'Sofia Reyes',  email: 'sofia@example.com',  items: 2, total: 109.98, status: 'delivered',  date: '2024-03-10', payment: 'card' },
  { id: 'ORD-7811', customer: 'Aria Chen',    email: 'aria@nexus.io',      items: 1, total: 549.99, status: 'refunded',   date: '2024-03-09', payment: 'card' },
  { id: 'ORD-7810', customer: 'James Okafor', email: 'james@example.com',  items: 5, total: 629.95, status: 'delivered',  date: '2024-03-09', payment: 'card' },
]

const MONTHLY_REVENUE = [38400, 42100, 39800, 51200, 48600, 56800, 61400, 58200, 64100, 71300, 68900, 82400]
const MONTHLY_ORDERS  = [312, 341, 298, 412, 389, 451, 498, 467, 521, 578, 549, 634]
const MONTHLY_USERS   = [48, 62, 55, 71, 83, 94, 102, 89, 118, 134, 121, 156]

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const mockAuth = {
  async login(email, password) {
    await delay(600)
    const user = USERS.find(u => u.email === email)
    if (!user || password.length < 4) throw new Error('Invalid credentials')
    const token = btoa(`${user.id}:${Date.now()}`)
    return { token, user }
  },
  async me(token) {
    await delay(200)
    if (!token) throw new Error('Unauthorized')
    const userId = parseInt(atob(token).split(':')[0])
    const user = USERS.find(u => u.id === userId)
    if (!user) throw new Error('User not found')
    return user
  }
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export const mockDashboard = {
  async getStats() {
    await delay()
    return {
      totalRevenue:    { value: 482640, change: +18.4, trend: 'up' },
      totalOrders:     { value: 4893,   change: +12.7, trend: 'up' },
      totalUsers:      { value: 1284,   change: +8.2,  trend: 'up' },
      avgOrderValue:   { value: 98.64,  change: -2.1,  trend: 'down' },
      revenueByMonth:  MONTHLY_REVENUE,
      ordersByMonth:   MONTHLY_ORDERS,
      usersByMonth:    MONTHLY_USERS,
      topProducts: [...PRODUCTS].sort((a,b) => b.sales - a.sales).slice(0,5),
      ordersByStatus: {
        delivered:  ORDERS.filter(o => o.status === 'delivered').length,
        shipped:    ORDERS.filter(o => o.status === 'shipped').length,
        processing: ORDERS.filter(o => o.status === 'processing').length,
        pending:    ORDERS.filter(o => o.status === 'pending').length,
        cancelled:  ORDERS.filter(o => o.status === 'cancelled').length,
      }
    }
  }
}

// ─── Products ─────────────────────────────────────────────────────────────────

export const mockProducts = {
  async list({ page = 1, perPage = 6, search = '', category = '', status = '' } = {}) {
    await delay()
    let filtered = [...PRODUCTS]
    if (search)   filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()))
    if (category) filtered = filtered.filter(p => p.category === category)
    if (status)   filtered = filtered.filter(p => p.status === status)
    const total = filtered.length
    const items = filtered.slice((page - 1) * perPage, page * perPage)
    return { items, total, page, perPage, totalPages: Math.ceil(total / perPage) }
  },
  async create(data) {
    await delay()
    const product = { ...data, id: Date.now(), sales: 0, status: data.stock > 10 ? 'active' : data.stock > 0 ? 'low_stock' : 'out_of_stock' }
    PRODUCTS.unshift(product)
    return product
  },
  async update(id, data) {
    await delay()
    const idx = PRODUCTS.findIndex(p => p.id === id)
    if (idx === -1) throw new Error('Product not found')
    PRODUCTS[idx] = { ...PRODUCTS[idx], ...data, status: data.stock > 10 ? 'active' : data.stock > 0 ? 'low_stock' : 'out_of_stock' }
    return PRODUCTS[idx]
  },
  async delete(id) {
    await delay()
    PRODUCTS = PRODUCTS.filter(p => p.id !== id)
    return { success: true }
  }
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export const mockOrders = {
  async list({ page = 1, perPage = 8, search = '', status = '' } = {}) {
    await delay()
    let filtered = [...ORDERS]
    if (search) filtered = filtered.filter(o =>
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.email.toLowerCase().includes(search.toLowerCase())
    )
    if (status) filtered = filtered.filter(o => o.status === status)
    const total = filtered.length
    const items = filtered.slice((page - 1) * perPage, page * perPage)
    return { items, total, page, perPage, totalPages: Math.ceil(total / perPage) }
  },
  async updateStatus(id, status) {
    await delay()
    const order = ORDERS.find(o => o.id === id)
    if (!order) throw new Error('Order not found')
    order.status = status
    return order
  },
  getPendingCount() {
    return ORDERS.filter(o => ['pending', 'processing'].includes(o.status)).length
  }
}

// ─── Users ────────────────────────────────────────────────────────────────────

export const mockUsers = {
  async list() {
    await delay()
    return [...USERS]
  },
  async updateRole(id, role) {
    await delay()
    const user = USERS.find(u => u.id === id)
    if (!user) throw new Error('User not found')
    user.role = role
    return user
  },
  async updateStatus(id, status) {
    await delay()
    const user = USERS.find(u => u.id === id)
    if (!user) throw new Error('User not found')
    user.status = status
    return user
  },
  async create(data) {
    await delay()
    const user = { ...data, id: Date.now(), avatar: data.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2), orders: 0, spent: 0, joined: new Date().toISOString().split('T')[0] }
    USERS.push(user)
    return user
  }
}
