/**
 * Font Utilities for Fancy Mathematical Typography & Cursive Script Conversion
 * Converts text between plain ASCII, Mathematical Bold Script (𝓣𝔂𝓹𝓮 𝓼𝓸𝓶𝓮𝓽𝓱𝓲𝓷𝓰 𝓽𝓸 𝓼𝓽𝓪𝓻𝓽),
 * Fraktur Gothic (𝕳𝖆𝖈𝖐𝖛𝖊𝖗𝖘𝖊), and Double-Struck ('𝟚𝟞).
 */

// Mathematical Bold Script Unicode code points
// Uppercase: U+1D4D0 (𝓐) to U+1D4E9 (𝓩)
// Lowercase: U+1D4EA (𝓪) to U+1D503 (𝔃)
const BOLD_SCRIPT_UPPER_START = 0x1D4D0;
const BOLD_SCRIPT_LOWER_START = 0x1D4EA;

// Mathematical Fraktur Unicode code points
// Uppercase: U+1D56C (𝕬) to U+1D585 (𝖅)
// Lowercase: U+1D586 (𝖆) to U+1D59F (𝖟)
const FRAKTUR_UPPER_START = 0x1D56C;
const FRAKTUR_LOWER_START = 0x1D586;

// Mathematical Double-Struck digits (𝟘-𝟡: U+1D7D8 to U+1D7E1)
const DOUBLE_STRUCK_DIGIT_START = 0x1D7D8;

/**
 * Strips fancy mathematical unicode characters back to regular ASCII characters
 */
export function stripFancyMath(text: string): string {
  if (!text) return '';
  return Array.from(text)
    .map((char) => {
      const code = char.codePointAt(0);
      if (!code) return char;

      // Mathematical Bold Script
      if (code >= BOLD_SCRIPT_UPPER_START && code <= BOLD_SCRIPT_UPPER_START + 25) {
        return String.fromCharCode(65 + (code - BOLD_SCRIPT_UPPER_START));
      }
      if (code >= BOLD_SCRIPT_LOWER_START && code <= BOLD_SCRIPT_LOWER_START + 25) {
        return String.fromCharCode(97 + (code - BOLD_SCRIPT_LOWER_START));
      }

      // Mathematical Fraktur
      if (code >= FRAKTUR_UPPER_START && code <= FRAKTUR_UPPER_START + 25) {
        return String.fromCharCode(65 + (code - FRAKTUR_UPPER_START));
      }
      if (code >= FRAKTUR_LOWER_START && code <= FRAKTUR_LOWER_START + 25) {
        return String.fromCharCode(97 + (code - FRAKTUR_LOWER_START));
      }

      // Double-Struck Digits
      if (code >= DOUBLE_STRUCK_DIGIT_START && code <= DOUBLE_STRUCK_DIGIT_START + 9) {
        return String.fromCharCode(48 + (code - DOUBLE_STRUCK_DIGIT_START));
      }

      return char;
    })
    .join('');
}

/**
 * Converts standard or fraktur text into Mathematical Bold Script
 * Example: "Type something to start" -> "𝓣𝔂𝓹𝓮 𝓼𝓸𝓶𝓮𝓽𝓱𝓲𝓷𝓰 𝓽𝓸 𝓼𝓽𝓪𝓻𝓽"
 * Example: "Hackverse" -> "𝓗𝓪𝓬𝓴𝖛𝖊𝖗𝓼𝖊"
 * Example: "𝕳𝖆𝖈𝖐𝖛𝖊𝖗𝖘𝖊" -> "𝓗𝓪𝓬𝓴𝖛𝖊𝖗𝓼𝖊"
 */
export function toBoldScript(text: string): string {
  if (!text) return '';
  const clean = stripFancyMath(text);
  return Array.from(clean)
    .map((char) => {
      const code = char.charCodeAt(0);
      // Uppercase A-Z
      if (code >= 65 && code <= 90) {
        return String.fromCodePoint(BOLD_SCRIPT_UPPER_START + (code - 65));
      }
      // Lowercase a-z
      if (code >= 97 && code <= 122) {
        return String.fromCodePoint(BOLD_SCRIPT_LOWER_START + (code - 97));
      }
      return char;
    })
    .join('');
}

/**
 * Converts standard or script text into Mathematical Fraktur (Gothic)
 * Example: "Hackverse" -> "𝕳𝖆𝖈𝖐𝖛𝖊𝖗𝖘𝖊"
 */
export function toFraktur(text: string): string {
  if (!text) return '';
  const clean = stripFancyMath(text);
  return Array.from(clean)
    .map((char) => {
      const code = char.charCodeAt(0);
      if (code >= 65 && code <= 90) {
        return String.fromCodePoint(FRAKTUR_UPPER_START + (code - 65));
      }
      if (code >= 97 && code <= 122) {
        return String.fromCodePoint(FRAKTUR_LOWER_START + (code - 97));
      }
      return char;
    })
    .join('');
}

/**
 * Converts digits in a string into Double-Struck digits (e.g. '26 -> '𝟚𝟞)
 */
export function toDoubleStruckDigits(text: string): string {
  if (!text) return '';
  return Array.from(text)
    .map((char) => {
      const code = char.charCodeAt(0);
      if (code >= 48 && code <= 57) {
        return String.fromCodePoint(DOUBLE_STRUCK_DIGIT_START + (code - 48));
      }
      return char;
    })
    .join('');
}
