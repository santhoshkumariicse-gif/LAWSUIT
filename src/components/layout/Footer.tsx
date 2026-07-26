import { Scale } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#07111f] border-t border-white/10 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <Scale className="text-[#d4af37] w-8 h-8" />
            <div>
              <h2 className="font-heading text-xl font-bold text-white leading-none">
                LawGuide AI India
              </h2>
            </div>
          </div>
          <p className="text-[#b8c2cc] font-sans text-sm max-w-sm leading-relaxed">
            India&apos;s intelligent legal guidance platform helping citizens understand laws,
            rights, procedures, documents, and next legal steps.
          </p>
        </div>

        <div>
          <h3 className="font-heading text-white text-lg font-semibold mb-4">Practice Areas</h3>
          <ul className="space-y-3">
            {["Consumer Law", "Family Law", "Property Law", "Cyber Crime", "Employment"].map(
              (item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-[#b8c2cc] hover:text-[#d4af37] font-sans text-sm transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-white text-lg font-semibold mb-4">Resources</h3>
          <ul className="space-y-3">
            {[
              "Legal Knowledge",
              "Document Checker",
              "Practice Simulator",
              "Articles",
              "Success Stories",
            ].map((item) => (
              <li key={item}>
                <Link
                  href="#"
                  className="text-[#b8c2cc] hover:text-[#d4af37] font-sans text-sm transition-colors"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-white text-lg font-semibold mb-4">Support</h3>
          <ul className="space-y-3">
            {["Contact Us", "Privacy Policy", "Terms of Service", "Legal Disclaimer"].map(
              (item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-[#b8c2cc] hover:text-[#d4af37] font-sans text-sm transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[#b8c2cc] font-sans text-sm">
          &copy; 2026 LawGuide AI India. All Rights Reserved.
        </p>
        <p className="text-[#b8c2cc]/50 font-sans text-xs max-w-lg text-center md:text-right">
          Disclaimer: This platform provides AI-generated legal guidance for educational and
          informational purposes only. It is not a substitute for professional legal advice from a
          qualified advocate.
        </p>
      </div>
    </footer>
  );
}
