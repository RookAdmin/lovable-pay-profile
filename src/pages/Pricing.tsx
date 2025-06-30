import React from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Pricing = () => {
  return (
    <>
      <Helmet>
        <title>Pricing | Paym.me</title>
        <meta
          name="description"
          content="See Paym.me pricing plans for creators and businesses. Start for free and upgrade anytime."
        />
      </Helmet>
      <div className="container max-w-6xl px-4 py-16 mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 text-[#333333]">
            Pricing Plans
          </h1>
          <p className="text-xl text-[#555555] mb-4">
            Coming Soon... Hold tight!
          </p>
          <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg mb-8 max-w-xl mx-auto">
            <AlertCircle className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
            <p className="text-blue-800">
              All features are currently free. We'll be introducing pricing
              plans soon, so you can stay ahead of the game.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <Card className="border border-gray-200 hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-4 text-center">
              <CardTitle className="text-2xl font-bold text-[#333333]">
                Free
              </CardTitle>
              <p className="text-4xl font-bold mt-4 text-[#333333]">
                $0
                <span className="text-lg text-[#555555] font-normal">/mo</span>
              </p>
              <p className="text-[#555555] mt-2">Great for getting started</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <span className="text-[#333333]">Basic payment page</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <span className="text-[#333333]">UPI payment method</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <span className="text-[#333333]">3 smart links</span>
                </li>
              </ul>

              <Button className="w-full mt-6" variant="outline">
                Current Plan
              </Button>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="border border-primary relative hover:shadow-lg transition-shadow duration-300">
            <div className="absolute top-0 left-0 right-0 bg-primary text-white text-center py-1 text-sm font-medium">
              Coming Soon
            </div>
            <CardHeader className="pb-4 text-center pt-10">
              <CardTitle className="text-2xl font-bold text-[#333333]">
                Pro
              </CardTitle>
              <p className="text-4xl font-bold mt-4 text-[#333333]">
                $9
                <span className="text-lg text-[#555555] font-normal">/mo</span>
              </p>
              <p className="text-[#555555] mt-2">For growing creators</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <span className="text-[#333333]">
                    <strong>Everything in Free</strong>
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <span className="text-[#333333]">Custom branding</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <span className="text-[#333333]">Unlimited smart links</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <span className="text-[#333333]">Analytics dashboard</span>
                </li>
              </ul>

              <Button className="w-full mt-6" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          {/* Enterprise Plan */}
          <Card className="border border-gray-200 hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-4 text-center">
              <CardTitle className="text-2xl font-bold text-[#333333]">
                Enterprise
              </CardTitle>
              <p className="text-4xl font-bold mt-4 text-[#333333]">Custom</p>
              <p className="text-[#555555] mt-2">For established brands</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <span className="text-[#333333]">
                    <strong>Everything in Pro</strong>
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <span className="text-[#333333]">API access</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <span className="text-[#333333]">White-label solution</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <span className="text-[#333333]">Dedicated support</span>
                </li>
              </ul>

              <Link to="/contact">
                <Button className="w-full mt-6" variant="outline">
                  Contact Sales
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Pricing;
