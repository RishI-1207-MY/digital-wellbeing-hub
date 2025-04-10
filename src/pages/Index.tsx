
import React from 'react';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-bold text-lifesage-primary">LifeSage Health</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <a href="#features" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700">
                  Features
                </a>
                <a href="#about" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700">
                  About
                </a>
                <a href="#contact" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700">
                  Contact
                </a>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <Link to="/login">
                <Button variant="outline" className="mr-2">Sign in</Button>
              </Link>
              <Link to="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <Hero />
      <Features />

      {/* About Section */}
      <div className="py-16 bg-white" id="about">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-lifesage-primary font-semibold tracking-wide uppercase">Our Mission</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Healthcare for the underserved
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              LifeSage Health is dedicated to breaking down barriers to healthcare access for rural and underserved communities.
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
              <div className="relative">
                <img
                  className="h-64 w-full object-cover rounded-lg md:h-full"
                  src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80"
                  alt="Rural healthcare"
                />
              </div>
              <div className="space-y-4">
                <p className="text-lg text-gray-500">
                  Our platform connects patients in rural areas with quality healthcare providers through telemedicine, 
                  bringing specialized medical expertise to regions with limited access to healthcare facilities.
                </p>
                <p className="text-lg text-gray-500">
                  By leveraging technology, we're able to monitor patient health in real-time, provide timely interventions, 
                  and ensure continuity of care regardless of geographic location.
                </p>
                <p className="text-lg text-gray-500">
                  We believe that everyone deserves access to quality healthcare services. Our mission is to make 
                  this a reality through innovative technology solutions and compassionate care delivery.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-16 bg-lifesage-light" id="contact">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-lifesage-primary font-semibold tracking-wide uppercase">Contact Us</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Get in touch
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Have questions about LifeSage Health? We're here to help.
            </p>
          </div>

          <div className="mt-12 flex justify-center">
            <div className="max-w-lg w-full">
              <form className="grid grid-cols-1 gap-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                  <div className="mt-1">
                    <input type="text" name="name" id="name" className="py-3 px-4 block w-full shadow-sm focus:ring-lifesage-primary focus:border-lifesage-primary border-gray-300 rounded-md" />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <div className="mt-1">
                    <input type="email" name="email" id="email" className="py-3 px-4 block w-full shadow-sm focus:ring-lifesage-primary focus:border-lifesage-primary border-gray-300 rounded-md" />
                  </div>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                  <div className="mt-1">
                    <textarea name="message" id="message" rows={4} className="py-3 px-4 block w-full shadow-sm focus:ring-lifesage-primary focus:border-lifesage-primary border border-gray-300 rounded-md"></textarea>
                  </div>
                </div>
                <div>
                  <Button type="submit" className="w-full py-3">Send Message</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Solutions</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="text-base text-gray-300 hover:text-white">Telemedicine</a></li>
                <li><a href="#" className="text-base text-gray-300 hover:text-white">Health Monitoring</a></li>
                <li><a href="#" className="text-base text-gray-300 hover:text-white">Mental Health</a></li>
                <li><a href="#" className="text-base text-gray-300 hover:text-white">Emergency Services</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Company</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="text-base text-gray-300 hover:text-white">About</a></li>
                <li><a href="#" className="text-base text-gray-300 hover:text-white">Careers</a></li>
                <li><a href="#" className="text-base text-gray-300 hover:text-white">Privacy</a></li>
                <li><a href="#" className="text-base text-gray-300 hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Connect</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="text-base text-gray-300 hover:text-white">Contact Us</a></li>
                <li><a href="#" className="text-base text-gray-300 hover:text-white">Twitter</a></li>
                <li><a href="#" className="text-base text-gray-300 hover:text-white">Facebook</a></li>
                <li><a href="#" className="text-base text-gray-300 hover:text-white">LinkedIn</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8 md:flex md:items-center md:justify-between">
            <p className="text-base text-gray-400">&copy; 2025 LifeSage Health. All rights reserved.</p>
            <div className="mt-4 md:mt-0">
              <p className="text-base text-gray-400">Proudly serving rural and underserved communities.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
