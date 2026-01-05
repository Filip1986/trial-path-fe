/**
 * Interface defining GDPR consent preferences
 */
export interface GdprConsentPreferences {
  necessary: boolean; // Always required
  analytics: boolean; // For analytics tracking
  marketing: boolean; // For marketing/advertising
  preferences: boolean; // For user preferences/personalization
  thirdParty: boolean; // For third-party services/embeds
  acceptedAt?: Date; // When user accepted
  version?: string; // Consent policy version
}

/**
 * Legacy cookie consent preferences (for backward compatibility)
 */
export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
  acceptedAt?: Date;
}
