import React from "react";
import {blogPosts} from "../data/mokeData"
import BlogCard from "../components/blog/blogCard/BlogCard";
import { ArrowRight, TrendingUp } from "lucide-react";
import "./css/HomePage.css";

export default function HomePage() {
  const featuredPost = blogPosts[0];
  const allPosts = blogPosts.slice(0, 6);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-text">
            <h1>
              Welcome to <span className="highlight">BlogSpace</span>
            </h1>
            <p>
              Discover insightful articles, expert opinions, and the latest trends in
              technology, design, business, and lifestyle. Join our community of
              passionate readers.
            </p>
            <button className="btn primary">
              Start Reading <ArrowRight className="icon" />
            </button>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="featured-section">
        <div className="section-container">
          <div className="section-header">
            <TrendingUp className="icon blue" />
            <h2>Featured Post</h2>
          </div>

          <div className="featured-grid">
            <div className="featured-image">
              <img src={featuredPost.imageUrl} alt={featuredPost.title} />
            </div>

            <div className="featured-content">
              <span className="category">{featuredPost.category}</span>
              <h3>{featuredPost.title}</h3>
              <p>{featuredPost.excerpt}</p>

              <div className="meta">
                <span>By {featuredPost.author}</span>
                <span>
                  {new Date(featuredPost.publishDate).toLocaleDateString()}
                </span>
              </div>

              <button className="btn outline">
                Read Full Article <ArrowRight className="icon small" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Posts */}
      <section className="recent-section">
        <div className="section-container">
          <div className="section-header center">
            <h2>Latest Articles</h2>
            <p>
              Stay up-to-date with our newest content covering the latest trends and
              insights across technology, design, business, and lifestyle.
            </p>
          </div>

          <div className="posts-grid">
            {allPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>

          <div className="center">
            <button className="btn outline">
              View All Posts <ArrowRight className="icon small" />
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="newsletter-container">
          <h2>Never Miss an Update</h2>
          <p>
            Subscribe to our newsletter and get the latest articles delivered straight
            to your inbox.
          </p>

          <div className="newsletter-form">
            <input type="email" placeholder="Enter your email" />
            <button className="btn secondary">Subscribe</button>
          </div>
        </div>
      </section>
    </div>
  );
}
