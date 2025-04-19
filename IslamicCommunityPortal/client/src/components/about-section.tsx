import { Heart, Users, Handshake } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">About Darul Qira'at Welfare</h2>
          <p className="max-w-3xl mx-auto text-neutral-600">
            We are dedicated to serving the Islamic community through education, advocacy, and charitable work.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-neutral-50 p-6 rounded-lg shadow-sm">
            <div className="w-14 h-14 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-4">
              <Heart className="text-primary text-xl" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Our Mission</h3>
            <p className="text-neutral-600">
              To provide support, assistance, and resources to community members in accordance with Islamic principles of compassion and charity.
            </p>
          </div>
          
          <div className="bg-neutral-50 p-6 rounded-lg shadow-sm">
            <div className="w-14 h-14 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-4">
              <Users className="text-primary text-xl" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Our Community</h3>
            <p className="text-neutral-600">
              We serve a diverse Islamic community, providing assistance to families, individuals, and organizations in need.
            </p>
          </div>
          
          <div className="bg-neutral-50 p-6 rounded-lg shadow-sm">
            <div className="w-14 h-14 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-4">
              <Handshake className="text-primary text-xl" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Our Impact</h3>
            <p className="text-neutral-600">
              Through community donations and volunteer efforts, we've helped thousands of people overcome challenges and find solutions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
