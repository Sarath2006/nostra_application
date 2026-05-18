import React, { useContext, useState, useMemo, useEffect } from "react";
import { StoreContext } from "../../context/StoreContext";
import "./SearchResults.css";
import { RiArrowDownWideLine, RiArrowRightWideLine } from "react-icons/ri";
import { Link, useSearchParams } from "react-router-dom";

const ITEMS_PER_PAGE = 9;

const SearchResults = () => {
  const { products, currency } = useContext(StoreContext);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

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

  const [sortOption, setSortOption] = useState("popularity");

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleFilter = (key, value) => {
    setFilters((prev) => {
      const updated = { ...prev };
      if (Array.isArray(updated[key]) && updated[key].includes(value)) {
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

  // Filter products by search query
  const searchFilteredProducts = useMemo(() => {
    if (!searchQuery) return products;

    const query = searchQuery.toLowerCase();
    return products.filter((p) => {
      return (
        p.name.toLowerCase().includes(query) ||
        p.category?.toLowerCase().includes(query) ||
        p.subCategory?.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query)
      );
    });
  }, [products, searchQuery]);

  const categories = [...new Set(searchFilteredProducts.map((p) => p.category))];
  const subCategories = [...new Set(searchFilteredProducts.map((p) => p.subCategory))];

  const mergedCategories = [
    { type: "Category", values: categories },
    { type: "Subcategory", values: subCategories },
  ];

  const categoryCounts = {};
  searchFilteredProducts.forEach((p) => {
    if (!categoryCounts[p.category]) categoryCounts[p.category] = 0;
    categoryCounts[p.category]++;
  });
  searchFilteredProducts.forEach((p) => {
    if (!categoryCounts[p.subCategory]) categoryCounts[p.subCategory] = 0;
    categoryCounts[p.subCategory]++;
  });

  const filteredProducts = useMemo(() => {
    return searchFilteredProducts.filter((p) => {
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
  }, [searchFilteredProducts, filters]);

  const sortedProducts = useMemo(() => {
    let sorted = [...filteredProducts];
    if (sortOption === "lowToHigh") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortOption === "highToLow") {
      sorted.sort((a, b) => b.price - a.price);
    }
    return sorted;
  }, [filteredProducts, sortOption]);

  const paginatedProducts = sortedProducts.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);

  return (
    <div className="collections">
      <div className="collections-container">
        {/* Sidebar */}
        <div className="collections-sidebar">
          <h3 className="sidebar-title">Search Results for "{searchQuery}"</h3>
          <p className="results-count">Found {sortedProducts.length} products</p>

          {/* Category Filter */}
          <div className="filter-section">
            <div
              className="filter-header"
              onClick={() => toggleSection("category")}
            >
              <h4>FILTER BY CATEGORY</h4>
              {openSections.category ? (
                <RiArrowDownWideLine />
              ) : (
                <RiArrowRightWideLine />
              )}
            </div>
            {openSections.category && (
              <div className="filter-options">
                {mergedCategories.map(({ type, values }) =>
                  values.map((cat) => (
                    <label key={cat}>
                      <input
                        type="checkbox"
                        checked={filters.category.includes(cat)}
                        onChange={() => toggleFilter("category", cat)}
                      />
                      <span>
                        {cat} ({categoryCounts[cat] || 0})
                      </span>
                    </label>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Price Filter */}
          <div className="filter-section">
            <div
              className="filter-header"
              onClick={() => toggleSection("price")}
            >
              <h4>PRICE</h4>
              {openSections.price ? (
                <RiArrowDownWideLine />
              ) : (
                <RiArrowRightWideLine />
              )}
            </div>
            {openSections.price && (
              <div className="filter-options">
                {[
                  { label: "₹0 - ₹1,000", value: [0, 1000] },
                  { label: "₹1,000 - ₹3,000", value: [1000, 3000] },
                  { label: "₹3,000 - ₹5,000", value: [3000, 5000] },
                  { label: "₹5,000+", value: [5000, 100000] },
                ].map(({ label, value }) => (
                  <label key={label}>
                    <input
                      type="radio"
                      name="price"
                      checked={filters.priceRange === value}
                      onChange={() => toggleFilter("priceRange", value)}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="collections-main">
          {/* Sort */}
          <div className="sort-container">
            <label>
              Sort By:
              <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                <option value="popularity">Popularity</option>
                <option value="lowToHigh">Price: Low to High</option>
                <option value="highToLow">Price: High to Low</option>
              </select>
            </label>
          </div>

          {/* Products Grid */}
          {paginatedProducts.length > 0 ? (
            <div className="products-grid">
              {paginatedProducts.map((product) => (
                <Link
                  to={`/product/${product._id}`}
                  key={product._id}
                  className="product-card"
                >
                  <div className="product-image">
                    <img
                      src={product.image[0]}
                      alt={product.name}
                      className="main-image"
                    />
                  </div>
                  <h5 className="product-name">{product.name}</h5>
                  <p className="description">{product.description}</p>
                  <div className="product-pricing">
                    <span className="price">{currency}{product.price}</span>
                    {product.oldPrice && (
                      <span className="old-price">{currency}{product.oldPrice}</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="no-products">
              <p>No products found for "{searchQuery}"</p>
              <p>Try searching with different keywords or browse our collections.</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={`pagination-btn ${page === p ? "active" : ""}`}
                  onClick={() => {
                    setPage(p);
                    window.scrollTo(0, 0);
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
