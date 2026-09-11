/**
 * Utility functions for user avatars and initials formatting
 */

/**
 * Extracts initials using the first letter of first name and last name.
 * e.g. "Aarav Sharma" => "AS"
 *      "Priya Patel" => "PP"
 *      "Aayush" => "AA"
 *      "Mohammad Ali Khan" => "MK"
 */
export function getInitials(name?: string): string {
  if (!name || !name.trim()) return 'VR';
  const cleanName = name.trim();
  const words = cleanName.split(/\s+/).filter(Boolean);
  
  if (words.length === 0) return 'VR';
  
  if (words.length === 1) {
    const single = words[0];
    if (single.length >= 2) {
      return single.slice(0, 2).toUpperCase();
    }
    return single.charAt(0).toUpperCase();
  }
  
  const firstLetter = words[0].charAt(0).toUpperCase();
  const lastLetter = words[words.length - 1].charAt(0).toUpperCase();
  return `${firstLetter}${lastLetter}`;
}

/**
 * Helper to generate a deterministic vibrant background gradient based on name
 */
export function getAvatarColorClasses(name?: string): { bg: string; text: string; border: string } {
  if (!name) {
    return {
      bg: 'bg-gradient-to-br from-indigo-500 to-indigo-700',
      text: 'text-white',
      border: 'border-indigo-300'
    };
  }

  const palettes = [
    { bg: 'bg-gradient-to-br from-indigo-500 to-indigo-700', text: 'text-white', border: 'border-indigo-300' },
    { bg: 'bg-gradient-to-br from-purple-500 to-indigo-600', text: 'text-white', border: 'border-purple-300' },
    { bg: 'bg-gradient-to-br from-blue-500 to-indigo-600', text: 'text-white', border: 'border-blue-300' },
    { bg: 'bg-gradient-to-br from-teal-500 to-emerald-700', text: 'text-white', border: 'border-teal-300' },
    { bg: 'bg-gradient-to-br from-rose-500 to-pink-600', text: 'text-white', border: 'border-rose-300' },
    { bg: 'bg-gradient-to-br from-amber-500 to-orange-600', text: 'text-white', border: 'border-amber-300' },
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % palettes.length;
  return palettes[index];
}
