import { BikeIcon } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { footerData } from "../assets/assets";

const Footer = () => {
  return (
    <footer className="bg-app-green text-white relative overflow-hidden">
      {/* Decorative background circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* TOP SECTION */}
        <div className="py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            {/* Logo */}
            <Link
              to={"/"}
              className="inline-flex items-center gap-2.5 mb-5 group"
            >
              <div className="size-9 rounded-xl bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-colors">
                <BikeIcon className="size-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-white">
                {footerData.brand.name}
              </span>
            </Link>

            {/* Description */}
            <p className="text-sm text-white/60 leading-relaxed mb-6 max-w-xs">
              {footerData.brand.description}
            </p>

            {/* Socials */}
            <div className="flex gap-2.5">
              {footerData.brand.socials.map((social, i) => (
                <a
                  href={social.link}
                  key={i}
                  className="size-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center hover:bg-white/20 hover:border-white/20 transition-all duration-200"
                >
                  <social.icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Sections Columns */}
          {footerData.sections.map((section, i) => (
            <div key={i}>
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-5">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, j) => (
                  <li key={j}>
                    {link.to ? (
                      <Link
                        to={link.to}
                        className="text-sm text-white/70 hover:text-white transition-colors duration-150 flex items-center gap-1.5 group"
                      >
                        <span className="w-0 group-hover:w-2 h-px bg-white transition-all duration-200 rounded-full" />
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-sm text-white/70 hover:text-white transition-colors duration-150 flex items-center gap-1.5 group"
                      >
                        <span className="w-0 group-hover:w-2 h-px bg-white transition-all duration-200 rounded-full" />
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Column */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-5">
              Contact Us
            </h3>
            <ul className="space-y-4">
              {footerData.contact.map((item, i) => {
                const Icon = item.icon;
                return (
                  <li key={i} className="flex items-start gap-3">
                    <div className="size-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="size-3.5 text-white" />
                    </div>
                    <span className="text-sm text-white/60 leading-relaxed">
                      {item.text}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* DIVIDER with gradient */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* BOTTOM BAR */}
        <div className="py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <BikeIcon className="size-4 text-white/30" />
            <p className="text-xs text-white/40">
              {footerData.bottom.copyright}
            </p>
          </div>
          <div className="flex items-center gap-1">
            {footerData.bottom.links.map((link, i) => (
              <React.Fragment key={i}>
                <a
                  href={link.href}
                  className="text-xs text-white/40 hover:text-white/70 transition-colors px-3 py-1 rounded-md hover:bg-white/10"
                >
                  {link.label}
                </a>
                {i < footerData.bottom.links.length - 1 && (
                  <span className="text-white/20 text-xs">·</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
