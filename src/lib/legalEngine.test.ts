import { describe, it, expect } from "vitest";
import { inferMatter, getAnalysis, questionFeedback, practiceDeck } from "./legalEngine";

describe("legalEngine - Deterministic AI Tests", () => {
  
  describe("inferMatter", () => {
    it("should infer 'consumer' matter from product defect descriptions", () => {
      const result = inferMatter("I bought a defective refrigerator and the company refuses to refund me.");
      expect(result).toBe("consumer");
    });

    it("should infer 'property' matter from real estate disputes", () => {
      const result = inferMatter("The builder has delayed possession of my flat by 3 years.");
      expect(result).toBe("property");
    });

    it("should default to 'consumer' for ambiguous or unrecognized text", () => {
      const result = inferMatter("Something bad happened yesterday.");
      expect(result).toBe("consumer"); // Current fallback logic
    });
  });

  describe("getAnalysis", () => {
    it("should return the correct analysis payload for 'consumer' matter", () => {
      const analysis = getAnalysis("consumer", "Defective product");
      
      expect(analysis.laws).toContain("Consumer Protection Act, 2019");
      expect(analysis.forum).toBe("District Consumer Commission");
      expect(analysis.docs).toContain("Invoice or bill");
      expect(analysis.steps[0]).toContain("Collect purchase records");
    });

    it("should return the correct analysis payload for 'criminal' matter", () => {
      const analysis = getAnalysis("criminal", "Assault");
      
      expect(analysis.laws).toContain("Bharatiya Nyaya Sanhita, 2023");
      expect(analysis.forum).toBe("Police Station or Criminal Court");
      expect(analysis.docs).toContain("FIR or complaint copy");
    });
  });

  describe("practiceDeck", () => {
    it("should return an array of 3 specific questions for consumer cases", () => {
      const deck = practiceDeck("consumer");
      expect(deck).toHaveLength(3);
      expect(deck[0]).toBe("What exactly did you buy, and what proof do you have of the defect?");
    });
  });

  describe("questionFeedback", () => {
    it("should encourage more detail for short answers", () => {
      const feedback = questionFeedback("yes");
      expect(feedback).toBe("Add more detail: include the date, the notice, and the proof you have.");
    });

    it("should acknowledge good answers", () => {
      const feedback = questionFeedback("I purchased the item on January 5th and noticed the defect on January 10th. I sent a legal notice to them immediately.");
      expect(feedback).toBe("That is a clear answer. Stay factual and avoid guessing about legal consequences.");
    });
  });

});
