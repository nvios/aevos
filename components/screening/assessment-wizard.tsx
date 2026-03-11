"use client";

import { useState, useEffect, useCallback } from "react";
import { useLocale } from "next-intl";
import { ArrowLeft, ArrowRight, BarChart3, User, Target, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  type AssessmentData,
  type ProfileData,
  type GoalsData,
  type LifestyleData,
  ASSESSMENT_STORAGE_KEY,
  ASSESSMENT_EXPIRY_DAYS,
  loadCalculatorData,
  computeAssessmentResult,
} from "@/lib/config/assessment";
import { ProfileStep, GoalsStep, LifestyleStep } from "./assessment-steps";
import { AssessmentReport } from "./assessment-report";
import { analytics } from "@/lib/analytics/events";

const TOTAL_STEPS = 3;

const DEFAULT_PROFILE: ProfileData = {
  gender: "male",
  ageRange: "26-35",
  heightCm: "",
  weightKg: "",
  activityLevel: "moderately_active",
};

const DEFAULT_GOALS: GoalsData = {
  primaryGoal: "longevity",
  secondaryGoals: [],
};

const DEFAULT_LIFESTYLE: LifestyleData = {
  exerciseAccess: [],
  trainingTime: "morning",
  scheduleConsistency: "somewhat_consistent",
  sleepQuality: "okay",
  mealPrep: "mixed",
  weeklyHours: "3to5",
};

const STEP_META: {
  title: { it: string; en: string };
  subtitle: { it: string; en: string };
  icon: typeof User;
}[] = [
    {
      title: { it: "Il tuo profilo", en: "Your profile" },
      subtitle: {
        it: "Dicci chi sei per personalizzare l'analisi",
        en: "Tell us about yourself to personalise the analysis",
      },
      icon: User,
    },
    {
      title: { it: "Obiettivi e priorità", en: "Goals & priorities" },
      subtitle: {
        it: "Cosa vuoi ottenere? Ti guidiamo verso l'approccio con il miglior ROI",
        en: "What do you want to achieve? We'll guide you to the highest-ROI approach",
      },
      icon: Target,
    },
    {
      title: { it: "Stile di vita", en: "Lifestyle" },
      subtitle: {
        it: "Quanto tempo e risorse hai? Costruiamo un piano realistico",
        en: "How much time and resources do you have? Let's build a realistic plan",
      },
      icon: Compass,
    },
  ];

export function AssessmentWizard({ locale: localeProp }: { locale?: string } = {}) {
  const localeHook = useLocale();
  const locale = localeProp || localeHook;
  const isEn = locale === "en";
  const [step, setStep] = useState(0);
  const [showReport, setShowReport] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE);
  const [goals, setGoals] = useState<GoalsData>(DEFAULT_GOALS);
  const [lifestyle, setLifestyle] = useState<LifestyleData>(DEFAULT_LIFESTYLE);

  // Load persisted data and calculator prefill on mount
  useEffect(() => {
    setMounted(true);

    // Try to restore assessment progress
    try {
      const raw = localStorage.getItem(ASSESSMENT_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const age = (Date.now() - parsed.timestamp) / (1000 * 60 * 60 * 24);
        if (age < ASSESSMENT_EXPIRY_DAYS) {
          if (parsed.profile) setProfile(parsed.profile);
          if (parsed.goals) setGoals(parsed.goals);
          if (parsed.lifestyle) setLifestyle(parsed.lifestyle);
          if (typeof parsed.step === "number" && parsed.step < TOTAL_STEPS) {
            setStep(parsed.step);
          }
          if (parsed.showReport) setShowReport(true);
          return;
        }
        localStorage.removeItem(ASSESSMENT_STORAGE_KEY);
      }
    } catch {
      /* ignore */
    }

    // Pre-fill from longevity calculator if no assessment data exists
    const calc = loadCalculatorData();
    if (calc) {
      setProfile((prev) => ({
        ...prev,
        ...(calc.gender && { gender: calc.gender }),
        ...(calc.ageRange && { ageRange: calc.ageRange }),
        ...(typeof calc.heightCm === "number" && { heightCm: calc.heightCm }),
        ...(typeof calc.weightKg === "number" && { weightKg: calc.weightKg }),
      }));
    }
  }, []);

  // Persist on change
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(
      ASSESSMENT_STORAGE_KEY,
      JSON.stringify({
        profile,
        goals,
        lifestyle,
        step,
        showReport,
        timestamp: Date.now(),
      })
    );
  }, [profile, goals, lifestyle, step, showReport, mounted]);

  const handleNext = useCallback(() => {
    if (step < TOTAL_STEPS - 1) {
      analytics.assessmentStepCompleted({ step: step + 1, total: TOTAL_STEPS });
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const data: AssessmentData = { profile, goals, lifestyle };
      const result = computeAssessmentResult(data);
      analytics.assessmentCompleted({
        overall_score: result.overallScore,
        primary_goal: goals.primaryGoal,
        activity_level: profile.activityLevel,
      });
      setShowReport(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [step, profile, goals, lifestyle]);

  const handleBack = useCallback(() => {
    if (step > 0) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [step]);

  const handleRestart = useCallback(() => {
    analytics.assessmentRestarted();
    setStep(0);
    setShowReport(false);
    setProfile(DEFAULT_PROFILE);
    setGoals(DEFAULT_GOALS);
    setLifestyle(DEFAULT_LIFESTYLE);
    localStorage.removeItem(ASSESSMENT_STORAGE_KEY);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (!mounted) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-900 border-t-transparent" />
      </div>
    );
  }

  if (showReport) {
    const data: AssessmentData = { profile, goals, lifestyle };
    const result = computeAssessmentResult(data);
    return (
      <AssessmentReport
        result={result}
        data={data}
        locale={locale}
        onRestart={handleRestart}
      />
    );
  }

  const meta = STEP_META[step];
  const StepIcon = meta.icon;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Page header — hidden when report is showing */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-3">
          {isEn ? "Lifestyle Assessment" : "Assessment Lifestyle"}
        </h1>
        <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
          {isEn
            ? "3 simple steps to understand your longevity potential and get a personalised action plan."
            : "3 semplici step per capire il tuo potenziale di longevità e ricevere un piano d'azione personalizzato."}
        </p>
      </div>
      {/* Progress header */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm mb-3">
          <div className="flex items-center gap-2 text-zinc-900 font-semibold">
            <StepIcon className="h-4 w-4" />
            <span>{isEn ? meta.title.en : meta.title.it}</span>
          </div>
          <span className="text-zinc-400 font-medium">
            {step + 1}/{TOTAL_STEPS}
          </span>
        </div>
        <Progress
          value={((step + 1) / TOTAL_STEPS) * 100}
          className="h-2 bg-zinc-100"
          indicatorClassName="bg-zinc-900"
        />
      </div>

      {/* Step card */}
      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-zinc-100 bg-zinc-50/50 px-6 py-5">
          <h2 className="text-xl font-bold text-zinc-900">
            {isEn ? meta.title.en : meta.title.it}
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            {isEn ? meta.subtitle.en : meta.subtitle.it}
          </p>
        </div>

        <div className="p-6">
          {step === 0 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <ProfileStep data={profile} onChange={setProfile} locale={locale} />
            </div>
          )}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <GoalsStep data={goals} onChange={setGoals} locale={locale} />
            </div>
          )}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <LifestyleStep data={lifestyle} onChange={setLifestyle} locale={locale} />
            </div>
          )}
        </div>

        {/* Footer nav */}
        <div className="flex items-center justify-between border-t border-zinc-100 bg-zinc-50/50 px-6 py-4">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 0}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {isEn ? "Back" : "Indietro"}
          </Button>
          <Button
            onClick={handleNext}
            className="gap-2 bg-zinc-900 hover:bg-zinc-800 text-white min-w-[160px]"
          >
            {step === TOTAL_STEPS - 1 ? (
              <>
                <BarChart3 className="h-4 w-4" />
                {isEn ? "Generate Report" : "Genera Report"}
              </>
            ) : (
              <>
                {isEn ? "Continue" : "Continua"}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
