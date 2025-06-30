import React, { useState, useEffect } from "react";
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
  Puzzle,
  FileText,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import ProfileEditForm from "@/components/ProfileEditForm";
import { toast } from "sonner";
import { Link, useLocation } from "react-router-dom";
import PaymentSection from "@/components/PaymentSection";
import SmartLinkSection from "@/components/SmartLinkSection";
import { SmartLink, Profile } from "@/types/profile";
import {
  BankDetails,
  CardDetails,
  UpiDetails,
  safelyConvertToUpiDetails,
} from "@/types/payment";
import { Transaction } from "@/types/transaction";
import UpiVerificationField from "@/components/UpiVerificationField";
import SettingsForm from "@/components/SettingsForm";
import { VerificationSection } from "@/components/verification/VerificationSection";
import AppsIntegrationsSection from "@/components/integrations/AppsIntegrationsSection";
import TransactionsSection from "@/components/TransactionsSection";
import Payms from "./Payms";

// Define goToAppsIntegrations for the global window object
declare global {
  interface Window {
    goToAppsIntegrations?: () => void;
  }
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [isUpiValid, setIsUpiValid] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [activeTab, setActiveTab] = useState(() => {
    if (location.state?.activeTab) {
      return location.state.activeTab;
    }
    return "overview";
  });

  // Clear location state after using it
  useEffect(() => {
    if (location.state?.activeTab) {
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Setup the goToAppsIntegrations window function - fixed to use React.useEffect
  useEffect(() => {
    window.goToAppsIntegrations = () => handleNavItemClick("apps-integrations");

    return () => {
      delete window.goToAppsIntegrations;
    };
  }, []);

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

      // Transform the raw profile data to match our Profile interface
      // And set a default value of 0 for views since it might not exist in the database
      const profileData: Profile = {
        id: data.id,
        username: data.username,
        displayName: data.display_name,
        bio: data.bio,
        avatarUrl: data.avatar_url,
        isVerified: data.is_verified,
        instagramUrl: data.instagram_url,
        twitterUrl: data.twitter_url,
        websiteUrl: data.website_url,
        linkedinUrl: data.linkedin_url,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        usernameUpdatedAt: data.username_updated_at,
        views: 0, // Default to 0 since the column might not exist yet
      };

      return profileData;
    },
    enabled: !!user?.id,
  });

  // Handle navigation item click
  const handleNavItemClick = (tabId) => {
    setActiveTab(tabId);
  };

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

  const { data: payms } = useQuery({
    queryKey: ["payms", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payms")
        .select("*")
        .eq("profile_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  const { data: transactions } = useQuery({
    queryKey: ["transactions", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("profile_id", user?.id)
        .order("created_at", { ascending: false });

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

  // Navigation items configuration
  const navigationItems = [
    { icon: LayoutDashboard, label: "Overview", tabId: "overview" },
    { icon: FileText, label: "Payms", tabId: "payms" },
    { icon: QrCode, label: "Payment Methods", tabId: "payment" },
    { icon: LinkIcon, label: "Smart Links", tabId: "smart-links" },
    { icon: Wallet, label: "Transactions", tabId: "transactions" },
    {
      icon: BarChart,
      label: "Analytics",
      tabId: "analytics",
      link: "/analytics",
    },
    { icon: Puzzle, label: "Apps & Integrations", tabId: "apps-integrations" },
    { icon: BadgeCheck, label: "Verification", tabId: "verification" },
    { icon: Settings, label: "Settings", tabId: "settings" },
  ];

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
                      src={profile?.avatarUrl}
                      alt={profile?.displayName || user?.email}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white font-medium text-3xl">
                      {(profile?.displayName || user?.email || "")
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
                  {profile?.displayName || user?.email}
                  {profile?.isVerified && (
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
                {navigationItems.map((item) =>
                  item.link ? (
                    <Link to={item.link} key={item.label}>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all duration-300 rounded-lg py-3 px-4 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary ${
                          activeTab === item.tabId
                            ? "bg-gray-100 dark:bg-gray-700/50 text-primary dark:text-primary font-medium"
                            : ""
                        }`}
                        size="sm"
                      >
                        <item.icon size={18} className="mr-3" />
                        {item.label}
                        <ChevronRight
                          size={16}
                          className="ml-auto opacity-70"
                        />
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      key={item.label}
                      variant="ghost"
                      className={`w-full justify-start hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all duration-300 rounded-lg py-3 px-4 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary ${
                        activeTab === item.tabId
                          ? "bg-gray-100 dark:bg-gray-700/50 text-primary dark:text-primary font-medium"
                          : ""
                      }`}
                      size="sm"
                      onClick={() => handleNavItemClick(item.tabId)}
                    >
                      <item.icon size={18} className="mr-3" />
                      {item.label}
                      <ChevronRight size={16} className="ml-auto opacity-70" />
                    </Button>
                  )
                )}
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
                  {navigationItems.find((item) => item.tabId === activeTab)
                    ?.label || "Dashboard"}
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
              {/* Overview Tab Content */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">
                      Welcome, {profile?.displayName}!
                    </h2>
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
                            onClick={() => handleNavItemClick("smart-links")}
                          >
                            View all <ArrowRight size={16} className="ml-1" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-0 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 shadow-sm">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                              Payms
                            </p>
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                              {payms?.length || 0}
                            </h3>
                          </div>
                          <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400">
                            <FileText size={20} />
                          </div>
                        </div>
                        <div className="mt-4">
                          <Button
                            variant="link"
                            size="sm"
                            className="text-red-600 dark:text-red-400 p-0 h-auto"
                            onClick={() => handleNavItemClick("payms")}
                          >
                            Manage <ArrowRight size={16} className="ml-1" />
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
                            onClick={() => handleNavItemClick("payment")}
                          >
                            Configure <ArrowRight size={16} className="ml-1" />
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
                            {profile?.websiteUrl && (
                              <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mr-3">
                                  <LinkIcon
                                    size={16}
                                    className="text-blue-600 dark:text-blue-400"
                                  />
                                </div>
                                <a
                                  href={profile.websiteUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                                >
                                  {profile.websiteUrl.replace(
                                    /^https?:\/\//,
                                    ""
                                  )}
                                </a>
                              </div>
                            )}
                            {profile?.twitterUrl && (
                              <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div className="w-8 h-8 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center mr-3">
                                  <svg
                                    className="w-4 h-4 text-gray-900 dark:text-white"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                                  </svg>
                                </div>
                                <a
                                  href={profile.twitterUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-900 dark:text-white hover:underline text-sm font-medium"
                                >
                                  {profile.twitterUrl
                                    .replace(/^https?:\/\//, "")
                                    .replace("twitter.com/", "@")
                                    .replace("x.com/", "@")}
                                </a>
                              </div>
                            )}
                            {profile?.instagramUrl && (
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
                                  href={profile.instagramUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-pink-600 dark:text-pink-400 hover:underline text-sm font-medium"
                                >
                                  {profile.instagramUrl
                                    .replace(/^https?:\/\//, "")
                                    .replace("instagram.com/", "@")}
                                </a>
                              </div>
                            )}
                            {profile?.linkedinUrl && (
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
                                  href={profile.linkedinUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                                >
                                  {profile.linkedinUrl
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
              )}

              {/* Payms Tab Content */}
              {activeTab === "payms" && <Payms />}

              {/* Payment Methods Tab Content */}
              {activeTab === "payment" && (
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
                            ? (upiMethod.details as { upiId?: string }).upiId ||
                              ""
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
                        ? (upiMethod.details as { upiId?: string }).upiId || ""
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
              )}

              {/* Smart Links Tab Content */}
              {activeTab === "smart-links" && (
                <SmartLinkSection links={typedSmartLinks} />
              )}

              {/* Apps and Integrations Tab Content */}
              {activeTab === "apps-integrations" && <AppsIntegrationsSection />}

              {/* Transactions Tab Content */}
              {activeTab === "transactions" && <TransactionsSection />}

              {/* Verification Tab Content */}
              {activeTab === "verification" && <VerificationSection />}

              {/* Settings Tab Content */}
              {activeTab === "settings" && (
                <SettingsForm
                  initialData={profile}
                  refetchProfile={refetchProfile}
                />
              )}

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
                            xmlns="http://www3.org/2000/svg"
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
