import { Quote } from "lucide-react";

export default function TestimonialSection() {
  return (
    <section className="py-16 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">Community Impact</h2>
          <p className="max-w-3xl mx-auto text-neutral-600">
            See how our committee has made a difference in the lives of community members.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 flex items-center justify-center bg-primary bg-opacity-10 rounded-full">
                <Quote className="text-primary text-xl" />
              </div>
            </div>
            <blockquote className="text-neutral-600 text-center">
              <p className="mb-4">
                "The Islamic Committee provided essential support when my family faced financial hardship after losing our home. They helped us get back on our feet with dignity and compassion."
              </p>
              <cite className="not-italic font-medium text-primary">- Ahmed S.</cite>
            </blockquote>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 flex items-center justify-center bg-primary bg-opacity-10 rounded-full">
                <Quote className="text-primary text-xl" />
              </div>
            </div>
            <blockquote className="text-neutral-600 text-center">
              <p className="mb-4">
                "Through their mediation services, we were able to resolve a long-standing family dispute that had been causing pain for years. Their guidance was invaluable."
              </p>
              <cite className="not-italic font-medium text-primary">- Fatima K.</cite>
            </blockquote>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 flex items-center justify-center bg-primary bg-opacity-10 rounded-full">
                <Quote className="text-primary text-xl" />
              </div>
            </div>
            <blockquote className="text-neutral-600 text-center">
              <p className="mb-4">
                "The scholarship program provided by the committee enabled me to continue my education despite financial obstacles. I'm forever grateful for this opportunity."
              </p>
              <cite className="not-italic font-medium text-primary">- Yusuf M.</cite>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
