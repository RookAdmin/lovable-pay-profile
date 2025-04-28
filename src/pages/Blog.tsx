
import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Search, Tag, Clock, ArrowRight } from 'lucide-react';

// Mock blog post data
const blogPosts = [
  {
    id: 1,
    title: "Introducing UPI QR Code Generation",
    excerpt: "We're excited to announce our new UPI QR code generation feature, making it easier than ever for creators to receive payments.",
    coverImage: "https://via.placeholder.com/800x450",
    category: "Feature Updates",
    date: "April 25, 2025",
    readTime: "4 min read"
  },
  {
    id: 2,
    title: "How to Create Effective Smart Links",
    excerpt: "Learn how to create compelling smart links that convert better and help you earn more from your audience.",
    coverImage: "https://via.placeholder.com/800x450",
    category: "Tutorials",
    date: "April 20, 2025",
    readTime: "6 min read"
  },
  {
    id: 3,
    title: "Privacy in Digital Payments - Why It Matters",
    excerpt: "In an increasingly connected world, maintaining privacy in your payment methods is more important than ever.",
    coverImage: "https://via.placeholder.com/800x450",
    category: "Security",
    date: "April 15, 2025",
    readTime: "5 min read"
  },
  {
    id: 4,
    title: "5 Ways Creators Can Boost Their Income",
    excerpt: "Discover five proven strategies that creators can use to diversify and increase their revenue streams.",
    coverImage: "https://via.placeholder.com/800x450",
    category: "Tips & Tricks",
    date: "April 10, 2025",
    readTime: "8 min read"
  },
  {
    id: 5,
    title: "Understanding Payment Regulations in India",
    excerpt: "Stay compliant with this overview of key payment regulations affecting digital transactions in India.",
    coverImage: "https://via.placeholder.com/800x450",
    category: "Legal",
    date: "April 5, 2025",
    readTime: "7 min read"
  },
  {
    id: 6,
    title: "How We Built a Privacy-First Payment Platform",
    excerpt: "Our journey to creating a payment platform that puts user privacy at the center of everything we do.",
    coverImage: "https://via.placeholder.com/800x450",
    category: "Company",
    date: "March 30, 2025",
    readTime: "9 min read"
  }
];

// Categories
const categories = ["All", "Feature Updates", "Tutorials", "Security", "Tips & Tricks", "Legal", "Company"];

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
                          
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div className="container px-4 py-12 mx-auto">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-[#333333]">Paym.me Blog</h1>
        <p className="text-lg text-[#555555]">
          Latest updates, tutorials, and insights about digital payments and creator economy
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Main Content */}
        <div className="md:w-2/3">
          {/* Search Bar */}
          <div className="mb-8 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search articles..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Blog Posts Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {filteredPosts.length > 0 ? (
              filteredPosts.map(post => (
                <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <img 
                    src={post.coverImage} 
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                  <CardContent className="pt-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {post.category}
                      </span>
                      <span className="text-xs text-[#555555]">{post.date}</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-[#333333]">{post.title}</h3>
                    <p className="text-[#555555] line-clamp-3">{post.excerpt}</p>
                  </CardContent>
                  <CardFooter className="pt-0 flex justify-between items-center">
                    <div className="flex items-center text-xs text-[#555555]">
                      <Clock size={14} className="mr-1" />
                      {post.readTime}
                    </div>
                    <Link to={`/blog/${post.id}`}>
                      <Button variant="ghost" size="sm" className="text-primary">
                        Read More <ArrowRight size={14} className="ml-1" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-2 py-12 text-center">
                <p className="text-[#555555]">No articles found matching your search criteria.</p>
                <Button variant="link" onClick={() => {setSearchQuery(""); setSelectedCategory("All");}}>
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="md:w-1/3 space-y-6">
          {/* Categories */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4 text-[#333333]">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="mb-2"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Popular Posts */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4 text-[#333333]">Popular Posts</h3>
              <div className="space-y-4">
                {blogPosts.slice(0, 3).map(post => (
                  <div key={`popular-${post.id}`} className="flex gap-3">
                    <img 
                      src={post.coverImage} 
                      alt={post.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <h4 className="text-sm font-medium text-[#333333] line-clamp-2">{post.title}</h4>
                      <p className="text-xs text-[#555555]">{post.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Tags */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4 text-[#333333]">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {["payments", "upi", "creators", "privacy", "security", "qr-code", "smart-links", "monetization"].map(tag => (
                  <div 
                    key={tag} 
                    className="px-3 py-1 bg-gray-100 rounded-full text-xs text-[#555555] flex items-center"
                  >
                    <Tag size={12} className="mr-1" />
                    {tag}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Newsletter */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-2 text-[#333333]">Subscribe to Our Newsletter</h3>
              <p className="text-sm text-[#555555] mb-4">Get the latest updates directly to your inbox</p>
              <div className="flex gap-2">
                <Input placeholder="Your email" />
                <Button>Subscribe</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Blog;
