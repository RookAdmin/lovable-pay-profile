
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, BadgeCheck, Info } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { CategorySelector } from './CategorySelector';
import { IndividualForm } from './IndividualForm';
import { ProprietorshipForm } from './ProprietorshipForm';
import { PrivateLimitedForm } from './PrivateLimitedForm';
import { LLPForm } from './LLPForm';
import { CorporationForm } from './CorporationForm';
import { VerificationStatusCard } from './VerificationStatus';
import VerificationBadge from './VerificationBadge';
import { VerificationType, VerificationStatus, VerificationRequest } from '@/types/verification';

export function VerificationSection() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<VerificationType>('individual');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Fetch verification request if it exists
  const { data: verificationRequest, isLoading: isLoadingVerification, refetch: refetchVerification } = useQuery({
    queryKey: ['verification_request', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('verification_requests')
        .select('*')
        .eq('profile_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
        
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned" error
      return data as VerificationRequest | null;
    },
    enabled: !!user?.id,
  });
  
  // Fetch user profile to check verification status
  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });
  
  // If user has a verification request, adjust UI based on status
  useEffect(() => {
    if (verificationRequest) {
      setSelectedCategory(verificationRequest.category);
      
      // If status is pending or approved, show the status tab
      if (verificationRequest.status === 'pending' || verificationRequest.status === 'approved') {
        setActiveTab('status');
      }
    }
  }, [verificationRequest]);
  
  const handleFormSubmit = async (formData: any, documents: Record<string, string>) => {
    if (!user) {
      toast.error('You must be logged in to submit verification requests');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Insert verification request
      const { data, error } = await supabase
        .from('verification_requests')
        .insert({
          profile_id: user.id,
          category: selectedCategory,
          status: 'pending' as VerificationStatus,
          form_data: formData,
          documents: documents
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Update user profile with the category
      await supabase
        .from('profiles')
        .update({
          verification_category: selectedCategory
        })
        .eq('id', user.id);
      
      toast.success('Verification request submitted successfully');
      refetchVerification();
      setActiveTab('status');
    } catch (error: any) {
      toast.error(`Error submitting verification request: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const isLoading = isLoadingVerification || isLoadingProfile;
  const isVerified = profile?.is_verified || false;
  
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
              Account Verification
              {isVerified && (
                <VerificationBadge 
                  isVerified={true} 
                  category={profile?.verification_category as VerificationType} 
                  className="ml-2 inline-flex"
                />
              )}
            </CardTitle>
            <CardDescription className="mt-1">
              Get verified to unlock premium features and build trust with users
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Progress value={70} className="w-full max-w-xs mb-4" />
            <p className="text-sm text-muted-foreground">Loading verification details...</p>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="status">Verification Status</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              {isVerified ? (
                <Alert className="bg-green-50 border-green-200 text-green-800">
                  <BadgeCheck className="h-5 w-5" />
                  <AlertTitle>Your account is verified!</AlertTitle>
                  <AlertDescription>
                    Your account has been successfully verified as {profile?.verification_category}.
                    The verified badge will be displayed next to your name across the platform.
                  </AlertDescription>
                </Alert>
              ) : verificationRequest?.status === 'pending' ? (
                <Alert className="bg-yellow-50 border-yellow-200 text-yellow-800">
                  <Info className="h-5 w-5" />
                  <AlertTitle>Verification in progress</AlertTitle>
                  <AlertDescription>
                    Your verification request is currently being reviewed.
                    This typically takes 2-3 business days. You can check the status
                    in the "Verification Status" tab.
                  </AlertDescription>
                </Alert>
              ) : verificationRequest?.status === 'rejected' ? (
                <Alert className="bg-red-50 border-red-200 text-red-800">
                  <AlertCircle className="h-5 w-5" />
                  <AlertTitle>Verification rejected</AlertTitle>
                  <AlertDescription>
                    Your previous verification request was rejected.
                    Please review the feedback in the "Verification Status" tab
                    and submit a new request with the necessary corrections.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-6">
                  <Alert className="bg-blue-50 border-blue-200 text-blue-800">
                    <Info className="h-5 w-5" />
                    <AlertTitle>Why get verified?</AlertTitle>
                    <AlertDescription>
                      Verified accounts build trust with users, gain access to premium features,
                      and have higher visibility on the platform. Verification badges are displayed
                      next to your name across the platform.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="space-y-8">
                    <CategorySelector 
                      value={selectedCategory} 
                      onChange={(value) => setSelectedCategory(value as VerificationType)} 
                    />
                    
                    <div className="pt-4">
                      <h3 className="text-lg font-semibold mb-4">Complete Verification Form</h3>
                      
                      {selectedCategory === 'individual' && (
                        <IndividualForm 
                          userId={user?.id || ''} 
                          onSubmit={handleFormSubmit} 
                          isLoading={isSubmitting}
                        />
                      )}
                      
                      {selectedCategory === 'proprietorship' && (
                        <ProprietorshipForm 
                          userId={user?.id || ''} 
                          onSubmit={handleFormSubmit}
                          isLoading={isSubmitting}
                        />
                      )}
                      
                      {selectedCategory === 'private_limited' && (
                        <PrivateLimitedForm 
                          userId={user?.id || ''} 
                          onSubmit={handleFormSubmit}
                          isLoading={isSubmitting}
                        />
                      )}
                      
                      {selectedCategory === 'llp' && (
                        <LLPForm 
                          userId={user?.id || ''} 
                          onSubmit={handleFormSubmit}
                          isLoading={isSubmitting}
                        />
                      )}
                      
                      {selectedCategory === 'corporation' && (
                        <CorporationForm 
                          userId={user?.id || ''} 
                          onSubmit={handleFormSubmit}
                          isLoading={isSubmitting}
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="status" className="space-y-6">
              {verificationRequest ? (
                <VerificationStatusCard 
                  status={verificationRequest.status}
                  category={verificationRequest.category}
                  submittedAt={verificationRequest.submitted_at}
                  reviewedAt={verificationRequest.reviewed_at}
                  rejectionReason={verificationRequest.rejection_reason}
                />
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No verification requests yet</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    You haven't submitted any verification requests.
                    Go to the Overview tab to start the verification process.
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setActiveTab('overview')}
                  >
                    Start Verification
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
