// ------------------------------------------------------------------------
'use client';

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Share2, 
  ThumbsUp, 
  ThumbsDown, 
  Clock, 
  Quote, 
  Film, 
  Sparkles, 
  X, 
  SendHorizontal,
  Lock, 
  ShieldCheck,
  Download,
  Home,
  AlertTriangle,
  Eye,
  Users,
  Shield,
  Zap,
  BookOpen,
  Star,
  Moon
} from "lucide-react";
import imgicon from '../../../../public/message.png'
import logo from '../../../../public/Vector.svg';
import axios from 'axios';
import { section } from "@/components/quest-landing/styles";
import { signInWithGoogle } from '@/utils/auth';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { PaymentService, sessionStorageManager, sessionManager } from '@/services/payments';
import { useParams } from 'react-router-dom';
import { log } from "console";


interface Film {
  title: string;
  description: string;
  imageUrl?: string;
}

interface Subject {
  title: string;
  description: string;
  matchPercentage: number;
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

interface Quote {
  text: string;
  author: string;
}

interface MindCardData {
  name?: string;
  personality?: string;
  description?: string;
  attributes: string[];
  scores: string[];
  insights: string[];
}

interface ResultData {
  session_id: string;
  user_id?: string;
  completion_date: string;
  results: {
    "section 1"?: string;
    "Mind Card"?: MindCardData;
    findings?: string[];
    quotes?: Quote[];
    films?: Film[];
    subjects?: Subject[];
    astrology?: AstrologyData;
    books?: Book[];
    actionItem?: string;
  };
}

interface User {
  id: string;
  email?: string; // Make email optional to match Supabase
  name?: string;
  // Add other properties you might need
  user_metadata?: any;
  app_metadata?: any;
}

interface RouteParams {
  userId: string;
  sessionId: string;
  testId: string;
}

// Design Tokens
const tokens = {
  textDark: "#0A0A0A",
  textLight: "#FFFFFF",
  muted: "#6B7280",
  border: "#E6EAF2",
  accent: "#0C45F0",
  accent2: "#41D9FF",
  accent3: "#48B9D8",
  soft: "#F7F9FC",
};

const CTA_HEIGHT = 60;

// Motion Configuration
const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const DUR_SM = 0.18;
const DUR_MD = 0.32;

const sectionVariants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DUR_MD, ease: EASE_OUT, staggerChildren: 0.06 },
  },
};

// Mock Data
const MOCK_RESULT_DATA: ResultData = {
  session_id: "mock-session-123",
  user_id: "mock-user-456",
  completion_date: new Date().toISOString(),
  results: {
    "section 1": "You project calm intensity—ambitious, observant, and guarded until conviction clicks into motion.",
    "Mind Card": {
      name: "The Architect",
      personality: "#Strategic-Minded Individual",
      description: "A methodical thinker who builds systems and seeks elegant solutions.",
      attributes: ["self awareness", "collaboration", "conflict navigation", "risk appetite"],
      scores: ["82/100", "76/100", "71/100", "65/100"],
      insights: [
        "High self-reflection and emotional intelligence",
        "Prefers small, high-trust team environments", 
        "Approaches conflict with diplomatic solutions",
        "Calculated risk-taker with thorough analysis"
      ]
    },
    findings: [
      "You hoard unfinished ideas until urgency forces elegant execution.",
      "You listen to patterns first, people second—useful, but sometimes misread as cold.",
      "You avoid small talk not from arrogance, but from conservation of focus.",
      "You under-share wins; your excellence is discoverable, not broadcast.",
      "You feel safest when plans are modular—Plan B is always pre-built."
    ],
    quotes: [
      { text: "What we dwell on is who we become.", author: "Oprah Winfrey" },
      { text: "He who has a why can bear almost any how.", author: "Nietzsche" },
      { text: "You must build your life as a work of art.", author: "Simone de Beauvoir" },
      { text: "The obstacle is the way.", author: "Marcus Aurelius" },
      { text: "Live the questions now.", author: "R.M. Rilke" }
    ],
    films: [
      { title: "Arrival", description: "Language rewires how you choose." },
      { title: "Whiplash", description: "Obsession versus self-regard." },
      { title: "Her", description: "Intimacy with ideas, distance with people." },
      { title: "Good Will Hunting", description: "Unused potential, chosen family." },
      { title: "The Social Network", description: "Precision without tenderness costs." }
    ],
    subjects: [
      { title: "Game theory for everyday negotiations", description: "Strategic thinking in daily interactions", matchPercentage: 85 },
      { title: "Cognitive load management", description: "Optimizing mental bandwidth", matchPercentage: 78 },
      { title: "Systems design thinking", description: "Building scalable frameworks", matchPercentage: 82 }
    ],
    astrology: {
      actualSign: "Gemini",
      behavioralSign: "Virgo",
      description: "You behave more like a Virgo than your actual sign. Why: Discipline + methodical prep + discomfort with spectacle. You optimize silently, then ship.",
      predictions: [
        { title: "Career pivot within 18 months", likelihood: 72, reason: "Mastery drive + boredom with maintenance cycles." },
        { title: "You'll be seen as 'aloof' before 'deep'", likelihood: 68, reason: "Low social broadcast + high internal dialogues." },
        { title: "You'll lead a lean team of 3-6", likelihood: 63, reason: "Preference for high-trust, high-autonomy pods." },
        { title: "You'll publish a framework or guide", likelihood: 59, reason: "Pattern memory + urge to compress chaos." },
        { title: "Sleep becomes a non-negotiable ritual", likelihood: 54, reason: "Performance dependency discovered via dips." }
      ]
    },
    books: [
      { title: "Range", author: "David Epstein" },
      { title: "Deep Work", author: "Cal Newport" },
      { title: "Man's Search for Meaning", author: "Viktor Frankl" }
    ],
    actionItem: "Ship one imperfect artifact daily for 14 days. Log it and write a one-line reflection."
  }
};

//payment CTA
// Add this component before the main QuestResultFullscreen component
interface UpsellSheetProps {
  open: boolean;
  onClose: () => void;
  onPayment: () => Promise<void>;
  paymentLoading: boolean;
}

const UpsellSheet: React.FC<UpsellSheetProps> = ({ open, onClose, onPayment, paymentLoading }) => {
  const [trial, setTrial] = useState(true);

  const [seconds, setSeconds] = useState(30 * 60);
  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

   const handlePaymentClick = async () => {
    try {
      await onPayment();
    } catch (error) {
      console.error('Payment error in UpsellSheet:', error);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[70]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/35" onClick={onClose} />
          <motion.div
            className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-[390px] rounded-t-[28px] bg-white"
            style={{ boxShadow: "0 -12px 32px rgba(0,0,0,0.15)", border: `1px solid ${tokens.border}` }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
          >
            <div className="relative px-4 pt-4">
              <button aria-label="Close" onClick={onClose} className="absolute left-2 top-2 rounded-full p-2">
                <X className="h-5 w-5" color={tokens.textDark} />
              </button>
              <div className="pb-2 pt-6 text-[26px] font-['Gilroy-Regular'] leading-8" style={{ color: tokens.textDark }}>
                Download your 35+ page <span className="font-['Gilroy-Black']">Psychoanalysis PDF Report</span>
              </div>
              <div className="mb-3 text-[14px] font-['Gilroy-Regular']" style={{ color: tokens.muted }}> Powered by Fraterny’s advanced AI model </div>
              <ul className="grid gap-2 pb-3">
                {["A Deep-Dive Mindset Analysis", "Detailed Mental Blueprint", "Personalized Content Operating System ", "You VS Future You", "Curated Action & Growth Plan"].map((t, i) => (
                  <li key={i} className="flex items-center gap-2 text-[14px] font-['Gilroy-semiBold']">
                    <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: i === 0 ? "#FF3B6B" : tokens.accent }} />
                    <span className={i === 0 ? "font-[700]" : ""} style={{ color: tokens.textDark }}>
                      {i === 0 ? <span style={{ color: "#FF3B6B" }}>A Deep-Dive Mindset Analysis</span> : t}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="px-4">
              <motion.div
                className="relative rounded-2xl p-4 text-white"
                style={{ background: "linear-gradient(135deg, rgba(12,69,240,1) 0%, rgba(65,217,255,1) 45%, rgba(72,185,216,1) 100%)" }}
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              >
                <div className="text-[12px] opacity-95"><span>Ends in {formatTime(seconds)}</span></div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-[14px] line-through opacity-85">₹1200</span>
                  <span className="text-[20px] font-[700]">→ ₹950</span>
                </div>
              </motion.div>
              <div className="mt-3 flex items-center justify-between rounded-xl bg-[#F2F5FA] px-3 py-3 font-['Gilroy-Bold']" style={{ border: `1px solid ${tokens.border}` }}>
                <div className="text-[16px]" style={{ color: tokens.textDark }}>Incorporate My Feedback</div>
                <button aria-label="toggle trial" onClick={() => setTrial((t) => !t)} className="relative h-6 w-11 rounded-full" style={{ background: trial ? tokens.accent : "#D1D5DB", boxShadow: "0 10px 30px rgba(12,69,240,0.06)" }}>
                  <span className="absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform" style={{ transform: `translateX(${trial ? 20 : 0}px)` }} />
                </button>
              </div>
            </div>
            <div className="sticky bottom-0 mt-5 border-t" style={{ borderColor: tokens.border }}>
              <div className="px-4 py-3">
                <button 
                  onClick={handlePaymentClick}
                  disabled={paymentLoading}
                  className="w-full rounded-xl px-4 py-3 text-[16px] font-[600] font-['Gilroy-Bold'] tracking-tight text-white disabled:opacity-50" 
                  style={{ background: tokens.textDark }}
                >
                  {paymentLoading ? 'Processing...' : 'Continue'}
                </button>
                <div className="pt-2 text-center text-[12px]" style={{ color: tokens.muted }}>
                  Fully Refundable. T&C apply. 
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface StickyCTAProps {
  onOpen: () => void;
}

const StickyCTA: React.FC<StickyCTAProps> = ({ onOpen }) => {
  const [seconds, setSeconds] = useState(30 * 60);
  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        borderTop: `1px solid ${tokens.border}`,
        boxShadow: "0 -6px 18px rgba(10,10,10,0.06)",
        height: CTA_HEIGHT,
      }}
    >
      <div className="mx-auto flex h-full max-w-[390px] items-center justify-between px-3" style={{ color: tokens.textDark }}>
        <div className="flex flex-col">
          <div className="flex items-baseline gap-2">
            <span className="text-[20px] font-[800]">₹950</span>
            <span className="text-[12px] line-through" style={{ color: tokens.muted }}>₹1200</span>
          </div>
          <div className="mt-1 flex items-center gap-1 text-[12px]" aria-live="polite" style={{ color: tokens.muted }}>
            <Clock className="h-4 w-4" color={tokens.accent} />
            <span>Ends in {formatTime(seconds)}</span>
          </div>
        </div>

        <motion.button
          onClick={onOpen}
          whileTap={{ scale: 0.98 }}
          className="font-['Gilroy-semiBold'] flex items-center justify-center rounded-full px-6 py-2.5 min-w-[180px] text-[14px] font-[700] text-white"
          style={{
            background: `linear-gradient(135deg, ${tokens.accent} 0%, ${tokens.accent2} 60%, ${tokens.accent3} 100%)`,
            boxShadow: "0 10px 20px rgba(12,69,240,0.20)",
          }}
          aria-label="Unlock full PDF report"
        >
          Unlock Full PDF Report
        </motion.button>
      </div>

      <div className="absolute left-0 right-0 bottom-0 h-[2px]" style={{ background: `linear-gradient(90deg, ${tokens.accent} 0%, ${tokens.accent2} 50%, ${tokens.accent3} 100%)` }} />
    </div>
  );
};

// Utility Functions
const formatTime = (s: number): string => {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const r = (s % 60).toString().padStart(2, "0");
  return `${m}:${r}`;
};

const validateResultData = (data: any): ResultData => {
  console.log('🔍 Validating result data:', data);
  
  // Handle both cases where Mind Card might be missing or have different property names
  const mindCardData = data.results?.["Mind Card"];
  
  const validated: ResultData = {
    session_id: data.session_id || 'unknown',
    user_id: data.user_id,
    completion_date: data.completion_date || new Date().toISOString(),
    results: {
      "section 1": data.results?.["section 1"] || '',
      
      // Enhanced Mind Card validation with fallbacks for API inconsistencies
      "Mind Card": mindCardData ? {
        name: mindCardData.personality_type || "The Architect",
        personality: mindCardData.personlity || mindCardData.personality || "#Game-Styled Mindcard", 
        description: mindCardData.description || "A methodical thinker who builds systems and seeks elegant solutions.",
        // Handle both 'attribute' and 'attributes' from API
        attributes: mindCardData.attribute || mindCardData.attributes || ["self awareness", "collaboration", "conflict navigation", "risk appetite"],
        // Handle both 'score' and 'scores' from API  
        scores: mindCardData.score || mindCardData.scores || ["50/100", "50/100", "50/100", "50/100"],
        // Handle both 'insight' and 'insights' from API
        insights: mindCardData.insight || mindCardData.insights || ["Analysis in progress...", "Analysis in progress...", "Analysis in progress...", "Analysis in progress..."]
      } : {
        name: "User",
        personality: "#Game-Styled Mindcard", 
        description: "Loading analysis...",
        attributes: ["self awareness", "collaboration", "conflict navigation", "risk appetite"],
        scores: ["50/100", "50/100", "50/100", "50/100"],
        insights: ["Analysis in progress...", "Analysis in progress...", "Analysis in progress...", "Analysis in progress..."]
      },
      
      // Ensure all arrays have fallbacks to prevent .map() errors
      findings: Array.isArray(data.results?.findings) ? data.results.findings : [],
      quotes: Array.isArray(data.results?.quotes) ? data.results.quotes : [],
      films: Array.isArray(data.results?.films) ? data.results.films.map((film: any, index: number) => ({
        title: film.title || '',
        description: film.description || '',
        imageUrl: `/film.svg`
      })) : [],
      subjects: Array.isArray(data.results?.subjects) ? data.results.subjects : [],
      astrology: data.results?.astrology || null,
      books: Array.isArray(data.results?.books) ? data.results.books : [],
      actionItem: data.results?.actionItem || ''
    }
  };
  
  console.log('✅ Validated result data:', validated);
  return validated;
};

async function shareText(title: string, text: string): Promise<boolean> {
  try {
    if (navigator.share) {
      await navigator.share({ title, text });
      return true;
    }
  } catch {}
  try {
    await navigator.clipboard.writeText(`${title}\n\n${text}`);
    return true;
  } catch {
    return false;
  }
}

// Section Themes
const sectionTheme = (key: string) => {
  switch (key) {
    case "emotional":
      return {
        bg: `radial-gradient(1200px 600px at 60% 80%, rgba(255,255,255,.25), transparent 60%), linear-gradient(160deg, #0b4ef6 0%, #2d73ff 45%, #69c7ff 100%)`,
        text: tokens.textLight,
      };
    case "mind":
      return {
        bg: `linear-gradient(180deg, rgba(72,185,216,0.9) 0%, rgba(65,217,255,0.85) 40%, rgba(12,69,240,0.9) 100%)`,
        text: tokens.textLight,
      };
    case "findings":
      return {
        bg: `linear-gradient(135deg, rgba(12,69,240,1) 0%, rgba(65,217,255,0.85) 55%, rgba(255,255,255,0.2) 100%)`,
        text: tokens.textLight,
      };
    case "quotes":
      return {
        bg: `linear-gradient(180deg, #FFFFFF 0%, #F7F9FC 30%, #006983 100%)`,
        text: tokens.textDark,
      };
    case "films":
      return {
        bg: `radial-gradient(120% 100% at 50% 100%, rgba(12,69,240,1) 0%, rgba(12,69,240,0.9) 35%, rgba(65,217,255,0.6) 100%)`,
        text: tokens.textLight,
      };
    case "subjects":
      return { bg: `linear-gradient(180deg, #FFFFFF 0%, #F7F9FC 100%)`, text: tokens.textDark };
    case "astrology":
      return {
        bg: `radial-gradient(90% 80% at 50% 60%, rgba(12,69,240,0.95) 0%, rgba(12,69,240,0.9) 45%, rgba(65,217,255,0.6) 100%)`,
        text: tokens.textLight,
      };
    case "books":
      return { bg: `linear-gradient(180deg, #FFFFFF 0%, #F7F9FC 100%)`, text: tokens.textDark };
    case "work":
      return { bg: `linear-gradient(135deg, rgba(12,69,240,1) 0%, rgba(72,185,216,0.95) 100%)`, text: tokens.textLight };
    default:
      return { bg: `#FFFFFF`, text: tokens.textDark };
  }
};

// Components
interface OrbProps {
  onTip: () => void;
}

const Orb: React.FC<OrbProps> = ({ onTip }) => (
  <motion.button
    aria-label="Quest orb"
    onClick={onTip}
    whileTap={{ scale: 0.96 }}
    className="fixed bottom-24 right-4 z-[60] h-14 w-14 rounded-full"
    style={{
      border: `1px solid ${tokens.border}`,
      boxShadow: "0 10px 30px rgba(12,69,240,0.20)",
      background:
        "radial-gradient(60% 60% at 50% 45%, #0C45F0 0%, #41D9FF 40%, #48B9D8 75%, rgba(72,185,216,0.15) 100%)",
      filter: "saturate(1.06)",
    }}
    animate={{ scale: [1, 0.965, 1], rotate: [0, 1.2, 0] }}
    transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
  />
);

interface SectionActionsProps {
  title: string;
  share: string;
  textColor: string;
   inputClassName?: string;
    buttonClassName?: string; 
    sessionId?: string;
  testId?: string;
  sectionId?: string;
  onToast?: (msg: string) => void;
}

const SectionActions: React.FC<SectionActionsProps> = ({ title, share, textColor, onToast, inputClassName, buttonClassName, sessionId, testId, sectionId }) => {
  const [reacted, setReacted] = useState<"up" | "down" | null>(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [shared, setShared] = useState(false);

  // Replace the existing sendFeedback function with this updated version:

const sendFeedback = async () => {
  console.log("sendFeedback called with:", { sessionId, testId, sectionId });
  // if (!sessionId || !testId || !sectionId) return;
  
  try {
    // Determine reaction value based on reacted state
    let reaction = "none";
    if (reacted === "up") reaction = "like";
    if (reacted === "down") reaction = "dislike";
    
    console.log("Sending feedback:", { sessionId, testId, reaction, feedback, sectionId });
    
    await axios.post('https://api.fraterny.in/api/quest/feedback', {
      sessionId,
      testId,
      reaction,
      feedback,
      sectionId: sectionId
    });
    
    toast.success("Thank you for the feedback");
  } catch (error) {
    toast.error("Failed to send feedback");
  }
};

  const onShare = async () => {
    const ok = await shareText(title, share);
    if (ok) {
      setShared(true);
      setTimeout(() => setShared(false), 900);
      toast.success("Shared ✓");
    }
  };

  return (
    <div className="pointer-events-auto">
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* <button
            onClick={() => setReacted("up")}
            className="flex items-center gap-1 rounded-full px-3 py-1 text-[12px]"
            style={{ background: "rgba(255,255,255,0.25)", color: textColor }}
          >
            <ThumbsUp className="h-4 w-4" />
          </button>
          <button
            onClick={() => setReacted("down")}
            className="flex items-center gap-1 rounded-full px-3 py-1 text-[12px]"
            style={{ background: "rgba(255,255,255,0.25)", color: textColor }}
          >
            <ThumbsDown className="h-4 w-4" />
          </button> */}

          <div className="flex items-center gap-2">
          <motion.button
            onClick={() => setReacted(reacted === "up" ? null : "up")}
            className="flex items-center gap-1 rounded-full px-3 py-1 text-[12px] relative overflow-hidden"
            style={{ background: "rgba(255,255,255,0.25)", color: textColor }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Background fill animation */}
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: reacted === "up" ? 1 : 0,
                opacity: reacted === "up" ? 0.3 : 0,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
              style={{ borderRadius: "inherit" }}
            />
            
            {/* Icon with animation */}
            <motion.div
              animate={{
                rotate: reacted === "up" ? [0, -10, 10, 0] : 0,
                scale: reacted === "up" ? [1, 1.2, 1] : 1,
              }}
              transition={{
                duration: 0.5,
                ease: "easeOut"
              }}
            >
              <ThumbsUp 
                className="h-4 w-4 relative z-10" 
                fill={reacted === "up" ? "currentColor" : "none"}
                style={{
                  transition: "fill 0.3s ease"
                }}
              />
            </motion.div>
            
            {/* Ripple effect */}
            {reacted === "up" && (
              <motion.div
                className="absolute inset-0 border-2 border-green-400 rounded-full"
                initial={{ scale: 0.8, opacity: 0.8 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            )}
          </motion.button>

          <motion.button
            onClick={() => setReacted(reacted === "down" ? null : "down")}
            className="flex items-center gap-1 rounded-full px-3 py-1 text-[12px] relative overflow-hidden"
            style={{ background: "rgba(255,255,255,0.25)", color: textColor }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Background fill animation */}
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: reacted === "down" ? 1 : 0,
                opacity: reacted === "down" ? 0.3 : 0,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
              style={{ borderRadius: "inherit" }}
            />
            
            {/* Icon with animation */}
            <motion.div
              animate={{
                rotate: reacted === "down" ? [0, 10, -10, 0] : 0,
                scale: reacted === "down" ? [1, 1.2, 1] : 1,
              }}
              transition={{
                duration: 0.5,
                ease: "easeOut"
              }}
            >
              <ThumbsDown 
                className="h-4 w-4 relative z-10" 
                fill={reacted === "down" ? "currentColor" : "none"}
                style={{
                  transition: "fill 0.3s ease"
                }}
              />
            </motion.div>
            
            {/* Ripple effect */}
            {reacted === "down" && (
              <motion.div
                className="absolute inset-0 border-2 border-red-400 rounded-full"
                initial={{ scale: 0.8, opacity: 0.8 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            )}
          </motion.button>
          <button
          onClick={onShare}
          className="rounded-full px-3 active:scale-95 font-['Gilroy-Regular'] tracking-tighter"
          style={{ background: "rgba(255,255,255,0.25)", color: textColor }}
          aria-label="Share"
        >
          Share
        </button>
        </div>
        </div>
        {/* <button
          onClick={onShare}
          className="rounded-full p-2 active:scale-95"
          style={{ background: "rgba(255,255,255,0.25)", color: textColor }}
          aria-label="Share"
        >
          <Share2 className="h-5 w-5" />
        </button> */}
      </div>

      <AnimatePresence initial={false}>
        {feedbackOpen && (
          <motion.form
           onSubmit={(e) => {
              e.preventDefault();
              sendFeedback();
              setFeedback("");
              setFeedbackOpen(false);
            }}
            className="mt-2 flex items-center gap-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <input
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tell us something specific…"
              className={`w-full rounded-xl px-3 py-2 text-[14px] outline-none placeholder:italic placeholder:font-['Gilroy-Regular'] ${inputClassName || 'text-[#e2e8f0] placeholder:text-[#e2e8f0] bg-white/25'}`}
            />
            <button
              type="submit"
              className={`rounded-xl px-3 py-2 text-[13px] font-[600] ${buttonClassName || 'bg-white/25 text-white'}`}
            >
              <img src={imgicon} alt="Send" className="h-5 w-5" />
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="mt-2 text-[12px] underline opacity-90">
        <button onClick={() => setFeedbackOpen((s) => !s)} style={{ color: textColor }}>
          {feedbackOpen ? "Close" : "Add a thought…"}
        </button>
      </div>

      <AnimatePresence>
        {shared && (
          <motion.div
            className="pointer-events-none absolute right-3 top-3 rounded-lg px-2 py-1 text-[12px]"
            style={{ background: "#0A0A0A", color: "#fff" }}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
          >
            Shared ✓
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface SectionFrameProps {
  id: string;
  title: string;
  sub?: string;
  shareText: string;
  themeKey: string;
  customClass?: string;
  inputClassName?: string;
   buttonClassName?: string; 
   sessionId?: string;    // Add this
  testId?: string;       // Add this
  children: React.ReactNode;
  onToast?: (msg: string) => void;
}

const SectionFrame: React.FC<SectionFrameProps> = ({ id, title, sub, shareText, themeKey, customClass, inputClassName, buttonClassName, children, onToast, sessionId, testId }) => {
  const theme = sectionTheme(themeKey);
  const text = theme.text;
  return (
    <section
      id={id}
      className={`snap-start relative ${customClass}`}
      style={{
        minHeight: `calc(100vh - ${CTA_HEIGHT}px)`,
        background: theme.bg,
        color: text,
      }}
    >
      {text === tokens.textLight && (
        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.12))" }} />
      )}
      <div className="mx-auto relative z-[1] flex h-full max-w-[390px] flex-col px-4 py-6">
        <div className="mb-1 text-sm font-normal font-['Inter'] uppercase leading-tight tracking-[4.20px]">{sub || ""}</div>
        <div className="mb-4 text-5xl font-normal font-['Gilroy-Bold'] leading-10">
          {title}
        </div>
        <motion.div className="flex-1 overflow-hidden" variants={sectionVariants} initial="hidden" whileInView="show" viewport={{ amount: 0.25 }}>
          {children}
        </motion.div>
        <SectionActions title={title} share={shareText} textColor={text} onToast={onToast} inputClassName={inputClassName} buttonClassName={buttonClassName} sessionId={sessionId} testId={testId} sectionId={id} />
      </div>
    </section>
  );
};

interface StatBarProps {
  label: string;
  value: number;
  light?: boolean;
}

const StatBar: React.FC<StatBarProps> = ({ label, value, light }) => (
  <div className="mb-3">
    <div className="mb-1 flex items-center justify-between text-[12px]" style={{ opacity: 0.95 }}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
    <div className="h-2 w-full rounded-full" style={{ background: light ? "rgba(255,255,255,0.25)" : "#EEF2F7" }}>
      <motion.div
        className="h-2 rounded-full"
        style={{ background: tokens.accent2, width: `${value}%` }}
        initial={{ width: 0 }}
        whileInView={{ width: `${value}%` }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
    </div>
  </div>
);

interface CirclePercentProps {
  percent: number;
}

const CirclePercent: React.FC<CirclePercentProps> = ({ percent }) => {
  const r = 20;
  const c = 2 * Math.PI * r;
  const dash = (percent / 100) * c;
  return (
    <svg width={64} height={64} viewBox="0 0 48 48" className="shrink-0">
      <circle cx={24} cy={24} r={r} stroke="rgba(255,255,255,0.25)" strokeWidth={4} fill="none" />
      <motion.circle
        cx={24}
        cy={24}
        r={r}
        stroke={tokens.accent2}
        strokeWidth={4}
        strokeLinecap="round"
        fill="none"
        initial={{ strokeDasharray: `0 ${c}` }}
        whileInView={{ strokeDasharray: `${dash} ${c - dash}` }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ filter: "drop-shadow(0 0 6px rgba(65,217,255,0.6))" }}
      />
      <text x="50%" y="52%" textAnchor="middle" fontSize="10" fill="#fff">
        {Math.round(percent)}%
      </text>
    </svg>
  );
};

const getAuthBannerColors = (sectionIndex: number) => {
  const sectionKeys = ["emotional", "mind", "findings", "quotes", "films", "subjects", "astrology", "books", "work"];
  const currentSection = sectionKeys[sectionIndex];
  
  switch (currentSection) {
    case "quotes":
    case "subjects": 
    case "books":
      // Light sections - use dark colors
      return {
        logoFilter: "invert(0)", // Dark logo
        buttonBg: "rgba(0,0,0,0.8)", // Dark button background
        buttonText: "text-white", // Dark text
        buttonBorder: "border-black/50"
      };
    case "emotional":
    case "mind":
    case "findings":
    case "films":
    case "astrology":
    case "work":
    default:
      // Dark sections - use light colors
      return {
        logoFilter: "invert(1)", // White logo
        buttonBg: "rgba(255,255,255,0.2)", // Light button background
        buttonText: "text-white", // White text
        buttonBorder: "border-white/20"
      };
  }
};

interface AuthBannerProps {
  onSignIn: () => void;
  onPayment: () => void;
  user: User | null;
  paymentLoading: boolean;
  activeIndex?: number;
}

const AuthBanner: React.FC<AuthBannerProps> = ({ onSignIn, onPayment, user, paymentLoading, activeIndex = 0 }) => {
  const colors = getAuthBannerColors(activeIndex);
  
  const getGlassBackground = (index: number) => {
    const sectionKeys = ["emotional", "mind", "findings", "quotes", "films", "subjects", "astrology", "books", "work"];
    const currentSection = sectionKeys[index];
    
    if (currentSection === "quotes" || currentSection === "subjects" || currentSection === "books") {
      return 'rgba(255,255,255,0.15)';
    } else {
      return 'rgba(255,255,255,0.1)';
    }
  };

  return (
    <div 
      className={`fixed top-0 left-0 right-0 z-[60] px-4 transition-all duration-300 py-0`} 
      style={{ 
        backdropFilter: 'blur(16px)', 
        WebkitBackdropFilter: 'blur(16px)', 
        background: getGlassBackground(activeIndex) 
      }}
    >
      <div className="max-w-md flex items-center justify-between">
        {/* Dynamic logo color */}
        <img 
          src={logo} 
          alt="Logo" 
          className="w-20 h-14 transition-all duration-300" 
          style={{ filter: colors.logoFilter }}
        />
          <button
            onClick={onSignIn}
            className={`font-['Gilroy-Regular'] tracking-tight px-4 py-1 rounded-lg shadow-md transition-all duration-300 ${colors.buttonText} ${colors.buttonBorder}`}
            style={{ background: colors.buttonBg }}
          >
            {user ? 'Dashboard' : 'Save'}
          </button>
      </div>
    </div>
  );
};

interface PaymentSuccessMessageProps {
  userId?: string;
}

const PaymentSuccessMessage: React.FC<PaymentSuccessMessageProps> = ({ userId }) => {
  const navigate = useNavigate();

  const handleDashboardClick = () => {
    if (userId) {
      // Navigate to dashboard with userId in the URL if needed
      console.log(`Navigating to dashboard for user: ${userId}`);
      navigate(`/quest-dashboard/${userId}`);
    } else {
      // Fallback to regular dashboard route
      navigate('/quest-dashboard');
    }
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: "rgba(255,255,255,0.92)",
        borderTop: `1px solid ${tokens.border}`,
        boxShadow: "0 -6px 18px rgba(10,10,10,0.06)",
        height: CTA_HEIGHT,
      }}
    >
      <div className="mx-auto flex h-full max-w-[390px] items-center justify-between px-3" style={{ color: tokens.textDark }}>
        <div className="flex-1 pr-4">
          <div className="text-[12px] leading-4">
            Our model is analyzing your response for deeper analysis. It will be ready in 15 minutes
          </div>
        </div>
        <button
          onClick={handleDashboardClick}
          className="font-['Gilroy-semiBold'] flex items-center justify-center rounded-full px-4 py-2 text-[14px] font-[700] text-white"
          style={{
            background: `linear-gradient(135deg, ${tokens.accent} 0%, ${tokens.accent2} 60%, ${tokens.accent3} 100%)`,
            boxShadow: "0 4px 12px rgba(12,69,240,0.20)",
          }}
        >
          Dashboard
        </button>
      </div>
    </div>
  );
};

interface InsightModalProps {
  insight: {index: number, text: string} | null;
  onClose: () => void;
  attribute: string;
}

const InsightModal: React.FC<InsightModalProps> = ({ insight, onClose, attribute }) => {
 if (!insight) return null;

 // Get the same styling as the corresponding Mind Card
 const getCardStyling = (index: number) => {
   const styles = [
     { 
       bg: "bg-red-800", 
       decorative: (
         <div className="w-40 h-40 absolute top-0 left-0 opacity-20">
           <div className="w-40 h-28 left-0 top-0 absolute bg-red-400" />
           <div className="w-5 h-5 left-[50px] top-[140px] absolute bg-red-400" />
           <div className="w-5 h-5 left-[90px] top-[140px] absolute bg-red-400" />
           <div className="w-5 h-5 left-[130px] top-[140px] absolute bg-red-400" />
           <div className="w-5 h-5 left-[10px] top-[140px] absolute bg-red-400" />
         </div>
       )
     },
     { 
       bg: "bg-purple-900", 
       decorative: (
         <div className="absolute inset-0 opacity-20">
           <div className="w-28 h-11 absolute right-[20px] bottom-[40px] bg-purple-100" />
           <div className="w-16 h-24 absolute right-[50px] top-[30px] bg-purple-100" />
           <div className="w-16 h-24 absolute right-[10px] top-[20px] bg-purple-100" />
         </div>
       )
     },
     { 
       bg: "bg-stone-400", 
       decorative: (
         <div className="w-20 h-32 absolute right-[20px] top-[24px] opacity-20 bg-green-100" />
       )
     },
     { 
       bg: "bg-sky-500", 
       decorative: (
         <div className="w-36 h-32 absolute right-[10px] top-[21px] opacity-20 bg-sky-100" />
       )
     }
   ];
   return styles[index] || styles[0];
 };

 const cardStyle = getCardStyling(insight.index);

 return (
   <AnimatePresence>
     <motion.div 
       className="fixed inset-0 z-[70]" 
       initial={{ opacity: 0 }} 
       animate={{ opacity: 1 }} 
       exit={{ opacity: 0 }}
     >
       <div className="absolute inset-0 bg-black/50" onClick={onClose} />
       <motion.div
         className={`absolute inset-x-4 top-1/2 -translate-y-1/2 mx-auto max-w-[350px] min-h-[280px] rounded-[20px] ${cardStyle.bg} overflow-hidden relative`}
         initial={{ y: "50%", opacity: 0, scale: 0.9 }}
         animate={{ y: "-50%", opacity: 1, scale: 1 }}
         exit={{ y: "50%", opacity: 0, scale: 0.9 }}
         transition={{ type: "spring", stiffness: 300, damping: 25 }}
       >
         {/* Decorative Elements */}
         {/* {cardStyle.decorative} */}
         
         {/* Close Button */}
         <button 
           aria-label="Close" 
           onClick={onClose} 
           className="absolute right-4 top-4 rounded-full p-2 bg-white/20 hover:bg-white/30 transition-colors"
           style={{ zIndex: 20 }}
         >
           <X className="h-5 w-5 text-white" />
         </button>
         
         {/* Content */}
         <div className="relative z-10 p-6 pt-16">
           {/* <div className="text-4xl font-['Gilroy-Bold'] mb-4 text-white opacity-90">
             {attribute}
           </div> */}
           <div className="text-4xl font-['Gilroy-Regular'] leading-tight text-white">
             {insight.text}
           </div>
         </div>
       </motion.div>
     </motion.div>
   </AnimatePresence>
 );
};

interface FilmModalProps {
  film: Film | null;
  onClose: () => void;
}

const FilmModal: React.FC<FilmModalProps> = ({ film, onClose }) => {
  if (!film) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-[70]" 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        <motion.div
          className="absolute inset-x-4 top-1/2 -translate-y-1/2 mx-auto max-w-[350px] min-h-[400px] rounded-[20px] bg-gradient-to-b from-blue-900 to-blue-800 overflow-hidden"
          initial={{ y: "50%", opacity: 0, scale: 0.9 }}
          animate={{ y: "-50%", opacity: 1, scale: 1 }}
          exit={{ y: "50%", opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          {/* Close Button */}
          <button 
            aria-label="Close" 
            onClick={onClose} 
            className="absolute right-4 top-4 rounded-full p-2 bg-black hover:bg-white/30 transition-colors z-20"
          >
            <X className="h-5 w-5 text-white" />
          </button>
          
          {/* Film Image */}
          <div className="w-full h-48 bg-gradient-to-b from-blue-600 to-blue-700 flex items-center justify-center">
            {film.imageUrl ? (
              <img 
                src={film.imageUrl} 
                alt={film.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <Film className="h-16 w-16 text-white/60" />
            )}
          </div>
          
          {/* Content */}
          <div className="p-6">
            <h3 className="text-2xl font-['Gilroy-Bold'] text-white mb-4">
              {film.title}
            </h3>
            <p className="text-white/90 text-base font-['Gilroy-Regular'] leading-relaxed">
              {film.description}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

interface AstrologyModalProps {
  prediction: {title: string, likelihood: number, reason: string} | null;
  onClose: () => void;
}

const AstrologyModal: React.FC<AstrologyModalProps> = ({ prediction, onClose }) => {
  if (!prediction) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-[70]" 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        <motion.div
          className="absolute inset-x-4 top-1/2 -translate-y-1/2 mx-auto max-w-[350px] min-h-[320px] rounded-[20px] bg-gradient-to-b from-purple-900 to-indigo-800 overflow-hidden"
          initial={{ y: "50%", opacity: 0, scale: 0.9 }}
          animate={{ y: "-50%", opacity: 1, scale: 1 }}
          exit={{ y: "50%", opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          {/* Close Button */}
          <button 
            aria-label="Close" 
            onClick={onClose} 
            className="absolute right-4 top-4 rounded-full p-2 bg-white/20 hover:bg-white/30 transition-colors z-20"
          >
            <X className="h-5 w-5 text-white" />
          </button>
          
          {/* Content */}
          <div className="p-6 pt-16">
            {/* Percentage Circle */}
            <div className="text-center mb-6">
              <div className="text-6xl font-['Gilroy-Bold'] text-white mb-2">
                {prediction.likelihood}%
              </div>
            </div>
            
            {/* Prediction Title */}
            <h3 className="text-xl font-['Gilroy-Bold'] text-white mb-4 text-center">
              {prediction.title}
            </h3>
            
            {/* Why Explanation */}
            <div className="text-white/90">
              <p className="text-sm font-['Gilroy-semiBold'] mb-2 text-purple-200">Why:</p>
              <p className="text-base font-['Gilroy-Regular'] leading-relaxed">
                {prediction.reason}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

interface BookModalProps {
  book: Book | null;
  onClose: () => void;
}

const BookModal: React.FC<BookModalProps> = ({ book, onClose }) => {
  if (!book) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-[70]" 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        <motion.div
          className="absolute inset-x-4 top-1/2 -translate-y-1/2 mx-auto max-w-[350px] min-h-[320px] rounded-[20px] bg-gradient-to-b from-blue-800 to-blue-900 overflow-hidden"
          initial={{ y: "50%", opacity: 0, scale: 0.9 }}
          animate={{ y: "-50%", opacity: 1, scale: 1 }}
          exit={{ y: "50%", opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          {/* Close Button */}
          <button 
            aria-label="Close" 
            onClick={onClose} 
            className="absolute right-4 top-4 rounded-full p-2 bg-white/20 hover:bg-white/30 transition-colors z-20"
          >
            <X className="h-5 w-5 text-white" />
          </button>
          
          {/* Book Icon */}
          <div className="w-full h-32 bg-gradient-to-b from-blue-600 to-blue-700 flex items-center justify-center">
            <BookOpen className="h-16 w-16 text-white/80" />
          </div>
          
          {/* Content */}
          <div className="p-6">
            <h3 className="text-3xl font-['Gilroy-Bold'] text-white">
              {book.title}
            </h3>
            <p className="text-blue-200 text-lg font-['Gilroy-Regular'] mb-4">
              by {book.author}
            </p>
            <p className="text-white/90 text-2xl leading-tight font-['Gilroy-semiBold']">
              {book.description}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

interface PaymentSuccessPopupProps {
  open: boolean;
  onClose: () => void;
  userId?: string;
}

const PaymentSuccessPopup: React.FC<PaymentSuccessPopupProps> = ({ open, onClose, userId }) => {
  const navigate = useNavigate();

  const handleDashboardClick = () => {
    if (userId) {
      navigate(`/quest-dashboard/${userId}`);
    } else {
      navigate('/quest-dashboard');
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[80]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-xl p-6 max-w-md w-full mx-4 relative"
          >
            <button 
              aria-label="Close" 
              onClick={onClose} 
              className="absolute right-4 top-4 rounded-full p-2 hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
            
            <p className="text-gray-600 text-xl leading-6 font-['Gilroy-Regular'] mb-6 pr-8">
              We have received your payment. Our AI model is analyzing your response for deeper analysis. It will be ready in 15 minutes. Please check your dashboard for the status.
            </p>
            
            <button
              onClick={handleDashboardClick}
              className="px-6 py-3 text-xl font-normal font-['Gilroy-Bold'] tracking-[-1px] bg-gradient-to-br from-sky-800 to-sky-400 text-white rounded-lg hover:opacity-90 transition-colors"
            >
              Dashboard
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};


interface QuestResultFullscreenProps {
  sessionId?: string;
  testId?: string;
  className?: string;
}

const QuestResult: React.FC<QuestResultFullscreenProps> = ({  
  className = '' 
}) => {
  const [tip, setTip] = useState<string | null>(null);
  // const [resultData] = useState<ResultData>(MOCK_RESULT_DATA);
  const [resultData, setResultData] = useState<ResultData | null>(null);
  const { user, signInWithGoogle } = useAuth();
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showMeta, setShowMeta] = useState(false);
  const [upsellOpen, setUpsellOpen] = useState(false);
  const { userId, sessionId, testId } = useParams();
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const metaTimerRef = useRef<number | null>(null);
  const [selectedInsight, setSelectedInsight] = useState<{index: number, text: string} | null>(null);
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);
  const [filmModalOpen, setFilmModalOpen] = useState(false);
  const [selectedPrediction, setSelectedPrediction] = useState<{title: string, likelihood: number, reason: string} | null>(null);
  const [astrologyModalOpen, setAstrologyModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [bookModalOpen, setBookModalOpen] = useState(false);

  const sectionIds = ["emotional", "mind", "findings", "quotes", "films", "subjects", "astrology", "books", "work"];
  
  const navigate = useNavigate();

  const handleAuthAction = () => {
    if (user) {
      navigate(`/quest-dashboard/${userId}`); // or wherever your dashboard is
    } else {
      handleSignIn();
    }
  };

  const handleCardClick = (index: number) => {
      const insight = mindCard?.insights[index];
      if (insight) {
        setSelectedInsight({ index, text: insight });
      }
    };

  useEffect(() => {
    if (!tip) return;
    const t = setTimeout(() => setTip(null), 2000);
    return () => clearTimeout(t);
  }, [tip]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    
    const handler = () => {
      const rect = el.getBoundingClientRect();
      let best = 0;
      let bestDist = Infinity;
      
      sectionIds.forEach((id, i) => {
        const s = document.getElementById(id);
        if (!s) return;
        const r = s.getBoundingClientRect();
        const dist = Math.abs(r.top - rect.top);
        if (dist < bestDist) { 
          bestDist = dist; 
          best = i; 
        }
      });
      
      setActiveIndex(best);
      setShowMeta(true);
      
      if (metaTimerRef.current) window.clearTimeout(metaTimerRef.current);
      metaTimerRef.current = window.setTimeout(() => setShowMeta(false), 1500);
    };
    
    el.addEventListener('scroll', handler, { passive: true });
    handler();
    
    return () => {
      el.removeEventListener('scroll', handler);
      if (metaTimerRef.current) window.clearTimeout(metaTimerRef.current);
      // if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    };
  }, [sectionIds]);

  // Mock API handlers (commented real implementation)
  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      toast.success('Successfully signed in!');
    } catch (error) {
      console.error('Sign-in error:', error);
      toast.error('Sign-in failed. Please try again.');
    }
  };
  
  const handlePayment = async (): Promise<void> => {
    if (!user?.id) {
      toast.error('Please save your analysis first');
      return;
    }
    
    if (!sessionId || !testId) {
      toast.error('Missing session information. Please try again.');
      console.error('Missing URL parameters:', { sessionId, testId });
      return;
    }
    
    setPaymentLoading(true);
    try {
      // console.log('Payment attempt with:', { sessionId, testId, userId: user?.id });
      
      const paymentResult = await PaymentService.startPayment(sessionId, testId);
      
      if (paymentResult.success) {
        toast.success('Payment successful!');
        setPaymentSuccess(true);
        setShowSuccessPopup(true);
        setUpsellOpen(false); // Close the modal on success
      } else {
        const errorMessage = paymentResult.error || 'Payment failed.';
        // console.error('Payment failed:', errorMessage);
        toast.error(errorMessage);
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      
      // Better error handling
      let errorMessage = 'Payment failed. Please try again.';
      
      if (error.message) {
        if (error.message.includes('Network error')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else if (error.message.includes('Server error')) {
          errorMessage = 'Server error. Please try again in a few moments.';
        } else if (error.message.includes('Authentication')) {
          errorMessage = 'Authentication required. Please sign in and try again.';
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleCloseSuccessPopup = () => {
    setShowSuccessPopup(false);
  };

  useEffect(() => {
  console.log('Payment flow state:', {
    user: user?.id,
    sessionId,
    testId,
    paymentLoading,
    paymentSuccess,
    upsellOpen
  });
}, [user?.id, sessionId, testId, paymentLoading, paymentSuccess, upsellOpen]);



// fetch result from the database
  useEffect(() => {
    const fetchResultData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `https://api.fraterny.in/api/report/${userId}/${sessionId}/${testId}`, 
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );
        console.log('API response:', response.data);
        
        const analysisData = response.data;
        if (typeof analysisData.results === 'string') {
          try {
            // Clean the JSON string before parsing
            let cleanedResults = analysisData.results
              .replace(/sixty-five/g, '65')  // Fix the specific issue
              .replace(/:\s*([a-zA-Z-]+),/g, ': "$1",');  // Quote unquoted strings
            
            analysisData.results = JSON.parse(cleanedResults);
          } catch (parseError) {
            console.error('JSON parse error:', parseError);
            // Fallback to empty results
            analysisData.results = {};
          }
        }
        
        const validatedData = validateResultData(analysisData);
        setResultData(validatedData);
        setIsLoading(false);
      } catch (axiosError: any) {
        if (axiosError.code === 'ECONNABORTED') {
          throw new Error('Request timeout - analysis may still be processing');
        } else if (axiosError.response?.status === 404) {
          throw new Error('Analysis not found - please try again later');
        } else if (axiosError.response?.status === 401) {
          throw new Error('Unauthorized access - please log in again');
        } else {
          throw new Error(`Network error: ${axiosError.message}`);
        }
      }
    };

    if (sessionId && testId) {
      fetchResultData();
    }
  }, [sessionId, userId, testId]);

  // Add this useEffect to update URL when user signs in
  useEffect(() => {
    if (user?.id && userId === 'anonymous' && sessionId && testId) {
      console.log('User authenticated, updating URL from anonymous to:', user.id);
      const newUrl = `/quest-result/result/${user.id}/${sessionId}/${testId}`;
      navigate(newUrl, { replace: true });
    }
  }, [user?.id, userId, sessionId, testId, navigate]);

  if (!resultData) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your results...</p>
      </div>
    </div>
  );
}


  const mindCard = resultData.results["Mind Card"];
  const findings = resultData.results.findings || [];
  const quotes = resultData.results.quotes || [];
  const films = resultData.results.films || [];
  const subjects = resultData.results.subjects || [];
  const astrology = resultData.results.astrology;
  const books = resultData.results.books || [];
  const actionItem = resultData.results.actionItem || '';

  // Convert mind card data to stats format
  const mindStats = mindCard?.attributes.map((attr, index) => {
    const scoreText = mindCard.scores[index] || "0/100";
    const scoreValue = parseInt(scoreText.split('/')[0]);
    return {
      label: attr.charAt(0).toUpperCase() + attr.slice(1),
      value: scoreValue
    };
  }) || [];

  return (
    <div className={`min-h-screen w-full bg-white text-gray-900 ${className}`}>
          {/* Auth Banner */}
          <AuthBanner 
            onSignIn={handleAuthAction}
            onPayment={handlePayment}
            user={user}
            paymentLoading={paymentLoading}
            activeIndex={activeIndex}
          />
    
          {/* Main Content */}
          <div
            className="mx-auto max-w-[390px] overflow-y-auto"
            ref={containerRef}
            style={{ 
              scrollSnapType: "y mandatory", 
              height: `calc(100vh - ${CTA_HEIGHT}px`,
            }}
          >
            {/* Intro helper bubble */}
            {/* <div className="pointer-events-none absolute left-20 top-5 z-40 rounded-2xl bg-white px-3 py-2 text-[12px] leading-4" style={{ border: `1px solid ${tokens.border}`, boxShadow: "0 10px 30px rgba(12,69,240,0.06)" }}>
              Here's what I've learned about you…
            </div> */}
    
            {/* Emotional Mirror Section */}
            {/* <SectionFrame 
              id="emotional" 
              title="Emotional Mirror" 
              sub="Your mind, in one sentence." 
              shareText={resultData.results["section 1"] || ""} 
              themeKey="emotional" 
              onToast={onToast}
            >
              <div className="flex h-full flex-col items-center justify-center text-left tracking-tight">
                <div className="rounded-3xl px-4 py-3 text-[18px] leading-7" style={{ background: "rgba(255,255,255,0.15)" }}>
                  {resultData.results["section 1"]}
                </div>
              </div>
            </SectionFrame> */}
    
            <SectionFrame 
              id="emotional" 
              title="" 
              sub="" 
              shareText={resultData.results["section 1"] || ""} 
              themeKey="emotional" 
              sessionId={sessionId}
              customClass="pb-16"
             testId={testId}
            >
              <div className="relative w-full max-w-[480px] mx-auto pt-4">
                <motion.h1 className="mb-5 text-left">
                  <span className="block text-sm uppercase tracking-[0.3em] text-white/70 mb-1">Analysis Complete</span>
                  <span className="block text-5xl font-['Gilroy-Bold'] tracking-tighter bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
                    Let's explore Your Mind
                  </span>
                  <span className="block mt-1 w-20 h-1 bg-white/50 rounded-full"></span>
                </motion.h1>
    
                <motion.div className="rounded-[28px] bg-white/10 backdrop-blur-xl ring-1 ring-white/20 p-6 text-white">
                  <p className="text-sm text-white/80 font-['Gilroy-Regular']">Your mind, in one sentence.</p>
                  <h2 className="mt-1 text-[44px] leading-[0.95] font-['Gilroy-Bold'] tracking-tighter">Emotional<br />Mirror</h2>
    
                  <div className="mt-2 rounded-3xl font-['Gilroy-Regular'] bg-white text-slate-900 p-2 shadow-[0_10px_30px_rgba(0,0,0,.12)]">
                    <p className="text-xl leading-tight p-2">{resultData.results["section 1"]}</p>
                  </div>
                </motion.div>
              </div>
            </SectionFrame>
    
            {/* Mind Card Section */}
            <SectionFrame 
              id="mind" 
              title="Your Mind Card" 
              sub="Archetype & stats" 
              shareText={`${mindCard?.name || 'Mind Card'}; ${mindStats.map(s => `${s.label} ${s.value}`).join(', ')}.`}
              themeKey="mind" 
              customClass="pt-16 pb-16"
              sessionId={sessionId}
              testId={testId}
            >
              <div className="grid grid-rows-[auto_1fr] gap-4">
                {mindCard && (
                  <>
                    <div className="text-left">
                      <div className="text-teal-900 text-4xl font-normal font-['Gilroy-Bold'] leading-7 pb-2">{mindCard.name}</div>
                      <div className="text-white/80 text-base font-normal font-['Gilroy-Regular'] leading-tight] ">{mindCard.personality}</div>
                    </div>
                    <div className="overflow-x-auto">
                      <div  className="flex gap-4 pb-4" style={{ width: "max-content" }}>
                        {mindStats.map((stat, i) => {
                          const colors = [
                            { bg: "bg-red-800", decorative: "bg-red-400" },
                            { bg: "bg-purple-900", decorative: "bg-purple-100" },
                            { bg: "bg-stone-400", decorative: "bg-green-100" },
                            { bg: "bg-sky-500", decorative: "bg-sky-100" }
                          ];
                          
                          return (
                            <div onClick={() => handleCardClick(i)} key={stat.label} className={`relative w-60 h-60 ${colors[i].bg} rounded-[10px] overflow-hidden flex-shrink-0`}>
                              {/* Decorative Elements */}
                              {/* {i === 0 && (
                                <div className="w-40 h-40 relative opacity-30">
                                    <div className="w-40 h-28 left-0 top-0 absolute bg-red-400" />
                                    <div className="w-5 h-5 left-[50.20px] top-[139.62px] absolute bg-red-400" />
                                    <div className="w-5 h-5 left-[89.41px] top-[139.62px] absolute bg-red-400" />
                                    <div className="w-5 h-5 left-[130.20px] top-[139.62px] absolute bg-red-400" />
                                    <div className="w-5 h-5 left-[9.41px] top-[139.62px] absolute bg-red-400" />
                                </div>
                              )}
                              {i === 1 && (
                                <>
                                  <div className="w-28 h-11 absolute left-[136.37px] top-[123.25px] bg-purple-100" />
                                  <div className="w-16 h-24 absolute left-[110.17px] top-[26.06px] bg-purple-100" />
                                  <div className="w-16 h-24 absolute left-[189.45px] top-[15.74px] bg-purple-100" />
                                </>
                              )}
                              {i === 2 && (
                                <div className="w-20 h-32 absolute left-[169px] top-[24px] opacity-30 mix-blend-soft-light bg-green-100" />
                              )}
                              {i === 3 && (
                                <div className="w-36 h-32 absolute left-[143px] top-[21px] opacity-30 mix-blend-hard-light bg-sky-100" />
                              )} */}
                              
                              {/* Title */}
                              <div className="absolute left-[20px] top-[21px] opacity-70 mix-blend-hard-light text-white text-3xl font-normal font-['Gilroy-Bold'] leading-9">
                                {stat.label.split(' ').map((word, idx) => (
                                  <div key={idx}>{word}</div>
                                ))}
                              </div>
                              
                              {/* Percentage */}
                              <div className="absolute left-[20px] top-[141px] opacity-90 text-white text-8xl font-normal font-['Gilroy-Bold'] leading-[96.45px]">
                                {stat.value}%
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </SectionFrame>
    
            {/* Findings Section */}
            <SectionFrame 
              id="findings" 
              title="5 Unique Findings About You" 
              sub="Thought Provoking Insights" 
              shareText={findings.join("\n")} 
              themeKey="findings" 
              customClass="pt-14 pb-16"
              sessionId={sessionId}
              testId={testId}
            >
              <div className="w-full">
                <div className="grid grid-cols-2 gap-3 auto-rows-min">
                  {findings.slice(0, 4).map((finding, i) => (
                    <div 
                      key={i} 
                      className="bg-[#7dc3e4] rounded-lg p-3 min-h-[80px] flex items-start"
                    >
                      <div className="text-white text-sm font-normal font-['Gilroy-Regular'] leading-tight">
                        {finding}
                      </div>
                    </div>
                  ))}
                  {findings[4] && (
                    <div className="col-span-2 bg-[#7dc3e4] rounded-lg p-3 min-h-[80px] flex items-start">
                      <div className="text-white text-sm font-normal font-['Gilroy-Regular'] leading-tight">
                        {findings[4]}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </SectionFrame>
    
            {/* Quotes Section */}
            <SectionFrame 
              id="quotes" 
              title="Philosophical Quotes That Mirrors Your Psyche" 
              sub="Save the ones that hit" 
              shareText={quotes.map((q) => `"${q.text}" — ${q.author}`).join("\n")} 
              themeKey="quotes" 
               inputClassName="placeholder:text-gray-700 bg-gray-100/30 text-gray-800 border border-gray-300"
              buttonClassName="bg-blue-600 text-white hover:bg-blue-700 border border-blue-600" 
              customClass="pt-12 pb-24"
              sessionId={sessionId}
              testId={testId}
            >
              <ul className="grid content-center gap-3 overflow-y-auto">
                {quotes.map((quote, i) => (
                  <li key={i} className="rounded-2xl bg-white p-3" style={{ border: `1px solid ${tokens.border}` }}>
                    <div className="flex items-start gap-2">
                      <Quote className="mt-0.5 h-4 w-4" color={tokens.accent} />
                      <div>
                        <div className="text-[15px] font-['Inter'] leading-tight">"{quote.text}"</div>
                        <div className="text-[12px]" style={{ color: tokens.muted }}>— {quote.author}</div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </SectionFrame>
    
            {/* Films Section */}
            <SectionFrame 
              id="films" 
              title="Films That Will Hit Closer Than Expected" 
              sub="Weekend cues" 
              shareText={films.map((f) => `${f.title} — ${f.description}`).join("\n")} 
              themeKey="films" 
              customClass="pt-16 pb-16"
              sessionId={sessionId}
              testId={testId}
            >
              <div className="overflow-x-auto">
                <div className="flex gap-4 pb-1" style={{ width: "max-content" }}>
                  {films.map((film, i) => (
                    <div 
                      key={i} 
                      className="flex flex-col items-center gap-3 flex-shrink-0 cursor-pointer"
                      onClick={() => {
                        setSelectedFilm(film);
                        setFilmModalOpen(true);
                      }}
                    >
                      {/* Film Card */}
                      <div className="w-40 h-48 relative rounded-lg shadow-[0px_8px_20px_0px_rgba(12,69,240,0.22)] overflow-hidden bg-gradient-to-b from-blue-600 to-blue-700 flex items-center justify-center">
                        {film.imageUrl ? (
                          <img 
                            src={film.imageUrl} 
                            alt={film.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Film className="h-16 w-16 text-white/60" />
                        )}
                      </div>
                      
                      {/* Film Title */}
                      <div className="w-36 text-center">
                        <div className="text-white text-lg font-bold font-['Inter'] leading-normal">
                          {film.title}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SectionFrame>
    
            {/* Subjects Section */}
            <SectionFrame 
              id="subjects" 
              title="Subjects You Are Mentally Built to Explore Deeper" 
              sub="Deepen the edges" 
              shareText={subjects.map(s => `${s.title}: ${s.description}`).join("; ")} 
              themeKey="subjects" 
               inputClassName="placeholder:text-gray-700 bg-gray-100/30 text-gray-800 border border-gray-300"
              buttonClassName="bg-blue-600 text-white hover:bg-blue-700 border border-blue-600" 
              customClass="pt-12 pb-[50px]"
              sessionId={sessionId}
              testId={testId}
            >
              <div className="grid h-full content-center gap-3">
                {subjects.map((subject, i) => (
                  <div key={i} className="rounded-2xl bg-white p-3 text-[15px]" style={{ border: `1px solid ${tokens.border}` }}>
                    <div className="font-semibold text-gray-900">{subject.title}</div>
                    <div className="text-sm text-gray-600 mt-1">{subject.description}</div>
                    <div className="text-xs text-blue-600 mt-2">{subject.matchPercentage}% match</div>
                  </div>
                ))}
              </div>
            </SectionFrame>
    
            {/* Astrology Section */}
            {/* {astrology && (
              <SectionFrame 
                id="astrology" 
                title="Our Take on Astrology" 
                sub="Apologies to the cosmos" 
                shareText={astrology.description} 
                themeKey="astrology" 
                customClass="pt-12 pb-16"
                sessionId={sessionId}
                testId={testId}
              >
                <div className="flex h-full flex-col justify-center gap-4">
                  <div className="text-center">
                    <div className="text-[16px] font-['Gilroy-Bold'] text-left leading-tight">
                      You behave more like a <span className="underline">{astrology.behavioralSign}</span> than your actual sign ({astrology.actualSign}).
                    </div>
                    <div className=" text-left max-w-[320px] mt-3 opacity-90 text-sm font-['Gilroy-Regular'] leading-[1]">
                      {astrology.description}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto">
                    {astrology.predictions.slice(0, 3).map((prediction, i) => (
                      <div key={i} className="rounded-2xl bg-white/10 p-3 flex items-center gap-3">
                        <CirclePercent percent={prediction.likelihood} />
                        <div className="text-[13px] leading-5">
                          <div className="font-[600]">{prediction.title}</div>
                          <div className="opacity-90">Why: {prediction.reason}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </SectionFrame>
            )} */}
            {/* Astrology Section */}
            {astrology && (
              <SectionFrame 
                id="astrology" 
                title="Our Take on Astrology" 
                sub="Apologies to the cosmos" 
                shareText={astrology.description} 
                themeKey="astrology" 
                customClass="pt-12 pb-16"
                sessionId={sessionId}
                testId={testId}
              >
                <div className="flex h-full flex-col justify-center gap-4">
                  <div className="text-center">
                    <div className="text-[16px] font-['Gilroy-Bold'] text-left leading-tight">
                      You behave more like a <span className="underline">{astrology.behavioralSign}</span> than your actual sign ({astrology.actualSign}).
                    </div>
                    <div className="text-left max-w-[320px] mt-3 opacity-90 text-lg font-['Gilroy-Regular'] leading-[1]">
                      {astrology.description}
                    </div>
                  </div>
                  
                  {/* Predictions Cards */}
                  <div className="overflow-x-auto">
                    <div className="flex gap-4 pb-1" style={{ width: "max-content" }}>
                      {astrology.predictions.slice(0, 3).map((prediction, i) => {
                        const colors = ["bg-purple-800", "bg-indigo-700", "bg-violet-600"];
                        
                        return (
                          <div 
                            key={i} 
                            className={`relative w-60 h-60 ${colors[i]} rounded-[10px] overflow-hidden flex-shrink-0 cursor-pointer`}
                            onClick={() => {
                              setSelectedPrediction(prediction);
                              setAstrologyModalOpen(true);
                            }}
                          >
                            {/* Percentage */}
                            <div className="absolute left-[20px] top-[21px] text-white text-6xl font-normal font-['Gilroy-Bold'] leading-[60px]">
                              {prediction.likelihood}%
                            </div>
                            
                            {/* Title */}
                            <div className="absolute left-[20px] bottom-[21px] text-white text-xl font-normal font-['Gilroy-Bold'] leading-6">
                              {prediction.title.split(' ').slice(0, 3).join(' ')}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </SectionFrame>
            )}
    
            {/* Books Section */}
            <SectionFrame 
              id="books" 
              title="Books You'd Love If You Give Them a Chance" 
              sub="3 high-yield picks" 
              shareText={books.map((b) => `${b.title} — ${b.author}`).join("\n")}
              inputClassName="placeholder:text-gray-700 bg-gray-100/30 text-gray-800 border border-gray-300"
              buttonClassName="bg-blue-600 text-white hover:bg-blue-700 border border-blue-600" 
              themeKey="books" 
              customClass="pt-12 pb-12"
              sessionId={sessionId}
              testId={testId}
            >
              <div className="overflow-x-auto">
                <div className="flex gap-4 pb-1" style={{ width: "max-content" }}>
                  {books.map((book, i) => {
                    const backgrounds = ["#41D9FF", "#0C45F0", "#41D9FF"];
                    
                    return (
                      <div key={i} className="flex flex-col items-center gap-3 flex-shrink-0"
                      onClick={() => {
                          console.log('Book clicked:', book); // Add this for debugging
                          setSelectedBook(book);
                          setBookModalOpen(true);
                        }}>
                        {/* Book Card */}
                        <div 
                          className="w-40 h-48 relative rounded-lg shadow-[0px_8px_20px_0px_rgba(12,69,240,0.22)] flex items-center justify-center"
                          style={{ backgroundColor: backgrounds[i] }}
                        >
                          <BookOpen className="h-20 w-20 text-white" />
                        </div>
                        
                        {/* Book Text */}
                        <div className="w-36 text-center">
                          <div className="text-neutral-950 text-lg font-bold font-['Inter'] leading-normal">
                            {book.title}
                          </div>
                          <div className="text-gray-500 text-lg font-normal font-['Inter'] leading-normal">
                            {book.author}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </SectionFrame>
    
            {/* Action Item Section */}
            <SectionFrame 
              id="work" 
              title="One Thing To Work On" 
              sub="Start today; 60-minute cap" 
              shareText={actionItem} 
              themeKey="work" 
              customClass="pt-20"
              sessionId={sessionId}
              testId={testId}
            >
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="rounded-2xl bg-white/10 p-4 text-[16px] leading-6">
                  <div className="font-[800] mb-2">{actionItem}</div>
                  <div className="opacity-95 text-sm">Max 60 minutes • Public or private but logged • 1-line reflection afterward.</div>
                </div>
              </div>
            </SectionFrame>
            

          </div>
    
          {/* Progress Rail */}
          <div className="fixed right-2 top-1/2 z-[55] -translate-y-1/2 flex flex-col items-center gap-2">
            {sectionIds.map((id, i) => (
              <button
                key={id}
                aria-label={`Jump to ${id}`}
                onClick={() => containerRef.current?.querySelector(`#${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="transition-all"
                style={{ 
                  width: 6, 
                  height: i === activeIndex ? 20 : 6, 
                  borderRadius: 9999, 
                  background: i === activeIndex ? tokens.accent : 'rgba(10,10,10,0.25)' 
                }}
              />
            ))}
          </div>
    
          {/* Meta Counter */}
          {/* <AnimatePresence>
            {showMeta && (
              <motion.div
                className="fixed left-3 z-[55] rounded-full px-2 py-1 text-[11px]"
                style={{ bottom: CTA_HEIGHT + 8, background: 'rgba(0,0,0,0.6)', color: '#fff' }}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
              >
                {activeIndex + 1} / {sectionIds.length}
              </motion.div>
            )}
          </AnimatePresence> */}
    
    
          {/* Orb Component */}
          {/* <Orb onTip={() => setTip("Tap share on any section → native share or copy.")} /> */}
    
    
          {/* Sticky CTA + Upsell */}
          {paymentSuccess ? (
            <PaymentSuccessMessage userId={userId} />
          ) : (
            <StickyCTA onOpen={() => !paymentSuccess && setUpsellOpen(true)} />
          )}
          {!paymentSuccess && (
            <UpsellSheet 
              open={upsellOpen} 
              onClose={() => setUpsellOpen(false)}
              onPayment={handlePayment}
              paymentLoading={paymentLoading}
            />
          )}

          <PaymentSuccessPopup
            open={showSuccessPopup}
            onClose={handleCloseSuccessPopup}
            userId={userId}
          />

          <InsightModal 
            insight={selectedInsight}
            onClose={() => setSelectedInsight(null)}
            attribute={selectedInsight ? mindStats[selectedInsight.index]?.label || '' : ''}
          />

          <FilmModal 
            film={selectedFilm}
            onClose={() => {
              setSelectedFilm(null);
              setFilmModalOpen(false);
            }}
          />

          <AstrologyModal 
            prediction={selectedPrediction}
            onClose={() => {
              setSelectedPrediction(null);
              setAstrologyModalOpen(false);
            }}
          />

          <BookModal 
            book={selectedBook}
            onClose={() => {
              setSelectedBook(null);
              setBookModalOpen(false);
            }}
          />
    
          {/* Tip Tooltip */}
          <AnimatePresence>
            {tip && (
              <motion.div
                className="fixed bottom-20 right-20 z-[65] rounded-2xl bg-black/80 px-3 py-2 text-[12px] text-white max-w-48"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                {tip}
              </motion.div>
            )}
          </AnimatePresence>
    
          {/* Bottom CTA Space */}
          <div style={{ height: CTA_HEIGHT }} />
        </div>
  );
};

export default QuestResult;



