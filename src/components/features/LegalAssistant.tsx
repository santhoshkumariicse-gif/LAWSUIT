"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Search,
  Loader2,
  BookOpen,
  Scale,
  FileText,
  Clock,
  AlertTriangle,
  Building,
  CheckCircle2,
} from "lucide-react";
import { inferMatter, getAnalysis, AnalysisData, samples, MatterType } from "@/lib/legalEngine";

const formSchema = z.object({
  matterType: z.string(),
  state: z.string().min(1, "State is required"),
  issue: z.string().min(10, "Please describe the issue in more detail"),
});

type FormValues = z.infer<typeof formSchema>;

export default function LegalAssistant() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisData | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      matterType: "auto",
      state: "",
      issue: "",
    },
  });

  const watchIssue = watch("issue");

  const onSubmit = async (data: FormValues) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const response = await fetch("/api/v1/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ issue_text: data.issue }),
      });

      if (response.ok) {
        const json = await response.json();
        setAnalysisResult(json.data.analysis);
      } else if (response.status === 401) {
        // Fallback to client-side deterministic logic for unauthenticated users
        console.warn("Unauthenticated: Falling back to local AI engine.");
        const detectedMatter =
          data.matterType === "auto" ? inferMatter(data.issue) : (data.matterType as MatterType);
        const result = getAnalysis(detectedMatter, data.issue);
        setAnalysisResult(result);
      } else {
        throw new Error("Server error");
      }
    } catch (error) {
      console.error(error);
      // Fallback if network fails
      const detectedMatter =
        data.matterType === "auto" ? inferMatter(data.issue) : (data.matterType as MatterType);
      const result = getAnalysis(detectedMatter, data.issue);
      setAnalysisResult(result);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadSample = (type: MatterType) => {
    const sample = samples[type as keyof typeof samples];
    if (sample) {
      setValue("matterType", type);
      setValue("state", sample.state);
      setValue("issue", sample.issue);
    }
  };

  return (
    <section id="legal-assistant" className="py-24 relative overflow-hidden bg-[#07111f]">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#d4af37]/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
            AI <span className="text-[#d4af37]">Legal Assistant</span>
          </h2>
          <p className="text-[#b8c2cc] font-sans text-lg max-w-2xl mx-auto">
            Describe your situation in plain English. Our AI will analyze the facts, identify
            applicable laws, and guide your next steps.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Side */}
          <div className="lg:col-span-5 glass-card p-8">
            <h3 className="font-heading text-2xl text-white font-semibold mb-6 flex items-center gap-2">
              <Search className="text-[#d4af37] w-6 h-6" /> Case Details
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-sans text-[#b8c2cc] mb-2">
                  Legal Matter Type
                </label>
                <select
                  {...register("matterType")}
                  className="w-full bg-[#0d1b2a] border border-white/10 rounded-lg p-3 text-white font-sans focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none transition-all"
                >
                  <option value="auto">Auto-Detect via AI</option>
                  <option value="consumer">Consumer Law</option>
                  <option value="family">Family Law</option>
                  <option value="property">Property Law</option>
                  <option value="cyber">Cyber Law</option>
                  <option value="employment">Employment Law</option>
                  <option value="motor">Motor Accident</option>
                  <option value="cheque">Cheque Bounce</option>
                  <option value="criminal">Criminal Law</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-sans text-[#b8c2cc] mb-2">
                  State / Jurisdiction
                </label>
                <input
                  {...register("state")}
                  placeholder="e.g. Maharashtra, Delhi"
                  className="w-full bg-[#0d1b2a] border border-white/10 rounded-lg p-3 text-white font-sans focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none transition-all"
                />
                {errors.state && (
                  <p className="text-[#ff4d4d] text-xs mt-1">{errors.state.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-sans text-[#b8c2cc] mb-2">
                  Issue Description
                </label>
                <textarea
                  {...register("issue")}
                  rows={5}
                  placeholder="Describe what happened in detail..."
                  className="w-full bg-[#0d1b2a] border border-white/10 rounded-lg p-3 text-white font-sans focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none transition-all resize-none"
                />
                {errors.issue && (
                  <p className="text-[#ff4d4d] text-xs mt-1">{errors.issue.message}</p>
                )}
              </div>

              <div className="flex flex-wrap gap-2 pb-4">
                <span className="text-xs text-[#b8c2cc] flex items-center w-full mb-1">
                  Try a sample scenario:
                </span>
                {(Object.keys(samples) as MatterType[]).slice(0, 3).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => loadSample(type)}
                    className="text-xs px-3 py-1 rounded-full border border-white/10 text-white/70 hover:text-[#d4af37] hover:border-[#d4af37]/50 transition-colors capitalize"
                  >
                    {type}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                disabled={isAnalyzing}
                className="w-full py-4 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#f1d27a] text-[#07111f] font-sans font-bold text-lg hover:shadow-[0_0_15px_#d4af37] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5" /> AI Scanning...
                  </>
                ) : (
                  "Analyze Legal Situation"
                )}
              </button>
            </form>
          </div>

          {/* Results Side */}
          <div className="lg:col-span-7 relative min-h-[500px]">
            <AnimatePresence mode="wait">
              {!isAnalyzing && !analysisResult && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-white/10 rounded-2xl"
                >
                  <Scale className="w-16 h-16 text-white/10 mb-4" />
                  <p className="text-white/40 font-sans text-lg">
                    Enter your case details to generate a comprehensive AI legal analysis.
                  </p>
                </motion.div>
              )}

              {isAnalyzing && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center glass-card z-10"
                >
                  <div className="relative w-24 h-24 mb-6">
                    <div className="absolute inset-0 border-4 border-[#d4af37]/20 rounded-full" />
                    <div className="absolute inset-0 border-4 border-[#d4af37] rounded-full border-t-transparent animate-spin" />
                    <Scale className="absolute inset-0 m-auto text-[#d4af37] w-8 h-8 animate-pulse" />
                  </div>
                  <h3 className="font-heading text-xl text-white font-bold mb-2">
                    Cross-referencing Legal Database
                  </h3>
                  <p className="text-[#b8c2cc] font-sans text-sm animate-pulse">
                    Extracting applicable statutes and procedures...
                  </p>
                </motion.div>
              )}

              {analysisResult && !isAnalyzing && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6 h-full"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="glass-card p-6 border-l-4 border-l-[#d4af37]">
                      <h4 className="flex items-center gap-2 font-heading text-lg font-bold text-white mb-3">
                        <BookOpen className="text-[#d4af37] w-5 h-5" /> Relevant Laws
                      </h4>
                      <ul className="space-y-2">
                        {analysisResult.laws.map((law, i) => (
                          <li
                            key={i}
                            className="text-sm font-sans text-[#b8c2cc] flex items-start gap-2"
                          >
                            <span className="text-[#d4af37] mt-1">•</span> {law}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="glass-card p-6 border-l-4 border-l-[#00d084]">
                      <h4 className="flex items-center gap-2 font-heading text-lg font-bold text-white mb-3">
                        <Building className="text-[#00d084] w-5 h-5" /> Forum To Approach
                      </h4>
                      <p className="text-sm font-sans text-[#b8c2cc]">{analysisResult.forum}</p>

                      <h4 className="flex items-center gap-2 font-heading text-lg font-bold text-white mb-2 mt-4">
                        <Clock className="text-[#00d084] w-5 h-5" /> Est. Timeframe
                      </h4>
                      <p className="text-sm font-sans text-[#b8c2cc]">
                        6 to 18 months (Standard procedure)
                      </p>
                    </div>
                  </div>

                  <div className="glass-card p-6">
                    <h4 className="flex items-center gap-2 font-heading text-lg font-bold text-white mb-3">
                      <FileText className="text-[#d4af37] w-5 h-5" /> Required Documents
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.docs.map((doc, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-[#0d1b2a] border border-white/10 rounded-full text-xs font-sans text-white/80"
                        >
                          {doc}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="glass-card p-6">
                    <h4 className="flex items-center gap-2 font-heading text-lg font-bold text-white mb-3">
                      <CheckCircle2 className="text-[#d4af37] w-5 h-5" /> Recommended Procedure
                    </h4>
                    <ol className="space-y-3">
                      {analysisResult.steps.map((step, i) => (
                        <li
                          key={i}
                          className="text-sm font-sans text-[#b8c2cc] flex items-start gap-3"
                        >
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#d4af37]/20 text-[#d4af37] flex items-center justify-center text-xs font-bold">
                            {i + 1}
                          </span>
                          <span className="pt-0.5">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="glass-card p-6 bg-gradient-to-br from-[#ff4d4d]/5 to-transparent border-l-4 border-l-[#ff4d4d]">
                    <h4 className="flex items-center gap-2 font-heading text-lg font-bold text-white mb-2">
                      <AlertTriangle className="text-[#ff4d4d] w-5 h-5" /> Risk Assessment
                    </h4>
                    <p className="text-sm font-sans text-[#b8c2cc]">
                      Ensure all evidence is preserved immediately. Delaying formal notice might
                      weaken your claim based on limitation statutes.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
