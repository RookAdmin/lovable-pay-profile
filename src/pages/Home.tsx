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
      <section className="relative h-screen flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-br from-lightblue to-cyan opacity-70 -z-10"
          style={{ transform: `translateY(${scrollY * 0.2}px)` }}
        />
        <div
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center bg-no-repeat opacity-10 -z-20"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        />

        <div className="container px-4 z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1
              className="text-5xl md:text-7xl font-bold mb-6 text-[#003D40] animate-fade-in"
              style={{ transform: `translateY(${-scrollY * 0.2}px)` }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#003D40] via-[#005F6A] to-[#0097A7]">
                Your Payment Receivables Identity
              </span>
            </h1>
            <p
              className="text-xl md:text-2xl text-[#005F6A] mb-12 animate-fade-in opacity-90"
              style={{
                transform: `translateY(${-scrollY * 0.1}px)`,
                animationDelay: "200ms",
              }}
            >
              Collect Payment With Ease Using Just A Single Beautiful link:{" "}
              <span className="font-semibold">paym.me/you</span>
            </p>
            <div
              className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in"
              style={{ animationDelay: "400ms" }}
            >
              {!user ? (
                <Link to="/signup">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-[#0097A7] to-[#005F6A] hover:scale-105"
                  >
                    Get Started for Free
                  </Button>
                </Link>
              ) : (
                <Link to="/dashboard">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-[#0097A7] to-[#005F6A] hover:scale-105"
                  >
                    Go to Dashboard
                  </Button>
                </Link>
              )}
              <Link to="/arav">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-2 border-[#0097A7] text-[#003D40] hover:bg-[#D4F1F4]/20 hover:scale-105 transition-all"
                >
                  See Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {showScrollIndicator && (
          <div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce transition-opacity"
            style={{ opacity: 1 - scrollY / 100 }}
          >
            <ChevronDown size={40} className="text-[#003D40] opacity-70" />
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

      <section className="py-24 bg-white relative">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-[#005F6A]">
              Perfect For
            </h2>
            <p className="text-lg md:text-xl text-[#005F6A]/80">
              Anyone who collects payments and values their privacy
            </p>
          </div>

          <div className="relative px-4">
            <Swiper
              modules={[Autoplay, Navigation, Pagination]}
              spaceBetween={24}
              slidesPerView={1.2}
              breakpoints={{
                640: {
                  slidesPerView: 1.5,
                },
                768: {
                  slidesPerView: 2.3,
                },
                1024: {
                  slidesPerView: 3.1,
                },
              }}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              navigation={{
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              }}
              pagination={{
                el: ".swiper-pagination",
                clickable: true,
              }}
              loop={true}
              className="!overflow-visible"
            >
              {[
                {
                  title: "Content Creators",
                  desc: "Elegantly collect tips and payments from your audience",
                  img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                  accent: "#D946EF",
                },
                {
                  title: "Freelancers",
                  desc: "Receive client payments with professional simplicity",
                  img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                  accent: "#0EA5E9",
                },
                {
                  title: "Small Businesses",
                  desc: "Streamline payment collection with elegant solutions",
                  img: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                  accent: "#8B5CF6",
                },
                {
                  title: "Event Organizers",
                  desc: "Effortlessly manage contributions and fees",
                  img: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                  accent: "#F97316",
                },
                {
                  title: "Consultants",
                  desc: "Professional payment requests that reflect your brand",
                  img: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                  accent: "#1EAEDB",
                },
                {
                  title: "Individuals",
                  desc: "Request money with grace and dignity",
                  img: "https://images.unsplash.com/photo-1542103749-8ef59b94f47e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                  accent: "#9b87f5",
                },
              ].map((item, i) => (
                <SwiperSlide key={i}>
                  <div className="relative h-[420px] group overflow-hidden rounded-xl shadow-lg">
                    {/* Image with overlay */}
                    <div className="absolute inset-0 bg-black/20 z-10 transition-all duration-500 group-hover:bg-black/30"></div>
                    <img
                      src={item.img}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 z-20 p-8 text-white">
                      <div className="mb-2">
                        <span
                          className="inline-block w-12 h-1 mb-3 transition-all duration-500 group-hover:w-16"
                          style={{ backgroundColor: item.accent }}
                        ></span>
                      </div>
                      <h3 className="text-4xl font-light mb-3">{item.title}</h3>
                      <p className="text-white/90 opacity-0 transform translate-y-4 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                        {item.desc}
                      </p>
                    </div>

                    {/* Accent bar */}
                    <div
                      className="absolute left-0 bottom-0 h-1 w-full z-30 transition-all duration-500 group-hover:h-2"
                      style={{ backgroundColor: item.accent }}
                    ></div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Navigation arrows */}
            <button className="swiper-button-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center text-gray-700 hover:text-[#005F6A] transition-colors hidden md:flex">
              {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg> */}
            </button>
            <button className="swiper-button-next absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center text-gray-700 hover:text-[#005F6A] transition-colors hidden md:flex">
              {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg> */}
            </button>

            {/* Pagination */}
            <div className="swiper-pagination flex justify-center mt-8 space-x-2"></div>
          </div>
        </div>
      </section>

      <style>{`
  .swiper-container {
    padding: 0 60px;
  }
  .swiper-wrapper {
    display: flex;
    gap: 24px;
  }
  .swiper-slide {
    flex-shrink: 0;
    transition: transform 0.3s ease;
  }
  .swiper-slide:hover {
    transform: translateY(-8px);
  }
  .swiper-pagination-bullet {
    width: 10px;
    height: 10px;
    background: #E5E7EB;
    opacity: 1;
    border-radius: 10px;
    transition: all 0.3s ease;
  }
  .swiper-pagination-bullet-active {
    width: 24px;
    background: #005F6A;
  }
`}</style>

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
    </div>
  );
};

export default Home;
