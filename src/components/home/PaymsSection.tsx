
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Clock, Send, Shield, Globe, Lock, FileText, BellDot } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const PaymsSection = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Introducing Payms</h2>
          <p className="text-lg text-gray-600 mb-6">
            Private, professional payment links for your invoices
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700">
              <Check className="w-4 h-4 mr-1" /> Private
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-50 text-green-700">
              <Check className="w-4 h-4 mr-1" /> Professional
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-50 text-purple-700">
              <Check className="w-4 h-4 mr-1" /> Secure
            </span>
          </div>
          <div className="inline-block p-1 bg-white rounded-lg shadow-md">
            <div className="flex items-center bg-gray-100 rounded-md py-2 px-4">
              <span className="text-gray-400">paym.me/payms/</span>
              <span className="font-mono text-gray-800">z9A7bP3x</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-semibold mb-4">Smart Links vs Payms: What's the Difference?</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium flex items-center mb-2">
                  <Globe className="mr-2 text-dc2e3e h-5 w-5" /> Smart Links
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Public payment links displayed on your profile</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Perfect for tips, donations, and standard offerings</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Always visible on your public profile page</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-medium flex items-center mb-2">
                  <Lock className="mr-2 text-dc2e3e h-5 w-5" /> Payms
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Private payment links for invoices and specific clients</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Not indexed or displayed on your public profile</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Can be set to expire after a specific time</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Automated payment reminders via email and WhatsApp</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col justify-center">
            <Card className="border shadow-lg overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-dc2e3e p-4 text-white">
                  <h3 className="text-xl font-medium">Payms Features</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mr-4">
                      <Clock className="h-5 w-5 text-dc2e3e" />
                    </div>
                    <div>
                      <h4 className="font-medium">Expiration Control</h4>
                      <p className="text-sm text-gray-500">Set payment links to expire automatically</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mr-4">
                      <Send className="h-5 w-5 text-dc2e3e" />
                    </div>
                    <div>
                      <h4 className="font-medium">Automated Reminders</h4>
                      <p className="text-sm text-gray-500">Send reminders via email and WhatsApp</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mr-4">
                      <Shield className="h-5 w-5 text-dc2e3e" />
                    </div>
                    <div>
                      <h4 className="font-medium">Invoice Integration</h4>
                      <p className="text-sm text-gray-500">Connect with Zoho, FreshBooks, and more</p>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-dc2e3e hover:bg-dc2e3e/90 mt-4" asChild>
                    <Link to="/dashboard?activeTab=payms">Try Payms Now</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="max-w-4xl mx-auto mt-16">
          <h3 className="text-2xl font-bold text-center mb-8">How Payms Works</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2">1. Create an Invoice</h4>
              <p className="text-gray-600 text-sm">Generate an invoice in your favorite app like Zoho Books or FreshBooks</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <Lock className="h-6 w-6 text-dc2e3e" />
              </div>
              <h4 className="font-semibold mb-2">2. Generate Paym Link</h4>
              <p className="text-gray-600 text-sm">Create a private payment link with optional expiry and reminders</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                <BellDot className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">3. Share & Get Paid</h4>
              <p className="text-gray-600 text-sm">Share the link with your client and receive automatic payment notifications</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 overflow-hidden border border-gray-200">
            <h4 className="text-xl font-semibold mb-4">Security & Privacy Features</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Feature</TableHead>
                  <TableHead>Smart Links</TableHead>
                  <TableHead>Payms</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Search Engine Visibility</TableCell>
                  <TableCell>Public & Indexed</TableCell>
                  <TableCell>Private & Unindexed</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Time-based Expiry</TableCell>
                  <TableCell>No</TableCell>
                  <TableCell>Yes (Configurable)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Automated Payment Reminders</TableCell>
                  <TableCell>No</TableCell>
                  <TableCell>Yes (Email & WhatsApp)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Invoice Integration</TableCell>
                  <TableCell>No</TableCell>
                  <TableCell>Yes (Multiple Apps)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Payment Status Tracking</TableCell>
                  <TableCell>Basic</TableCell>
                  <TableCell>Advanced</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="text-center mt-12">
          <Button className="bg-dc2e3e hover:bg-dc2e3e/90" size="lg" asChild>
            <Link to="/signup">Get Started with Payms</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PaymsSection;
