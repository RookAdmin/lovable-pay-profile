
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit, Plus, Copy, ExternalLink, User, CreditCard, Wallet, BarChart, Settings, LogOut } from 'lucide-react';
import { toast } from 'sonner';

const Dashboard = () => {
  // In a real app, we'd fetch this data from the API
  const userData = {
    username: 'arav',
    displayName: 'Arav Singh',
    bio: 'Freelance Web Developer & UI Designer',
    avatarUrl: 'https://i.pravatar.cc/300?img=10',
    profileUrl: '/arav',
  };
  
  const handleCopyProfileUrl = () => {
    navigator.clipboard.writeText(`${window.location.origin}${userData.profileUrl}`);
    toast.success('Profile URL copied to clipboard!');
  };
  
  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <Card className="sticky top-8">
            <CardContent className="p-4">
              <div className="flex flex-col items-center mb-6 pt-2">
                <Avatar className="h-20 w-20 mb-3">
                  <AvatarImage src={userData.avatarUrl} alt={userData.displayName} />
                  <AvatarFallback className="bg-gradient-primary text-white">
                    {userData.displayName.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold">{userData.displayName}</h2>
                <p className="text-sm text-muted-foreground">@{userData.username}</p>
              </div>
              
              <nav className="space-y-1">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <User size={18} className="mr-2" />
                  Profile
                </Button>
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <CreditCard size={18} className="mr-2" />
                  Payment Methods
                </Button>
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <Wallet size={18} className="mr-2" />
                  Transactions
                </Button>
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <BarChart size={18} className="mr-2" />
                  Analytics
                </Button>
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <Settings size={18} className="mr-2" />
                  Settings
                </Button>
                <Button variant="ghost" className="w-full justify-start text-red-500" size="sm">
                  <LogOut size={18} className="mr-2" />
                  Logout
                </Button>
              </nav>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="flex gap-3 mt-3 sm:mt-0">
              <Button variant="outline" size="sm" onClick={handleCopyProfileUrl}>
                <Copy size={16} className="mr-2" />
                Copy Profile URL
              </Button>
              <Button size="sm" asChild>
                <a href={userData.profileUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={16} className="mr-2" />
                  View Profile
                </a>
              </Button>
            </div>
          </div>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="username" className="text-sm font-medium">Username</label>
                  <div className="flex">
                    <div className="bg-muted rounded-l-lg py-2 px-3">
                      <span className="text-sm text-muted-foreground">paym.me/</span>
                    </div>
                    <Input id="username" value={userData.username} readOnly className="rounded-l-none" />
                  </div>
                </div>
                
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="displayName" className="text-sm font-medium">Display Name</label>
                  <Input id="displayName" value={userData.displayName} />
                </div>
                
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="bio" className="text-sm font-medium">Bio</label>
                  <Input id="bio" value={userData.bio} />
                </div>
                
                <Button className="w-full sm:w-auto">
                  <Edit size={16} className="mr-2" />
                  Update Profile
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="upi">
                <TabsList className="mb-4">
                  <TabsTrigger value="upi">UPI</TabsTrigger>
                  <TabsTrigger value="bank">Bank Account</TabsTrigger>
                  <TabsTrigger value="gateways">Payment Gateways</TabsTrigger>
                </TabsList>
                
                <TabsContent value="upi" className="space-y-4">
                  <div className="flex flex-col space-y-1.5">
                    <label htmlFor="upiId" className="text-sm font-medium">UPI ID</label>
                    <Input id="upiId" placeholder="yourname@bank" />
                  </div>
                  
                  <Button className="w-full sm:w-auto">Save UPI ID</Button>
                </TabsContent>
                
                <TabsContent value="bank" className="space-y-4">
                  <div className="flex flex-col space-y-1.5">
                    <label htmlFor="accountNumber" className="text-sm font-medium">Account Number</label>
                    <Input id="accountNumber" placeholder="Your account number" />
                  </div>
                  
                  <div className="flex flex-col space-y-1.5">
                    <label htmlFor="ifsc" className="text-sm font-medium">IFSC Code</label>
                    <Input id="ifsc" placeholder="BANK0001234" />
                  </div>
                  
                  <div className="flex flex-col space-y-1.5">
                    <label htmlFor="accountName" className="text-sm font-medium">Account Holder Name</label>
                    <Input id="accountName" placeholder="Your name as per bank records" />
                  </div>
                  
                  <div className="flex flex-col space-y-1.5">
                    <label htmlFor="bankName" className="text-sm font-medium">Bank Name</label>
                    <Input id="bankName" placeholder="Your bank name" />
                  </div>
                  
                  <Button className="w-full sm:w-auto">Save Bank Details</Button>
                </TabsContent>
                
                <TabsContent value="gateways" className="space-y-4">
                  <div className="border rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Razorpay</h3>
                      <p className="text-sm text-muted-foreground">Connect your Razorpay account</p>
                    </div>
                    <Button variant="outline">Connect</Button>
                  </div>
                  
                  <div className="border rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Stripe</h3>
                      <p className="text-sm text-muted-foreground">Connect your Stripe account</p>
                    </div>
                    <Button variant="outline">Connect</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <div className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Smart Payment Links</CardTitle>
                <Button size="sm">
                  <Plus size={16} className="mr-2" />
                  Add Link
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Create smart payment links to share with your audience
                </p>
                
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Support My Work</h3>
                      <p className="text-sm text-muted-foreground">₹100 • Created 2 days ago</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm">Delete</Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Buy Me a Coffee</h3>
                      <p className="text-sm text-muted-foreground">₹50 • Created 2 days ago</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm">Delete</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
