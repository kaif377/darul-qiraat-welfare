import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Church, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Footer() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Subscription successful",
      description: "Thank you for subscribing to our newsletter!",
    });
    setEmail("");
  };
  
  return (
    <footer className="bg-neutral-800 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center mb-4">
              <Church className="text-yellow-400 text-3xl mr-3" />
              <div>
                <span className="text-xl font-bold">Darul Qira'at Welfare</span>
                <span className="block text-xs text-neutral-400">Islamic Community Support</span>
              </div>
            </div>
            <p className="text-neutral-400 mb-4">
              Dedicated to serving our community through faith, compassion, and support.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-400 hover:text-yellow-400 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-neutral-400 hover:text-yellow-400 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-neutral-400 hover:text-yellow-400 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-neutral-400 hover:text-yellow-400 transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className="text-neutral-400 hover:text-white transition-colors">Home</a>
                </Link>
              </li>
              <li>
                <a href="/#about" className="text-neutral-400 hover:text-white transition-colors">About Us</a>
              </li>
              <li>
                <a href="/#services" className="text-neutral-400 hover:text-white transition-colors">Services</a>
              </li>
              <li>
                <Link href="/submit-request">
                  <a className="text-neutral-400 hover:text-white transition-colors">Submit Request</a>
                </Link>
              </li>
              <li>
                <Link href="/donate">
                  <a className="text-neutral-400 hover:text-white transition-colors">Donate</a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="text-neutral-400 hover:text-white transition-colors">Contact</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-neutral-400 hover:text-white transition-colors">Spiritual Guidance</a>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-white transition-colors">Conflict Resolution</a>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-white transition-colors">Financial Assistance</a>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-white transition-colors">Educational Support</a>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-white transition-colors">Community Outreach</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
            <p className="text-neutral-400 mb-4">
              Subscribe to our newsletter to receive updates on our activities and events.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div>
                <Input 
                  type="email" 
                  placeholder="Your email address" 
                  className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 text-white" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-neutral-700 pt-6 text-center text-neutral-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Darul Qira'at Welfare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
