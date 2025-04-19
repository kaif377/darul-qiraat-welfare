import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="bg-primary bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2760%27%20height%3D%2760%27%20viewBox%3D%270%200%2060%2060%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%3E%3Cpath%20d%3D%27M54.627%200l.83.828-1.415%201.415L51.8%200h2.827zM5.373%200l-.83.828L5.96%202.243%208.2%200H5.374zM48.97%200l3.657%203.657-1.414%201.414L46.143%200h2.828zM11.03%200L7.372%203.657%208.787%205.07%2013.857%200H11.03zm32.284%200L49.8%206.485%2048.384%207.9l-7.9-7.9h2.83zM16.686%200L10.2%206.485%2011.616%207.9l7.9-7.9h-2.83zm20.97%200l9.315%209.314-1.414%201.414L34.828%200h2.83zM22.344%200L13.03%209.314l1.414%201.414L25.172%200h-2.83zM32%200l12.142%2012.142-1.414%201.414L30%20.828%2017.272%2013.556l-1.414-1.414L28%200h4zM.284%200l28%2028-1.414%201.414L0%202.544v2.83L25.456%2030l-1.414%201.414L0%207.372v2.827L22.627%2030l-1.414%201.414L0%2012.2v2.83L19.8%2030l-1.414%201.414L0%2017.03v2.828L16.97%2030l-1.414%201.414L0%2021.855v2.83L14.142%2030l-1.414%201.414L0%2026.683v2.83l8.485%208.485L7.07%2039.414%200%2032.343v2.83L5.657%2040.9%204.242%2042.314%200%2038.07v2.83L2.828%2043.7%201.414%2045.113%200%2043.7v2.83L0%2060h60L60%200h-2.83L0%2057.17v-2.828L54.343%200h-2.83L0%2051.513v-2.83L48.685%200h-2.83L0%2045.857v-2.83L43.03%200h-2.83L0%2040.2v-2.83L37.37%200h-2.83L0%2034.544v-2.83L31.716%200h-2.83L0%2028.885v-2.83L26.057%200h-2.83L0%2023.23v-2.83L20.4%200h-2.83L0%2017.57v-2.827L14.742%200h-2.83L0%2011.915v-2.83L8.413%200H5.542L0%205.542V2.714L2.714%200H0zm0%200%27%20fill%3D%27%23307A35%27%20fill-opacity%3D%270.46%27%20fill-rule%3D%27evenodd%27%2F%3E%3C%2Fsvg%3E')] text-white">
      <div className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Supporting Our Community Through Faith</h1>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Darul Qira'at Welfare provides assistance, guidance, and support to community members in need.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/submit-request">
              <Button size="lg" className="bg-white text-primary hover:bg-neutral-100">
                Submit a Request
              </Button>
            </Link>
            <Link href="/donate">
              <Button size="lg" className="bg-yellow-600 hover:bg-yellow-700 text-white">
                Donate Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
