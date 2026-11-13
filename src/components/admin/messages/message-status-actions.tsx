"use client";

import { useState, useTransition } from "react";
import { Archive, CheckCheck, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateMessageStatusAction } from "@/features/messages/actions";
import type { ContactSubmissionRow } from "@/features/messages/queries";

interface MessageStatusActionsProps {
  readonly messageId: string;
  readonly currentStatus: ContactSubmissionRow["status"];
}

export function MessageStatusActions({
  messageId,
  currentStatus,
}: MessageStatusActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<string | null>(null);

  function setStatus(status: ContactSubmissionRow["status"]) {
    setFeedback(null);
    startTransition(async () => {
      const result = await updateMessageStatusAction({ id: messageId, status });
      setFeedback(result.ok ? (result.message ?? "Updated.") : (result.error ?? "Failed."));
    });
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant={currentStatus === "read" ? "default" : "outline"}
          size="sm"
          disabled={isPending || currentStatus === "read"}
          onClick={() => setStatus("read")}
          className="gap-1.5"
        >
          <CheckCheck className="size-3.5" aria-hidden="true" />
          <span>Mark Read</span>
        </Button>

        <Button
          type="button"
          variant={currentStatus === "replied" ? "default" : "outline"}
          size="sm"
          disabled={isPending || currentStatus === "replied"}
          onClick={() => setStatus("replied")}
          className="gap-1.5"
        >
          <MailCheck className="size-3.5" aria-hidden="true" />
          <span>Mark Replied</span>
        </Button>

        <Button
          type="button"
          variant={currentStatus === "archived" ? "default" : "outline"}
          size="sm"
          disabled={isPending || currentStatus === "archived"}
          onClick={() => setStatus("archived")}
          className="gap-1.5"
        >
          <Archive className="size-3.5" aria-hidden="true" />
          <span>Archive</span>
        </Button>
      </div>

      {feedback ? (
        <p role="status" className="text-xs font-medium text-primary">
          {feedback}
        </p>
      ) : null}
    </div>
  );
}
