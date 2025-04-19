import HeroSection from "@/components/hero-section";
import AboutSection from "@/components/about-section";
import ServicesSection from "@/components/services-section";
import TestimonialSection from "@/components/testimonial-section";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      
      {/* Action Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold text-primary">Need Assistance?</h2>
            <p className="text-neutral-600 text-lg">
              Whether you're facing challenges or need support, our committee is here to help.
              Submit a request or make a donation to support our community initiatives.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/submit-request">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Submit a Request
                </Button>
              </Link>
              <Link href="/donate">
                <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
                  Make a Donation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <TestimonialSection />
    </div>
  );
}
