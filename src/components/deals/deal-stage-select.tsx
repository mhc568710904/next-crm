"use client";

import { useTransition } from "react";
import { updateDealStage } from "@/actions/deal";
import { Button } from "@/components/ui/button";

const stages = [
  { value: "lead", label: "线索" },
  { value: "proposal", label: "提案" },
  { value: "negotiation", label: "谈判" },
  { value: "closed_won", label: "成交" },
  { value: "closed_lost", label: "丢失" },
];

export function DealStageSelect({
  dealId,
  currentStage,
}: {
  dealId: string;
  currentStage: string;
}) {
  const [isPending, startTransition] = useTransition();

  function handleUpdate(stage: string) {
    startTransition(async () => {
      await updateDealStage(dealId, stage);
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      {stages.map((stage) => (
        <Button
          key={stage.value}
          variant={currentStage === stage.value ? "default" : "outline"}
          size="sm"
          disabled={isPending || currentStage === stage.value}
          onClick={() => handleUpdate(stage.value)}
        >
          {stage.label}
        </Button>
      ))}
    </div>
  );
}