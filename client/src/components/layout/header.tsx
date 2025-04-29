import { Link, useLocation } from "wouter";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Menu, Bell, User } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { useState } from "react";

export default function Header() {
  const [, setLocation] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/">
              <span className="text-primary text-2xl font-bold cursor-pointer">MediBook</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <Link href="/find-doctor">
              <span className="text-gray-700 hover:text-primary font-medium cursor-pointer">
                Find a Doctor
              </span>
            </Link>
            <Link href="/my-appointments">
              <span className="text-gray-700 hover:text-primary font-medium cursor-pointer">
                My Appointments
              </span>
            </Link>
            <Link href="/help">
              <span className="text-gray-700 hover:text-primary font-medium cursor-pointer">
                Help
              </span>
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Bell className="h-5 w-5 text-gray-600" />
            </Button>
            
            <Avatar className="h-8 w-8 bg-gray-200">
              <AvatarFallback>
                <User className="h-4 w-4 text-gray-600" />
              </AvatarFallback>
            </Avatar>
            
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5 text-gray-600" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col space-y-4 mt-8">
                  <Button 
                    variant="ghost" 
                    className="justify-start text-lg" 
                    onClick={() => {
                      setLocation('/find-doctor');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Find a Doctor
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="justify-start text-lg" 
                    onClick={() => {
                      setLocation('/my-appointments');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    My Appointments
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="justify-start text-lg" 
                    onClick={() => {
                      setLocation('/help');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Help
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
