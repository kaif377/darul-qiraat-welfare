import { HandHelping, Gavel, BanknoteIcon, GraduationCap } from "lucide-react";

export default function ServicesSection() {
  return (
    <section id="services" className="py-16 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">Our Services</h2>
          <p className="max-w-3xl mx-auto text-neutral-600">
            We offer various services to address the needs of our community members.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition">
            <HandHelping className="text-primary text-3xl mb-4" />
            <h3 className="text-xl font-semibold mb-2">Spiritual Guidance</h3>
            <p className="text-neutral-600">
              Access to religious counseling and spiritual support from qualified community leaders.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition">
            <Gavel className="text-primary text-3xl mb-4" />
            <h3 className="text-xl font-semibold mb-2">Conflict Resolution</h3>
            <p className="text-neutral-600">
              Mediation services to resolve disputes within families or between community members.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition">
            <BanknoteIcon className="text-primary text-3xl mb-4" />
            <h3 className="text-xl font-semibold mb-2">Financial Assistance</h3>
            <p className="text-neutral-600">
              Emergency financial aid for eligible community members facing hardship.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition">
            <GraduationCap className="text-primary text-3xl mb-4" />
            <h3 className="text-xl font-semibold mb-2">Educational Support</h3>
            <p className="text-neutral-600">
              Scholarships, tutoring, and educational resources for students in need.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
