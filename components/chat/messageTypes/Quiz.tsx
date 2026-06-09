"use client";
import { useMemo, useState } from "react";
import { gradeAnswer, saveQuizAnswer } from "@/lib/api";
import type { MessageRendererProps } from "./rendererTypes";
import MessageTypePlaceholder from "./MessageTypePlaceholder";

interface TrueFalse {
  kind: "true_false";
  question: string;
  answer: boolean;
  explanation: string;
}

interface FreeText {
  kind: "free_text";
  question: string;
  answer: string;
  explanation: string;
}

interface MultipleChoice {
  kind: "multiple_choice";
  question: string;
  options: Record<string, string>;
  answer: string;
  explanation: string;
}

type QuizQuestion = TrueFalse | FreeText | MultipleChoice;

type GradeResult = { correct: boolean; feedback: string };

export default function Quiz({ content, streaming, messageId, quizAnswers }: MessageRendererProps) {
  const question = useMemo<QuizQuestion | null>(() => {
    try {
      return JSON.parse(content);
    } catch {
      return null;
    }
  }, [content]);

  const existingAnswer = useMemo(
    () => quizAnswers?.find((a) => a.question === question?.question) ?? null,
    [quizAnswers, question],
  );

  const [selected, setSelected] = useState<string | null>(existingAnswer?.student_answer ?? null);
  const [inputValue, setInputValue] = useState(existingAnswer?.student_answer ?? "");
  const [grading, setGrading] = useState(false);
  const [result, setResult] = useState<GradeResult | null>(
    existingAnswer ? { correct: existingAnswer.correct, feedback: existingAnswer.feedback } : null,
  );

  if (streaming || !question) {
    return <MessageTypePlaceholder content={content} streaming={streaming} />;
  }

  const userAnswer =
    question.kind === "free_text" ? inputValue.trim() : (selected ?? "");

  const handleCheck = async () => {
    if (!userAnswer || result) return;

    if (question.kind === "free_text") {
      setGrading(true);
      try {
        const grade = await gradeAnswer(
          question.question,
          question.answer,
          userAnswer,
        );
        setResult(grade);
        if (messageId) {
          saveQuizAnswer(messageId, question.question, userAnswer, grade.correct, grade.feedback).catch(console.error);
        }
      } catch {
        setResult({ correct: false, feedback: "Could not reach the grading service." });
      } finally {
        setGrading(false);
      }
    } else {
      const correct =
        question.kind === "true_false"
          ? userAnswer === String(question.answer)
          : userAnswer === question.answer;
      const gradeResult = { correct, feedback: question.explanation };
      setResult(gradeResult);
      if (messageId) {
        saveQuizAnswer(messageId, question.question, userAnswer, gradeResult.correct, gradeResult.feedback).catch(console.error);
      }
    }
  };

  const correctLabel =
    question.kind === "multiple_choice" && question.options[question.answer]
      ? `${question.answer}: ${question.options[question.answer]}`
      : String(question.answer);

  return (
    <div className="my-3 rounded-xl bg-[#141219] border border-[rgba(124,106,247,0.25)] p-4">
      <p className="text-[#e8e4f0] text-sm font-medium mb-3">{question.question}</p>

      {question.kind === "true_false" && (
        <div className="flex gap-2 mb-3">
          {(["true", "false"] as const).map((opt) => (
            <button
              key={opt}
              type="button"
              disabled={!!result}
              onClick={() => setSelected(opt)}
              className={`flex-1 py-2 rounded-lg text-sm border transition-all ${
                selected === opt
                  ? "bg-[rgba(124,106,247,0.3)] border-[#7c6af7] text-[#a78bfa]"
                  : "bg-transparent border-[rgba(232,228,240,0.12)] text-[rgba(232,228,240,0.6)] hover:border-[rgba(124,106,247,0.4)]"
              } disabled:cursor-not-allowed`}
            >
              {opt.charAt(0).toUpperCase() + opt.slice(1)}
            </button>
          ))}
        </div>
      )}

      {question.kind === "multiple_choice" && (
        <div className="flex flex-col gap-2 mb-3">
          {Object.entries(question.options).map(([key, label]) => (
            <button
              key={key}
              type="button"
              disabled={!!result}
              onClick={() => setSelected(key)}
              className={`text-left px-3 py-2 rounded-lg text-sm border transition-all ${
                selected === key
                  ? "bg-[rgba(124,106,247,0.3)] border-[#7c6af7] text-[#a78bfa]"
                  : "bg-transparent border-[rgba(232,228,240,0.12)] text-[rgba(232,228,240,0.6)] hover:border-[rgba(124,106,247,0.4)]"
              } disabled:cursor-not-allowed`}
            >
              <span className="font-mono mr-2">{key}.</span>
              {label}
            </button>
          ))}
        </div>
      )}

      {question.kind === "free_text" && (
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={!!result || grading}
          placeholder="Type your answer…"
          aria-label="Your answer"
          className="w-full mb-3 bg-[#1a1825] border border-[rgba(232,228,240,0.12)] rounded-lg px-3 py-2 text-sm text-[#e8e4f0] placeholder:text-[rgba(232,228,240,0.3)] outline-none focus:border-[rgba(124,106,247,0.5)] disabled:opacity-50"
        />
      )}

      {!result && (
        <button
          type="button"
          onClick={handleCheck}
          disabled={!userAnswer || grading}
          className="px-4 py-2 rounded-lg bg-[#7c6af7] text-white text-sm font-medium hover:bg-[#6b59e0] transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {grading && (
            <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          )}
          {grading ? "Grading…" : "Check"}
        </button>
      )}

      {result && (
        <div
          className={`mt-3 p-3 rounded-lg border text-sm ${
            result.correct
              ? "bg-[rgba(52,211,153,0.08)] border-[rgba(52,211,153,0.3)] text-[#34d399]"
              : "bg-[rgba(248,113,113,0.08)] border-[rgba(248,113,113,0.3)] text-[#f87171]"
          }`}
        >
          <p className="font-semibold mb-1">
            {result.correct
              ? "Correct!"
              : question.kind === "free_text"
              ? "Not quite"
              : `Incorrect — answer: ${correctLabel}`}
          </p>
          <p className="text-[rgba(232,228,240,0.7)]">{result.feedback}</p>
        </div>
      )}
    </div>
  );
}
