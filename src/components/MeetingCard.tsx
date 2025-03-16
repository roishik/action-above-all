
import { Meeting } from "@/utils/types";
import { format } from "date-fns";
import { MessageSquare, Clock, Calendar as CalendarIcon, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MeetingCardProps {
  meeting: Meeting;
  onClick: () => void;
  compact?: boolean;
}

const MeetingCard = ({ meeting, onClick, compact = false }: MeetingCardProps) => {
  const isPast = meeting.date < new Date() && meeting.summary;
  const isFuture = meeting.date > new Date();
  
  return (
    <div 
      className={cn(
        "group rounded-lg border p-3 transition-all hover:shadow-md",
        "bg-white dark:bg-gray-950",
        compact ? "border" : "border-2",
        isPast ? "border-green-200 dark:border-green-900" : "",
        isFuture ? "border-blue-200 dark:border-blue-900" : "",
        !isPast && !isFuture ? "border-gray-200 dark:border-gray-800" : ""
      )}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2 space-x-2">
        <div>
          <h3 className={cn("font-medium line-clamp-1", compact ? "text-sm" : "text-base")}>
            {meeting.name}
          </h3>
          
          {!compact && meeting.summary && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {meeting.summary}
            </p>
          )}
        </div>
        
        {isPast && (
          <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800">
            Completed
          </Badge>
        )}
        
        {isFuture && (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800">
            Upcoming
          </Badge>
        )}
      </div>
      
      <div className="flex flex-wrap gap-1 mt-2">
        {meeting.tags.slice(0, compact ? 2 : 3).map(tag => (
          <Badge key={tag.id} variant="secondary" className="px-2 py-0 h-5 text-xs">
            {tag.name}
          </Badge>
        ))}
        
        {meeting.tags.length > (compact ? 2 : 3) && (
          <Badge variant="secondary" className="px-2 py-0 h-5 text-xs">
            +{meeting.tags.length - (compact ? 2 : 3)}
          </Badge>
        )}
      </div>
      
      <div className={cn("flex items-center gap-3 text-muted-foreground mt-3", compact ? "text-xs" : "text-sm")}>
        <div className="flex items-center">
          <CalendarIcon className="mr-1 h-3 w-3" />
          <span>{format(meeting.date, "MMM d")}</span>
        </div>
        
        <div className="flex items-center">
          <Clock className="mr-1 h-3 w-3" />
          <span>{meeting.time}</span>
        </div>
        
        {!compact && (
          <>
            {meeting.notes && (
              <div className="flex items-center">
                <FileText className="mr-1 h-3 w-3" />
                <span>Notes</span>
              </div>
            )}
            
            {meeting.transcript && (
              <div className="flex items-center">
                <MessageSquare className="mr-1 h-3 w-3" />
                <span>Transcript</span>
              </div>
            )}
          </>
        )}
      </div>
      
      {!compact && (
        <div className="mt-3 text-right opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="sm" onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}>
            {isPast ? "View Summary" : "Edit Meeting"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default MeetingCard;
