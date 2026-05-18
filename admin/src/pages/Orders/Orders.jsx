import React, { useEffect, useState, useMemo } from 'react'
import axios from 'axios'
import { backendUrl } from '../../App'
import { toast } from 'react-toastify'
import { FiDownload, FiChevronDown, FiSearch, FiGrid, FiExternalLink, FiChevronLeft, FiChevronRight, FiMoreVertical, FiTrendingUp, FiTrendingDown } from 'react-icons/fi'
import { BsCalendar2Fill } from 'react-icons/bs'
import { AiOutlineInfoCircle } from 'react-icons/ai'
import * as XLSX from 'xlsx'
import './Orders.css'


const Orders = ({ token }) => {

  const [orders, setOrders] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState('table') // 'table' or 'grid'
  const [isExpanded, setIsExpanded] = useState(false)

  const fetchAllOrders = async () => {
    
    if(!token){
      return null;
    }

    try {
      const response = await axios.post(backendUrl + '/api/order/list', {}, {headers:{ token }})
      if(response.data.success){
        setOrders(response.data.orders)
      }else{
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }

  }

  const statusHandler = async ( event, orderId) => {

     try {
      const response = await axios.post(backendUrl + '/api/order/status', {orderId, status:event.target.value}, { headers: {token}})
      if(response.data.success){
        await fetchAllOrders()
      }
     } catch (error) {
      console.log(error);
      toast.error(response.data.message)
      
     }
  }

  // Export orders to Excel
  const exportToExcel = () => {
    try {
      // Prepare data for export
      const exportData = filteredOrders.map((order, index) => ({
        'Sr No': index + 1,
        'Order ID': order._id,
        'Customer Name': `${order.address?.firstName || ''} ${order.address?.lastName || ''}`.trim() || '-',
        'Products': order.items?.map(item => `${item.name} (x${item.quantity})`).join(', ') || '-',
        'Total Amount': `₹${order.amount}`,
        'Mobile': order.address?.phone || '-',
        'Payment Method': order.paymentMethod || '-',
        'Payment Status': order.payment ? 'Paid' : 'Pending',
        'Address': order.address ? `${order.address.street}, ${order.address.city}, ${order.address.state}, ${order.address.zipcode}` : '-',
        'Date': new Date(order.date).toLocaleDateString(),
        'Status': order.status || 'Order Placed'
      }))

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(exportData)
      
      // Set column widths
      ws['!cols'] = [
        { wch: 8 },  // Sr No
        { wch: 25 }, // Order ID
        { wch: 20 }, // Customer Name
        { wch: 40 }, // Products
        { wch: 15 }, // Total Amount
        { wch: 15 }, // Mobile
        { wch: 15 }, // Payment Method
        { wch: 15 }, // Payment Status
        { wch: 40 }, // Address
        { wch: 12 }, // Date
        { wch: 20 }  // Status
      ]

      // Create workbook
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Orders')

      // Generate filename with current date
      const filename = `Orders_${new Date().toISOString().split('T')[0]}.xlsx`

      // Download file
      XLSX.writeFile(wb, filename)
      toast.success('Orders exported successfully!')
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export orders')
    }
  }

  // Calculate statistics
  const stats = useMemo(() => {
    const DAY = 24 * 60 * 60 * 1000
    const now = Date.now()
    const currentStart = now - 7 * DAY
    const previousStart = now - 14 * DAY

    const currentOrders = orders.filter(o => (o.date || 0) >= currentStart)
    const previousOrders = orders.filter(o => (o.date || 0) >= previousStart && (o.date || 0) < currentStart)

    const sumAmount = list => list.reduce((s, o) => s + (o.amount || 0), 0)
    const totalRevenue = sumAmount(currentOrders)
    const totalOrders = currentOrders.length
    const prevRevenue = sumAmount(previousOrders)
    const prevOrders = previousOrders.length

    const pct = (prev, curr) => {
      if (prev > 0) return ((curr - prev) / prev) * 100
      return curr > 0 ? 100 : 0
    }

    const revenuePct = pct(prevRevenue, totalRevenue)
    const ordersPct = pct(prevOrders, totalOrders)
    const aov = totalOrders ? totalRevenue / totalOrders : 0

    return { totalRevenue, totalOrders, revenuePct, ordersPct, aov }
  }, [orders])

  // Filter orders based on search
  const filteredOrders = useMemo(() => {
    return orders.filter(order => 
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.address?.phone?.includes(searchTerm) ||
      order.address?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.address?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items?.some(item => item.name?.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }, [orders, searchTerm])

  useEffect(()=>{
    fetchAllOrders();
  }, [token])

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1 className="page-title">Orders</h1>
        <div className="export-section">
          <button className="export-btn" onClick={exportToExcel}><FiDownload /> Download</button>
        </div>
      </div>

      {/* Stats Section (single panel like screenshot) */}
      <div className="stats-panel">
        {/* Today Pill */}
        <div className="panel-today">
          <div className="panel-today-badge">
            <span className="panel-today-icon"><BsCalendar2Fill /></span>
            <span className="panel-today-text">Today</span>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="panel-metric">
          <div className="metric-header">
            <span className="metric-title">Total Revenue</span>
            <AiOutlineInfoCircle className="metric-info" />
          </div>
          <div className="metric-row">
            <div className="metric-value">₹{stats.totalRevenue.toLocaleString()}</div>
            <div className="metric-right">
              <span className={`trend-badge ${stats.revenuePct >= 0 ? 'trend-blue' : 'trend-red'}`}>
                {stats.revenuePct >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
                {Math.abs(stats.revenuePct).toFixed(1)}%
              </span>
              <span className="trend-text">from last week</span>
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="panel-metric">
          <div className="metric-header">
            <span className="metric-title">Total Orders</span>
            <AiOutlineInfoCircle className="metric-info" />
          </div>
          <div className="metric-row">
            <div className="metric-value">{stats.totalOrders}</div>
            <div className="metric-right">
              <span className={`trend-badge ${stats.ordersPct >= 0 ? 'trend-blue' : 'trend-red'}`}>
                {stats.ordersPct >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
                {Math.abs(stats.ordersPct).toFixed(1)}%
              </span>
              <span className="trend-text">from last week</span>
            </div>
          </div>
        </div>

        {/* Average Order Value */}
        <div className="panel-metric">
          <div className="metric-header">
            <span className="metric-title">Avg. Order Value</span>
            <AiOutlineInfoCircle className="metric-info" />
          </div>
          <div className="metric-row">
            <div className="metric-value">₹{Math.round(stats.aov).toLocaleString()}</div>
            <div className="metric-right">
              <span className="trend-text">based on this week</span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Summary Section */}
      <div className={`order-summary-section ${isExpanded ? 'expanded' : ''}`}>
        <div className="summary-header">
          <div className="summary-header-left">
            <h2 className="summary-title">Order Summary</h2>
            <p className="summary-description">Overview of total orders, returns, and revenue.</p>
          </div>
          <div className="summary-header-right">
            <div className="search-box">
              <FiSearch className="search-icon" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              className={`control-btn ${viewMode === 'grid' ? 'active' : ''}`}
              title="Grid view"
              onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}
            >
              <FiGrid />
            </button>
            <button 
              className={`control-btn ${isExpanded ? 'active' : ''}`}
              title="Expand"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <FiExternalLink />
            </button>
          </div>
        </div>

        {/* Table or Grid View */}
        <div className={`table-wrapper ${isExpanded ? 'expanded' : ''}`}>
          {filteredOrders.length === 0 ? (
            <div className="empty-state">
              <p>No orders found</p>
            </div>
          ) : viewMode === 'grid' ? (
            /* Grid View */
            <div className="orders-grid">
              {filteredOrders.map((order, idx) => (
                <div key={order._id || idx} className="order-grid-card">
                  <div className="grid-card-header">
                    <div className="order-id-badge">#{order._id.substring(0, 8)}</div>
                    <span className={`payment-badge ${order.payment ? '' : 'unpaid'}`}>
                      {order.payment ? 'Paid' : 'Pending'}
                    </span>
                  </div>
                  
                  <div className="grid-card-body">
                    <div className="grid-row">
                      <span className="grid-label">Products:</span>
                      <span className="grid-value">
                        {order.items.map((item, i) => (
                          <span key={i}>
                            {item.name}
                            {i < order.items.length - 1 && ', '}
                          </span>
                        ))}
                      </span>
                    </div>
                    
                    <div className="grid-row">
                      <span className="grid-label">Amount:</span>
                      <span className="grid-value price">₹{order.amount}</span>
                    </div>
                    
                    <div className="grid-row">
                      <span className="grid-label">Mobile:</span>
                      <span className="grid-value">{order.address?.phone || '-'}</span>
                    </div>
                    
                    <div className="grid-row">
                      <span className="grid-label">Method:</span>
                      <span className="grid-value">{order.paymentMethod}</span>
                    </div>
                    
                    <div className="grid-row">
                      <span className="grid-label">Address:</span>
                      <span className="grid-value">{order.address?.street}, {order.address?.city}</span>
                    </div>
                    
                    <div className="grid-row">
                      <span className="grid-label">Date:</span>
                      <span className="grid-value">{new Date(order.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="grid-card-footer">
                    <select 
                      onChange={(event)=>statusHandler(event, order._id)} 
                      value={order.status}
                      className="status-select"
                    >
                      <option>Order Placed</option>
                      <option>Packing</option>
                      <option>Shipped</option>
                      <option>Out for delivery</option>
                      <option>Delivered</option>
                    </select>
                    <button className="action-btn"><FiMoreVertical /></button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Table View */
            <table className="orders-table">
              <thead>
                <tr>
                  <th><input type="checkbox" /></th>
                  <th>Order ID</th>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th>Mobile</th>
                  <th>Method</th>
                  <th>Payment</th>
                  <th>Address</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, idx) => (
                  <tr key={order._id || idx}>
                    <td><input type="checkbox" /></td>
                    <td className="order-id">{order._id.substring(0, 8)}</td>
                    <td className="product-name">
                      {order.items.map((item, i) => (
                        <span key={i}>
                          {item.name}
                          {i < order.items.length - 1 && ', '}
                        </span>
                      ))}
                    </td>
                    <td className="price">₹{order.amount}</td>
                    <td className="mobile">{order.address?.phone || '-'}</td>
                    <td className="method">{order.paymentMethod}</td>
                    <td className="payment">
                      <span className={`payment-badge ${order.payment ? 'paid' : 'pending'}`}>
                        {order.payment ? 'Paid' : 'Pending'}
                      </span>
                    </td>
                    <td className="address">
                      {order.address?.street}, {order.address?.city}
                    </td>
                    <td className="date">{new Date(order.date).toLocaleDateString()}</td>
                    <td className="action">
                      <div className="action-menu">
                        <select 
                          onChange={(event)=>statusHandler(event, order._id)} 
                          value={order.status}
                          className="status-select"
                        >
                          <option>Order Placed</option>
                          <option>Packing</option>
                          <option>Shipped</option>
                          <option>Out for delivery</option>
                          <option>Delivered</option>
                        </select>
                        <button className="action-btn"><FiMoreVertical /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="pagination">
          <span className="items-per-page">Items per page <select><option>10</option><option>20</option><option>50</option></select></span>
          <div className="pagination-controls">
            <button className="pag-btn"><FiChevronLeft /> Previous</button>
            <button className="pag-btn active">1</button>
            <button className="pag-btn">2</button>
            <button className="pag-btn">3</button>
            <button className="pag-btn">Next <FiChevronRight /></button>
          </div>
        </div>
      </div>
    </div>
  )

}

export default Orders
