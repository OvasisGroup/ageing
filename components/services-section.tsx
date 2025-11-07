import Image from 'next/image';

export default function ServicesSection() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="mb-12 flex flex-col md:flex-row justify-between items-end gap-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Services
            </h2>
            <p className="text-lg text-muted-foreground text-left">
              Comprehensive solutions designed to support aging in place with dignity, safety, and independence.
            </p>
          </div>
          <div className="max-w-2xl">
            <div className="grid grid-cols-4 gap-4">
              <div className="flex flex-col items-center">
                <Image
                  src="/images/bathroom@4x.png"
                  alt="Bathroom Modifications"
                  width={48}
                  height={48}
                  className="w-12 h-12 object-contain mb-2"
                />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  BATHROOM
                </span>
              </div>
              <div className="flex flex-col items-center">
                <Image
                  src="/images/kitchen@4x.png"
                  alt="Kitchen Modifications"
                  width={48}
                  height={48}
                  className="w-12 h-12 object-contain mb-2"
                />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  KITCHEN
                </span>
              </div>
              <div className="flex flex-col items-center">
                <Image
                  src="/images/stairs@4x.png"
                  alt="Stairs Modifications"
                  width={48}
                  height={48}
                  className="w-12 h-12 object-contain mb-2"
                />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  STAIRS
                </span>
              </div>
              <div className="flex flex-col items-center">
                <Image
                  src="/images/kight@4x.png"
                  alt="Lighting Modifications"
                  width={48}
                  height={48}
                  className="w-12 h-12 object-contain mb-2"
                />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  LIGHTS
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 container mx-auto">
          
          {/* Home Modifications Service Card */}
          <div className="bg-card rounded-xl border border-primary p-6">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              {/* Image */}
              <div className="shrink-0 self-center sm:self-auto">
                <Image
                  src="/images/home-mod.svg"
                  alt="Home Modifications"
                  width={60}
                  height={60}
                  className="w-15 h-15"
                />
              </div>
              
              {/* Content */}
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Home Modifications
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Professional CAPS-certified specialists provide bathroom safety upgrades, ramps, grab bars, 
                  stairlifts, and accessibility improvements for safe aging in place.
                </p>
              </div>
            </div>
          </div>

          {/* Cleaning Services Card */}
          <div className="bg-card rounded-xl border border-primary p-6">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              {/* Image */}
              <div className="shrink-0 self-center sm:self-auto">
                <Image
                  src="/images/cleaning.svg"
                  alt="Cleaning Services"
                  width={60}
                  height={60}
                  className="w-15 h-15"
                />
              </div>
              
              {/* Content */}
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Cleaning Services
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Specialized cleaning services for seniors and people with disabilities, including deep cleaning, 
                  maintenance, and accessibility-focused housekeeping.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}