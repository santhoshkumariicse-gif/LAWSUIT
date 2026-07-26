import { describe, it, expect } from 'vitest';
import { inferMatter, getAnalysis, questionFeedback } from '../legalEngine';

describe('legalEngine', () => {
  describe('inferMatter', () => {
    it('should correctly infer cyber matter from keywords', () => {
      const result = inferMatter('someone hacked my online upi account');
      expect(result).toBe('cyber');
    });

    it('should correctly infer family matter from keywords', () => {
      const result = inferMatter('seeking divorce and custody of child');
      expect(result).toBe('family');
    });

    it('should default to consumer if no keywords match', () => {
      const result = inferMatter('i bought a defective product');
      expect(result).toBe('consumer');
    });
  });

  describe('getAnalysis', () => {
    it('should return base data for a standard matter', () => {
      const analysis = getAnalysis('cyber', 'someone hacked my account');
      expect(analysis.forum).toBe('Cyber Police or Criminal Court');
      expect(analysis.laws).toContain('Information Technology Act, 2000');
    });

    it('should append extra laws if specific keywords are present', () => {
      const analysis = getAnalysis('family', 'divorce with child custody and banking issues');
      expect(analysis.laws).toContain('Juvenile Justice (Care and Protection of Children) Act, 2015');
      expect(analysis.laws).toContain('Payment and banking complaint channels');
    });
  });

  describe('questionFeedback', () => {
    it('should prompt for detail if answer is too short', () => {
      const feedback = questionFeedback('it was bad');
      expect(feedback).toContain('Add more detail');
    });

    it('should prompt for certainty if answer contains maybe', () => {
      const feedback = questionFeedback('i think maybe it happened on tuesday, but i am not sure to be honest. this is a very long sentence just to pass the length check.');
      expect(feedback).toContain('Keep the answer precise');
    });

    it('should approve a detailed factual answer', () => {
      const feedback = questionFeedback('On 12th August, I received a notice from the landlord demanding immediate eviction without the required 30-day notice period as per our registered rent agreement.');
      expect(feedback).toContain('That is a clear answer');
    });
  });
});
