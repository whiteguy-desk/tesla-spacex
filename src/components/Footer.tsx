import React from 'react';

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface FooterProps {
  copyrightText?: string;
  disclaimerText?: string;
  sections?: FooterSection[];
}

const defaultSections: FooterSection[] = [
  {
    title: 'Vehicles & Shop',
    links: [
      { label: 'Model S', href: '/shop/model-s' },
      { label: 'Model 3', href: '/shop/model-3' },
      { label: 'Model X', href: '/shop/model-x' },
      { label: 'Model Y', href: '/shop/model-y' },
      { label: 'Cybertruck', href: '/shop/cybertruck' },
    ],
  },
  {
    title: 'Investment & Innovation',
    links: [
      { label: 'Space City Fund', href: '/invest/space-city' },
      { label: 'Tunnel Network', href: '/invest/tunnel' },
      { label: 'AI Plans', href: '/invest/ai' },
      { label: 'Investor Relations', href: '/invest/relations' },
    ],
  },
  {
    title: 'Company & Support',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
      { label: 'Privacy & Legal', href: '/legal' },
    ],
  },
];

export const Footer: React.FC<FooterProps> = ({
  copyrightText = `© ${new Date().getFullYear()} Tesla, Inc. All rights reserved.`,
  disclaimerText = 'Disclaimer: Images and promotional materials displayed are for demonstration purposes.',
  sections = defaultSections,
}) => {
  return (
    <footer className="w-full bg-black border-t border-white/10 text-white/70 text-xs py-12 px-6 sm:px-10 z-10 relative">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Navigation columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {sections.map((section) => (
            <div key={section.title} className="space-y-3">
              <h3 className="text-white font-semibold text-xs uppercase tracking-[0.2em] border-b border-white/10 pb-2">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="hover:text-white transition-colors duration-200 tracking-[0.05em]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Legal Disclaimer */}
        <div className="pt-6 border-t border-white/10 text-white/50 text-[11px] leading-relaxed">
          <p>{disclaimerText}</p>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-white/50 text-[11px]">
          <p>{copyrightText}</p>
          <div className="flex space-x-6">
            <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="/locations" className="hover:text-white transition-colors">Locations</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
