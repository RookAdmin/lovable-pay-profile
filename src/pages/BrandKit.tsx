import React from 'react';
import { Download, Package } from 'lucide-react';
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

  const handleDownloadAll = () => {
    toast.info('Preparing complete brand kit...', {
      description: 'This may take a few moments'
    });
    // Simulate zip preparation
    setTimeout(() => {
      toast.success('Brand kit downloaded successfully!', {
        description: 'All logo assets have been packaged into a ZIP file'
      });
    }, 3000);
  };

  return (
    <div className="container max-w-5xl py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">Paym.me Brand Kit</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
          Everything you need to represent the Paym.me brand correctly in your communications.
        </p>
        <Button 
          onClick={handleDownloadAll}
          className="flex gap-2 bg-blue-600 hover:bg-blue-700"
          size="lg"
        >
          <Package size={20} />
          Download Complete Brand Kit (ZIP)
        </Button>
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
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex flex-col items-center p-6 border rounded-lg">
                <div className="w-48 h-48 bg-white flex items-center justify-center mb-4 rounded-lg">
                  <img 
                    src="/lovable-uploads/48be0c8b-7024-4561-8197-b8fb18c8c01a.png" 
                    alt="Paym.me Logo (Full)" 
                    className="w-36 h-auto object-contain"
                  />
                </div>
                <h3 className="text-lg font-medium mb-2">Paym.me Logo (Full)</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex gap-2"
                    onClick={() => handleDownload('Full Logo PNG')}
                  >
                    <Download size={16} />
                    PNG
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex gap-2"
                    onClick={() => handleDownload('Full Logo SVG')}
                  >
                    <Download size={16} />
                    SVG
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-col items-center p-6 border rounded-lg bg-gray-900">
                <div className="w-48 h-48 bg-gray-900 flex items-center justify-center mb-4 rounded-lg">
                  <img 
                    src="/lovable-uploads/33485f10-10af-4c18-9961-ca57444f650c.png" 
                    alt="Paym.me Logo (Dark Background)" 
                    className="w-36 h-auto object-contain"
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
                    src="/lovable-uploads/33906b8c-f93b-4eff-b1f9-e4a0ca5aaef8.png" 
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
                    src="/lovable-uploads/8e336c94-f519-42df-aa12-2c1a838a3224.png" 
                    alt="Paym.me Compact Icon" 
                    className="w-24 h-24 object-contain"
                  />
                </div>
                <h3 className="text-lg font-medium mb-2">Paym.me Compact Icon</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex gap-2"
                    onClick={() => handleDownload('Compact Icon PNG')}
                  >
                    <Download size={16} />
                    PNG
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex gap-2"
                    onClick={() => handleDownload('Compact Icon SVG')}
                  >
                    <Download size={16} />
                    SVG
                  </Button>
                </div>
              </div>

              <div className="flex flex-col items-center p-6 border rounded-lg">
                <div className="w-48 h-48 bg-white flex items-center justify-center mb-4 rounded-lg">
                  <img 
                    src="/lovable-uploads/a0d6dd25-4d77-4acc-9cc3-ec428dba79dd.png" 
                    alt="Paym.me Cross Icon Blue" 
                    className="w-24 h-24 object-contain"
                  />
                </div>
                <h3 className="text-lg font-medium mb-2">Cross Icon (Blue)</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex gap-2"
                    onClick={() => handleDownload('Cross Icon Blue PNG')}
                  >
                    <Download size={16} />
                    PNG
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex gap-2"
                    onClick={() => handleDownload('Cross Icon Blue SVG')}
                  >
                    <Download size={16} />
                    SVG
                  </Button>
                </div>
              </div>

              <div className="flex flex-col items-center p-6 border rounded-lg">
                <div className="w-48 h-48 bg-white flex items-center justify-center mb-4 rounded-lg">
                  <img 
                    src="/lovable-uploads/78318878-fa8f-4fe5-a85b-45ce743719ad.png" 
                    alt="Paym.me Cross Icon Blue Alt" 
                    className="w-24 h-24 object-contain"
                  />
                </div>
                <h3 className="text-lg font-medium mb-2">Cross Icon (Blue Alt)</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex gap-2"
                    onClick={() => handleDownload('Cross Icon Blue Alt PNG')}
                  >
                    <Download size={16} />
                    PNG
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex gap-2"
                    onClick={() => handleDownload('Cross Icon Blue Alt SVG')}
                  >
                    <Download size={16} />
                    SVG
                  </Button>
                </div>
              </div>

              <div className="flex flex-col items-center p-6 border rounded-lg">
                <div className="w-48 h-48 bg-white flex items-center justify-center mb-4 rounded-lg">
                  <img 
                    src="/lovable-uploads/c5c6ea55-b72b-4f3d-8e9f-a90b8cf9b2b3.png" 
                    alt="Paym.me Cross Icon Blue Gradient" 
                    className="w-24 h-24 object-contain"
                  />
                </div>
                <h3 className="text-lg font-medium mb-2">Cross Icon (Gradient)</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex gap-2"
                    onClick={() => handleDownload('Cross Icon Gradient PNG')}
                  >
                    <Download size={16} />
                    PNG
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex gap-2"
                    onClick={() => handleDownload('Cross Icon Gradient SVG')}
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="flex flex-col">
                  <div className="aspect-video bg-gray-100 rounded flex items-center justify-center mb-3">
                    <img 
                      src="/lovable-uploads/48be0c8b-7024-4561-8197-b8fb18c8c01a.png" 
                      alt="Logo on website" 
                      className="h-12 object-contain"
                    />
                  </div>
                  <p className="text-sm text-gray-600">Website Header</p>
                </div>
                <div className="flex flex-col">
                  <div className="aspect-video bg-gray-100 rounded flex items-center justify-center mb-3">
                    <img 
                      src="/lovable-uploads/33906b8c-f93b-4eff-b1f9-e4a0ca5aaef8.png" 
                      alt="Logo on social media" 
                      className="h-12 object-contain"
                    />
                  </div>
                  <p className="text-sm text-gray-600">Social Media Profile</p>
                </div>
                <div className="flex flex-col">
                  <div className="aspect-video bg-gray-100 rounded flex items-center justify-center mb-3">
                    <img 
                      src="/lovable-uploads/8e336c94-f519-42df-aa12-2c1a838a3224.png" 
                      alt="Logo on print material" 
                      className="h-12 object-contain"
                    />
                  </div>
                  <p className="text-sm text-gray-600">Print Materials</p>
                </div>
                <div className="flex flex-col">
                  <div className="aspect-video bg-gray-100 rounded flex items-center justify-center mb-3">
                    <img 
                      src="/lovable-uploads/a0d6dd25-4d77-4acc-9cc3-ec428dba79dd.png" 
                      alt="Cross icon usage" 
                      className="h-12 object-contain"
                    />
                  </div>
                  <p className="text-sm text-gray-600">App Icons</p>
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
                <div className="h-24 bg-[#1e9bd8] rounded-lg"></div>
                <div>
                  <h3 className="font-medium">Primary Blue</h3>
                  <p className="text-sm text-gray-600">HEX: #1e9bd8</p>
                  <p className="text-sm text-gray-600">RGB: 30, 155, 216</p>
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
                        src="/lovable-uploads/33906b8c-f93b-4eff-b1f9-e4a0ca5aaef8.png" 
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
                          src="/lovable-uploads/33906b8c-f93b-4eff-b1f9-e4a0ca5aaef8.png" 
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
                        src="/lovable-uploads/33906b8c-f93b-4eff-b1f9-e4a0ca5aaef8.png" 
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
                          src="/lovable-uploads/33906b8c-f93b-4eff-b1f9-e4a0ca5aaef8.png" 
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
