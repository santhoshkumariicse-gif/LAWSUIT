import { ValidationError } from "@/core/errors/AppError";

export class AIGuardrailService {
  private static readonly INJECTION_PATTERNS = [
    /ignore (all )?previous instructions/i,
    /forget (all )?previous instructions/i,
    /you are now/i,
    /system prompt/i,
    /bypass/i,
    /simulated (environment|scenario)/i,
    /developer mode/i
  ];

  private static readonly SAFETY_PATTERNS = [
    /how to (murder|kill|harm|hurt)/i,
    /how to (hide|destroy|tamper) (with )?(evidence|body)/i,
    /how to evade taxes/i,
    /money laundering/i,
    /how to build a bomb/i,
    /suicide/i
  ];

  /**
   * Scans input for prompt injection vectors.
   * Throws ValidationError if detected.
   */
  public static checkPromptInjection(input: string): void {
    for (const pattern of this.INJECTION_PATTERNS) {
      if (pattern.test(input)) {
        throw new ValidationError("Security Violation: Prompt Injection detected.");
      }
    }
  }

  /**
   * Scans input for explicitly unsafe topics.
   * Throws ValidationError if detected.
   */
  public static checkSafety(input: string): void {
    for (const pattern of this.SAFETY_PATTERNS) {
      if (pattern.test(input)) {
        throw new ValidationError("Safety Violation: Unsafe content detected. This platform cannot be used for illegal or harmful activities.");
      }
    }
  }

  /**
   * Comprehensive guardrail check.
   */
  public static validate(input: string): void {
    this.checkPromptInjection(input);
    this.checkSafety(input);
  }
}
