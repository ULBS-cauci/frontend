"use client";
import { useParams } from "next/navigation";
import LearningPathView from "@/components/learningPath/LearningPathView";

export default function LearningPathPage() {
  const { id } = useParams<{ id: string }>();
  return (
    <div className="h-full">
      <LearningPathView pathId={id} />
    </div>
  );
}
