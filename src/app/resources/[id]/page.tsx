import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

// Mock data for the resources
const mockArticles: Record<string, { title: string; content: React.ReactNode; category: string }> = {
  "1": {
    title: "Consumer Rights in India",
    category: "Guide",
    content: (
      <>
        <p className="mb-4">
          Under the Consumer Protection Act, 2019, consumers in India have several fundamental rights. 
          These include the right to be protected against the marketing of goods and services which are hazardous to life and property, 
          and the right to be informed about the quality, quantity, potency, purity, standard, and price of goods.
        </p>
        <h3 className="text-xl font-bold text-[#d4af37] mt-8 mb-4">Steps to File a Complaint</h3>
        <ul className="list-disc pl-6 space-y-2 mb-6">
          <li>Send a formal legal notice to the seller or service provider.</li>
          <li>Draft a consumer complaint with all factual details.</li>
          <li>Attach supporting documents (invoices, warranty cards, email correspondence).</li>
          <li>File the complaint in the appropriate Consumer Disputes Redressal Commission.</li>
        </ul>
      </>
    ),
  },
  "2": {
    title: "Cyber Safety Protocols",
    category: "Article",
    content: (
      <>
        <p className="mb-4">
          With the rise of digital transactions, cyber fraud is becoming increasingly common. 
          The Information Technology Act, 2000 provides the legal framework for combating cybercrime in India.
        </p>
        <h3 className="text-xl font-bold text-[#d4af37] mt-8 mb-4">Immediate Actions for Cyber Fraud</h3>
        <ul className="list-disc pl-6 space-y-2 mb-6">
          <li>Immediately block your compromised bank accounts and credit cards.</li>
          <li>Call the National Cyber Crime Reporting Portal helpline (1930).</li>
          <li>Register a complaint on cybercrime.gov.in.</li>
          <li>Preserve all digital evidence, including screenshots and transaction IDs.</li>
        </ul>
      </>
    ),
  },
  "3": {
    title: "Property Registration Checklist",
    category: "Checklist",
    content: (
      <>
        <p className="mb-4">
          Buying property requires rigorous legal due diligence to ensure a clean title and avoid future disputes.
        </p>
        <h3 className="text-xl font-bold text-[#d4af37] mt-8 mb-4">Essential Documents Checklist</h3>
        <ul className="list-disc pl-6 space-y-2 mb-6">
          <li><strong>Sale Deed:</strong> The core document acting as proof of sale.</li>
          <li><strong>Extracts (Khata/Patta):</strong> Proof of property tax registration.</li>
          <li><strong>Encumbrance Certificate (EC):</strong> Ensures the property is free from legal dues and mortgages.</li>
          <li><strong>Building Approval Plan:</strong> Sanctioned by the municipal authority.</li>
          <li><strong>No Objection Certificates (NOC):</strong> From various utility boards.</li>
        </ul>
      </>
    ),
  },
  "4": {
    title: "Marriage Laws in India: An Overview",
    category: "Overview",
    content: (
      <>
        <p className="mb-4">
          India does not have a uniform civil code, meaning marriage laws are governed by the personal laws of the respective religions.
        </p>
        <h3 className="text-xl font-bold text-[#d4af37] mt-8 mb-4">Key Legislations</h3>
        <ul className="list-disc pl-6 space-y-2 mb-6">
          <li><strong>Hindu Marriage Act, 1955:</strong> Applies to Hindus, Buddhists, Jains, and Sikhs. Focuses on monogamy and legal age for marriage.</li>
          <li><strong>Special Marriage Act, 1954:</strong> Facilitates inter-religious and civil marriages irrespective of religion.</li>
          <li><strong>Muslim Personal Law:</strong> Governs Islamic marriages, which are considered civil contracts.</li>
        </ul>
      </>
    ),
  },
};

export default async function ResourceArticlePage({ params }: { params: { id: string } }) {
  // Await the params object in Next.js 15+ (if using Turbopack, it's good practice to await params)
  const { id } = await params;
  const article = mockArticles[id];

  if (!article) {
    return (
      <div className="min-h-screen bg-[#07111f] text-white pt-32 px-6 flex flex-col items-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">Article Not Found</h1>
        <Link href="/">
          <button className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 transition-all">
            Return Home
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07111f] text-white pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-6">
        <Link href="/resources" className="inline-flex items-center gap-2 text-[#b8c2cc] hover:text-white transition-colors mb-12 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Hub
        </Link>
        
        <div className="mb-8 flex items-center gap-4">
          <span className="px-3 py-1 rounded-full bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20 text-xs font-sans uppercase tracking-wider">
            {article.category}
          </span>
          <span className="text-[#b8c2cc] text-sm">LawGuide AI Mock Resource</span>
        </div>

        <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-10 leading-tight">
          {article.title}
        </h1>

        <div className="prose prose-invert prose-p:text-[#b8c2cc] prose-p:leading-relaxed prose-li:text-[#b8c2cc] max-w-none">
          {article.content}
        </div>
        
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-[#b8c2cc] text-sm text-center sm:text-left">
            Need specific advice on this topic? Talk to our AI Legal Assistant.
          </p>
          <Link href="/dashboard">
            <button className="px-6 py-3 rounded-full bg-[#d4af37] text-[#07111f] font-bold hover:shadow-[0_0_15px_#d4af37] transition-all flex items-center gap-2">
              Analyze My Case <ArrowUpRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
