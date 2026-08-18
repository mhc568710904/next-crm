"use client";

import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">出错了</h1>
        <p className="text-muted-foreground mb-8">{error.message || "发生了一个意外错误"}</p>
        <Button onClick={reset}>重试</Button>
      </div>
    </div>
  );
}