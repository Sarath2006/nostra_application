import React, { useContext, useState, useMemo, useEffect } from "react";
import { StoreContext } from "../../context/StoreContext";
import "./Collections.css";
import { RiArrowDownWideLine, RiArrowRightWideLine } from "react-icons/ri";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { Link } from "react-router-dom";

const ITEMS_PER_PAGE = 9;

const Collections = () => {
  const { products, currency, wishlist, addToWishlist, removeFromWishlist } = useContext(StoreContext);

  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    category: [],
    sizes: [],
    priceRange: null,
  });

  const [openSections, setOpenSections] = useState({
    category: true,
    price: true,
    size: true,
  });

  // ✅ Sorting state
  const [sortOption, setSortOption] = useState("popularity");

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleFilter = (key, value) => {
    setFilters((prev) => {
      const updated = { ...prev };
      if (updated[key].includes && updated[key].includes(value)) {
        updated[key] = updated[key].filter((v) => v !== value);
      } else if (Array.isArray(updated[key])) {
        updated[key] = [...updated[key], value];
      } else {
        updated[key] = value;
      }
      setPage(1);
      return updated;
    });
  };

  const categories = [...new Set(products.map((p) => p.category))];
  const subCategories = [...new Set(products.map((p) => p.subCategory))];

  const mergedCategories = [
    { type: "Category", values: categories },
    { type: "Subcategory", values: subCategories },
  ];

  const categoryCounts = {};
  products.forEach((p) => {
    if (!categoryCounts[p.category]) categoryCounts[p.category] = 0;
    categoryCounts[p.category]++;
  });
  products.forEach((p) => {
    if (!categoryCounts[p.subCategory]) categoryCounts[p.subCategory] = 0;
    categoryCounts[p.subCategory]++;
  });

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      let pass = true;

      if (filters.category.length) {
        if (
          !filters.category.includes(p.category) &&
          !filters.category.includes(p.subCategory)
        ) {
          pass = false;
        }
      }

      if (
        filters.sizes.length &&
        !filters.sizes.some((s) => p.sizes.includes(s))
      )
        pass = false;

      if (filters.priceRange) {
        const [min, max] = filters.priceRange;
        if (!(p.price >= min && p.price <= max)) pass = false;
      }

      return pass;
    });
  }, [products, filters]);

  // ✅ Sorting logic
  const sortedProducts = useMemo(() => {
    let sorted = [...filteredProducts];
    if (sortOption === "lowToHigh") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortOption === "highToLow") {
      sorted.sort((a, b) => b.price - a.price);
    }
    return sorted;
  }, [filteredProducts, sortOption]);

  // ✅ Pagination
  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = sortedProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  useEffect(() => {
    console.log("✅ Applied Filters:", filters);
    console.log("✅ Filtered Products:", filteredProducts);
  }, [filters, filteredProducts]);

  return (
    <>
      <div className="collection-layout">
        {/* Sidebar Filters */}
        <aside className="sidebar">
        {/* ✅ Category + Subcategory merged */}
        <div className="filter-group">
          <div
            className="filter-header"
            onClick={() => toggleSection("category")}
          >
            <h3>Category</h3>
            <span>
              {openSections.category ? (
                <RiArrowDownWideLine />
              ) : (
                <RiArrowRightWideLine />
              )}
            </span>
          </div>
          {openSections.category && (
            <div className="filter-options">
              {mergedCategories.map((group) => (
                <div key={group.type} className="sub-filter-group">
                  <h4>{group.type}</h4>
                  {group.values.map((val) => (
                    <label
                      key={val}
                      className={filters.category.includes(val) ? "active" : ""}
                    >
                      <input
                        type="checkbox"
                        checked={filters.category.includes(val)}
                        onChange={() => toggleFilter("category", val)}
                      />
                      <span>{val}</span>
                      <span className="count">{categoryCounts[val] || 0}</span>
                    </label>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Price */}
        <div className="filter-group">
          <div className="filter-header" onClick={() => toggleSection("price")}>
            <h3>Price</h3>
            <span>
              {openSections.price ? (
                <RiArrowDownWideLine />
              ) : (
                <RiArrowRightWideLine />
              )}
            </span>
          </div>
          {openSections.price && (
            <div className="filter-options">
              <label>
                <input
                  type="radio"
                  name="price"
                  onChange={() =>
                    setFilters({ ...filters, priceRange: [0, 50] })
                  }
                />
                Under $50
              </label>
              <label>
                <input
                  type="radio"
                  name="price"
                  onChange={() =>
                    setFilters({ ...filters, priceRange: [20, 100] })
                  }
                />
                $20 - $100
              </label>
              <label>
                <input
                  type="radio"
                  name="price"
                  onChange={() =>
                    setFilters({ ...filters, priceRange: [100, 1000] })
                  }
                />
                Above $100
              </label>
            </div>
          )}
        </div>

        {/* Size */}
        <div className="filter-group">
          <div className="filter-header" onClick={() => toggleSection("size")}>
            <h3>Size</h3>
            <span>
              {openSections.size ? (
                <RiArrowDownWideLine />
              ) : (
                <RiArrowRightWideLine />
              )}
            </span>
          </div>
          {openSections.size && (
            <div className="filter-options">
              {["S", "M", "L", "XL"].map((size) => (
                <label
                  key={size}
                  className={filters.sizes.includes(size) ? "active" : ""}
                >
                  <input
                    type="checkbox"
                    checked={filters.sizes.includes(size)}
                    onChange={() => toggleFilter("sizes", size)}
                  />
                  {size}
                </label>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="products-section">
        <div className="top-bar">
          <p>
            Showing {paginatedProducts.length} results from total{" "}
            {filteredProducts.length}
          </p>

          {/* ✅ Sort by dropdown */}
          <div className="sort-by">
            <label>Sort by</label>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="all">All</option>
              <option value="lowToHigh">Price: Low to High</option>
              <option value="highToLow">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* ✅ Applied Filters Row */}
        {(filters.category.length ||
          filters.sizes.length ||
          filters.priceRange) && (
          <div className="applied-filters">
            <span className="title">Applied Filters:</span>

            {filters.category.map((val) => (
              <div key={val} className="chip">
                {val}
                <button onClick={() => toggleFilter("category", val)}>×</button>
              </div>
            ))}

            {filters.sizes.map((val) => (
              <div key={val} className="chip">
                {val}
                <button onClick={() => toggleFilter("sizes", val)}>×</button>
              </div>
            ))}

            {filters.priceRange && (
              <div className="chip">
                {filters.priceRange[0] === 0
                  ? "Under $50"
                  : filters.priceRange[1] === 100
                  ? "$20 - $100"
                  : "Above $100"}
                <button
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, priceRange: null }))
                  }
                >
                  ×
                </button>
              </div>
            )}
          </div>
        )}

        {/* Product Grid */}
        <div className="product-grid">
          {paginatedProducts.map((p) => {
            const isWishlisted = wishlist.some(item => item._id === p._id);
            return (
              <div className="product-card" key={p._id} style={{ position: 'relative' }}>
                {/* Heart Icon at bottom right */}
                <div
                  className="wishlist-icon"
                  onClick={e => {
                    e.stopPropagation();
                    if (isWishlisted) {
                      removeFromWishlist(p._id);
                    } else {
                      addToWishlist(p._id);
                    }
                  }}
                  style={{ position: 'absolute', bottom: 12, right: 12, zIndex: 20, cursor: 'pointer', background: 'rgba(255,255,255,0.7)', borderRadius: '50%', padding: 2, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
                >
                  {isWishlisted ? (
                    <GoHeartFill size={24} color="#e74c3c" />
                  ) : (
                    <GoHeart size={24} color="#888" />
                  )}
                </div>
                <Link
                  to={`/product/${p._id}`}
                  state={{ product: p }}
                  style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                >
                  {p.bestseller && (
                    <div className="bestseller-badge">Bestseller</div>
                  )}
                  <img
                    src={Array.isArray(p.image) ? p.image[0] : p.image}
                    alt={p.name}
                  />
                  <h3>{p.name}</h3>
                  <p className="description">{p.description}</p>
                  <p className="price">
                    {currency}
                    {p.price}
                    {p.oldPrice && (
                      <span className="old-price">{currency}{p.oldPrice}</span>
                    )}
                  </p>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Previous
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={page === i + 1 ? "active" : ""}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </main>
    </div>
    </>
  );
};

export default Collections;
