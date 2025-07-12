// /**
//  * cardUtils.ts
//  * Shared utilities for quest result cards
//  */

// // Get appropriate attribute icon based on attribute name
// export const getAttributeIcon = (attribute: string): string => {
//   const iconMap: { [key: string]: string } = {
//     'self awareness': 'Eye',
//     'collaboration': 'Users',
//     'conflict navigation': 'Shield',
//     'risk appetite': 'Zap'
//   };
  
//   return iconMap[attribute.toLowerCase()] || 'Sparkles';
// };

// // Get color gradient for score
// export const getScoreColor = (score: string): string => {
//   const numScore = parseInt(score.split('/')[0]);
  
//   if (numScore >= 80) return 'from-cyan-400 to-blue-500';
//   if (numScore >= 60) return 'from-purple-400 to-pink-500';
//   if (numScore >= 40) return 'from-orange-400 to-red-500';
  
//   return 'from-red-400 to-rose-500';
// };

// // Parse content from a string to extract findings and quotes
// export const parseContent = (content: string) => {
//   let findings: string[] = [];
//   let quotes: string[] = [];
//   let remainingContent = content;

//   // Extract findings using simple string operations
//   const findingsStart = content.indexOf('**5 Most Thought Provoking Findings about You**');
//   if (findingsStart !== -1) {
//     const afterFindings = content.substring(findingsStart);
//     const nextSection = afterFindings.indexOf('\n**', 10); // Look for next section after the title
//     const findingsSection = nextSection !== -1 ? afterFindings.substring(0, nextSection) : afterFindings;
    
//     // Split by numbered items and clean up
//     const findingMatches = findingsSection.split(/\n\d+\./);
//     findings = findingMatches
//       .slice(1)
//       .map(item => item.trim().replace(/\n/g, ' '))
//       .filter(item => item.length > 0);
    
//     // Remove this section from remaining content
//     remainingContent = remainingContent.replace(findingsSection, '');
//   }

//   // Extract quotes using simple string operations
//   const quotesStart = content.indexOf('**5 Philosophical Quotes That Mirror Your Psyche**');
//   if (quotesStart !== -1) {
//     const afterQuotes = content.substring(quotesStart);
//     const nextSection = afterQuotes.indexOf('\n**', 10); // Look for next section after the title
//     const quotesSection = nextSection !== -1 ? afterQuotes.substring(0, nextSection) : afterQuotes;
    
//     // Split by bullet points and clean up
//     const quoteMatches = quotesSection.split(/\n-\s*[""]/);
//     quotes = quoteMatches
//       .slice(1)
//       .map(item => {
//         return item.trim()
//           .replace(/[""]/g, '') // Remove quotes
//           .replace(/\n/g, ' ') // Remove line breaks
//           .replace(/–.*$/, '') // Remove everything after the dash (explanation)
//           .trim();
//       })
//       .filter(item => item.length > 0);
    
//     // Remove this section from remaining content
//     remainingContent = remainingContent.replace(quotesSection, '');
//   }

//   return { findings, quotes, remainingContent: remainingContent.trim() };
// };

// // Format date to readable string
// export const formatDate = (dateString: string): string => {
//   return new Date(dateString).toLocaleDateString('en-US', {
//     weekday: 'long',
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric'
//   });
// };

// // Common card styles
// export const cardStyles = {
//   // Card wrapper styles
//   wrapper: "relative w-full",
  
//   // Base card styles
//   card: "relative backdrop-blur-xl rounded-3xl p-8 border shadow-2xl overflow-hidden",
  
//   // Mind card (blue) theme
//   mindCardTheme: "bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 border-cyan-500/30",
  
//   // Findings card (purple) theme
//   findingsCardTheme: "bg-gradient-to-br from-purple-900/90 via-indigo-900/90 to-purple-900/90 border-purple-500/30",
  
//   // Quotes card (green) theme
//   quotesCardTheme: "bg-gradient-to-br from-emerald-900/90 via-teal-900/90 to-emerald-900/90 border-emerald-500/30",
  
//   // Corner decorations
//   corner: "absolute w-6 h-6",
//   cornerTopLeft: "top-4 left-4 border-l-2 border-t-2",
//   cornerTopRight: "top-4 right-4 border-r-2 border-t-2",
//   cornerBottomLeft: "bottom-4 left-4 border-l-2 border-b-2",
//   cornerBottomRight: "bottom-4 right-4 border-r-2 border-b-2",
  
//   // Corner colors
//   cornerMind: "border-cyan-400 opacity-60",
//   cornerFindings: "border-purple-400 opacity-60",
//   cornerQuotes: "border-emerald-400 opacity-60",
  
//   // Headers
//   headerWrapper: "text-center mb-8",
//   headerDot: "w-2 h-2 rounded-full mr-2 animate-pulse",
//   headerDotMind: "bg-cyan-400",
//   headerDotFindings: "bg-purple-400",
//   headerDotQuotes: "bg-emerald-400",
  
//   // Header title
//   headerTitle: "text-2xl font-bold text-transparent bg-clip-text tracking-wider",
//   headerTitleMind: "bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400",
//   headerTitleFindings: "bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400",
//   headerTitleQuotes: "bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400",
  
//   // Header divider
//   headerDivider: "h-[1px] mx-auto bg-gradient-to-r from-transparent to-transparent",
//   headerDividerMind: "w-32 via-cyan-400",
//   headerDividerFindings: "w-40 via-purple-400",
//   headerDividerQuotes: "w-40 via-emerald-400",
  
//   // Glow effects
//   outerGlow: "absolute inset-0 rounded-3xl blur-xl -z-10 opacity-60",
//   outerGlowMind: "bg-gradient-to-r from-cyan-500/20 to-purple-500/20",
//   outerGlowFindings: "bg-gradient-to-r from-purple-500/20 to-pink-500/20",
//   outerGlowQuotes: "bg-gradient-to-r from-emerald-500/20 to-teal-500/20",
  
//   // Bottom accents
//   bottomAccent: "mt-8 flex justify-center",
//   accentDot: "w-2 h-2 rounded-full",
//   accentDotMind: "bg-gradient-to-r from-cyan-400 to-purple-400",
//   accentDotFindings: "bg-gradient-to-r from-purple-400 to-pink-400",
//   accentDotQuotes: "bg-gradient-to-r from-emerald-400 to-teal-400"
// };


/**
 * Enhanced cardUtils.ts - parseContent function for all content types
 * Based on your working implementation, extended for all cases
 */

// Enhanced content parsing interfaces
interface Film {
  title: string;
  description: string;
}

interface Subject {
  title: string;
  description: string;
  matchPercentage?: number;
}

interface AstrologyData {
  actualSign: string;
  behavioralSign: string;
  description: string;
  predictions: Array<{
    title: string;
    likelihood: number;
    reason: string;
  }>;
}

interface Book {
  title: string;
  author: string;
  description?: string;
}

interface ParsedContent {
  findings: string[];
  quotes: string[];
  films: Film[];
  subjects: Subject[];
  astrology: AstrologyData | null;
  books: Book[];
  actionItem: string;
  remainingContent: string;
}

// Enhanced parseContent function based on your working approach
export const parseContent = (content: string): ParsedContent => {
  console.log('🔍 Enhanced parseContent - Starting analysis');
  console.log('📝 Content length:', content.length);
  
  let findings: string[] = [];
  let quotes: string[] = [];
  let films: Film[] = [];
  let subjects: Subject[] = [];
  let astrology: AstrologyData | null = null;
  let books: Book[] = [];
  let actionItem: string = '';
  let remainingContent = content;

  // 1. Extract Findings (using your working approach)
  console.log('\n🔍 EXTRACTING FINDINGS...');
  const findingsStart = content.indexOf('**5 Most Thought Provoking Findings about You**');
  if (findingsStart !== -1) {
    const afterFindings = content.substring(findingsStart);
    const nextSection = afterFindings.indexOf('\n**', 10);
    const findingsSection = nextSection !== -1 ? afterFindings.substring(0, nextSection) : afterFindings;
    
    console.log('📝 Findings section found:', findingsSection.substring(0, 200) + '...');
    
    // Split by numbered items and clean up
    const findingMatches = findingsSection.split(/\n\d+\./);
    findings = findingMatches
      .slice(1)
      .map(item => item.trim().replace(/\n/g, ' '))
      .filter(item => item.length > 0);
    
    console.log('✅ Findings extracted:', findings.length, 'items');
    remainingContent = remainingContent.replace(findingsSection, '');
  }

  // 2. Extract Quotes (using your working approach)
  console.log('\n🔍 EXTRACTING QUOTES...');
  const quotesStart = content.indexOf('**5 Philosophical Quotes That Mirror Your Psyche**');
  if (quotesStart !== -1) {
    const afterQuotes = content.substring(quotesStart);
    const nextSection = afterQuotes.indexOf('\n**', 10);
    const quotesSection = nextSection !== -1 ? afterQuotes.substring(0, nextSection) : afterQuotes;
    
    console.log('📝 Quotes section found:', quotesSection.substring(0, 200) + '...');
    
    // Extract quotes using multiple approaches
    let quoteMatches = quotesSection.split(/\n-\s*[""]/);
    
    // If first approach doesn't work, try extracting quotes directly
    if (quoteMatches.length <= 1) {
      const directQuotes = quotesSection.match(/"[^"]*"/g);
      if (directQuotes) {
        quotes = directQuotes
          .map(quote => quote.replace(/"/g, '').trim())
          .filter(quote => quote.length > 10);
      }
    } else {
      quotes = quoteMatches
        .slice(1)
        .map(item => {
          return item.trim()
            .replace(/[""]/g, '')
            .replace(/\n/g, ' ')
            .replace(/–.*$/, '')
            .trim();
        })
        .filter(item => item.length > 0);
    }
    
    console.log('✅ Quotes extracted:', quotes.length, 'items');
    remainingContent = remainingContent.replace(quotesSection, '');
  }

  // 3. Extract Films
  console.log('\n🔍 EXTRACTING FILMS...');
  const filmsStart = content.indexOf('**5 Films That Hit Closer Than Expected**');
  if (filmsStart !== -1) {
    const afterFilms = content.substring(filmsStart);
    const nextSection = afterFilms.indexOf('\n**', 10);
    const filmsSection = nextSection !== -1 ? afterFilms.substring(0, nextSection) : afterFilms;
    
    console.log('📝 Films section found:', filmsSection.substring(0, 200) + '...');
    
    // Extract lines with title – description format
    const filmLines = filmsSection.split('\n').filter(line => 
      line.includes('–') && !line.includes('**') && line.trim().length > 0
    );
    
    films = filmLines.map(line => {
      const parts = line.split('–').map(part => part.trim());
      if (parts.length >= 2) {
        return {
          title: parts[0],
          description: parts[1]
        };
      }
      return null;
    }).filter((film): film is Film => film !== null);
    
    console.log('✅ Films extracted:', films.length, 'items');
    remainingContent = remainingContent.replace(filmsSection, '');
  }

  // 4. Extract Subjects
  console.log('\n🔍 EXTRACTING SUBJECTS...');
  const subjectsStart = content.indexOf('**3 Subjects You\'re Mentally Built To Explore Deeper**');
  if (subjectsStart !== -1) {
    const afterSubjects = content.substring(subjectsStart);
    const nextSection = afterSubjects.indexOf('\n**', 10);
    const subjectsSection = nextSection !== -1 ? afterSubjects.substring(0, nextSection) : afterSubjects;
    
    console.log('📝 Subjects section found:', subjectsSection.substring(0, 200) + '...');
    
    // Extract lines with title – description format
    const subjectLines = subjectsSection.split('\n').filter(line => 
      line.includes('–') && !line.includes('**') && line.trim().length > 0
    );
    
    subjects = subjectLines.map(line => {
      const parts = line.split('–').map(part => part.trim());
      if (parts.length >= 2) {
        return {
          title: parts[0],
          description: parts[1],
          matchPercentage: Math.floor(Math.random() * 20) + 75
        } as Subject;
      }
      return null;
    }).filter((subject): subject is Subject => subject !== null);
    
    console.log('✅ Subjects extracted:', subjects.length, 'items');
    remainingContent = remainingContent.replace(subjectsSection, '');
  }

  // 5. Extract Astrology
  console.log('\n🔍 EXTRACTING ASTROLOGY...');
  const astrologyStart = content.indexOf('**Our take on Astrology');
  if (astrologyStart !== -1) {
    const afterAstrology = content.substring(astrologyStart);
    const nextSection = afterAstrology.indexOf('\n**', 10);
    const astrologySection = nextSection !== -1 ? afterAstrology.substring(0, nextSection) : afterAstrology;
    
    console.log('📝 Astrology section found:', astrologySection.substring(0, 300) + '...');
    
    // Extract signs
    const signMatch = astrologySection.match(/personality aligns more with (\w+)'s.*?than your (\w+)/i);
    const actualSignMatch = astrologySection.match(/Actual sun sign:\s*(\w+)/i);
    
    const behavioralSign = signMatch ? signMatch[1] : 'Virgo';
    const actualSign = actualSignMatch ? actualSignMatch[1] : (signMatch ? signMatch[2] : 'Aries');
    
    // Extract description
    const descMatch = astrologySection.match(/Based on.*?(?=\n\d+\.|$)/s);
    const description = descMatch ? descMatch[0].trim() : 'Based on behavioral psychology, your personality shows interesting patterns.';
    
    // Extract predictions - look for numbered predictions
    const predictions: Array<{ title: string; likelihood: number; reason: string }> = [];
    const predictionLines = astrologySection.split('\n').filter(line => 
      line.match(/^\d+\./) && line.includes('Likelihood:') && line.includes('Why:')
    );
    
    predictionLines.forEach((line) => {
      const titleMatch = line.match(/^\d+\.\s+(.+?)\s*–/);
      const likelihoodMatch = line.match(/Likelihood:\s*(\d+)%/);
      const reasonMatch = line.match(/Why:\s*(.+?)$/);
      
      if (titleMatch && likelihoodMatch && reasonMatch) {
        predictions.push({
          title: titleMatch[1].trim(),
          likelihood: parseInt(likelihoodMatch[1]),
          reason: reasonMatch[1].trim()
        });
      }
    });
    
    astrology = {
      actualSign,
      behavioralSign,
      description,
      predictions
    };
    
    console.log('✅ Astrology extracted with', predictions.length, 'predictions');
    remainingContent = remainingContent.replace(astrologySection, '');
  }

  // 6. Extract Books
  console.log('\n🔍 EXTRACTING BOOKS...');
  const booksStart = content.indexOf('**3 Books You\'d Love If You Gave Them a Chance**');
  if (booksStart !== -1) {
    const afterBooks = content.substring(booksStart);
    const nextSection = afterBooks.indexOf('\n**', 10);
    const booksSection = nextSection !== -1 ? afterBooks.substring(0, nextSection) : afterBooks;
    
    console.log('📝 Books section found:', booksSection.substring(0, 200) + '...');
    
    // Extract lines with "by" in them
    const bookLines = booksSection.split('\n').filter(line => 
      line.includes(' by ') && !line.includes('**') && line.trim().length > 0
    );
    
    books = bookLines.map(line => {
      const parts = line.split(' by ');
      if (parts.length >= 2) {
        return {
          title: parts[0].trim(),
          author: parts[1].trim()
        };
      }
      return null;
    }).filter((book): book is Book => book !== null);
    
    console.log('✅ Books extracted:', books.length, 'items');
    remainingContent = remainingContent.replace(booksSection, '');
  }

  // 7. Extract Action Item
  console.log('\n🔍 EXTRACTING ACTION ITEM...');
  const actionStart = content.indexOf('**One Thing You Should Work On');
  if (actionStart !== -1) {
    const actionSection = content.substring(actionStart);
    
    console.log('📝 Action section found:', actionSection.substring(0, 200) + '...');
    
    // Extract the text after the header
    const actionLines = actionSection.split('\n').filter(line => 
      !line.includes('**') && line.trim().length > 0
    );
    
    if (actionLines.length > 0) {
      actionItem = actionLines.join(' ').trim().substring(0, 500);
      console.log('✅ Action item extracted:', actionItem.substring(0, 100) + '...');
    }
    
    remainingContent = remainingContent.replace(actionSection, '');
  }

  // Final results
  console.log('\n📊 FINAL PARSING RESULTS:');
  console.log('- Findings:', findings.length);
  console.log('- Quotes:', quotes.length);
  console.log('- Films:', films.length);
  console.log('- Subjects:', subjects.length);
  console.log('- Astrology:', astrology ? 'Found' : 'Not found');
  console.log('- Books:', books.length);
  console.log('- Action item:', actionItem ? 'Found' : 'Not found');
  console.log('- Remaining content length:', remainingContent.trim().length);

  return {
    findings,
    quotes,
    films,
    subjects,
    astrology,
    books,
    actionItem,
    remainingContent: remainingContent.trim()
  };
};

// Keep all your existing utility functions
export const getAttributeIcon = (attribute: string): string => {
  const iconMap: { [key: string]: string } = {
    'self awareness': 'Eye',
    'collaboration': 'Users',
    'conflict navigation': 'Shield',
    'risk appetite': 'Zap'
  };
  
  return iconMap[attribute.toLowerCase()] || 'Sparkles';
};

export const getScoreColor = (score: string): string => {
  const numScore = parseInt(score.split('/')[0]);
  
  if (numScore >= 80) return 'from-cyan-400 to-blue-500';
  if (numScore >= 60) return 'from-purple-400 to-pink-500';
  if (numScore >= 40) return 'from-orange-400 to-red-500';
  
  return 'from-red-400 to-rose-500';
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Keep all your existing cardStyles
export const cardStyles = {
  wrapper: "relative w-full",
  card: "relative backdrop-blur-xl rounded-3xl p-8 border shadow-2xl overflow-hidden",
  mindCardTheme: "bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 border-cyan-500/30",
  findingsCardTheme: "bg-gradient-to-br from-purple-900/90 via-indigo-900/90 to-purple-900/90 border-purple-500/30",
  quotesCardTheme: "bg-gradient-to-br from-emerald-900/90 via-teal-900/90 to-emerald-900/90 border-emerald-500/30",
  corner: "absolute w-6 h-6",
  cornerTopLeft: "top-4 left-4 border-l-2 border-t-2",
  cornerTopRight: "top-4 right-4 border-r-2 border-t-2",
  cornerBottomLeft: "bottom-4 left-4 border-l-2 border-b-2",
  cornerBottomRight: "bottom-4 right-4 border-r-2 border-b-2",
  cornerMind: "border-cyan-400 opacity-60",
  cornerFindings: "border-purple-400 opacity-60",
  cornerQuotes: "border-emerald-400 opacity-60",
  headerWrapper: "text-center mb-8",
  headerDot: "w-2 h-2 rounded-full mr-2 animate-pulse",
  headerDotMind: "bg-cyan-400",
  headerDotFindings: "bg-purple-400",
  headerDotQuotes: "bg-emerald-400",
  headerTitle: "text-2xl font-bold text-transparent bg-clip-text tracking-wider",
  headerTitleMind: "bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400",
  headerTitleFindings: "bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400",
  headerTitleQuotes: "bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400",
  headerDivider: "h-[1px] mx-auto bg-gradient-to-r from-transparent to-transparent",
  headerDividerMind: "w-32 via-cyan-400",
  headerDividerFindings: "w-40 via-purple-400",
  headerDividerQuotes: "w-40 via-emerald-400",
  outerGlow: "absolute inset-0 rounded-3xl blur-xl -z-10 opacity-60",
  outerGlowMind: "bg-gradient-to-r from-cyan-500/20 to-purple-500/20",
  outerGlowFindings: "bg-gradient-to-r from-purple-500/20 to-pink-500/20",
  outerGlowQuotes: "bg-gradient-to-r from-emerald-500/20 to-teal-500/20",
  bottomAccent: "mt-8 flex justify-center",
  accentDot: "w-2 h-2 rounded-full",
  accentDotMind: "bg-gradient-to-r from-cyan-400 to-purple-400",
  accentDotFindings: "bg-gradient-to-r from-purple-400 to-pink-400",
  accentDotQuotes: "bg-gradient-to-r from-emerald-400 to-teal-400"
};