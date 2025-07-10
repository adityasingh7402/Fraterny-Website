/**
 * cardUtils.ts
 * Shared utilities for quest result cards
 */

// Get appropriate attribute icon based on attribute name
export const getAttributeIcon = (attribute: string): string => {
  const iconMap: { [key: string]: string } = {
    'self awareness': 'Eye',
    'collaboration': 'Users',
    'conflict navigation': 'Shield',
    'risk appetite': 'Zap'
  };
  
  return iconMap[attribute.toLowerCase()] || 'Sparkles';
};

// Get color gradient for score
export const getScoreColor = (score: string): string => {
  const numScore = parseInt(score.split('/')[0]);
  
  if (numScore >= 80) return 'from-cyan-400 to-blue-500';
  if (numScore >= 60) return 'from-purple-400 to-pink-500';
  if (numScore >= 40) return 'from-orange-400 to-red-500';
  
  return 'from-red-400 to-rose-500';
};

// Parse content from a string to extract findings and quotes
export const parseContent = (content: string) => {
  let findings: string[] = [];
  let quotes: string[] = [];
  let remainingContent = content;

  // Extract findings using simple string operations
  const findingsStart = content.indexOf('**5 Most Thought Provoking Findings about You**');
  if (findingsStart !== -1) {
    const afterFindings = content.substring(findingsStart);
    const nextSection = afterFindings.indexOf('\n**', 10); // Look for next section after the title
    const findingsSection = nextSection !== -1 ? afterFindings.substring(0, nextSection) : afterFindings;
    
    // Split by numbered items and clean up
    const findingMatches = findingsSection.split(/\n\d+\./);
    findings = findingMatches
      .slice(1)
      .map(item => item.trim().replace(/\n/g, ' '))
      .filter(item => item.length > 0);
    
    // Remove this section from remaining content
    remainingContent = remainingContent.replace(findingsSection, '');
  }

  // Extract quotes using simple string operations
  const quotesStart = content.indexOf('**5 Philosophical Quotes That Mirror Your Psyche**');
  if (quotesStart !== -1) {
    const afterQuotes = content.substring(quotesStart);
    const nextSection = afterQuotes.indexOf('\n**', 10); // Look for next section after the title
    const quotesSection = nextSection !== -1 ? afterQuotes.substring(0, nextSection) : afterQuotes;
    
    // Split by bullet points and clean up
    const quoteMatches = quotesSection.split(/\n-\s*[""]/);
    quotes = quoteMatches
      .slice(1)
      .map(item => {
        return item.trim()
          .replace(/[""]/g, '') // Remove quotes
          .replace(/\n/g, ' ') // Remove line breaks
          .replace(/–.*$/, '') // Remove everything after the dash (explanation)
          .trim();
      })
      .filter(item => item.length > 0);
    
    // Remove this section from remaining content
    remainingContent = remainingContent.replace(quotesSection, '');
  }

  return { findings, quotes, remainingContent: remainingContent.trim() };
};

// Format date to readable string
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Common card styles
export const cardStyles = {
  // Card wrapper styles
  wrapper: "relative w-full",
  
  // Base card styles
  card: "relative backdrop-blur-xl rounded-3xl p-8 border shadow-2xl overflow-hidden",
  
  // Mind card (blue) theme
  mindCardTheme: "bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 border-cyan-500/30",
  
  // Findings card (purple) theme
  findingsCardTheme: "bg-gradient-to-br from-purple-900/90 via-indigo-900/90 to-purple-900/90 border-purple-500/30",
  
  // Quotes card (green) theme
  quotesCardTheme: "bg-gradient-to-br from-emerald-900/90 via-teal-900/90 to-emerald-900/90 border-emerald-500/30",
  
  // Corner decorations
  corner: "absolute w-6 h-6",
  cornerTopLeft: "top-4 left-4 border-l-2 border-t-2",
  cornerTopRight: "top-4 right-4 border-r-2 border-t-2",
  cornerBottomLeft: "bottom-4 left-4 border-l-2 border-b-2",
  cornerBottomRight: "bottom-4 right-4 border-r-2 border-b-2",
  
  // Corner colors
  cornerMind: "border-cyan-400 opacity-60",
  cornerFindings: "border-purple-400 opacity-60",
  cornerQuotes: "border-emerald-400 opacity-60",
  
  // Headers
  headerWrapper: "text-center mb-8",
  headerDot: "w-2 h-2 rounded-full mr-2 animate-pulse",
  headerDotMind: "bg-cyan-400",
  headerDotFindings: "bg-purple-400",
  headerDotQuotes: "bg-emerald-400",
  
  // Header title
  headerTitle: "text-2xl font-bold text-transparent bg-clip-text tracking-wider",
  headerTitleMind: "bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400",
  headerTitleFindings: "bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400",
  headerTitleQuotes: "bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400",
  
  // Header divider
  headerDivider: "h-[1px] mx-auto bg-gradient-to-r from-transparent to-transparent",
  headerDividerMind: "w-32 via-cyan-400",
  headerDividerFindings: "w-40 via-purple-400",
  headerDividerQuotes: "w-40 via-emerald-400",
  
  // Glow effects
  outerGlow: "absolute inset-0 rounded-3xl blur-xl -z-10 opacity-60",
  outerGlowMind: "bg-gradient-to-r from-cyan-500/20 to-purple-500/20",
  outerGlowFindings: "bg-gradient-to-r from-purple-500/20 to-pink-500/20",
  outerGlowQuotes: "bg-gradient-to-r from-emerald-500/20 to-teal-500/20",
  
  // Bottom accents
  bottomAccent: "mt-8 flex justify-center",
  accentDot: "w-2 h-2 rounded-full",
  accentDotMind: "bg-gradient-to-r from-cyan-400 to-purple-400",
  accentDotFindings: "bg-gradient-to-r from-purple-400 to-pink-400",
  accentDotQuotes: "bg-gradient-to-r from-emerald-400 to-teal-400"
};