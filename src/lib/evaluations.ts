import { isSupabaseConfigured, supabase } from "./supabase";
import {
  getLanguageLabel,
  LanguageCode,
  SURVEY_QUESTIONS,
} from "./survey-data";

export interface EvaluationRecord {
  id: string;
  name: string;
  language: LanguageCode;
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  q5: number;
  q6: boolean;
  created_at: string;
}

export interface NewEvaluationInput {
  name: string;
  language: LanguageCode;
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  q5: number;
  q6: boolean;
}

const LOCAL_STORAGE_KEY = "robowheels_nstw_2026_evaluations";

function readLocalEvaluations(): EvaluationRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocalEvaluations(records: EvaluationRecord[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(records));
  } catch {
    // Ignore storage quota errors
  }
}

export async function submitEvaluation(
  input: NewEvaluationInput
): Promise<{ record: EvaluationRecord; storage: "supabase" | "local" }> {
  const cleanName = input.name.trim() || "Anonymous";

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("evaluations")
      .insert([
        {
          name: cleanName,
          language: input.language,
          q1: input.q1,
          q2: input.q2,
          q3: input.q3,
          q4: input.q4,
          q5: input.q5,
          q6: input.q6,
        },
      ])
      .select()
      .single();

    if (!error && data) {
      return { record: data as EvaluationRecord, storage: "supabase" };
    }
    console.error("Supabase insert failed, falling back to localStorage:", error);
  }

  // Local fallback so the kiosk never loses a response even without Supabase keys or Wi-Fi
  const localRecord: EvaluationRecord = {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: cleanName,
    language: input.language,
    q1: input.q1,
    q2: input.q2,
    q3: input.q3,
    q4: input.q4,
    q5: input.q5,
    q6: input.q6,
    created_at: new Date().toISOString(),
  };

  const existing = readLocalEvaluations();
  writeLocalEvaluations([localRecord, ...existing]);
  return { record: localRecord, storage: "local" };
}

export async function fetchEvaluations(): Promise<{
  records: EvaluationRecord[];
  storage: "supabase" | "local";
  error?: string;
}> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("evaluations")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      return {
        records: data as EvaluationRecord[],
        storage: "supabase",
      };
    }

    return {
      records: readLocalEvaluations(),
      storage: "local",
      error: error?.message || "Could not fetch from Supabase.",
    };
  }

  return {
    records: readLocalEvaluations(),
    storage: "local",
  };
}

function escapeCsvCell(value: string | number | boolean): string {
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function buildEvaluationsCsv(records: EvaluationRecord[]): string {
  const headers = [
    "Name",
    "Language",
    ...SURVEY_QUESTIONS.map((q) => q.csvHeader),
    "Date",
  ];

  const rows = records.map((rec) => {
    const formattedDate = new Date(rec.created_at).toLocaleString("en-PH", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    return [
      rec.name,
      getLanguageLabel(rec.language),
      rec.q1,
      rec.q2,
      rec.q3,
      rec.q4,
      rec.q5,
      rec.q6 ? "Yes" : "No",
      formattedDate,
    ]
      .map(escapeCsvCell)
      .join(",");
  });

  // Add UTF-8 BOM so Excel opens special characters cleanly
  return "\uFEFF" + [headers.map(escapeCsvCell).join(","), ...rows].join("\r\n");
}

export function downloadEvaluationsCsv(records: EvaluationRecord[]): void {
  const csvContent = buildEvaluationsCsv(records);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const dateStamp = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.setAttribute(
    "download",
    `robowheels-nstw-2026-evaluations-${dateStamp}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
