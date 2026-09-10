import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function MaintenanceSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-3 flex-1">
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex gap-4 pt-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <Skeleton className="h-6 w-6 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function MaintenanceDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-64" />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
           <Card>
             <CardHeader>
               <Skeleton className="h-6 w-48" />
             </CardHeader>
             <CardContent className="space-y-4">
               <Skeleton className="h-4 w-full" />
               <Skeleton className="h-4 w-full" />
               <Skeleton className="h-4 w-3/4" />
             </CardContent>
           </Card>

           <Card>
             <CardHeader>
               <Skeleton className="h-6 w-48" />
             </CardHeader>
             <CardContent className="space-y-8">
               {[1, 2].map((i) => (
                 <div key={i} className="flex gap-4">
                   <Skeleton className="h-10 w-10 rounded-full" />
                   <div className="space-y-2 flex-1">
                     <Skeleton className="h-4 w-32" />
                     <Skeleton className="h-16 w-full" />
                   </div>
                 </div>
               ))}
             </CardContent>
           </Card>
        </div>

        <div className="space-y-6">
           <Card>
             <CardContent className="p-6 space-y-4">
               <Skeleton className="h-12 w-full" />
               <div className="space-y-2">
                 <Skeleton className="h-4 w-full" />
                 <Skeleton className="h-4 w-full" />
                 <Skeleton className="h-4 w-full" />
               </div>
             </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
