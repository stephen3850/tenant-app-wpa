"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/utils";
import {
  WrenchIcon,
  MessageSquareIcon,
  PaperclipIcon,
  ClockIcon,
  UserIcon,
  CheckCircle2Icon,
  RotateCcwIcon,
  SendIcon,
  CalendarIcon,
  PhoneIcon,
  AlertCircleIcon,
  Image as ImageIcon
} from "lucide-react";
import { addMaintenanceComment, confirmResolution, reopenRequest } from "@/actions/tenant-maintenance";
import { FeedbackDialog } from "./feedback-dialog";

export function MaintenanceDetail({ ticket }: { ticket: any }) {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    setLoading(true);
    try {
      await addMaintenanceComment(ticket.id, comment);
      setComment("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReopen = async () => {
    const reason = window.prompt("Please provide a reason for reopening this request:");
    if (!reason) return;
    setLoading(true);
    try {
      await reopenRequest(ticket.id, reason);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isClosed = ticket.status === "CLOSED";
  const isResolved = ticket.status === "RESOLVED";

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="shadow-sm">
          <CardHeader className="border-b bg-slate-50/50">
            <div className="flex justify-between items-start">
               <div className="space-y-1">
                 <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] font-bold tracking-tighter uppercase border-blue-200 text-blue-700 bg-blue-50">
                      {ticket.ticketNumber}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] font-bold uppercase">
                      {ticket.category.name}
                    </Badge>
                 </div>
                 <CardTitle className="text-2xl font-bold">{ticket.subject}</CardTitle>
               </div>
               <Badge className={`px-4 py-1 font-bold uppercase ${ticket.status === 'RESOLVED' ? 'bg-green-600' : 'bg-blue-600'}`}>
                  {ticket.status.replace(/_/g, " ")}
               </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
             <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Description</h4>
                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{ticket.description}</p>
             </div>

             {ticket.attachments.length > 0 && (
               <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Attachments</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                     {ticket.attachments.map((att: any) => (
                       <a key={att.id} href={att.url} target="_blank" rel="noopener noreferrer" className="group relative aspect-square bg-slate-100 rounded-lg border overflow-hidden flex items-center justify-center">
                          {att.type.startsWith('image/') ? (
                            <img src={att.url} alt={att.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          ) : (
                            <div className="text-center p-2">
                               <PaperclipIcon className="h-6 w-6 text-slate-400 mx-auto mb-1" />
                               <span className="text-[8px] font-bold uppercase truncate block w-full">{att.name}</span>
                            </div>
                          )}
                       </a>
                     ))}
                  </div>
               </div>
             )}
          </CardContent>
          <CardFooter className="bg-slate-50/50 border-t p-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
             <div className="flex items-center gap-1">
                <ClockIcon className="h-3 w-3" />
                Submitted {formatDate(ticket.createdAt)}
             </div>
             {ticket.preferredAccessTime && (
               <div className="flex items-center gap-1">
                  <CalendarIcon className="h-3 w-3" />
                  Access: {ticket.preferredAccessTime}
               </div>
             )}
             {ticket.contactPreference && (
               <div className="flex items-center gap-1">
                  <PhoneIcon className="h-3 w-3" />
                  Contact: {ticket.contactPreference}
               </div>
             )}
          </CardFooter>
        </Card>

        {/* Action Bar for Resolved/Closed */}
        {(isResolved || isClosed) && (
          <div className={`p-6 rounded-xl border-2 flex flex-col md:flex-row items-center justify-between gap-4 ${isResolved ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'}`}>
             <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${isResolved ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'}`}>
                   {isResolved ? <CheckCircle2Icon className="h-6 w-6" /> : <ClockIcon className="h-6 w-6" />}
                </div>
                <div>
                   <h4 className={`font-bold ${isResolved ? 'text-green-900' : 'text-slate-900'}`}>
                     {isResolved ? "Has this issue been resolved?" : "Request Closed"}
                   </h4>
                   <p className="text-sm text-slate-600">
                     {isResolved ? "Please confirm if the work was completed to your satisfaction." : "This maintenance request is complete and closed."}
                   </p>
                </div>
             </div>
             <div className="flex gap-3">
                {isResolved && (
                  <>
                    <Button className="bg-green-600 hover:bg-green-700" onClick={() => setShowFeedback(true)}>
                      <CheckCircle2Icon className="h-4 w-4 mr-2" />
                      Yes, It's Resolved
                    </Button>
                    <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50" onClick={handleReopen} disabled={loading}>
                      <RotateCcwIcon className="h-4 w-4 mr-2" />
                      No, Reopen Request
                    </Button>
                  </>
                )}
                {isClosed && (
                   <Button variant="outline" onClick={handleReopen} disabled={loading}>
                      <RotateCcwIcon className="h-4 w-4 mr-2" />
                      Reopen Request
                   </Button>
                )}
             </div>
          </div>
        )}

        {/* Communication & History Tabs */}
        <div className="space-y-6">
           <h3 className="text-lg font-bold flex items-center gap-2">
             <MessageSquareIcon className="h-5 w-5 text-blue-500" />
             Communication & Activity
           </h3>

           <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
              {/* Comment Input */}
              {!isClosed && (
                <div className="relative flex items-start gap-4 z-10">
                   <Avatar className="h-10 w-10 border-2 border-white shadow-sm shrink-0">
                      <AvatarFallback className="bg-blue-600 text-white font-bold">You</AvatarFallback>
                   </Avatar>
                   <Card className="flex-1 shadow-sm border-2 border-blue-100">
                      <CardContent className="p-3">
                         <Textarea
                            placeholder="Add a comment or update..."
                            className="bg-transparent border-0 focus-visible:ring-0 resize-none p-0 text-sm"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                         />
                      </CardContent>
                      <CardFooter className="p-2 border-t bg-slate-50/50 flex justify-between items-center">
                         <Button variant="ghost" size="sm" className="h-8 text-slate-500">
                            <PaperclipIcon className="h-4 w-4 mr-2" />
                            Add Photo
                         </Button>
                         <Button size="sm" className="bg-blue-600 hover:bg-blue-700" disabled={!comment.trim() || loading} onClick={handleAddComment}>
                            {loading ? <ClockIcon className="h-4 w-4 animate-spin" /> : <SendIcon className="h-4 w-4 mr-2" />}
                            Post Update
                         </Button>
                      </CardFooter>
                   </Card>
                </div>
              )}

              {/* Combined History & Comments */}
              {[...ticket.comments, ...ticket.activities.map((a: any) => ({ ...a, isActivity: true }))]
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((item, idx) => (
                  <div key={item.id} className="relative flex items-start gap-4 z-10">
                     <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 border-white shadow-sm shrink-0 ${item.isActivity ? 'bg-slate-100' : 'bg-white'}`}>
                        {item.isActivity ? (
                           <div className="h-2 w-2 rounded-full bg-slate-400" />
                        ) : (
                           <Avatar className="h-full w-full">
                              <AvatarImage src={item.user?.image} />
                              <AvatarFallback className={item.user?.name === ticket.tenant?.firstName ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"}>
                                 {item.user?.name?.charAt(0)}
                              </AvatarFallback>
                           </Avatar>
                        )}
                     </div>

                     {item.isActivity ? (
                        <div className="flex-1 py-2">
                           <p className="text-xs text-slate-500">
                              <span className="font-bold text-slate-700">{item.user?.name}</span> {item.content}
                              <span className="mx-2">•</span>
                              {formatDate(item.createdAt)}
                           </p>
                        </div>
                     ) : (
                        <Card className={`flex-1 shadow-sm ${item.user?.name === ticket.tenant?.firstName ? 'border-blue-50' : 'border-orange-50'}`}>
                           <CardHeader className="p-3 pb-0 flex flex-row justify-between items-center space-y-0">
                              <span className="text-xs font-bold text-slate-900">{item.user?.name}</span>
                              <span className="text-[10px] text-muted-foreground">{formatDate(item.createdAt)}</span>
                           </CardHeader>
                           <CardContent className="p-3 pt-1">
                              <p className="text-sm text-slate-700">{item.content}</p>
                              {item.attachments?.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                   {item.attachments.map((att: any) => (
                                     <a key={att.id} href={att.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 border rounded text-[10px] font-medium text-slate-600 hover:bg-slate-100">
                                        <PaperclipIcon className="h-3 w-3" />
                                        {att.name}
                                     </a>
                                   ))}
                                </div>
                              )}
                           </CardContent>
                        </Card>
                     )}
                  </div>
                ))}
           </div>
        </div>
      </div>

      {/* Sidebar Details */}
      <div className="space-y-6">
         {/* Status & Assignment */}
         <Card className="shadow-sm">
            <CardHeader className="pb-2">
               <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">Assignment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               {ticket.assignee ? (
                  <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
                     <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                        <AvatarImage src={ticket.assignee.image} />
                        <AvatarFallback className="bg-orange-600 text-white">
                           {ticket.assignee.name?.charAt(0)}
                        </AvatarFallback>
                     </Avatar>
                     <div>
                        <p className="text-xs text-muted-foreground font-medium uppercase">Technician</p>
                        <p className="text-sm font-bold text-slate-900">{ticket.assignee.name}</p>
                        {ticket.assignee.phone && <p className="text-[10px] text-blue-600 font-bold">{ticket.assignee.phone}</p>}
                     </div>
                  </div>
               ) : (
                  <div className="text-center py-6 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                     <UserIcon className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                     <p className="text-xs text-slate-500 font-medium">Awaiting Technician Assignment</p>
                  </div>
               )}

               <div className="space-y-2 pt-2 border-t">
                  <div className="flex justify-between text-xs">
                     <span className="text-muted-foreground">Priority</span>
                     <span className="font-bold uppercase text-red-600">{ticket.priority}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                     <span className="text-muted-foreground">Latest Update</span>
                     <span className="font-medium">{formatDate(ticket.updatedAt)}</span>
                  </div>
               </div>
            </CardContent>
         </Card>

         {/* Property context */}
         <Card className="shadow-sm bg-blue-50/50 border-blue-100">
            <CardHeader className="pb-2">
               <CardTitle className="text-sm font-bold uppercase tracking-widest text-blue-400">Property Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
               <div className="flex items-start gap-3">
                  <div className="mt-1 p-1.5 bg-blue-100 text-blue-600 rounded">
                     <WrenchIcon className="h-4 w-4" />
                  </div>
                  <div>
                     <p className="text-xs font-bold text-slate-900">Unit {ticket.unit?.unitNumber}</p>
                     <p className="text-[10px] text-muted-foreground">{ticket.property?.propertyName}</p>
                  </div>
               </div>
            </CardContent>
         </Card>

         {/* Resolution Satisfaction (If closed) */}
         {ticket.satisfactionRating && (
           <Card className="shadow-sm border-green-200 bg-green-50/50">
             <CardHeader className="pb-2">
               <CardTitle className="text-sm font-bold uppercase tracking-widest text-green-600">Satisfaction Feedback</CardTitle>
             </CardHeader>
             <CardContent className="space-y-3">
               <div className="flex gap-1">
                 {[1, 2, 3, 4, 5].map((s) => (
                   <CheckCircle2Icon key={s} className={`h-4 w-4 ${s <= ticket.satisfactionRating ? 'text-green-600 fill-green-600' : 'text-slate-300'}`} />
                 ))}
               </div>
               {ticket.satisfactionFeedback && (
                 <p className="text-xs italic text-slate-700 bg-white p-2 rounded border border-green-100">
                   "{ticket.satisfactionFeedback}"
                 </p>
               )}
             </CardContent>
           </Card>
         )}
      </div>

      <FeedbackDialog
        open={showFeedback}
        onOpenChange={setShowFeedback}
        requestId={ticket.id}
      />
    </div>
  );
}
