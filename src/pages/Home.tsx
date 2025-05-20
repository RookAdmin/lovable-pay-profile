import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Shield,
  Zap,
  User,
  UserCheck,
  PlusSquare,
  ArrowRight,
  MessageSquare,
  CreditCard,
  Share2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  ShoppingBag,
  Users,
  BookOpen,
  Calendar,
  Heart,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Home = () => {
  const { user } = useAuth();
  const [scrollY, setScrollY] = useState(0);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      if (window.scrollY > 100) {
        setShowScrollIndicator(false);
      } else {
        setShowScrollIndicator(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex flex-col">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef]">
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#f8fafc]/90 to-[#e0f2fe]/80 -z-10"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        />
        <div
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center bg-no-repeat opacity-5 -z-20"
          style={{ transform: `translateY(${scrollY * 0.05}px)` }}
        />

        {/* Decorative elements */}
        <div className="absolute top-1/4 left-10 w-64 h-64 rounded-full bg-gradient-to-r from-[#0097A7]/10 to-[#0097A7]/5 blur-3xl -z-10"></div>
        <div className="absolute bottom-1/4 right-10 w-80 h-80 rounded-full bg-gradient-to-r from-[#003D40]/10 to-[#005F6A]/5 blur-3xl -z-10"></div>

        <div className="container px-4 z-10 py-20 max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="max-w-xl">
                <h1 className="text-4xl md:text-6xl font-bold mb-6 text-[#003D40] tracking-tight leading-tight animate-fade-in">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#003D40] via-[#005F6A] to-[#0097A7]">
                    Your Payment Receivables Identity
                  </span>
                </h1>
                <p
                  className="text-lg md:text-xl text-[#005F6A]/80 mb-8 animate-fade-in opacity-90 leading-relaxed"
                  style={{ animationDelay: "200ms" }}
                >
                  Collect payments elegantly with a single beautiful link.
                  <span className="font-semibold block mt-2 text-[#0097A7]">
                    paym.me/you
                  </span>
                </p>
                <div
                  className="flex flex-col sm:flex-row gap-4 animate-fade-in"
                  style={{ animationDelay: "400ms" }}
                >
                  {!user ? (
                    <Link to="/signup">
                      <Button
                        size="lg"
                        className="w-full sm:w-auto shadow-md hover:shadow-lg transition-all bg-[#0097A7] hover:bg-[#0097A7]/90 text-white"
                      >
                        Get Started for Free
                      </Button>
                    </Link>
                  ) : (
                    <Link to="/dashboard">
                      <Button
                        size="lg"
                        className="w-full sm:w-auto shadow-md hover:shadow-lg transition-all bg-[#0097A7] hover:bg-[#0097A7]/90 text-white"
                      >
                        Go to Dashboard
                      </Button>
                    </Link>
                  )}
                  <Link to="/arav">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto border-2 border-[#0097A7] text-[#003D40] hover:bg-[#D4F1F4]/10"
                    >
                      See Demo
                    </Button>
                  </Link>
                </div>

                <div
                  className="mt-12 flex items-center space-x-6 text-sm text-[#005F6A]/70 animate-fade-in"
                  style={{ animationDelay: "600ms" }}
                >
                  <div className="flex items-center">
                    <Shield size={16} className="mr-2" />
                    <span>Secure & Private</span>
                  </div>
                  <div className="flex items-center">
                    <UserCheck size={16} className="mr-2" />
                    <span>10k+ Users</span>
                  </div>
                  <div className="flex items-center">
                    <Zap size={16} className="mr-2" />
                    <span>Instant Setup</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 md:order-2 flex justify-center items-center">
              <div
                className="relative w-full max-w-md animate-fade-in transform md:translate-y-0 -translate-y-8"
                style={{ animationDelay: "300ms" }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#0097A7]/20 to-[#003D40]/10 rounded-2xl transform rotate-3 scale-95 blur-sm"></div>
                <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#0097A7]/10">
                  <div className="bg-gradient-to-r from-[#003D40] to-[#0097A7] h-16 flex items-center px-6">
                    <span className="text-white font-medium">
                      paym.me/sarah
                    </span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 rounded-full bg-[#D4F1F4] flex items-center justify-center mr-4">
                        <User size={32} className="text-[#0097A7]" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-[#003D40]">
                          Sarah Johnson
                        </h3>
                        <p className="text-[#005F6A]/70">Freelance Designer</p>
                      </div>
                    </div>
                    <div className="space-y-4 mb-6">
                      <div className="bg-[#f8fafc] p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-[#005F6A] mb-2">
                          UPI Payment
                        </h4>
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded bg-[#D4F1F4]/50 flex items-center justify-center mr-3">
                            <CreditCard size={20} className="text-[#0097A7]" />
                          </div>
                          <span className="text-[#003D40]">sarah@upi</span>
                        </div>
                      </div>
                      <div className="bg-[#f8fafc] p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-[#005F6A] mb-2">
                          Bank Transfer
                        </h4>
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded bg-[#D4F1F4]/50 flex items-center justify-center mr-3">
                            <CreditCard size={20} className="text-[#0097A7]" />
                          </div>
                          <span className="text-[#003D40]">XXXX XXXX 1234</span>
                        </div>
                      </div>
                    </div>
                    <Button className="w-full bg-[#0097A7] hover:bg-[#0097A7]/90">
                      Pay Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showScrollIndicator && (
          <div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce transition-opacity"
            style={{ opacity: 1 - scrollY / 100 }}
          >
            <ChevronDown size={32} className="text-[#003D40] opacity-50" />
          </div>
        )}
      </section>

      <section className="py-24 bg-gradient-to-br from-[#D4F1F4]/50 to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579547621706-1a9c79d5c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-fixed opacity-5" />

        <div className="container px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-[#005F6A]">
              How It Works
            </h2>
            <p className="text-lg md:text-xl text-[#005F6A]/80">
              Three simple steps to start collecting payments privately
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto relative">
            <div className="absolute top-24 left-0 w-full h-1 bg-primary/30 hidden md:block" />

            {[
              {
                icon: PlusSquare,
                title: "Create Account",
                desc: "Sign up in seconds with just your email",
                step: 1,
              },
              {
                icon: CreditCard,
                title: "Add Payment Methods",
                desc: "Connect your UPI, bank account, or cards",
                step: 2,
              },
              {
                icon: Share2,
                title: "Share Your Link",
                desc: "Share your paym.me link with anyone",
                step: 3,
              },
            ].map((step, i) => (
              <div
                key={i}
                className="text-center relative hover:-translate-y-2 transition-transform duration-300"
                style={{ animationDelay: `${i * 200}ms` }}
              >
                <div className="rounded-full bg-white shadow-xl w-20 h-20 mx-auto mb-6 flex items-center justify-center border-4 border-primary/20 relative z-10 hover:border-primary/50 transition-colors">
                  <step.icon className="h-9 w-9 text-primary" />
                  <span className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
                    {step.step}
                  </span>
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-[#003D40]">
                  {step.title}
                </h3>
                <p className="text-[#005F6A] text-lg">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579547945413-497e1b99dac0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-fixed opacity-5" />

        <div className="container px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-[#005F6A]">
              Why Choose Paym.me?
            </h2>
            <p className="text-lg md:text-xl text-[#005F6A]/80">
              A complete payment identity solution that puts your privacy first
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: "Privacy-First",
                desc: "No need to share personal contact info. Only show payment methods.",
              },
              {
                icon: Zap,
                title: "Smart Links",
                desc: "Create one-click payment links with custom amounts and messages.",
              },
              {
                icon: User,
                title: "Your Identity",
                desc: "Customize your page with your brand, photo, and social links.",
              },
              {
                icon: MessageSquare,
                title: "Payms",
                desc: "Generate professional invoices and custom payment links for clients.",
              },
            ].map((feature, i) => (
              <Card
                key={i}
                className="bg-white border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-cyan/5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                <CardContent className="pt-8 pb-6 relative">
                  <div className="rounded-full bg-primary/10 p-4 w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3 text-[#003D40]">
                    {feature.title}
                  </h3>
                  <p className="text-[#005F6A] text-lg">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* New Payms Section */}
      <section className="py-24 bg-gradient-to-br from-[#f8fafc] to-[#e0f2fe] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579547621706-1a9c79d5c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-fixed opacity-5" />

        {/* Decorative elements */}
        <div className="absolute top-1/4 right-10 w-64 h-64 rounded-full bg-gradient-to-r from-[#0097A7]/10 to-[#0097A7]/5 blur-3xl"></div>
        <div className="absolute bottom-1/4 left-10 w-80 h-80 rounded-full bg-gradient-to-r from-[#003D40]/10 to-[#005F6A]/5 blur-3xl"></div>

        <div className="container px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-[#005F6A]">
              Introducing Payms
            </h2>
            <p className="text-lg md:text-xl text-[#005F6A]/80">
              Create custom payment links for specific amounts and purposes
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center max-w-6xl mx-auto">
            <div className="order-2 md:order-1">
              <h3 className="text-2xl md:text-3xl font-bold mb-6 text-[#003D40]">
                Standard Link vs Payms
              </h3>

              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#D4F1F4] flex items-center justify-center mr-4">
                      <User size={24} className="text-[#0097A7]" />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-[#003D40]">
                        Standard Link
                      </h4>
                      <p className="text-[#005F6A]/70">paym.me/yourname</p>
                    </div>
                  </div>
                  <ul className="space-y-3 text-[#005F6A]">
                    <li className="flex items-start">
                      <div className="mr-3 mt-1 text-[#0097A7]">•</div>
                      <span>Shows all your payment methods</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-3 mt-1 text-[#0097A7]">•</div>
                      <span>Payer decides the amount</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-3 mt-1 text-[#0097A7]">•</div>
                      <span>Your permanent payment identity</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-[#0097A7]/20">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#0097A7] flex items-center justify-center mr-4">
                      <MessageSquare size={24} className="text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-[#003D40]">
                        Payms
                      </h4>
                      <p className="text-[#005F6A]/70">
                        paym.me/yourname/coffee
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-3 text-[#005F6A]">
                    <li className="flex items-start">
                      <div className="mr-3 mt-1 text-[#0097A7]">•</div>
                      <span>Pre-set payment amount</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-3 mt-1 text-[#0097A7]">•</div>
                      <span>Custom description & purpose</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-3 mt-1 text-[#0097A7]">•</div>
                      <span>One-click payment experience</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-3 mt-1 text-[#0097A7]">•</div>
                      <span>Perfect for specific products or services</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="order-1 md:order-2 flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0097A7]/20 to-[#003D40]/10 rounded-2xl transform rotate-3 scale-95 blur-sm"></div>
                <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#0097A7]/10">
                  <div className="bg-gradient-to-r from-[#003D40] to-[#0097A7] h-16 flex items-center px-6">
                    <span className="text-white font-medium">
                      paym.me/alex/design-project
                    </span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 rounded-full bg-[#D4F1F4] flex items-center justify-center mr-4">
                        <User size={32} className="text-[#0097A7]" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-[#003D40]">
                          Alex's Design Project
                        </h3>
                        <p className="text-[#005F6A]/70">
                          Logo Design - Phase 1
                        </p>
                      </div>
                    </div>

                    <div className="bg-[#f8fafc] p-4 rounded-lg mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-medium text-[#005F6A]">
                          Project Details
                        </h4>
                        <span className="text-xl font-bold text-[#003D40]">
                          ₹5,000
                        </span>
                      </div>
                      <p className="text-sm text-[#005F6A]/80">
                        Initial payment for logo design project. Includes 3
                        concepts and 2 revision rounds.
                      </p>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div className="bg-[#f8fafc] p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-[#005F6A] mb-2">
                          Payment Methods
                        </h4>
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded bg-[#D4F1F4]/50 flex items-center justify-center mr-3">
                            <CreditCard size={20} className="text-[#0097A7]" />
                          </div>
                          <span className="text-[#003D40]">
                            Multiple options available
                          </span>
                        </div>
                      </div>
                    </div>

                    <Button className="w-full bg-[#0097A7] hover:bg-[#0097A7]/90">
                      Pay ₹5,000
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-6 text-[#003D40]">
              Create Payms For:
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                "Products",
                "Services",
                "Donations",
                "Subscriptions",
                "Events",
                "Invoices",
                "Memberships",
                "Custom Amounts",
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-white/80 backdrop-blur-sm rounded-lg py-3 px-4 shadow-md hover:shadow-lg transition-all hover:-translate-y-1 border border-[#0097A7]/10"
                >
                  <p className="text-[#005F6A] font-medium">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Perfect For Section - Premium Auto-Carousel Design */}
      <section className="py-24 bg-[#fafafa] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-1.2.1&auto=format&fit=crop&q=80&w=2940')] bg-cover bg-center opacity-[0.03]" />

        <div className="container px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-[#003D40]">
              Perfect For
            </h2>
            <p className="text-lg md:text-xl text-[#005F6A]/80">
              Designed for professionals who value elegance and simplicity
            </p>
          </div>

          {/* Premium Auto-Carousel */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            {/* Carousel Navigation */}
            <div className="absolute top-1/2 left-0 transform -translate-y-1/2 z-20 w-full flex justify-between pointer-events-none">
              <button
                className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-[#003D40] pointer-events-auto focus:outline-none hover:bg-white transition-all"
                onClick={() => {
                  const carousel = document.getElementById("premium-carousel");
                  if (carousel) {
                    carousel.scrollBy({ left: -400, behavior: "smooth" });
                  }
                }}
              >
                <ChevronLeft size={24} />
              </button>
              <button
                className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-[#003D40] pointer-events-auto focus:outline-none hover:bg-white transition-all"
                onClick={() => {
                  const carousel = document.getElementById("premium-carousel");
                  if (carousel) {
                    carousel.scrollBy({ left: 400, behavior: "smooth" });
                  }
                }}
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Carousel Items */}
            <div className="overflow-hidden" id="premium-carousel">
              <div className="flex space-x-6 py-8 animate-carousel">
                {[
                  {
                    icon: <Briefcase size={32} />,
                    title: "Freelancers",
                    desc: "Create professional payment links for clients with detailed project descriptions and milestone payments.",
                    image:
                      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-1.2.1&auto=format&fit=crop&q=80&w=2942",
                  },
                  {
                    icon: <ShoppingBag size={32} />,
                    title: "Small Businesses",
                    desc: "Streamline your payment collection with branded payment links that reflect your company's identity.",
                    image:
                      "https://images.unsplash.com/photo-1497215842964-222b430dc094?ixlib=rb-1.2.1&auto=format&fit=crop&q=80&w=2940",
                  },
                  {
                    icon: <Users size={32} />,
                    title: "Creators",
                    desc: "Monetize your content with elegant payment links for subscriptions, tips, and exclusive offerings.",
                    image:
                      "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?ixlib=rb-1.2.1&auto=format&fit=crop&q=80&w=2940",
                  },
                  {
                    icon: <BookOpen size={32} />,
                    title: "Educators",
                    desc: "Collect course fees and workshop payments with professional, branded payment links.",
                    image:
                      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-1.2.1&auto=format&fit=crop&q=80&w=2940",
                  },
                  {
                    icon: <Calendar size={32} />,
                    title: "Event Organizers",
                    desc: "Manage event registrations and ticket sales with customized payment experiences.",
                    image:
                      "https://images.unsplash.com/photo-1540317580384-e5d43867caa6?ixlib=rb-1.2.1&auto=format&fit=crop&q=80&w=2940",
                  },
                  {
                    icon: <Heart size={32} />,
                    title: "Non-Profits",
                    desc: "Create donation links with purpose-specific descriptions and suggested amounts.",
                    image:
                      "https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-1.2.1&auto=format&fit=crop&q=80&w=2940",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="min-w-[350px] md:min-w-[400px] flex-shrink-0"
                  >
                    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 h-full group">
                      <div className="h-48 overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10"></div>
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-8 relative">
                        <div className="w-16 h-16 rounded-full bg-[#f8fafc] flex items-center justify-center absolute -top-8 right-8 border-4 border-white shadow-md text-[#0097A7]">
                          {item.icon}
                        </div>
                        <h3 className="text-2xl font-semibold mb-4 text-[#003D40]">
                          {item.title}
                        </h3>
                        <div className="w-12 h-0.5 bg-[#0097A7] mb-4 transition-all duration-500 group-hover:w-24"></div>
                        <p className="text-[#005F6A]/80">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel Indicators */}
            <div className="flex justify-center mt-8 space-x-2">
              {[0, 1, 2, 3].map((index) => (
                <button
                  key={index}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    index === 0 ? "bg-[#0097A7]" : "bg-[#D4F1F4]"
                  }`}
                  onClick={() => {
                    const carousel =
                      document.getElementById("premium-carousel");
                    if (carousel) {
                      carousel.scrollTo({
                        left: index * 400,
                        behavior: "smooth",
                      });
                    }
                  }}
                ></button>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="mt-20 max-w-4xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {[
                "Freelancers",
                "Businesses",
                "Creators",
                "Consultants",
                "Educators",
                "Non-profits",
                "Events",
                "Personal",
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg py-4 px-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 border border-[#0097A7]/5 text-center"
                >
                  <p className="text-[#003D40] font-medium">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-[#D4F1F4]/30 to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579547945026-a788b13c73f7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-fixed opacity-5" />

        <div className="container px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-[#005F6A]">
              What Our Users Say
            </h2>
            <p className="text-lg md:text-xl text-[#005F6A]/80">
              Join thousands of creators who trust paym.me
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Priya M.",
                role: "Content Creator",
                quote:
                  "Finally I can collect tips without sharing my personal phone number!",
                avatar: "https://i.pravatar.cc/150?img=32",
              },
              {
                name: "Rahul S.",
                role: "Freelance Designer",
                quote:
                  "My clients love how professional my payment page looks.",
                avatar: "https://i.pravatar.cc/150?img=12",
              },
              {
                name: "Ananya K.",
                role: "Small Business Owner",
                quote:
                  "Simplified payments and increased customer satisfaction.",
                avatar: "https://i.pravatar.cc/150?img=23",
              },
            ].map((item, i) => (
              <Card
                key={i}
                className="bg-white border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <CardContent className="p-8 relative">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-bl-full -mt-2 -mr-2 z-0" />
                  <div className="mb-6 flex items-center relative z-10">
                    <div className="mr-4">
                      <img
                        src={item.avatar}
                        alt={item.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-[#D4F1F4]"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-lg text-[#003D40]">
                        {item.name}
                      </p>
                      <p className="text-sm text-[#005F6A]/80">{item.role}</p>
                    </div>
                  </div>
                  <p className="text-[#005F6A] text-lg mb-4 relative z-10">
                    "{item.quote}"
                  </p>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="#0097A7"
                        stroke="none"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#003D40] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579547621113-e4bb2a19bdd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center opacity-10" />

        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div
            className="absolute w-64 h-64 rounded-full bg-[#0097A7]/10 -top-20 -left-20 animate-pulse"
            style={{ animationDuration: "10s" }}
          />
          <div
            className="absolute w-96 h-96 rounded-full bg-[#0097A7]/10 bottom-20 right-10 animate-pulse"
            style={{ animationDuration: "15s", animationDelay: "1s" }}
          />
        </div>

        <div className="container px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-8 text-white">
              Ready to Get Started?
            </h2>
            <p className="text-xl opacity-90 mb-12 text-white">
              Create your payment profile in minutes and start receiving money
              with privacy and dignity.
            </p>
            {!user ? (
              <Link to="/signup">
                <Button
                  size="lg"
                  className="bg-[#0097A7] text-white hover:bg-[#005F6A] shadow-lg shadow-[#0097A7]/20 hover:shadow-xl hover:shadow-[#0097A7]/30 transition-all hover:scale-105 text-lg px-8 py-6 h-auto"
                >
                  Create Your Profile <ArrowRight className="ml-2" />
                </Button>
              </Link>
            ) : (
              <Link to="/dashboard">
                <Button
                  size="lg"
                  className="bg-[#0097A7] text-white hover:bg-[#005F6A] shadow-lg shadow-[#0097A7]/20 hover:shadow-xl hover:shadow-[#0097A7]/30 transition-all hover:scale-105 text-lg px-8 py-6 h-auto"
                >
                  Go to Dashboard <ArrowRight className="ml-2" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Replace the style jsx tag with a style tag */}
      <style>
        {`
        @keyframes carousel {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-1200px);
          }
        }
        .animate-carousel {
          animation: carousel 30s linear infinite;
        }
        .animate-carousel:hover {
          animation-play-state: paused;
        }
        `}
      </style>
    </div>
  );
};

export default Home;
