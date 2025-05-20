
import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const BrandKit = () => {
  const handleDownload = (type: string) => {
    // In a real app, this would trigger actual downloads
    toast.info(`Downloading ${type}...`);
    // Simulate download delay
    setTimeout(() => {
      toast.success(`${type} downloaded successfully!`);
    }, 1500);
  };

  return (
    <div className="container max-w-5xl py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">Paym.me Brand Kit</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Everything you need to represent the Paym.me brand correctly in your communications.
        </p>
      </div>
      
      <Tabs defaultValue="logos" className="space-y-8">
        <TabsList className="grid grid-cols-3 max-w-md mx-auto">
          <TabsTrigger value="logos">Logos</TabsTrigger>
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
        </TabsList>
        
        <TabsContent value="logos" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Logo Assets</CardTitle>
              <CardDescription>
                Download official Paym.me logo assets in various formats and sizes.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col items-center p-6 border rounded-lg">
                <div className="w-48 h-48 bg-white flex items-center justify-center mb-4 rounded-lg">
                  <img 
                    src="/placeholder.svg" 
                    alt="Paym.me Logo (Light)" 
                    className="w-36 h-36 object-contain"
                  />
                </div>
                <h3 className="text-lg font-medium mb-2">Paym.me Logo (Light)</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex gap-2"
                    onClick={() => handleDownload('Light Logo PNG')}
                  >
                    <Download size={16} />
                    PNG
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex gap-2"
                    onClick={() => handleDownload('Light Logo SVG')}
                  >
                    <Download size={16} />
                    SVG
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-col items-center p-6 border rounded-lg bg-gray-900">
                <div className="w-48 h-48 bg-gray-900 flex items-center justify-center mb-4 rounded-lg">
                  <img 
                    src="/placeholder.svg" 
                    alt="Paym.me Logo (Dark)" 
                    className="w-36 h-36 object-contain invert"
                  />
                </div>
                <h3 className="text-lg font-medium mb-2 text-white">Paym.me Logo (Dark)</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex gap-2 bg-white hover:bg-gray-100 text-gray-900"
                    onClick={() => handleDownload('Dark Logo PNG')}
                  >
                    <Download size={16} />
                    PNG
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex gap-2 bg-white hover:bg-gray-100 text-gray-900"
                    onClick={() => handleDownload('Dark Logo SVG')}
                  >
                    <Download size={16} />
                    SVG
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-col items-center p-6 border rounded-lg">
                <div className="w-48 h-48 bg-white flex items-center justify-center mb-4 rounded-lg">
                  <img 
                    src="/placeholder.svg" 
                    alt="Paym.me Icon Only" 
                    className="w-24 h-24 object-contain"
                  />
                </div>
                <h3 className="text-lg font-medium mb-2">Paym.me Icon Only</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex gap-2"
                    onClick={() => handleDownload('Icon PNG')}
                  >
                    <Download size={16} />
                    PNG
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex gap-2"
                    onClick={() => handleDownload('Icon SVG')}
                  >
                    <Download size={16} />
                    SVG
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-col items-center p-6 border rounded-lg">
                <div className="w-48 h-48 bg-white flex items-center justify-center mb-4 rounded-lg">
                  <img 
                    src="/placeholder.svg" 
                    alt="Paym.me Badge" 
                    className="w-24 h-24 object-contain"
                  />
                </div>
                <h3 className="text-lg font-medium mb-2">Paym.me Badge</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex gap-2"
                    onClick={() => handleDownload('Badge PNG')}
                  >
                    <Download size={16} />
                    PNG
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex gap-2"
                    onClick={() => handleDownload('Badge SVG')}
                  >
                    <Download size={16} />
                    SVG
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Usage Examples</CardTitle>
              <CardDescription>
                See how to correctly display the Paym.me logo in various contexts.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col">
                  <div className="aspect-video bg-gray-100 rounded flex items-center justify-center mb-3">
                    <img 
                      src="/placeholder.svg" 
                      alt="Logo on website" 
                      className="h-12 object-contain"
                    />
                  </div>
                  <p className="text-sm text-gray-600">Website Header</p>
                </div>
                <div className="flex flex-col">
                  <div className="aspect-video bg-gray-100 rounded flex items-center justify-center mb-3">
                    <img 
                      src="/placeholder.svg" 
                      alt="Logo on social media" 
                      className="h-12 object-contain"
                    />
                  </div>
                  <p className="text-sm text-gray-600">Social Media Profile</p>
                </div>
                <div className="flex flex-col">
                  <div className="aspect-video bg-gray-100 rounded flex items-center justify-center mb-3">
                    <img 
                      src="/placeholder.svg" 
                      alt="Logo on print material" 
                      className="h-12 object-contain"
                    />
                  </div>
                  <p className="text-sm text-gray-600">Print Materials</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="colors" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Brand Colors</CardTitle>
              <CardDescription>
                Official color palette for Paym.me brand identity.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div className="h-24 bg-[#dc2e3e] rounded-lg"></div>
                <div>
                  <h3 className="font-medium">Primary Red</h3>
                  <p className="text-sm text-gray-600">HEX: #dc2e3e</p>
                  <p className="text-sm text-gray-600">RGB: 220, 46, 62</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="h-24 bg-gray-900 rounded-lg"></div>
                <div>
                  <h3 className="font-medium">Dark Gray</h3>
                  <p className="text-sm text-gray-600">HEX: #1a1f2c</p>
                  <p className="text-sm text-gray-600">RGB: 26, 31, 44</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="h-24 bg-gray-100 rounded-lg"></div>
                <div>
                  <h3 className="font-medium">Light Gray</h3>
                  <p className="text-sm text-gray-600">HEX: #f5f5f7</p>
                  <p className="text-sm text-gray-600">RGB: 245, 245, 247</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="guidelines" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Brand Guidelines</CardTitle>
              <CardDescription>
                How to properly use the Paym.me brand assets.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Logo Usage</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="border rounded p-4">
                    <div className="aspect-square bg-white flex items-center justify-center mb-2 border-b pb-2">
                      <img 
                        src="/placeholder.svg" 
                        alt="Do: Clear space" 
                        className="h-16 object-contain"
                      />
                    </div>
                    <p className="text-sm text-green-600 font-medium">DO</p>
                    <p className="text-xs text-gray-600">Maintain clear space around logo</p>
                  </div>
                  
                  <div className="border rounded p-4">
                    <div className="aspect-square bg-white flex items-center justify-center mb-2 border-b pb-2">
                      <div className="relative">
                        <img 
                          src="/placeholder.svg" 
                          alt="Don't: Crowd logo" 
                          className="h-16 object-contain"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-full h-0.5 bg-red-500 rotate-45"></div>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-red-600 font-medium">DON'T</p>
                    <p className="text-xs text-gray-600">Crowd the logo with other elements</p>
                  </div>
                  
                  <div className="border rounded p-4">
                    <div className="aspect-square bg-white flex items-center justify-center mb-2 border-b pb-2">
                      <img 
                        src="/placeholder.svg" 
                        alt="Do: Original proportions" 
                        className="h-16 object-contain"
                      />
                    </div>
                    <p className="text-sm text-green-600 font-medium">DO</p>
                    <p className="text-xs text-gray-600">Keep original proportions</p>
                  </div>
                  
                  <div className="border rounded p-4">
                    <div className="aspect-square bg-white flex items-center justify-center mb-2 border-b pb-2">
                      <div className="relative">
                        <img 
                          src="/placeholder.svg" 
                          alt="Don't: Stretch" 
                          className="h-16 w-24 object-fill"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-full h-0.5 bg-red-500 rotate-45"></div>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-red-600 font-medium">DON'T</p>
                    <p className="text-xs text-gray-600">Stretch or distort the logo</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Typography</h3>
                <p>
                  Paym.me uses Inter as its primary font family. For headings, we use a font weight of 600 (semibold) or 700 (bold). 
                  For body text, we use regular (400) or medium (500) weights.
                </p>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">Heading 1</div>
                  <div className="text-xl font-semibold">Heading 2</div>
                  <div className="text-lg font-medium">Heading 3</div>
                  <div className="text-base">Body text</div>
                  <div className="text-sm text-gray-600">Small text / Caption</div>
                </div>
              </div>
              
              <div>
                <Button onClick={() => handleDownload('Complete Guidelines PDF')} className="flex gap-2">
                  <Download size={16} />
                  Download Complete Brand Guidelines
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BrandKit;
