import React from "react";
import { Link } from "react-router-dom";
import { Card } from "../common/Card";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";
import { Clock, HelpCircle, Award, ArrowRight } from "lucide-react";

export const AssessmentCard = ({ test }) => {
  const difficultyBadgeMap = {
    Easy: "success",
    Medium: "warning",
    Hard: "danger",
  };

  return (
    <Card className="flex flex-col justify-between hover:border-indigo-400 dark:hover:border-indigo-600 transition-all shadow-sm">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <Badge variant="indigo">{test.category}</Badge>
          <Badge variant={difficultyBadgeMap[test.difficulty] || "default"}>
            {test.difficulty}
          </Badge>
        </div>

        <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">
          {test.title}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
          {test.description}
        </p>

        <div className="grid grid-cols-3 gap-2 mt-4 py-3 border-y border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{test.durationMinutes} mins</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>{test.questionIds?.length || 0} Qs</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <Award className="w-3.5 h-3.5 text-slate-400" />
            <span>{test.totalMarks} Marks</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between pt-2">
        <div className="text-[11px] text-slate-500 dark:text-slate-400">
          Pass score: <span className="font-semibold text-slate-700 dark:text-slate-200">{test.passingScore}</span>
        </div>
        <Link to={`/candidate/tests/${test.id}/instructions`}>
          <Button size="sm" variant="primary" icon={ArrowRight}>
            Start Test
          </Button>
        </Link>
      </div>
    </Card>
  );
};