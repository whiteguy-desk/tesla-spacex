import React from 'react';
import { BrandLogo } from './BrandLogo';

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
    title: 'Vehicles & Mobility',
    links: [
      { label: 'Model S', href: '/shop' },
      { label: 'Model 3', href: '/shop' },
      { label: 'Model X', href: '/shop' },
      { label: 'Model Y', href: '/shop' },
      { label: 'Cybertruck', href: '/shop' },
    ],
  },
  {
    title: 'Innovation & Projects',
    links: [
      { label: 'Projects Overview', href: '/projects' },
      { label: 'Space City Infrastructure', href: '/invest' },
      { label: 'Tunnel Transit Network', href: '/tunnel' },
      { label: 'AI Computing Plans', href: '/ai' },
      { label: 'How It Works', href: '/how-it-works' },
    ],
  },
  {
    title: 'Platform & Access',
    links: [
      { label: 'Membership Tiers', href: '/dashboard/membership' },
      { label: 'Investor Login', href: '/invest/login' },
      { label: 'Account Register', href: '/invest/signup' },
      { label: 'Platform Support', href: '/support' },
    ],
  },
];

export const Footer: React.FC<FooterProps> = ({
  copyrightText = `© ${new Date().getFullYear()} Tesla & Spacex. All rights reserved.`,
  disclaimerText = 'Notice: Tesla & Spacex is an independent innovation and technology platform. This platform is not officially affiliated with, authorized, endorsed, or sponsored by Tesla, Inc., SpaceX, or any associated corporate entities.',
  sections = defaultSections,
}) => {
  return (
    <footer className="w-full bg-[#030304] border-t border-white/[0.08] text-white/60 text-xs py-14 px-6 sm:px-10 z-10 relative">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Brand header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-white/[0.06]">
          <a href="/" className="inline-block">
            <BrandLogo size="md" showTagline={true} />
          </a>
          <p className="text-[11px] text-white/40 max-w-md font-light leading-relaxed">
            Engineering next-generation mobility, autonomous tunnel networks, and aerospace energy systems.
          </p>
        </div>

        {/* Navigation columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {sections.map((section) => (
            <div key={section.title} className="space-y-3.5">
              <h3 className="text-white font-semibold text-xs uppercase tracking-[0.2em] border-b border-white/[0.06] pb-2">
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="hover:text-white transition-colors duration-200 tracking-[0.05em] text-white/60 text-xs"
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
        <div className="pt-6 border-t border-white/[0.06] text-white/40 text-[11px] leading-relaxed">
          <p>{disclaimerText}</p>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-white/40 text-[11px]">
          <p>{copyrightText}</p>
          <div className="flex space-x-6">
            <a href="/legal" className="hover:text-white transition-colors">Privacy & Terms</a>
            <a href="/support" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
