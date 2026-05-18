import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../../App'
import { toast } from 'react-toastify'
import * as XLSX from 'xlsx'
import './List.css'

const List = ({token}) => {
  const [list, setList] = useState([])
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const perPage = 9

  const fetchList = async () => {
    try {
      const res = await axios.get(backendUrl + '/api/product/list')

      // normalize response to an array
      let items = []
      if (Array.isArray(res.data)) items = res.data
      else if (res.data && res.data.success) items = res.data.data || res.data.products || []
      else items = res.data.data || res.data.products || []

      setList(items || [])
    } catch (err) {
      console.error(err)
      toast.error(err?.message || 'Failed to fetch products')
      setList([])
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  // Filter products based on search query, category, and price
  const safeList = Array.isArray(list) ? list : []
  let filteredList = safeList.filter((item) => {
    const matchesSearch = !searchQuery || (
      (item.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.category || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item._id || '').toLowerCase().includes(searchQuery.toLowerCase())
    )
    
    const matchesCategory = !selectedCategory || (item.category || '').toLowerCase() === selectedCategory.toLowerCase()
    
    const itemPrice = Number(item.price) || 0
    const min = minPrice ? Number(minPrice) : 0
    const max = maxPrice ? Number(maxPrice) : Infinity
    const matchesPrice = itemPrice >= min && itemPrice <= max
    
    return matchesSearch && matchesCategory && matchesPrice
  })
  
  // Sort products
  filteredList = [...filteredList].sort((a, b) => {
    switch(sortBy) {
      case 'price-low':
        return (Number(a.price) || 0) - (Number(b.price) || 0)
      case 'price-high':
        return (Number(b.price) || 0) - (Number(a.price) || 0)
      case 'a-z':
        return (a.name || '').localeCompare(b.name || '')
      case 'z-a':
        return (b.name || '').localeCompare(a.name || '')
      case 'bestseller':
        return (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0)
      case 'newest':
      default:
        return new Date(b.date) - new Date(a.date)
    }
  })

  const total = filteredList.length
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  const startIndex = (page - 1) * perPage
  const endIndex = Math.min(startIndex + perPage, total)
  const visible = filteredList.slice(startIndex, endIndex)

  // Reset page when search, category, price, or sort changes
  useEffect(() => {
    setPage(1)
  }, [searchQuery, selectedCategory, minPrice, maxPrice, sortBy])

  // Export to Excel
  const exportToExcel = () => {
    if (safeList.length === 0) {
      toast.error('No products to export')
      return
    }

    try {
      const excelData = safeList.map((item, index) => ({
        'S.No': index + 1,
        'Product ID': item._id || '',
        'Product Name': item.name || '',
        'Category': item.category || '',
        'Sub Category': item.subCategory || '',
        'Price': item.price || 0,
        'Description': item.description || '',
        'Best Seller': item.bestSeller ? 'Yes' : 'No',
        'Sizes': Array.isArray(item.sizes) ? item.sizes.join(', ') : '',
        'Date Added': item.date ? new Date(item.date).toLocaleDateString() : ''
      }))

      const ws = XLSX.utils.json_to_sheet(excelData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Products')

      ws['!cols'] = [
        { wch: 6 }, { wch: 25 }, { wch: 30 }, { wch: 15 }, { wch: 15 },
        { wch: 10 }, { wch: 50 }, { wch: 12 }, { wch: 20 }, { wch: 15 }
      ]

      const fileName = `Products_${new Date().toISOString().split('T')[0]}.xlsx`
      XLSX.writeFile(wb, fileName)
      toast.success('Products exported successfully!')
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export products')
    }
  }



  const fmtPrice = (p) => {
    if (p == null || Number.isNaN(Number(p))) return '-'
    try {
      return new Intl.NumberFormat(undefined, { style: 'currency', currency: currency || 'USD' }).format(Number(p))
    } catch {
      return `${currency || 'USD'} ${p}`
    }
  }

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(backendUrl + '/api/product/remove', {id}, {headers:{token}})

      if(response.data.success){
        toast.success(response.data.message)
        await fetchList();
      }else{
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const goPrev = () => setPage((p) => Math.max(1, p - 1))
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1))
  const goTo = (n) => setPage(n)

  return (
    <div className="plist-container">
      {/* Header */}
      <div className="plist-header">
        <h1 className="plist-title">Products List</h1>
        
        <div className="plist-actions">
          <button className="plist-btn-secondary" onClick={exportToExcel}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
            </svg>
            Download
          </button>
        </div>
      </div>

      {/* Filters bar */}
      <div className="plist-filters">
        <div className="plist-search-box">
          <svg className="plist-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input 
            type="text" 
            placeholder="Search" 
            className="plist-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <button 
          className="plist-filter-btn"
          onClick={() => setShowFilters(!showFilters)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
          </svg>
          Filter
        </button>
      </div>

      {/* Expandable Filter Panel */}
      {showFilters && (
        <div className="plist-filter-panel">
          <div className="plist-filter-group">
            <label className="plist-filter-label">Category</label>
            <select 
              className="plist-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>
          </div>

          <div className="plist-filter-group">
            <label className="plist-filter-label">Sort By</label>
            <select 
              className="plist-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="a-z">A - Z</option>
              <option value="z-a">Z - A</option>
              <option value="bestseller">Best Sellers</option>
            </select>
          </div>

          <div className="plist-filter-group">
            <label className="plist-filter-label">Price Range</label>
            <div className="plist-price-range">
              <input 
                type="number" 
                placeholder="Min Price" 
                className="plist-price-input"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <span className="plist-price-separator">-</span>
              <input 
                type="number" 
                placeholder="Max Price" 
                className="plist-price-input"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="plist-table-wrap">
        <table className="plist-table">
          <thead className="plist-thead">
            <tr>
              <th className="plist-th plist-th-check">
                <input type="checkbox" className="plist-checkbox" />
              </th>
              <th className="plist-th plist-th-name">Product Name</th>
              <th className="plist-th">Category</th>
              <th className="plist-th">Price</th>
              <th className="plist-th plist-th-action">Action</th>
            </tr>
          </thead>
          <tbody className="plist-tbody">
            {visible.length === 0 ? (
              <tr>
                <td colSpan="5" className="plist-empty">
                  {searchQuery ? `No products found for "${searchQuery}"` : 'No products found'}
                </td>
              </tr>
            ) : (
              visible.map((item) => {
                const id = item._id || item.id
                const img = Array.isArray(item.image) ? item.image[0] : item.image
                
                return (
                  <tr key={id} className="plist-tr">
                    <td className="plist-td plist-td-check">
                      <input type="checkbox" className="plist-checkbox" />
                    </td>
                    <td className="plist-td plist-td-product">
                      <div className="plist-product">
                        <img src={img || '/no-image.png'} alt={item.name || 'product'} className="plist-product-img" />
                        <span className="plist-product-name">{item.name || '-'}</span>
                      </div>
                    </td>
                    <td className="plist-td plist-category">{item.category || '-'}</td>
                    <td className="plist-td plist-price">{fmtPrice(item.price)}</td>
                    <td className="plist-td plist-td-action">
                      <button className="plist-menu-btn" onClick={() => removeProduct(item._id)}>
                        <svg width="4" height="16" viewBox="0 0 4 16" fill="currentColor">
                          <circle cx="2" cy="2" r="2"/><circle cx="2" cy="8" r="2"/><circle cx="2" cy="14" r="2"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="plist-pagination-wrap">
        <div className="plist-result-info">
          Result {total === 0 ? 0 : startIndex + 1}-{endIndex} of {total}
        </div>

        <div className="plist-pagination">
          <button className="plist-page-btn plist-page-prev" onClick={goPrev} disabled={page === 1}>
            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L2 6l4 4"/>
            </svg>
            Previous
          </button>

          <div className="plist-page-numbers">
            {Array.from({ length: totalPages }).map((_, i) => {
              const n = i + 1
              if (totalPages > 7) {
                if (n === 1 || n === totalPages || Math.abs(n - page) <= 1) {
                  return (
                    <button key={n} onClick={() => goTo(n)} className={`plist-page-num ${n === page ? 'plist-page-active' : ''}`}>
                      {n}
                    </button>
                  )
                }
                if (n === 2 && page > 3) return <span key={n} className="plist-page-dots">...</span>
                if (n === totalPages - 1 && page < totalPages - 2) return <span key={n} className="plist-page-dots">...</span>
                return null
              }
              return (
                <button key={n} onClick={() => goTo(n)} className={`plist-page-num ${n === page ? 'plist-page-active' : ''}`}>
                  {n}
                </button>
              )
            })}
          </div>

          <button className="plist-page-btn plist-page-next" onClick={goNext} disabled={page === totalPages}>
            Next
            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 2l4 4-4 4"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default List