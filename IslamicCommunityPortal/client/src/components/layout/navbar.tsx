import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, Church } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  
  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <a className="flex items-center">
              <Church className="text-primary text-3xl mr-3" />
              <div>
                <span className="text-xl font-bold text-primary">Darul Qira'at Welfare</span>
                <span className="block text-xs text-neutral-600">Islamic Community Support</span>
              </div>
            </a>
          </Link>
          
          <button 
            className="lg:hidden text-primary focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <div className="hidden lg:flex lg:items-center space-x-8">
            <Link href="/">
              <a className={`${location === '/' ? 'text-primary' : 'text-neutral-700'} hover:text-primary font-medium`}>
                Home
              </a>
            </Link>
            <a href="/#about" className="text-neutral-700 hover:text-primary font-medium">
              About Us
            </a>
            <a href="/#services" className="text-neutral-700 hover:text-primary font-medium">
              Services
            </a>
            <Link href="/submit-request">
              <a className={`${location === '/submit-request' ? 'text-primary' : 'text-neutral-700'} hover:text-primary font-medium`}>
                Submit Request
              </a>
            </Link>
            <Link href="/contact">
              <a className={`${location === '/contact' ? 'text-primary' : 'text-neutral-700'} hover:text-primary font-medium`}>
                Contact
              </a>
            </Link>
            <Link href="/donate">
              <Button className="bg-primary hover:bg-primary/90">Donate</Button>
            </Link>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 bg-white">
            <div className="flex flex-col space-y-3 pb-3">
              <Link href="/">
                <a className={`${location === '/' ? 'text-primary' : 'text-neutral-700'} hover:text-primary font-medium py-2`} onClick={closeMenu}>
                  Home
                </a>
              </Link>
              <a href="/#about" className="text-neutral-700 hover:text-primary font-medium py-2" onClick={closeMenu}>
                About Us
              </a>
              <a href="/#services" className="text-neutral-700 hover:text-primary font-medium py-2" onClick={closeMenu}>
                Services
              </a>
              <Link href="/submit-request">
                <a className={`${location === '/submit-request' ? 'text-primary' : 'text-neutral-700'} hover:text-primary font-medium py-2`} onClick={closeMenu}>
                  Submit Request
                </a>
              </Link>
              <Link href="/contact">
                <a className={`${location === '/contact' ? 'text-primary' : 'text-neutral-700'} hover:text-primary font-medium py-2`} onClick={closeMenu}>
                  Contact
                </a>
              </Link>
              <Link href="/donate">
                <a className="py-2" onClick={closeMenu}>
                  <Button className="w-full bg-primary hover:bg-primary/90">Donate</Button>
                </a>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
