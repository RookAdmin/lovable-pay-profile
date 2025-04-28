
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Zap, User, UserCheck, PlusSquare, ArrowRight, MessageSquare, CreditCard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();
  
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-16 sm:py-24">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#333333]">
              Privacy-First Payment Identity for Creators
            </h1>
            <p className="text-xl text-[#555555] mb-8">
              Collect payments with dignity — no more sharing your personal details.
              Just one beautiful link: paym.me/you
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {!user ? (
                <Link to="/signup">
                  <Button size="lg" className="w-full sm:w-auto">Get Started for Free</Button>
                </Link>
              ) : (
                <Link to="/dashboard">
                  <Button size="lg" className="w-full sm:w-auto">Go to Dashboard</Button>
                </Link>
              )}
              <Link to="/arav">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  See Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-[#333333]">Why Choose Paym.me?</h2>
            <p className="text-lg text-[#555555]">
              A complete payment identity solution that puts your privacy first
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white border-gray-100">
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-[#333333]">Privacy-First</h3>
                <p className="text-[#555555]">
                  No need to share personal contact info. Only show payment methods.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-gray-100">
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-[#333333]">Smart Links</h3>
                <p className="text-[#555555]">
                  Create one-click payment links with custom amounts and messages.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-gray-100">
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-[#333333]">Your Identity</h3>
                <p className="text-[#555555]">
                  Customize your page with your brand, photo, and social links.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-[#333333]">How It Works</h2>
            <p className="text-lg text-[#555555]">
              Three simple steps to start collecting payments privately
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="rounded-full bg-primary/20 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <PlusSquare className="h-8 w-8 text-primary" />
                <span className="absolute -mt-10 text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#333333]">Create Account</h3>
              <p className="text-[#555555]">Sign up in seconds with just your email</p>
            </div>
            
            <div className="text-center">
              <div className="rounded-full bg-primary/20 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-8 w-8 text-primary" />
                <span className="absolute -mt-10 text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#333333]">Add Payment Methods</h3>
              <p className="text-[#555555]">Connect your UPI, bank account, or cards</p>
            </div>
            
            <div className="text-center">
              <div className="rounded-full bg-primary/20 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Share2 className="h-8 w-8 text-primary" />
                <span className="absolute -mt-10 text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#333333]">Share Your Link</h3>
              <p className="text-[#555555]">Share your paym.me link with anyone</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Use Cases Section */}
      <section className="py-16 bg-white">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-[#333333]">Perfect For</h2>
            <p className="text-lg text-[#555555]">
              Anyone who collects payments and values their privacy
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { title: "Content Creators", desc: "Collect tips and payments from your audience" },
              { title: "Freelancers", desc: "Receive client payments professionally" },
              { title: "Small Businesses", desc: "Share payment details with customers easily" },
              { title: "Event Organizers", desc: "Collect contributions and fees simply" },
              { title: "Service Providers", desc: "Streamline payment collection" },
              { title: "Individuals", desc: "Request money from friends and family with dignity" },
            ].map((item, i) => (
              <Card key={i} className="bg-white border-gray-100">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2 text-[#333333]">{item.title}</h3>
                  <p className="text-[#555555]">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-[#333333]">What Our Users Say</h2>
            <p className="text-lg text-[#555555]">
              Join thousands of creators who trust paym.me
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { name: "Priya M.", role: "Content Creator", quote: "Finally I can collect tips without sharing my personal phone number!" },
              { name: "Rahul S.", role: "Freelance Designer", quote: "My clients love how professional my payment page looks." },
              { name: "Ananya K.", role: "Small Business Owner", quote: "Simplified payments and increased customer satisfaction." },
            ].map((item, i) => (
              <Card key={i} className="bg-white border-gray-100">
                <CardContent className="p-6">
                  <p className="text-[#555555] mb-4 italic">"{item.quote}"</p>
                  <p className="font-semibold text-[#333333]">{item.name}</p>
                  <p className="text-sm text-[#555555]">{item.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-[#003D40] text-white">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4 text-white">Ready to Get Started?</h2>
            <p className="text-lg opacity-90 mb-8 text-white">
              Create your payment profile in minutes and start receiving money with privacy and dignity.
            </p>
            {!user ? (
              <Link to="/signup">
                <Button 
                  size="lg" 
                  className="bg-[#0097A7] text-white hover:bg-[#005F6A]"
                >
                  Create Your Profile
                </Button>
              </Link>
            ) : (
              <Link to="/dashboard">
                <Button 
                  size="lg" 
                  className="bg-[#0097A7] text-white hover:bg-[#005F6A]"
                >
                  Go to Dashboard
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
