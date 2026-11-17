import React from "react";

// Section component rendering the main blog landing page header banner
const BlogHero = ({ searchQuery, setSearchQuery }) => {
    return (
        <section className="ok-blog-hero">
            <div className="container-xxl">
                <div className="text-center">
                    <h1 className="ok-blog-hero-title">Insights & Export Guides</h1>
                    <p className="ok-blog-hero-sub">Learn about car export, pricing, and shipping to Nigeria</p>
                </div>
            </div>
        </section>
    );
};

export default BlogHero;
