"use client";
import React, { useState } from "react";
import BlogCard from "../components/BlogCard";

// List component displaying filtered collections of blog cards, categorized tabs, and keyword search
const BlogList = ({ blogs }) => {
    const categories = ["All", "Export Guide", "Shipping", "Car Buying Tips"];
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredBlogs = blogs.filter(blog => {
        const matchesCategory = selectedCategory === "All" || blog.category === selectedCategory;
        const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <section className="ok-blog-list-section">
            <div className="container-xxl">
                <div className="ok-blog-search-filter d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 gap-3">
                    <div className="ok-blog-search-wrap">
                        <div className="ok-blog-search-inner">
                            <span className="ok-blog-search-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                            <input
                                type="text"
                                placeholder="Search articles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="ok-blog-search-input"
                            />
                        </div>
                    </div>

                    <div className="ok-blog-tabs d-flex flex-wrap gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`ok-blog-tab-btn ${selectedCategory === cat ? "active" : ""}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="row g-4">
                    {filteredBlogs.map((blog) => (
                        <div key={blog.id} className="col-12 col-md-6 col-lg-4">
                            <BlogCard blog={blog} />
                        </div>
                    ))}
                    {filteredBlogs.length === 0 && (
                        <div className="col-12 text-center py-5">
                            <p className="fs-18 text-muted">No articles found matching your criteria.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default BlogList;
