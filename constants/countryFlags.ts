/**
 * Shared country flag emoji mapping.
 * Use COUNTRY_FLAGS or getCountryFlag() instead of defining locally.
 */
export const COUNTRY_FLAGS: Record<string, string> = {
  Russia: '\u{1F1F7}\u{1F1FA}',
  USA: '\u{1F1FA}\u{1F1F8}',
  China: '\u{1F1E8}\u{1F1F3}',
  India: '\u{1F1EE}\u{1F1F3}',
  Germany: '\u{1F1E9}\u{1F1EA}',
  France: '\u{1F1EB}\u{1F1F7}',
  Spain: '\u{1F1EA}\u{1F1F8}',
  Norway: '\u{1F1F3}\u{1F1F4}',
  Brazil: '\u{1F1E7}\u{1F1F7}',
  Japan: '\u{1F1EF}\u{1F1F5}',
  Egypt: '\u{1F1EA}\u{1F1EC}',
  Ireland: '\u{1F1EE}\u{1F1EA}',
  Italy: '\u{1F1EE}\u{1F1F9}',
  Sweden: '\u{1F1F8}\u{1F1EA}',
  UK: '\u{1F1EC}\u{1F1E7}',
  Netherlands: '\u{1F1F3}\u{1F1F1}',
  Poland: '\u{1F1F5}\u{1F1F1}',
  Hungary: '\u{1F1ED}\u{1F1FA}',
  Ukraine: '\u{1F1FA}\u{1F1E6}',
  Armenia: '\u{1F1E6}\u{1F1F2}',
  Azerbaijan: '\u{1F1E6}\u{1F1FF}',
  Turkey: '\u{1F1F9}\u{1F1F7}',
  Israel: '\u{1F1EE}\u{1F1F1}',
  Kazakhstan: '\u{1F1F0}\u{1F1FF}',
  Uzbekistan: '\u{1F1FA}\u{1F1FF}',
  Georgia: '\u{1F1EC}\u{1F1EA}',
};

export function getCountryFlag(country?: string | null): string {
  if (!country) return '\u{1F3F3}\u{FE0F}';
  return COUNTRY_FLAGS[country] || '\u{1F3F3}\u{FE0F}';
}
