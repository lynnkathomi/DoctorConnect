import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Calendar, MapPin, Users, Shield } from "lucide-react";
import Header from "@/components/layout/header";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-white py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="md:flex md:items-center md:justify-between">
              <div className="md:w-1/2 md:pr-10">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Find & Book the Best
                  <span className="block text-primary"> Medical Specialists</span>
                </h1>
                <p className="mt-4 text-xl text-gray-600 max-w-xl">
                  Connect with top gynecologists, dentists, and other specialists near you. Book appointments instantly.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <Link href="/find-doctor">
                    <Button size="lg" className="px-8 py-6 text-lg w-full sm:w-auto">
                      Find a Doctor
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/my-appointments">
                    <Button size="lg" variant="outline" className="px-8 py-6 text-lg w-full sm:w-auto">
                      My Appointments
                    </Button>
                  </Link>
                </div>
                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <Check className="h-6 w-6 text-primary" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900">Verified Specialists</h3>
                      <p className="mt-1 text-sm text-gray-500">All doctors are verified professionals</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900">Easy Booking</h3>
                      <p className="mt-1 text-sm text-gray-500">Book appointments in minutes</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="hidden md:block md:w-1/2 mt-10 md:mt-0">
                <div className="relative">
                  <div className="absolute -top-6 -left-6 w-64 h-64 bg-primary/10 rounded-full"></div>
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary/10 rounded-full"></div>
                  <div className="relative bg-white p-4 rounded-xl shadow-lg">
                    <img 
                      src="https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=800" 
                      alt="Doctor consulting with patient" 
                      className="rounded-lg mx-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900">Why Choose MediBook</h2>
              <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
                We connect you with the best specialists to provide the care you deserve
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="h-14 w-14 rounded-lg bg-blue-100 flex items-center justify-center mb-6">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Find Nearby Specialists</h3>
                <p className="text-gray-600">
                  Easily locate specialized medical professionals in your area who can address your specific health needs.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="h-14 w-14 rounded-lg bg-green-100 flex items-center justify-center mb-6">
                  <Calendar className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Instant Appointments</h3>
                <p className="text-gray-600">
                  Book appointments instantly with our simple booking system. No phone calls or waiting on hold.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="h-14 w-14 rounded-lg bg-purple-100 flex items-center justify-center mb-6">
                  <Shield className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Trusted Professionals</h3>
                <p className="text-gray-600">
                  All practitioners on our platform are verified and have received excellent ratings from other patients.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Specialties Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900">Popular Specialties</h2>
              <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
                Connect with specialists across a wide range of medical fields
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { name: "Gynecologist", icon: "👩‍⚕️" },
                { name: "Dentist", icon: "🦷" },
                { name: "Dermatologist", icon: "🧴" },
                { name: "Cardiologist", icon: "❤️" },
                { name: "Neurologist", icon: "🧠" },
                { name: "Orthopedic", icon: "🦴" },
                { name: "Pediatrician", icon: "👶" },
                { name: "Ophthalmologist", icon: "👁️" },
              ].map((specialty, index) => (
                <Link key={index} href={`/find-doctor?specialty=${specialty.name}`}>
                  <div className="bg-gray-50 hover:bg-gray-100 p-6 rounded-lg cursor-pointer transition duration-200 border border-gray-200 text-center">
                    <div className="text-3xl mb-3">{specialty.icon}</div>
                    <h3 className="font-medium text-gray-900">{specialty.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to Book Your Appointment?</h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
              Find the right specialist and book your appointment in just a few clicks.
            </p>
            <Link href="/find-doctor">
              <Button size="lg" variant="secondary" className="px-8 py-6 text-lg bg-white text-primary hover:bg-gray-100">
                Find a Doctor Now
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">MediBook</h3>
              <p className="text-gray-400">
                Find and book appointments with specialized medical practitioners.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-4">For Patients</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Find a Doctor</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Book Appointment</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Patient Reviews</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">For Doctors</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Join as Doctor</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Doctor Dashboard</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Marketing Tools</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} MediBook. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
