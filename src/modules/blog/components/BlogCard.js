import React from "react";
import Image from "next/image";
import Link from "next/link";

// Card component rendering a single blog post's summary, date, and link details
const BlogCard = ({ blog }) => {
    // Resolves background color token matching the specific blog category string
    const getCategoryColor = (category) => {
        switch (category) {
            case "Export Guide":
                return "#2563EB";
            case "Shipping":
                return "#10B981";
            case "Car Buying Tips":
                return "#F59E0B";
            default:
                return "#2563EB";
        }
    };

    return (
        <div className="ok-blog-card">
            <div className="ok-blog-img-wrap">
                {blog.image && (
                    <Image
                        src={blog.image}
                        alt={blog.title}
                        layout="fill"
                        objectFit="cover"
                        className="ok-blog-img"
                    />
                )}
                <span
                    className="ok-blog-badge"
                    style={{ backgroundColor: getCategoryColor(blog.category) }}
                >
                    {blog.category}
                </span>
            </div>

            <div className="ok-blog-content">
                <h3 className="ok-blog-title">{blog.title}</h3>
                <p className="ok-blog-excerpt">{blog.description}</p>

                <div className="ok-blog-footer">
                    <div className="ok-blog-date">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>{blog.date}</span>
                    </div>

                    <Link href={`/blog/${blog.id}`} className="ok-blog-read-more">
                        Read More
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BlogCard;
