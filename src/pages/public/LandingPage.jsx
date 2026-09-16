import React from "react";
import { Link } from "react-router-dom";
import {
  Code2,
  CheckCircle2,
  Clock,
  BarChart3,
  ShieldCheck,
  Award,
  Layers,
  Terminal,
  Database,
  Cpu,
  Brain,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "../../components/common/Button";

export const LandingPage = () => {
  const stats = [
    { label: "Candidates Evaluated", value: "10,000+" },
    { label: "Technical Assessments", value: "500+" },
    { label: "Questions Scored", value: "50,000+" },
    { label: "Automated Evaluation Rate", value: "95%" },
  ];

  const features = [
    {
      icon: Clock,
      title: "Timed Assessments",
      description: "Custom duration limits, precise countdown tickers, and automated submission guards.",
    },
    {
      icon: CheckCircle2,
      title: "Instant Auto-Evaluation",
      description: "Automatic scoring for MCQ, negative marks calculation, and immediate pass/fail verdict.",
    },
    {
      icon: Database,
      title: "Vast Question Bank",
      description: "Organized by domain, difficulty tier, and tags across Java, SQL, OOP, DBMS, and DSA.",
    },
    {
      icon: BarChart3,
      title: "Deep Performance Analytics",
      description: "Category breakdown radar, score progression curves, and candidate improvement tracking.",
    },
    {
      icon: Award,
      title: "Competitive Leaderboards",
      description: "Dynamic rankings sorting by accuracy, score weight, and completion speed.",
    },
    {
      icon: ShieldCheck,
      title: "Enterprise Role Control",
      description: "Strict isolation between candidate testing interfaces and administrative management portals.",
    },
  ];

  const workflowSteps = [
    { step: "01", title: "Create Assessment", desc: "Select questions from the bank or author new domain problems." },
    { step: "02", title: "Invite Candidates", desc: "Share secure test keys or assign scheduled evaluation slots." },
    { step: "03", title: "Conduct Timed Test", desc: "Candidates answer in an environment with autosave protection." },
    { step: "04", title: "Auto Evaluation", desc: "The engine tabulates marks, penalties, and category mastery." },
    { step: "05", title: "Analyze & Export", desc: "Review candidate ranks and download CSV performance audits." },
  ];

  const categories = [
    { name: "Java Core & EE", icon: Terminal, color: "text-amber-500" },
    { name: "SQL & RDBMS", icon: Database, color: "text-sky-500" },
    { name: "Object Oriented Design", icon: Layers, color: "text-indigo-500" },
    { name: "Data Structures & Algos", icon: Cpu, color: "text-emerald-500" },
    { name: "Logical Aptitude", icon: Brain, color: "text-purple-500" },
  ];

  return (
    <div className="space-y-24 py-10">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 sm:pt-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Gen Technical Assessment Platform</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
          Assess Skills. <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
            Discover Tech Talent.
          </span>
        </h1>
        <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          CodeJudge delivers production-grade technical assessments, automated evaluations, and comprehensive candidate analytics for training institutes and enterprise engineering teams.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link to="/candidate/tests">
            <Button size="lg" variant="primary" icon={ArrowRight}>
              Start Assessment
            </Button>
          </Link>
          <Link to="/admin/login">
            <Button size="lg" variant="secondary">
              Admin Portal
            </Button>
          </Link>
        </div>

        {/* Hero Code Visual Mockup */}
        <div className="mt-14 max-w-4xl mx-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 sm:p-4 shadow-2xl">
          <div className="rounded-xl bg-slate-950 p-4 sm:p-6 text-left font-mono text-xs sm:text-sm text-slate-300">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs text-slate-500">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="ml-2 text-slate-400">CodeJudgeEvaluationEngine.java</span>
              </span>
              <span className="text-indigo-400 font-semibold">TEST_STATUS: ACTIVE</span>
            </div>
            <p className="mt-4 text-indigo-400">public class EvaluationEngine &#123;</p>
            <p className="pl-4 text-emerald-400">// Automatic evaluation, negative markings, and leaderboard computation</p>
            <p className="pl-4">AssessmentResult result = candidate.submitTest(activeAssessment);</p>
            <p className="pl-4 text-slate-400">System.out.println("Score: " + result.getPercentage() + "% | Passed: " + result.isPassed());</p>
            <p className="text-indigo-400">&#125;</p>
          </div>
        </div>
      </section>

      {/* Metrics Row */}
      <section className="bg-white dark:bg-slate-900/60 border-y border-slate-200 dark:border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => (
            <div key={i}>
              <p className="text-3xl sm:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight">
                {stat.value}
              </p>
              <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Platform Capabilities
          </h2>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-2">
            Engineered for Precision Screening
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:border-indigo-500/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">{f.title}</h4>
                <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {f.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            End-to-End Workflow
          </h2>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-2">
            How CodeJudge Operates
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {workflowSteps.map((step, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 relative"
            >
              <span className="text-3xl font-extrabold text-indigo-100 dark:text-slate-800 block mb-2">
                {step.step}
              </span>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{step.title}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-normal">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Domain Coverage
          </h2>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-2">
            Pre-configured Technical Tracks
          </h3>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <div
                key={i}
                className="flex items-center gap-3 px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
              >
                <Icon className={`w-5 h-5 ${cat.color}`} />
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {cat.name}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-tr from-indigo-900 to-slate-900 p-8 sm:p-14 text-center text-white relative overflow-hidden border border-indigo-800 shadow-xl">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Ready to evaluate developer skills at scale?
          </h2>
          <p className="mt-4 text-sm sm:text-base text-indigo-200 max-w-xl mx-auto">
            Take a test now to explore the candidate assessment interface or login as administrator to configure custom tests and review detailed analytics.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link to="/candidate/tests">
              <Button size="lg" variant="primary">
                Take an Assessment
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="secondary">
                Register as Candidate
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};