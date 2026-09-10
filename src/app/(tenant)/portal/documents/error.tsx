"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircleIcon, RefreshCcwIcon } from "lucide-react";
import { useEffect } from "react";

export default function DocumentsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <Card className="max-w-md w-full border-red-200">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-red-100 rounded-full">
              <AlertCircleIcon className="h-10 w-10 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-red-900">Something went wrong</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
          <p>We encountered an error while loading your documents. Please try again later.</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={() => reset()} className="bg-red-600 hover:bg-red-700">
            <RefreshCcwIcon className="mr-2 h-4 w-4" /> Try Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
