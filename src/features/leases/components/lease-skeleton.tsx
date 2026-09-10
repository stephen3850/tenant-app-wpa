import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function LeaseTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-[200px]" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-[80px]" />
          <Skeleton className="h-8 w-[100px]" />
        </div>
      </div>
      <div className="border rounded-md">
        <div className="h-10 border-b bg-muted/50" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 border-b flex items-center px-4 gap-4">
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function LeaseStatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
      {[...Array(5)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-[100px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-[120px]" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function LeaseDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <Skeleton className="h-10 w-[300px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
        <Skeleton className="h-[60px] w-[150px]" />
      </div>
      <div className="flex gap-2 border-b pb-2 overflow-x-auto">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-8 w-[100px] shrink-0" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-[100px] w-full" />
        ))}
      </div>
      <Skeleton className="h-[300px] w-full" />
    </div>
  );
}
