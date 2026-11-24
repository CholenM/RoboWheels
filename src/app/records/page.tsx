"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Cloud,
  Database,
  Download,
  RefreshCw,
  Search,
  Sparkles,
  ThumbsUp,
  Users,
  Star,
} from "lucide-react";
import { BrandHeader } from "@/components/BrandHeader";
import {
  downloadEvaluationsCsv,
  EvaluationRecord,
  fetchEvaluations,
} from "@/lib/evaluations";
import {
  getEmojiForScore,
  getLanguageLabel,
  LANGUAGE_OPTIONS,
  LanguageCode,
  RATING_OPTIONS,
  SURVEY_QUESTIONS,
} from "@/lib/survey-data";

export default function RecordsPage() {
  const [records, setRecords] = useState<EvaluationRecord[]>([]);
  const [storageMode, setStorageMode] = useState<"supabase" | "local">("local");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [languageFilter, setLanguageFilter] = useState<"all" | LanguageCode>(
    "all"
  );

  async function loadData() {
    setLoading(true);
    setErrorMsg(null);
    const result = await fetchEvaluations();
    setRecords(result.records);
    setStorageMode(result.storage);
    if (result.error) {
      setErrorMsg(result.error);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      const matchesLang =
        languageFilter === "all" || rec.language === languageFilter;
      const matchesSearch =
        !searchQuery.trim() ||
        rec.name.toLowerCase().includes(searchQuery.trim().toLowerCase());
      return matchesLang && matchesSearch;
    });
  }, [records, languageFilter, searchQuery]);

  const stats = useMemo(() => {
    const total = records.length;
    if (total === 0) {
      return {
        total: 0,
        overallAvg: 0,
        positivePct: 0,
        firstTimePct: 0,
        firstTimeCount: 0,
        priorYesCount: 0,
        langCounts: { english: 0, tagalog: 0, bisaya: 0 },
        questionStats: SURVEY_QUESTIONS.slice(0, 5).map((q) => ({
          question: q,
          avg: 0,
          dist: [0, 0, 0, 0, 0],
        })),
      };
    }

    let ratingSum = 0;
    let ratingCount = 0;
    let positiveCount = 0;
    let firstTimeCount = 0;
    const langCounts: Record<LanguageCode, number> = {
      english: 0,
      tagalog: 0,
      bisaya: 0,
    };

    const qKeys: Array<"q1" | "q2" | "q3" | "q4" | "q5"> = [
      "q1",
      "q2",
      "q3",
      "q4",
      "q5",
    ];
    const qSums = [0, 0, 0, 0, 0];
    const qDists = [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ];

    for (const rec of records) {
      if (rec.language in langCounts) {
        langCounts[rec.language] += 1;
      }
      if (!rec.q6) {
        firstTimeCount += 1;
      }
      qKeys.forEach((key, idx) => {
        const val = rec[key];
        ratingSum += val;
        ratingCount += 1;
        if (val >= 4) positiveCount += 1;
        qSums[idx] += val;
        if (val >= 1 && val <= 5) {
          qDists[idx][val - 1] += 1;
        }
      });
    }

    return {
      total,
      overallAvg: ratingSum / ratingCount,
      positivePct: Math.round((positiveCount / ratingCount) * 100),
      firstTimePct: Math.round((firstTimeCount / total) * 100),
      firstTimeCount,
      priorYesCount: total - firstTimeCount,
      langCounts,
      questionStats: SURVEY_QUESTIONS.slice(0, 5).map((q, idx) => ({
        question: q,
        avg: qSums[idx] / total,
        dist: qDists[idx],
      })),
    };
  }, [records]);

  const langBadgeStyles: Record<LanguageCode, string> = {
    english: "bg-sky-100 text-sky-800 border-sky-200",
    tagalog: "bg-amber-100 text-amber-800 border-amber-200",
    bisaya: "bg-orange-100 text-orange-800 border-orange-200",
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#FFFBF5] via-[#F4F9FF] to-[#FFF4EC]">
      <BrandHeader mode="records" />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Top Title + Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-sm">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0B153C]">
                Evaluation Records & Insights
              </h1>
              {storageMode === "supabase" ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                  <Cloud className="w-3.5 h-3.5" />
                  Supabase Live
                </span>
              ) : (
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold"
                  title="Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to sync to Supabase."
                >
                  <Database className="w-3.5 h-3.5" />
                  Local Browser Mode
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-slate-500">
              RoboWheels × 2026 NSTW · Real-time summary analytics and CSV
              export
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={loadData}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              <span>Refresh</span>
            </button>

            <button
              type="button"
              onClick={() => downloadEvaluationsCsv(filteredRecords)}
              disabled={filteredRecords.length === 0}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#0B153C] to-[#1D4ED8] text-white px-5 py-2.5 text-sm font-bold shadow-md hover:shadow-lg hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4 text-[#FBBF49]" />
              <span>Export CSV ({filteredRecords.length})</span>
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="rounded-2xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm font-medium text-rose-700">
            {errorMsg} (Showing local saved evaluations.)
          </div>
        )}

        {/* KPI Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/95 rounded-3xl border border-slate-200/80 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Total Evaluations
              </span>
              <span className="w-9 h-9 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </span>
            </div>
            <p className="mt-3 font-display text-3xl sm:text-4xl font-bold text-[#0B153C]">
              {stats.total}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Completed booth responses
            </p>
          </div>

          <div className="bg-white/95 rounded-3xl border border-slate-200/80 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Overall Avg Rating
              </span>
              <span className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <Star className="w-5 h-5" />
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <p className="font-display text-3xl sm:text-4xl font-bold text-[#0B153C]">
                {stats.total > 0 ? stats.overallAvg.toFixed(2) : "—"}
              </p>
              {stats.total > 0 && (
                <span className="text-sm font-semibold text-slate-400">
                  / 5.0 {getEmojiForScore(Math.round(stats.overallAvg))}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Across questions Q1 – Q5
            </p>
          </div>

          <div className="bg-white/95 rounded-3xl border border-slate-200/80 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Positive Ratings
              </span>
              <span className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <ThumbsUp className="w-5 h-5" />
              </span>
            </div>
            <p className="mt-3 font-display text-3xl sm:text-4xl font-bold text-emerald-700">
              {stats.total > 0 ? `${stats.positivePct}%` : "—"}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Rated 🙂 (4) or 🤩 (5)
            </p>
          </div>

          <div className="bg-white/95 rounded-3xl border border-slate-200/80 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                First-Time Robot Users
              </span>
              <span className="w-9 h-9 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </span>
            </div>
            <p className="mt-3 font-display text-3xl sm:text-4xl font-bold text-[#E6552E]">
              {stats.total > 0 ? `${stats.firstTimePct}%` : "—"}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {stats.firstTimeCount} first-timers · {stats.priorYesCount}{" "}
              experienced
            </p>
          </div>
        </section>

        {/* Visual Analytics Row */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Per-Question Average & Emoji Breakdown */}
          <div className="lg:col-span-2 bg-white/95 rounded-3xl border border-slate-200/80 p-6 shadow-sm">
            <h2 className="font-display text-xl font-bold text-[#0B153C] mb-4">
              Question Ratings Summary (Q1 – Q5)
            </h2>

            <div className="space-y-4">
              {stats.questionStats.map(({ question, avg, dist }) => {
                const pct = stats.total > 0 ? (avg / 5) * 100 : 0;
                return (
                  <div
                    key={question.id}
                    className="rounded-2xl bg-slate-50/80 border border-slate-100 p-3.5"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xl">{question.icon}</span>
                        <span className="font-semibold text-sm text-[#0B153C] truncate">
                          Q{question.number}. {question.shortLabel}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-[#0B153C] shrink-0">
                        {stats.total > 0 ? `${avg.toFixed(2)} / 5` : "—"}
                      </span>
                    </div>

                    <div className="w-full h-2.5 bg-slate-200/80 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#2EB5F4] via-[#FBBF49] to-[#E6552E] transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    {stats.total > 0 && (
                      <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                        {RATING_OPTIONS.map((opt, idx) => (
                          <span
                            key={opt.value}
                            className="inline-flex items-center gap-1 rounded-full bg-white border border-slate-200/80 px-2 py-0.5 font-medium"
                          >
                            <span>{opt.emoji}</span>
                            <span>{dist[idx]}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Language & Q6 Charts */}
          <div className="space-y-5">
            {/* Language Breakdown */}
            <div className="bg-white/95 rounded-3xl border border-slate-200/80 p-6 shadow-sm">
              <h2 className="font-display text-xl font-bold text-[#0B153C] mb-4">
                Responses by Language
              </h2>
              <div className="space-y-4">
                {LANGUAGE_OPTIONS.map((lang) => {
                  const count = stats.langCounts[lang.code];
                  const pct =
                    stats.total > 0
                      ? Math.round((count / stats.total) * 100)
                      : 0;
                  return (
                    <div key={lang.code}>
                      <div className="flex items-center justify-between text-sm font-semibold mb-1.5">
                        <span className="text-[#0B153C]">{lang.name}</span>
                        <span className="text-slate-500">
                          {count} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${lang.gradientClass} transition-all duration-500`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Q6 Split */}
            <div className="bg-white/95 rounded-3xl border border-slate-200/80 p-6 shadow-sm">
              <h2 className="font-display text-xl font-bold text-[#0B153C] mb-1">
                Q6: Prior Robot Interaction
              </h2>
              <p className="text-xs text-slate-500 mb-4">
                Have you ever experienced interacting with a robot?
              </p>

              {stats.total > 0 ? (
                <>
                  <div className="w-full h-4 rounded-full overflow-hidden flex bg-slate-100">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-500"
                      style={{
                        width: `${Math.round(
                          (stats.priorYesCount / stats.total) * 100
                        )}%`,
                      }}
                    />
                    <div
                      className="bg-[#2EB5F4] h-full transition-all duration-500"
                      style={{
                        width: `${stats.firstTimePct}%`,
                      }}
                    />
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-center">
                    <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3">
                      <div className="text-2xl">👍</div>
                      <div className="font-display text-xl font-bold text-emerald-700 mt-1">
                        {stats.priorYesCount}
                      </div>
                      <div className="text-xs font-semibold text-emerald-800">
                        Yes ({100 - stats.firstTimePct}%)
                      </div>
                    </div>
                    <div className="rounded-2xl bg-sky-50 border border-sky-200 p-3">
                      <div className="text-2xl">👎</div>
                      <div className="font-display text-xl font-bold text-sky-700 mt-1">
                        {stats.firstTimeCount}
                      </div>
                      <div className="text-xs font-semibold text-sky-800">
                        No / 1st Time ({stats.firstTimePct}%)
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-sm text-slate-400 text-center py-6">
                  No responses yet
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Records Table */}
        <section className="bg-white/95 rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="font-display text-xl font-bold text-[#0B153C]">
              All Evaluation Entries ({filteredRecords.length})
            </h2>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name..."
                  className="w-full sm:w-56 rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-3 py-2 text-sm focus:bg-white focus:border-[#2EB5F4] focus:outline-none"
                />
              </div>

              <select
                value={languageFilter}
                onChange={(e) =>
                  setLanguageFilter(e.target.value as "all" | LanguageCode)
                }
                aria-label="Filter by language"
                className="rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-sm font-semibold text-slate-700 focus:bg-white focus:border-[#2EB5F4] focus:outline-none"
              >
                <option value="all">All Languages</option>
                <option value="english">English</option>
                <option value="tagalog">Tagalog</option>
                <option value="bisaya">Bisaya</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-16 text-center text-slate-400 text-sm">
                Loading evaluation records...
              </div>
            ) : filteredRecords.length === 0 ? (
              <div className="py-16 text-center px-4">
                <div className="text-4xl mb-2">📋</div>
                <p className="font-display text-lg font-bold text-[#0B153C]">
                  No evaluation records yet
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  Submit an evaluation from the main dashboard and it will
                  appear here right away.
                </p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/90 text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200/80">
                    <th className="py-3.5 px-4 font-bold">Name</th>
                    <th className="py-3.5 px-3 font-bold">Language</th>
                    <th className="py-3.5 px-2.5 font-bold text-center">Q1</th>
                    <th className="py-3.5 px-2.5 font-bold text-center">Q2</th>
                    <th className="py-3.5 px-2.5 font-bold text-center">Q3</th>
                    <th className="py-3.5 px-2.5 font-bold text-center">Q4</th>
                    <th className="py-3.5 px-2.5 font-bold text-center">Q5</th>
                    <th className="py-3.5 px-3 font-bold text-center">
                      Q6 (Prior)
                    </th>
                    <th className="py-3.5 px-4 font-bold">Date & Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredRecords.map((rec) => (
                    <tr
                      key={rec.id}
                      className="hover:bg-sky-50/40 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-semibold text-[#0B153C] whitespace-nowrap">
                        {rec.name}
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                            langBadgeStyles[rec.language]
                          }`}
                        >
                          {getLanguageLabel(rec.language)}
                        </span>
                      </td>
                      {[rec.q1, rec.q2, rec.q3, rec.q4, rec.q5].map(
                        (score, idx) => (
                          <td
                            key={idx}
                            className="py-3.5 px-2.5 text-center whitespace-nowrap"
                            title={`Q${idx + 1}: ${score}/5`}
                          >
                            <span className="inline-flex items-center gap-1 rounded-lg bg-slate-50 border border-slate-200/70 px-2 py-0.5 text-xs font-bold text-slate-700">
                              <span className="text-base">
                                {getEmojiForScore(score)}
                              </span>
                              <span>{score}</span>
                            </span>
                          </td>
                        )
                      )}
                      <td className="py-3.5 px-3 text-center whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                            rec.q6
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-sky-50 text-sky-700 border border-sky-200"
                          }`}
                        >
                          <span>{rec.q6 ? "👍 Yes" : "👎 No"}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                        {new Date(rec.created_at).toLocaleString("en-PH", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
