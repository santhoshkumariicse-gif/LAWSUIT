"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ChevronRight,
} from "lucide-react";

export default function DocumentChecker() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      startAnalysis();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      startAnalysis();
    }
  };

  const startAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setUploaded(true);
    }, 2000);
  };

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (75 / 100) * circumference;

  return (
    <section
      id="document-checker"
      className="py-24 bg-[#07111f] relative overflow-hidden border-b border-white/5"
    >
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#d4af37]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
            Document <span className="text-[#d4af37]">Checker</span>
          </h2>
          <p className="text-[#b8c2cc] font-sans text-lg max-w-2xl mx-auto">
            Upload your case files securely. Our AI scans for required evidence and computes your
            legal readiness score.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Upload Area */}
          <div className="flex flex-col h-full">
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`flex-1 glass-card border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-12 text-center min-h-[400px] ${
                isDragging
                  ? "border-[#d4af37] bg-[#d4af37]/5 scale-[1.02]"
                  : "border-white/20 hover:border-[#d4af37]/50 hover:bg-white/5"
              }`}
            >
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,image/*"
              />
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-all duration-300 ${
                    isDragging || analyzing
                      ? "bg-[#d4af37]/20 shadow-[0_0_30px_rgba(212,175,55,0.4)]"
                      : "bg-white/5"
                  }`}
                >
                  <UploadCloud
                    className={`w-10 h-10 ${isDragging || analyzing ? "text-[#d4af37]" : "text-white/50"}`}
                  />
                </div>
                <h3 className="font-heading text-2xl font-bold text-white mb-2">
                  Drag & Drop Documents
                </h3>
                <p className="font-sans text-[#b8c2cc] text-sm mb-6">
                  Supported formats: PDF, DOCX, JPG, PNG
                </p>
                <span className="px-6 py-2 rounded-full border border-white/20 text-white font-sans text-sm hover:border-[#d4af37] hover:text-[#d4af37] transition-all">
                  Browse Files
                </span>
              </label>
            </div>
          </div>

          {/* Analysis Results Area */}
          <div className="flex flex-col h-full relative">
            <AnimatePresence mode="wait">
              {!analyzing && !uploaded && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 glass-card p-10 flex flex-col items-center justify-center text-center border border-white/5"
                >
                  <FileText className="w-16 h-16 text-white/10 mb-4" />
                  <p className="text-white/40 font-sans text-lg">
                    Upload documents to view readiness analysis.
                  </p>
                </motion.div>
              )}

              {analyzing && (
                <motion.div
                  key="analyzing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 glass-card p-10 flex flex-col items-center justify-center text-center"
                >
                  <div className="w-16 h-16 border-4 border-[#d4af37]/20 border-t-[#d4af37] rounded-full animate-spin mb-6" />
                  <h3 className="font-heading text-xl font-bold text-white mb-2">
                    Analyzing Documents...
                  </h3>
                  <p className="font-sans text-[#b8c2cc] animate-pulse">
                    Extracting dates, signatures, and legal clauses.
                  </p>
                </motion.div>
              )}

              {uploaded && !analyzing && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex-1 glass-card p-8 border border-[#d4af37]/30 flex flex-col"
                >
                  <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
                    <div>
                      <h3 className="font-heading text-2xl font-bold text-white mb-1">
                        Legal Readiness
                      </h3>
                      <p className="font-sans text-sm text-[#b8c2cc]">
                        Consumer Complaint (Defect)
                      </p>
                    </div>

                    {/* Animated Progress Ring */}
                    <div className="relative w-24 h-24 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r={radius}
                          stroke="rgba(255,255,255,0.1)"
                          strokeWidth="8"
                          fill="none"
                        />
                        <motion.circle
                          cx="50"
                          cy="50"
                          r={radius}
                          stroke="#d4af37"
                          strokeWidth="8"
                          fill="none"
                          strokeLinecap="round"
                          initial={{
                            strokeDasharray: circumference,
                            strokeDashoffset: circumference,
                          }}
                          animate={{ strokeDashoffset }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="font-heading text-2xl font-bold text-white">
                          75<span className="text-sm">%</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 flex-1">
                    <div>
                      <h4 className="font-sans text-sm uppercase tracking-wider text-[#b8c2cc] mb-3">
                        Identified Documents
                      </h4>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-3 text-sm font-sans text-white/90">
                          <CheckCircle2 className="w-4 h-4 text-[#00d084]" /> Purchase Invoice
                          (Dated 12-Oct-2025)
                        </li>
                        <li className="flex items-center gap-3 text-sm font-sans text-white/90">
                          <CheckCircle2 className="w-4 h-4 text-[#00d084]" /> Warranty Card
                        </li>
                        <li className="flex items-center gap-3 text-sm font-sans text-white/90">
                          <CheckCircle2 className="w-4 h-4 text-[#00d084]" /> Email Correspondence
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-sans text-sm uppercase tracking-wider text-[#b8c2cc] mb-3">
                        Missing / Recommended
                      </h4>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-3 text-sm font-sans text-white/90">
                          <AlertCircle className="w-4 h-4 text-[#d4af37]" /> Formal Legal Notice
                        </li>
                        <li className="flex items-center gap-3 text-sm font-sans text-white/90">
                          <XCircle className="w-4 h-4 text-[#ff4d4d]" /> Postal Receipt of Notice
                          Delivery
                        </li>
                      </ul>
                    </div>
                  </div>

                  <button className="mt-8 w-full py-3 rounded-lg glass border-[#d4af37]/30 text-[#f1d27a] font-sans font-semibold hover:bg-[#d4af37]/10 transition-all flex items-center justify-center gap-2">
                    Generate Legal Notice Template <ChevronRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
