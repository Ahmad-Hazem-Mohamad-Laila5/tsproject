import React from "react";
import { Link } from "react-router-dom";
import { footerData } from "../assets/assets";
import { BiBasket, BiChevronRight } from "react-icons/bi";

const Footer = () => {
  return (
    <footer className="border-t border-app-border bg-app-text text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1.1fr]">
          <div>
            <Link
              to="/"
              className="mb-5 inline-flex items-center gap-2.5 text-white"
            >
              <span className="flex size-10 items-center justify-center rounded-2xl bg-white/10">
                <BiBasket className="size-5" />
              </span>
              <div>
                <span className="block text-lg font-semibold">
                  {footerData.brand.name}
                </span>
                <span className="block text-xs text-white/45">
                  Fresh delivery, modern shopping
                </span>
              </div>
            </Link>

            <p className="max-w-sm text-sm leading-7 text-white/60">
              {footerData.brand.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              {footerData.brand.socials.map((social, i) => (
                <a
                  key={i}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/75 transition-all duration-200 hover:border-white/20 hover:bg-white/10 hover:text-white"
                  aria-label={social.label || `Social link ${i + 1}`}
                >
                  <social.icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {footerData.sections.map((section, i) => (
            <div key={i}>
              <h3 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">
                {section.title}
              </h3>

              <ul className="space-y-3">
                {section.links.map((link, j) => (
                  <li key={j}>
                    {link.to ? (
                      <Link
                        to={link.to}
                        className="group inline-flex items-center gap-2 text-sm text-white/65 transition-colors duration-200 hover:text-white"
                      >
                        <BiChevronRight className="size-4 text-white/25 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-app-orange" />
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2 text-sm text-white/65 transition-colors duration-200 hover:text-white"
                      >
                        <BiChevronRight className="size-4 text-white/25 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-app-orange" />
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">
              Contact us
            </h3>

            <ul className="space-y-4">
              {footerData.contact.map((item, i) => {
                const Icon = item.icon;
                return (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/8 text-white/80">
                      <Icon className="size-4" />
                    </div>
                    <span className="text-sm leading-6 text-white/60">
                      {item.text}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="h-px bg-white/10" />

        <div className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/40">{footerData.bottom.copyright}</p>

          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            {footerData.bottom.links.map((link, i) => (
              <a
                key={i}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg px-2.5 py-1 text-xs text-white/40 transition-colors hover:bg-white/5 hover:text-white/70"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
