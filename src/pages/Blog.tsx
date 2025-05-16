import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Search, Tag, Clock, ArrowRight } from 'lucide-react';

// Mock blog post data with Unsplash images
const blogPosts = [
  {
    id: 1,
    title: "Introducing UPI QR Code Generation",
    excerpt: "We're excited to announce our new UPI QR code generation feature, making it easier than ever for creators to receive payments.",
    coverImage: "https://images.unsplash.com/photo-1616469829581-73993eb86b02?w=800&auto=format&fit=crop&q=60",
    category: "Feature Updates",
    date: "April 25, 2025",
    readTime: "4 min read"
  },
  {
    id: 2,
    title: "How to Create Effective Smart Links",
    excerpt: "Learn how to create compelling smart links that convert better and help you earn more from your audience.",
    coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60",
    category: "Tutorials",
    date: "April 20, 2025",
    readTime: "6 min read"
  },
  {
    id: 3,
    title: "Privacy in Digital Payments - Why It Matters",
    excerpt: "In an increasingly connected world, maintaining privacy in your payment methods is more important than ever.",
    coverImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=60",
    category: "Security",
    date: "April 15, 2025",
    readTime: "5 min read"
  },
  {
    id: 4,
    title: "5 Ways Creators Can Boost Their Income",
    excerpt: "Discover five proven strategies that creators can use to diversify and increase their revenue streams.",
    coverImage: "https://images.unsplash.com/photo-1526948531399-320e7e40f0ca?w=800&auto=format&fit=crop&q=60",
    category: "Tips & Tricks",
    date: "April 10, 2025",
    readTime: "8 min read"
  },
  {
    id: 5,
    title: "Understanding Payment Regulations in India",
    excerpt: "Stay compliant with this overview of key payment regulations affecting digital transactions in India.",
    coverImage: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=60",
    category: "Legal",
    date: "April 5, 2025",
    readTime: "7 min read"
  },
  {
    id: 6,
    title: "How We Built a Privacy-First Payment Platform",
    excerpt: "Our journey to creating a payment platform that puts user privacy at the center of everything we do.",
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60",
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
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-cyan bg-clip-text text-black">
          Paym.me Blog
        </h1>
        <p className="text-lg text-muted-foreground">
          Latest updates, tutorials, and insights about digital payments and creator economy
        </p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="lg:w-2/3">
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
                <Card key={post.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="aspect-[16/9] overflow-hidden">
                    <img 
                      src={post.coverImage} 
                      alt={post.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                        {post.category}
                      </span>
                      <span className="text-xs text-muted-foreground">{post.date}</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-foreground group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground line-clamp-2">{post.excerpt}</p>
                  </CardContent>
                  <CardFooter className="pt-0 flex justify-between items-center">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock size={14} className="mr-1" />
                      {post.readTime}
                    </div>
                    <Link to={`/blog/${post.id}`}>
                      <Button variant="ghost" size="sm" className="text-primary group-hover:text-primary/80">
                        Read More <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-2 py-12 text-center">
                <p className="text-muted-foreground">No articles found matching your search criteria.</p>
                <Button variant="link" onClick={() => {setSearchQuery(""); setSelectedCategory("All");}}>
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="lg:w-1/3 space-y-6">
          {/* Categories */}
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Categories</h3>
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
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Popular Posts</h3>
              <div className="space-y-4">
                {blogPosts.slice(0, 3).map(post => (
                  <Link key={`popular-${post.id}`} to={`/blog/${post.id}`}>
                    <div className="flex gap-3 group">
                      <img 
                        src={post.coverImage} 
                        alt={post.title}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div>
                        <h4 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                          {post.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">{post.date}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Newsletter */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2">Subscribe to Our Newsletter</h3>
              <p className="text-sm text-muted-foreground mb-4">Get the latest updates directly to your inbox</p>
              <div className="flex gap-2">
                <Input placeholder="Your email" className="bg-white" />
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
