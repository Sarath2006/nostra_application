import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { RiArrowDownWideLine, RiArrowRightWideLine } from "react-icons/ri";
import "./Men.css";

const ITEMS_PER_PAGE = 9;

const Men = () => {
  const { products, currency } = useContext(StoreContext);

  const menProducts = useMemo(
    () => products.filter((p) => (p.category || "").toLowerCase() === "men"),
    [products]
  );

  const [page, setPage] = useState(1);
  const [sortOption, setSortOption] = useState("all");
  const [filters, setFilters] = useState({
    subCategory: [],
    sizes: [],
    priceRange: null,
  });

  const [openSections, setOpenSections] = useState({
    subCategory: true,
    price: true,
    size: true,
  });

  useEffect(() => {
    setPage(1);
  }, [menProducts]);

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleFilter = (key, value) => {
    setFilters((prev) => {
      const updated = { ...prev };
      if (Array.isArray(updated[key])) {
        updated[key] = updated[key].includes(value)
          ? updated[key].filter((v) => v !== value)
          : [...updated[key], value];
      } else {
        updated[key] = value;
      }
      setPage(1);
      return updated;
    });
  };

  const availableSubCategories = useMemo(
    () => [...new Set(menProducts.map((p) => p.subCategory))],
    [menProducts]
  );

  const availableSizes = useMemo(() => {
    const set = new Set();
    menProducts.forEach((p) => (p.sizes || []).forEach((s) => set.add(s)));
    return Array.from(set);
  }, [menProducts]);

  const filteredProducts = useMemo(() => {
    return menProducts.filter((p) => {
      let pass = true;

      if (filters.subCategory.length && !filters.subCategory.includes(p.subCategory)) {
        pass = false;
      }

      if (filters.sizes.length && !(p.sizes || []).some((s) => filters.sizes.includes(s))) {
        pass = false;
      }

      if (filters.priceRange) {
        const [min, max] = filters.priceRange;
        if (!(p.price >= min && p.price <= max)) pass = false;
      }

      return pass;
    });
  }, [menProducts, filters]);

  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    if (sortOption === "lowToHigh") sorted.sort((a, b) => a.price - b.price);
    if (sortOption === "highToLow") sorted.sort((a, b) => b.price - a.price);
    return sorted;
  }, [filteredProducts, sortOption]);

  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / ITEMS_PER_PAGE));
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <>
      <div className="men-layout">
        <aside className="men-sidebar">
        <div className="men-filter-group">
          <div className="men-filter-header" onClick={() => toggleSection("subCategory")}>
            <h3>Subcategory</h3>
            <span>{openSections.subCategory ? <RiArrowDownWideLine /> : <RiArrowRightWideLine />}</span>
          </div>
          {openSections.subCategory && (
            <div className="men-filter-options">
              {availableSubCategories.map((sub) => (
                <label
                  key={sub}
                  className={filters.subCategory.includes(sub) ? "men-active" : ""}
                >
                  <input
                    type="checkbox"
                    checked={filters.subCategory.includes(sub)}
                    onChange={() => toggleFilter("subCategory", sub)}
                  />
                  <span>{sub}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="men-filter-group">
          <div className="men-filter-header" onClick={() => toggleSection("price")}>
            <h3>Price</h3>
            <span>{openSections.price ? <RiArrowDownWideLine /> : <RiArrowRightWideLine />}</span>
          </div>
          {openSections.price && (
            <div className="men-filter-options men-price-options">
              <label>
                <input
                  type="radio"
                  name="men-price"
                  onChange={() => setFilters({ ...filters, priceRange: [0, 50] })}
                  checked={filters.priceRange?.[0] === 0 && filters.priceRange?.[1] === 50}
                />
                Under $50
              </label>
              <label>
                <input
                  type="radio"
                  name="men-price"
                  onChange={() => setFilters({ ...filters, priceRange: [20, 100] })}
                  checked={filters.priceRange?.[0] === 20 && filters.priceRange?.[1] === 100}
                />
                $20 - $100
              </label>
              <label>
                <input
                  type="radio"
                  name="men-price"
                  onChange={() => setFilters({ ...filters, priceRange: [100, 1000] })}
                  checked={filters.priceRange?.[0] === 100 && filters.priceRange?.[1] === 1000}
                />
                Above $100
              </label>
              <button
                className="men-clear"
                onClick={() => setFilters((prev) => ({ ...prev, priceRange: null }))}
              >
                Clear price
              </button>
            </div>
          )}
        </div>

        <div className="men-filter-group">
          <div className="men-filter-header" onClick={() => toggleSection("size")}>
            <h3>Size</h3>
            <span>{openSections.size ? <RiArrowDownWideLine /> : <RiArrowRightWideLine />}</span>
          </div>
          {openSections.size && (
            <div className="men-filter-options">
              {availableSizes.map((size) => (
                <label key={size} className={filters.sizes.includes(size) ? "men-active" : ""}>
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

      <main className="men-products-section">
        <div className="men-top-bar">
          <p>
            Showing {paginatedProducts.length} of {filteredProducts.length} products
          </p>
          <div className="men-sort-by">
            <label htmlFor="men-sort">Sort by</label>
            <select
              id="men-sort"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="all">All</option>
              <option value="lowToHigh">Price: Low to High</option>
              <option value="highToLow">Price: High to Low</option>
            </select>
          </div>
        </div>

        {(filters.subCategory.length || filters.sizes.length || filters.priceRange) && (
          <div className="men-applied-filters">
            <span className="men-filter-title">Applied Filters:</span>
            {filters.subCategory.map((sub) => (
              <div key={sub} className="men-chip">
                {sub}
                <button onClick={() => toggleFilter("subCategory", sub)}>×</button>
              </div>
            ))}
            {filters.sizes.map((size) => (
              <div key={size} className="men-chip">
                {size}
                <button onClick={() => toggleFilter("sizes", size)}>×</button>
              </div>
            ))}
            {filters.priceRange && (
              <div className="men-chip">
                {filters.priceRange[0] === 0
                  ? "Under $50"
                  : filters.priceRange[1] === 100
                  ? "$20 - $100"
                  : "Above $100"}
                <button onClick={() => setFilters((prev) => ({ ...prev, priceRange: null }))}>
                  ×
                </button>
              </div>
            )}
          </div>
        )}

        <div className="men-product-grid">
          {paginatedProducts.length === 0 && (
            <div className="men-empty">No products match your filters.</div>
          )}

          {paginatedProducts.map((p) => (
            <Link
              key={p._id}
              to={`/product/${p._id}`}
              state={{ product: p }}
              className="men-product-card"
            >
              {p.bestseller && <div className="men-bestseller-badge">Bestseller</div>}
              <img src={Array.isArray(p.image) ? p.image[0] : p.image} alt={p.name} />
              <h3>{p.name}</h3>
              <p className="men-description">{p.description}</p>
              <p className="men-price">
                {currency}
                {p.price}
                {p.oldPrice && (
                  <span className="men-old-price">{currency}{p.oldPrice}</span>
                )}
              </p>
            </Link>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="men-pagination">
            <button disabled={page === 1} onClick={() => setPage(page - 1)}>
              Previous
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={page === i + 1 ? "men-active-page" : ""}
              >
                {i + 1}
              </button>
            ))}
            <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
              Next
            </button>
          </div>
        )}
      </main>
    </div>
    </>
  );
};

export default Men;
