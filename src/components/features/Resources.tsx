"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
const resources = [
  {
    id: 1,
    title: "Consumer Rights",
    category: "Guide",
    readTime: "5 min read",
    img: "https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Cyber Safety Protocols",
    category: "Article",
    readTime: "8 min read",
    img: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Property Registration",
    category: "Checklist",
    readTime: "3 min read",
    img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Marriage Laws in India",
    category: "Overview",
    readTime: "10 min read",
    img: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop",
  },
];

export default function Resources() {
  return (
    <section id="resources" className="py-24 bg-[#07111f] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
              Legal <span className="text-[#d4af37]">Knowledge Hub</span>
            </h2>
            <p className="text-[#b8c2cc] font-sans text-lg max-w-xl">
              Stay informed with our premium curated articles, guides, and checklists covering
              essential Indian laws.
            </p>
          </div>
          <Link href="/resources">
            <button className="px-6 py-2 rounded-full border border-white/20 text-white font-sans text-sm hover:border-[#d4af37] hover:text-[#d4af37] transition-all whitespace-nowrap self-start md:self-auto">
              View All Resources
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {resources.map((resource, index) => (
            <Link key={resource.id} href={`/resources/${resource.id}`} className="block h-full">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group cursor-pointer rounded-2xl overflow-hidden glass-card border-white/10 flex flex-col h-full"
              >
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07111f] to-transparent z-10 opacity-60" />
                  <img
                    src={resource.img}
                    alt={resource.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <span className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-[#0d1b2a]/80 backdrop-blur-sm border border-white/10 text-white text-xs font-sans">
                    {resource.category}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-heading text-xl font-bold text-white mb-2 group-hover:text-[#d4af37] transition-colors line-clamp-2">
                      {resource.title}
                    </h3>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                    <span className="text-[#b8c2cc] text-xs font-sans uppercase tracking-wider">
                      {resource.readTime}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#d4af37] group-hover:text-[#07111f] transition-all">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
