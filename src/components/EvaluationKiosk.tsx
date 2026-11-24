"use client";

import { useState, FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  UserRound,
  Globe2,
} from "lucide-react";
import { BrandHeader } from "./BrandHeader";
import {
  BOOLEAN_OPTIONS,
  getEmojiForScore,
  LANGUAGE_OPTIONS,
  LanguageCode,
  RATING_OPTIONS,
  SURVEY_QUESTIONS,
  UI_STRINGS,
} from "@/lib/survey-data";
import { submitEvaluation } from "@/lib/evaluations";

type Step = "language" | "name" | "questions" | "thankyou";

interface AnswersState {
  q1?: number;
  q2?: number;
  q3?: number;
  q4?: number;
  q5?: number;
  q6?: boolean;
}

export function EvaluationKiosk() {
  const [step, setStep] = useState<Step>("language");
  const [language, setLanguage] = useState<LanguageCode>("english");
  const [name, setName] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswersState>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [savedName, setSavedName] = useState<string>("");

  const t = UI_STRINGS[language];
  const currentQuestion = SURVEY_QUESTIONS[questionIndex];
  const totalQuestions = SURVEY_QUESTIONS.length;

  function handleSelectLanguage(code: LanguageCode) {
    setLanguage(code);
    setErrorMsg(null);
    setStep("name");
  }

  function handleNameSubmit(e: FormEvent) {
    e.preventDefault();
    setQuestionIndex(0);
    setStep("questions");
  }

  function handleSkipName() {
    setName("");
    setQuestionIndex(0);
    setStep("questions");
  }

  function handleBack() {
    setErrorMsg(null);
    if (step === "name") {
      setStep("language");
      return;
    }
    if (step === "questions") {
      if (questionIndex > 0) {
        setQuestionIndex((prev) => prev - 1);
      } else {
        setStep("name");
      }
    }
  }

  function handleSelectRating(score: 1 | 2 | 3 | 4 | 5) {
    if (isSubmitting) return;
    const qId = currentQuestion.id as "q1" | "q2" | "q3" | "q4" | "q5";
    setAnswers((prev) => ({ ...prev, [qId]: score }));

    // Brief beat so kids see their selected emoji light up before advancing
    setTimeout(() => {
      if (questionIndex < totalQuestions - 1) {
        setQuestionIndex((prev) => prev + 1);
      }
    }, 240);
  }

  async function handleSelectBoolean(value: boolean) {
    if (isSubmitting) return;
    const finalAnswers = { ...answers, q6: value };
    setAnswers(finalAnswers);
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const cleanName = name.trim();
      await submitEvaluation({
        name: cleanName || "Anonymous",
        language,
        q1: finalAnswers.q1 ?? 3,
        q2: finalAnswers.q2 ?? 3,
        q3: finalAnswers.q3 ?? 3,
        q4: finalAnswers.q4 ?? 3,
        q5: finalAnswers.q5 ?? 3,
        q6: value,
      });
      setSavedName(cleanName);
      setStep("thankyou");
    } catch {
      setErrorMsg(t.submitError);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleReset() {
    setStep("language");
    setName("");
    setSavedName("");
    setQuestionIndex(0);
    setAnswers({});
    setErrorMsg(null);
    setIsSubmitting(false);
  }

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-gradient-to-br from-[#FFFBF5] via-[#F4F9FF] to-[#FFF4EC]">
      {/* Subtle decorative background blobs inspired by RoboWheels & 2026 NSTW logos */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -top-24 -left-24 w-80 h-80 rounded-full bg-[#2EB5F4]/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-1/3 -right-24 w-96 h-96 rounded-full bg-[#FBBF49]/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -bottom-24 left-1/3 w-80 h-80 rounded-full bg-[#E6552E]/12 blur-3xl"
      />

      <BrandHeader mode="survey" onLogoClick={handleReset} />

      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 py-6 sm:py-10">
        {/* STEP 1: LANGUAGE SELECTION */}
        {step === "language" && (
          <section
            key="step-language"
            className="w-full max-w-4xl animate-pop-in"
          >
            {/* Highlighted Dual-Logo Hero Card */}
            <div className="bg-white/95 backdrop-blur-md border-2 border-white shadow-[0_12px_40px_rgba(11,21,60,0.08)] rounded-[2rem] p-6 sm:p-10 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-[#0B153C] text-xs sm:text-sm font-bold tracking-wide uppercase mb-5">
                <Sparkles className="w-4 h-4 text-[#E6552E]" />
                <span>Event Evaluation Dashboard</span>
              </div>

              {/* Prominent Highlighted Logos */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-7">
                <div className="bg-gradient-to-b from-slate-50 to-white border border-slate-100 rounded-3xl px-6 py-4 shadow-sm">
                  <img
                    src="/logos/robowheels.png"
                    alt="RoboWheels: Innovation for Every-Juan"
                    className="h-24 sm:h-32 w-auto object-contain mx-auto animate-float-slow"
                  />
                </div>
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#0B153C] text-[#FBBF49] font-display font-bold text-xl shadow-md">
                  ×
                </div>
                <div className="bg-gradient-to-b from-slate-50 to-white border border-slate-100 rounded-3xl px-6 py-4 shadow-sm">
                  <img
                    src="/logos/nstw-2026.png"
                    alt="2026 NSTW"
                    className="h-20 sm:h-28 w-auto object-contain mx-auto"
                  />
                </div>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#0B153C] tracking-tight">
                Choose Your Language
              </h1>
              <p className="mt-2 text-slate-600 text-base sm:text-lg max-w-xl mx-auto">
                Pumili ng Wika · Pilia ang Imong Pinulongan
              </p>

              {/* 3 Big Language Option Cards */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
                {LANGUAGE_OPTIONS.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleSelectLanguage(lang.code)}
                    className={`group relative overflow-hidden rounded-3xl bg-white border-2 ${lang.borderClass} p-6 text-left shadow-sm hover:shadow-xl hover:-translate-y-1 active:scale-[0.98] transition-all cursor-pointer`}
                  >
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br ${lang.gradientClass} text-white font-display font-bold text-lg shadow-md mb-4 group-hover:scale-110 transition-transform`}
                    >
                      {lang.badge}
                    </div>
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0B153C] flex items-center justify-between">
                      <span>{lang.nativeLabel}</span>
                      <ArrowRight className="w-6 h-6 text-slate-400 group-hover:text-[#0B153C] group-hover:translate-x-1 transition-all" />
                    </h2>
                    <p className="mt-1.5 text-sm text-slate-600 font-medium">
                      {lang.subtitle}
                    </p>
                  </button>
                ))}
              </div>

              <p className="mt-7 text-xs sm:text-sm text-slate-400 flex items-center justify-center gap-1.5">
                <Globe2 className="w-4 h-4" />
                <span>6 quick emoji questions · Takes less than 1 minute!</span>
              </p>
            </div>
          </section>
        )}

        {/* STEP 2: ENTER NAME (OPTIONAL FOR SHY KIDS) */}
        {step === "name" && (
          <section
            key="step-name"
            className="w-full max-w-xl animate-pop-in"
          >
            <div className="bg-white/95 backdrop-blur-md border-2 border-white shadow-[0_12px_40px_rgba(11,21,60,0.08)] rounded-[2rem] p-6 sm:p-10">
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-[#0B153C] transition-colors cursor-pointer mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t.backBtn}</span>
              </button>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-amber-100 text-[#0B153C] mb-4 shadow-inner">
                  <UserRound className="w-8 h-8 text-amber-600" />
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0B153C]">
                  {t.nameTitle}
                </h2>
                <p className="mt-2 text-slate-600 text-base">
                  {t.nameSubtitle}
                </p>
              </div>

              <form onSubmit={handleNameSubmit} className="mt-7 space-y-4">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.namePlaceholder}
                  autoFocus
                  maxLength={60}
                  className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50/70 px-5 py-4 text-lg sm:text-xl font-semibold text-[#0B153C] placeholder:text-slate-400 focus:border-[#2EB5F4] focus:bg-white focus:outline-none focus:ring-4 focus:ring-sky-100 transition-all text-center"
                />

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#0B153C] to-[#1E3A8A] text-white font-display text-xl font-semibold py-4 px-6 shadow-lg hover:shadow-xl hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <span>{t.continueBtn}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={handleSkipName}
                  className="w-full rounded-2xl border-2 border-dashed border-slate-200 text-slate-500 hover:border-slate-300 hover:text-[#0B153C] hover:bg-slate-50 font-semibold py-3.5 px-6 text-sm sm:text-base transition-all cursor-pointer"
                >
                  {t.skipNameBtn}
                </button>
              </form>
            </div>
          </section>
        )}

        {/* STEP 3: ONE-QUESTION-AT-A-TIME EMOJI EVALUATION */}
        {step === "questions" && currentQuestion && (
          <section
            key={`step-q-${currentQuestion.id}`}
            className="w-full max-w-3xl animate-pop-in"
          >
            <div className="bg-white/95 backdrop-blur-md border-2 border-white shadow-[0_12px_40px_rgba(11,21,60,0.08)] rounded-[2rem] p-6 sm:p-10">
              {/* Top Bar: Back + Progress Pill */}
              <div className="flex items-center justify-between gap-4 mb-5">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-[#0B153C] disabled:opacity-40 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{t.backBtn}</span>
                </button>

                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs sm:text-sm font-bold">
                  {t.questionProgress(questionIndex + 1, totalQuestions)}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-8">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#2EB5F4] via-[#FBBF49] to-[#E6552E] transition-all duration-300"
                  style={{
                    width: `${((questionIndex + 1) / totalQuestions) * 100}%`,
                  }}
                />
              </div>

              {/* Question Prompt */}
              <div className="text-center max-w-2xl mx-auto">
                <div className="text-4xl sm:text-5xl mb-3 select-none">
                  {currentQuestion.icon}
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0B153C] leading-snug">
                  {currentQuestion.text[language]}
                </h2>
                <p className="mt-2.5 text-sm sm:text-base text-slate-500 font-medium">
                  {currentQuestion.type === "rating"
                    ? t.tapEmojiHint
                    : t.tapYesNoHint}
                </p>
              </div>

              {/* Rating Scale (Q1 - Q5) */}
              {currentQuestion.type === "rating" ? (
                <div className="mt-8 grid grid-cols-5 gap-2 sm:gap-4">
                  {RATING_OPTIONS.map((opt) => {
                    const selectedScore =
                      answers[
                        currentQuestion.id as "q1" | "q2" | "q3" | "q4" | "q5"
                      ];
                    const isSelected = selectedScore === opt.value;

                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleSelectRating(opt.value)}
                        className={`group flex flex-col items-center justify-center rounded-2xl sm:rounded-3xl border-2 py-4 sm:py-6 px-1.5 sm:px-3 transition-all cursor-pointer active:scale-95 ${
                          isSelected
                            ? `${opt.activeRingClass} ring-4 scale-105 shadow-md`
                            : `border-slate-200 bg-white ${opt.bgTintClass} hover:-translate-y-1 hover:shadow-md`
                        }`}
                      >
                        <span
                          className="text-4xl sm:text-6xl leading-none select-none group-hover:scale-110 transition-transform"
                          role="img"
                          aria-label={opt.label[language]}
                        >
                          {opt.emoji}
                        </span>
                        <span
                          className={`mt-2.5 text-[11px] sm:text-sm font-bold text-center leading-tight ${
                            isSelected ? opt.colorClass : "text-slate-700"
                          }`}
                        >
                          {opt.label[language]}
                        </span>
                        <span className="mt-1 text-[10px] sm:text-xs font-semibold text-slate-400">
                          {opt.value}/5
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                /* Yes / No Scale (Q6) */
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleSelectBoolean(true)}
                    className={`group flex flex-col items-center justify-center rounded-3xl border-2 py-7 px-6 transition-all cursor-pointer active:scale-95 disabled:opacity-60 ${
                      answers.q6 === true
                        ? "border-emerald-500 bg-emerald-50 ring-4 ring-emerald-300 shadow-md"
                        : "border-slate-200 bg-white hover:border-emerald-400 hover:bg-emerald-50/60 hover:-translate-y-1 hover:shadow-lg"
                    }`}
                  >
                    <span className="text-6xl select-none group-hover:scale-110 transition-transform">
                      {BOOLEAN_OPTIONS.yes.emoji}
                    </span>
                    <span className="mt-3 font-display text-2xl sm:text-3xl font-bold text-emerald-700">
                      {BOOLEAN_OPTIONS.yes.label[language]}
                    </span>
                    <span className="mt-1 text-sm text-slate-500 font-medium">
                      {BOOLEAN_OPTIONS.yes.sublabel[language]}
                    </span>
                  </button>

                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleSelectBoolean(false)}
                    className={`group flex flex-col items-center justify-center rounded-3xl border-2 py-7 px-6 transition-all cursor-pointer active:scale-95 disabled:opacity-60 ${
                      answers.q6 === false
                        ? "border-sky-500 bg-sky-50 ring-4 ring-sky-300 shadow-md"
                        : "border-slate-200 bg-white hover:border-sky-400 hover:bg-sky-50/60 hover:-translate-y-1 hover:shadow-lg"
                    }`}
                  >
                    <span className="text-6xl select-none group-hover:scale-110 transition-transform">
                      {BOOLEAN_OPTIONS.no.emoji}
                    </span>
                    <span className="mt-3 font-display text-2xl sm:text-3xl font-bold text-sky-700">
                      {BOOLEAN_OPTIONS.no.label[language]}
                    </span>
                    <span className="mt-1 text-sm text-slate-500 font-medium">
                      {BOOLEAN_OPTIONS.no.sublabel[language]}
                    </span>
                  </button>
                </div>
              )}

              {isSubmitting && (
                <p className="mt-6 text-center text-sm font-semibold text-sky-700 animate-pulse">
                  {t.savingText}
                </p>
              )}

              {errorMsg && (
                <p className="mt-5 text-center text-sm font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-xl py-2 px-4">
                  {errorMsg}
                </p>
              )}
            </div>
          </section>
        )}

        {/* STEP 4: THANK YOU + RESET BUTTON */}
        {step === "thankyou" && (
          <section
            key="step-thankyou"
            className="w-full max-w-xl animate-pop-in"
          >
            <div className="relative overflow-hidden bg-white/95 backdrop-blur-md border-2 border-white shadow-[0_12px_40px_rgba(11,21,60,0.08)] rounded-[2rem] p-8 sm:p-12 text-center">
              {/* Decorative playful confetti dots */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-28 overflow-hidden"
              >
                <span className="absolute left-[12%] top-2 text-2xl animate-confetti">
                  🎉
                </span>
                <span
                  className="absolute left-[32%] top-1 text-xl animate-confetti"
                  style={{ animationDelay: "0.4s" }}
                >
                  ⭐
                </span>
                <span
                  className="absolute left-[68%] top-2 text-2xl animate-confetti"
                  style={{ animationDelay: "0.8s" }}
                >
                  🤖
                </span>
                <span
                  className="absolute left-[84%] top-1 text-xl animate-confetti"
                  style={{ animationDelay: "1.2s" }}
                >
                  ✨
                </span>
              </div>

              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mb-5 shadow-inner">
                <CheckCircle2 className="w-11 h-11" />
              </div>

              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0B153C]">
                {savedName ? t.thankYouWithName(savedName) : t.thankYouTitle}
              </h2>
              <p className="mt-3 text-slate-600 text-base sm:text-lg max-w-md mx-auto">
                {t.thankYouSubtitle}
              </p>

              {/* Cute Emoji Summary Strip */}
              <div className="mt-6 inline-flex items-center gap-2 sm:gap-3 bg-slate-50 border border-slate-200/80 rounded-2xl px-4 py-2.5">
                {[answers.q1, answers.q2, answers.q3, answers.q4, answers.q5].map(
                  (score, idx) => (
                    <span
                      key={idx}
                      className="text-2xl sm:text-3xl"
                      title={`Q${idx + 1}: ${score}/5`}
                    >
                      {getEmojiForScore(score ?? 3)}
                    </span>
                  )
                )}
                <span className="text-slate-300">|</span>
                <span
                  className="text-2xl sm:text-3xl"
                  title={`Q6: ${answers.q6 ? "Yes" : "No"}`}
                >
                  {answers.q6 ? "👍" : "👎"}
                </span>
              </div>

              <div className="mt-8">
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#F59E0B] to-[#E6552E] text-white font-display text-xl font-bold py-4 px-10 shadow-lg hover:shadow-xl hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>{t.resetBtn}</span>
                </button>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="relative z-10 text-center py-4 px-4 text-xs text-slate-400">
        RoboWheels: Innovation for Every-Juan × 2026 NSTW
      </footer>
    </div>
  );
}
