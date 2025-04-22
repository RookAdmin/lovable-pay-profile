
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Zap, User, UserCheck } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-16 sm:py-24">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="gradient-text">Privacy-First Payment Identity</span> for Creators
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Collect payments with dignity — no more sharing your personal details.
              Just one beautiful link: paym.me/you
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto">Get Started for Free</Button>
              </Link>
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
            <h2 className="text-3xl font-bold mb-4">Why Choose Paym.me?</h2>
            <p className="text-lg text-muted-foreground">
              A complete payment identity solution that puts your privacy first
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white border-gray-100">
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Privacy-First</h3>
                <p className="text-muted-foreground">
                  No need to share personal contact info. Only show payment methods.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-gray-100">
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Smart Links</h3>
                <p className="text-muted-foreground">
                  Create one-click payment links with custom amounts and messages.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-gray-100">
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Your Identity</h3>
                <p className="text-muted-foreground">
                  Customize your page with your brand, photo, and social links.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-gray-100">
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <UserCheck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Get Verified</h3>
                <p className="text-muted-foreground">
                  Build trust with a verified badge that shows you're legitimate.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-gray-100 sm:col-span-2 lg:col-span-2">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold ml-4">AI-Powered Features</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Our AI helps optimize your payment page for maximum conversion:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li>Smart link suggestions based on your audience</li>
                  <li>Auto-generated taglines and descriptions</li>
                  <li>Intelligent fraud detection to keep you safe</li>
                  <li>Analytics insights to improve your earnings</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-primary text-white">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg opacity-90 mb-8">
              Create your payment profile in minutes and start receiving money with privacy and dignity.
            </p>
            <Link to="/signup">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                Create Your Profile
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
