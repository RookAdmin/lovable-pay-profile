import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Wallet,
  BarChart,
  Settings,
  LogOut,
  Share2,
  QrCode,
  LinkIcon,
  LayoutDashboard,
  Pencil,
  Edit,
  Plus,
  ArrowRight,
  ChevronRight,
  Check,
  ExternalLink,
  BadgeCheck,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import ProfileEditForm from "@/components/ProfileEditForm";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import PaymentSection from "@/components/PaymentSection";
import SmartLinkSection from "@/components/SmartLinkSection";
import { SmartLink } from "@/types/profile";
import {
  BankDetails,
  CardDetails,
  UpiDetails,
  safelyConvertToUpiDetails,
} from "@/types/payment";
import UpiVerificationField from "@/components/UpiVerificationField";
import SettingsForm from "@/components/SettingsForm";
import { VerificationSection } from "@/components/verification/VerificationSection";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [isUpiValid, setIsUpiValid] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);

  const {
    data: profile,
    isLoading,
    refetch: refetchProfileQuery,
  } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) throw error;
      
      // Add views property with default value if it doesn't exist
      return {
        ...data,
        views: data.views || 0
      };
    },
    enabled: !!user?.id,
  });

  const refetchProfile = async (): Promise<void> => {
    await refetchProfileQuery();
  };

  const { data: paymentMethods, refetch: refetchPaymentMethods } = useQuery({
    queryKey: ["payment_methods", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payment_methods")
        .select("*")
        .eq("profile_id", user?.id);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  const { data: smartLinks } = useQuery({
    queryKey: ["smart_links", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("smart_links")
        .select("*")
        .eq("profile_id", user?.id);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/${profile?.username}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Profile link copied to clipboard!");
  };

  const handleDataUpdate = async () => {
    await Promise.all([refetchProfile(), refetchPaymentMethods()]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="flex justify-center items-center min-h-screen">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const upiMethod = paymentMethods?.find((m) => m.type === "upi");
  const qrCodeUrl =
    upiMethod?.qr_code_url ||
    (typeof upiMethod?.details === "object" && upiMethod?.details !== null
      ? safelyConvertToUpiDetails(upiMethod.details).qrCodeUrl
      : undefined);

  const upiDetails = upiMethod?.details
    ? safelyConvertToUpiDetails(upiMethod.details)
    : undefined;

  const bankMethod = paymentMethods?.find((m) => m.type === "bank");
  const bankDetails: BankDetails | undefined = bankMethod?.details
    ? {
        accountNumber:
          (bankMethod.details as { accountNumber?: string }).accountNumber ||
          "",
        ifsc: (bankMethod.details as { ifsc?: string }).ifsc || "",
        accountName:
          (bankMethod.details as { accountName?: string }).accountName || "",
        bankName: (bankMethod.details as { bankName?: string }).bankName || "",
      }
    : undefined;

  const cardMethod = paymentMethods?.find((m) => m.type === "card");
  const cardDetails: CardDetails | undefined = cardMethod?.details
    ? {
        cardNumber:
          (cardMethod.details as { cardNumber?: string }).cardNumber || "",
        nameOnCard:
          (cardMethod.details as { nameOnCard?: string }).nameOnCard || "",
        expiryMonth:
          (cardMethod.details as { expiryMonth?: string }).expiryMonth || "",
        expiryYear:
          (cardMethod.details as { expiryYear?: string }).expiryYear || "",
      }
    : undefined;

  const typedSmartLinks: SmartLink[] =
    smartLinks?.map((link) => ({
      id: link.id,
      title: link.title,
      amount: Number(link.amount),
      currency: link.currency,
      icon:
        link.icon === "heart" ||
        link.icon === "coffee" ||
        link.icon === "zap" ||
        link.icon === "card"
          ? link.icon
          : "heart",
      gradient: !!link.gradient,
      profileId: link.profile_id,
      isActive: link.is_active,
      createdAt: link.created_at,
      updatedAt: link.updated_at,
    })) || [];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="flex flex-col md:flex-row w-full min-h-screen">
        {/* Sidebar */}
        <div className="w-full md:w-72 shrink-0 p-4">
          <Card className="sticky top-8 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-lg rounded-xl">
            <CardContent className="p-6">
              <div className="flex flex-col items-center mb-8 pt-2 relative group">
                <div className="relative">
                  <Avatar className="h-28 w-28 mb-4 ring-4 ring-white/50 dark:ring-gray-700/50 ring-offset-2 ring-offset-gray-100 dark:ring-offset-gray-800 shadow-lg">
                    <AvatarImage
                      src={profile?.avatar_url}
                      alt={profile?.display_name || user?.email}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white font-medium text-3xl">
                      {(profile?.display_name || user?.email || "")
                        .substring(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <button
                    onClick={() => setEditingProfile(true)}
                    className="absolute -bottom-2 right-2 bg-white dark:bg-gray-700 p-2 rounded-full shadow-md hover:bg-primary/20 transition-all duration-300 group-hover:opacity-100 opacity-0"
                  >
                    <Pencil
                      size={16}
                      className="text-gray-700 dark:text-white"
                    />
                  </button>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1 text-center flex items-center gap-2">
                  {profile?.display_name || user?.email}
                  {profile?.is_verified && (
                    <BadgeCheck size={20} className="text-green-500" />
                  )}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  @{profile?.username}
                </p>
                <Button
                  onClick={handleShare}
                  className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-lg hover:shadow-primary/30 transition-all duration-300 rounded-lg py-2 px-4 flex items-center justify-center"
                >
                  <Share2 size={16} className="mr-2" />
                  Share Profile
                </Button>
              </div>

              <nav className="space-y-2">
                {[
                  { icon: LayoutDashboard, label: "Overview", to: "#overview" },
                  { icon: QrCode, label: "Payment Methods", to: "#payment" },
                  { icon: LinkIcon, label: "Smart Links", to: "#smart-links" },
                  { icon: BadgeCheck, label: "Verification", to: "#verification" },
                  { icon: Settings, label: "Settings", to: "#settings" },
                ].map((item) => (
                  <Button
                    key={item.label}
                    variant="ghost"
                    className="w-full justify-start hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all duration-300 rounded-lg py-3 px-4 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary"
                    size="sm"
                    onClick={() => {
                      const element = document.querySelector(
                        `[data-value="${item.to.replace("#", "")}"]`
                      );
                      if (element) {
                        (element as HTMLElement).click();
                      }
                    }}
                  >
                    <item.icon size={18} className="mr-3" />
                    {item.label}
                    <ChevronRight size={16} className="ml-auto opacity-70" />
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 rounded-lg py-3 px-4"
                  size="sm"
                  onClick={() => signOut()}
                >
                  <LogOut size={18} className="mr-3" />
                  Logout
                </Button>
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4">
          <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-lg rounded-xl overflow-hidden">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white">
                  Dashboard
                </CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 border-gray-300 dark:border-gray-600"
                    onClick={() => setEditingProfile(true)}
                  >
                    <Edit size={16} />
                    Edit Profile
                  </Button>
                  <Link to={`/${profile?.username}`} target="_blank">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1 border-gray-300 dark:border-gray-600"
                    >
                      <ExternalLink size={16} />
                      View Live
                    </Button>
                  </Link>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full grid grid-cols-2 md:grid-cols-5 mb-8 bg-gray-100 dark:bg-gray-700/50 border-0 rounded-xl p-1 gap-1">
                  <TabsTrigger
                    value="overview"
                    className="text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm rounded-lg transition-all duration-300 py-2"
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value="payment"
                    className="text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm rounded-lg transition-all duration-300 py-2"
                  >
                    Payment
                  </TabsTrigger>
                  <TabsTrigger
                    value="smart-links"
                    className="text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm rounded-lg transition-all duration-300 py-2"
                  >
                    Smart Links
                  </TabsTrigger>
                  <TabsTrigger
                    value="verification"
                    className="text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm rounded-lg transition-all duration-300 py-2"
                  >
                    Verification
                  </TabsTrigger>
                  <TabsTrigger
                    value="settings"
                    className="text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm rounded-lg transition-all duration-300 py-2"
                  >
                    Settings
                  </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold">Welcome, {profile?.display_name}!</h2>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => setEditingProfile(true)}
                      >
                        <Edit size={14} />
                        Edit Profile
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 shadow-sm mt-5 sm:mt-0 md:mt-0 lg:mt-0 xl:mt-0 2xl:mt-0">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                                Smart Links
                              </p>
                              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                                {typedSmartLinks.length}
                              </h3>
                            </div>
                            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
                              <LinkIcon size={20} />
                            </div>
                          </div>
                          <div className="mt-4">
                            <Button
                              variant="link"
                              size="sm"
                              className="text-blue-600 dark:text-blue-400 p-0 h-auto"
                            >
                              View all <ArrowRight size={16} className="ml-1" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 shadow-sm">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                                Payment Methods
                              </p>
                              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                                {paymentMethods?.length || 0}
                              </h3>
                            </div>
                            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400">
                              <Wallet size={20} />
                            </div>
                          </div>
                          <div className="mt-4">
                            <Button
                              variant="link"
                              size="sm"
                              className="text-green-600 dark:text-green-400 p-0 h-auto"
                            >
                              Configure{" "}
                              <ArrowRight size={16} className="ml-1" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-0 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 shadow-sm">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                                Profile Views
                              </p>
                              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                                {profile?.views || 0}
                              </h3>
                            </div>
                            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400">
                              <BarChart size={20} />
                            </div>
                          </div>
                          <div className="mt-4">
                            <Button
                              variant="link"
                              size="sm"
                              className="text-purple-600 dark:text-purple-400 p-0 h-auto"
                            >
                              Analytics{" "}
                              <ArrowRight size={16} className="ml-1" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card className="border-0 shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
                          Profile Overview
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div>
                            <h4 className="font-medium mb-3 text-gray-700 dark:text-gray-300">
                              Bio
                            </h4>
                            <p className="text-gray-600 dark:text-gray-400">
                              {profile?.bio || "No bio added yet."}
                            </p>
                          </div>

                          <div className="w-full">
                            <h4 className="font-medium mb-3 text-gray-700 dark:text-gray-300">
                              Profile Link
                            </h4>
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                              <div className="flex-1 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg sm:min-w-0">
                                <p className="text-gray-800 dark:text-gray-200 font-mono text-sm truncate">
                                  {window.location.origin}/{profile?.username}
                                </p>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleShare}
                                className="w-full sm:w-auto border-gray-300 dark:border-gray-600"
                              >
                                <Share2 size={16} className="mr-2" />
                                Copy
                              </Button>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium mb-3 text-gray-700 dark:text-gray-300">
                              Social Links
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {profile?.website_url && (
                                <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mr-3">
                                    <LinkIcon
                                      size={16}
                                      className="text-blue-600 dark:text-blue-400"
                                    />
                                  </div>
                                  <a
                                    href={profile.website_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                                  >
                                    {profile.website_url.replace(
                                      /^https?:\/\//,
                                      ""
                                    )}
                                  </a>
                                </div>
                              )}
                            {profile?.twitter_url && (
  <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
    <div className="w-8 h-8 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center mr-3">
      <svg
        className="w-4 h-4 text-gray-900 dark:text-white"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
      </svg>
    </div>
    <a
      href={profile.twitter_url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-900 dark:text-white hover:underline text-sm font-medium"
    >
      {profile.twitter_url
        .replace(/^https?:\/\//, "")
        .replace("twitter.com/", "@")
        .replace("x.com/", "@")}
    </a>
  </div>
)}
                              {profile?.instagram_url && (
                                <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                  <div className="w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-900/50 flex items-center justify-center mr-3">
                                    <svg
                                      className="w-4 h-4 text-pink-600 dark:text-pink-400"
                                      fill="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.28.073-1.689.073-4.948 0-3.204.013-3.583-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                                    </svg>
                                  </div>
                                  <a
                                    href={profile.instagram_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-pink-600 dark:text-pink-400 hover:underline text-sm font-medium"
                                  >
                                    {profile.instagram_url
                                      .replace(/^https?:\/\//, "")
                                      .replace("instagram.com/", "@")}
                                  </a>
                                </div>
                              )}
                              {profile?.linkedin_url && (
                                <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mr-3">
                                    <svg
                                      className="w-4 h-4 text-blue-600 dark:text-blue-400"
                                      fill="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                    </svg>
                                  </div>
                                  <a
                                    href={profile.linkedin_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                                  >
                                    {profile.linkedin_url
                                      .replace(/^https?:\/\//, "")
                                      .replace("linkedin.com/in/", "")}
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Payment Tab */}
                <TabsContent value="payment">
                  <div className="space-y-8">
                    <Card className="border-0 shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
                          Payment Verification
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <UpiVerificationField
                          upiId={
                            upiMethod?.details &&
                            typeof upiMethod.details === "object"
                              ? (upiMethod.details as { upiId?: string })
                                  .upiId || ""
                              : ""
                          }
                          onChange={(value) =>
                            console.log("UPI ID changed:", value)
                          }
                          onValidate={(valid) => setIsUpiValid(valid)}
                          className="max-w-md"
                        />
                      </CardContent>
                    </Card>

                    <PaymentSection
                      upiId={
                        upiMethod?.details &&
                        typeof upiMethod.details === "object"
                          ? (upiMethod.details as { upiId?: string }).upiId ||
                            ""
                          : ""
                      }
                      bankDetails={bankDetails}
                      cardDetails={cardDetails}
                      qrCodeUrl={qrCodeUrl}
                      onPaymentMethodUpdate={handleDataUpdate}
                      upiMethodId={upiMethod?.id}
                      bankMethodId={bankMethod?.id}
                      cardMethodId={cardMethod?.id}
                    />

                    <Card className="border-0 shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
                          Payment Integrations
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-6">
                          <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 shadow-sm hover:shadow-md transition-all duration-300">
                            <CardContent className="p-6">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                  <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center shadow-sm mr-3">
                                    <img
                                      src="https://razorpay.com/favicon.png"
                                      alt="Razorpay"
                                      className="w-6 h-6"
                                    />
                                  </div>
                                  <h4 className="text-gray-800 dark:text-white font-medium">
                                    Razorpay
                                  </h4>
                                </div>
                                <div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-blue-200 dark:border-blue-900/50 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                  >
                                    Configure
                                  </Button>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                Connect your Razorpay account to accept direct
                                payments from your profile page.
                              </p>
                              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                                <span className="font-medium">
                                  Not Configured
                                </span>
                              </div>
                            </CardContent>
                          </Card>

                          <Card className="border-0 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 shadow-sm hover:shadow-md transition-all duration-300">
                            <CardContent className="p-6">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                  <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center shadow-sm mr-3">
                                    <img
                                      src="https://stripe.com/favicon.ico"
                                      alt="Stripe"
                                      className="w-6 h-6"
                                    />
                                  </div>
                                  <h4 className="text-gray-800 dark:text-white font-medium">
                                    Stripe
                                  </h4>
                                </div>
                                <div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-purple-200 dark:border-purple-900/50 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                                  >
                                    Configure
                                  </Button>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                Connect your Stripe account to accept
                                international payments from your profile.
                              </p>
                              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                                <span className="font-medium">
                                  Not Configured
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Smart Links Tab */}
                <TabsContent value="smart-links">
                  <SmartLinkSection links={typedSmartLinks} />
                </TabsContent>

                {/* Verification Tab */}
                <TabsContent value="verification">
                  <VerificationSection />
                </TabsContent>

                {/* Settings Tab */}
                <TabsContent value="settings">
                  <SettingsForm
                    initialData={profile}
                    refetchProfile={refetchProfile}
                  />
                </TabsContent>
              </Tabs>

              {/* Profile Edit Modal */}
              {editingProfile && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                  <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto border-0 shadow-2xl">
                    <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-xl font-bold text-gray-800 dark:text-white">
                          Edit Your Profile
                        </CardTitle>
                        <button
                          onClick={() => setEditingProfile(false)}
                          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <ProfileEditForm
                        initialData={profile}
                        onProfilePhotoUpdated={refetchProfile}
                        onClose={() => setEditingProfile(false)}
                      />
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
