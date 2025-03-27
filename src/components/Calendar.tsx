
import React, { useState } from "react";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Meeting } from "@/utils/types";
import { format, isSameMonth, isSameDay } from "date-fns";
import MeetingCard from "./MeetingCard";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CalendarViewProps {
  meetings: Meeting[];
  onSelectMeeting: (meeting: Meeting) => void;
}

const Calendar: React.FC<CalendarViewProps> = ({ meetings, onSelectMeeting }) => {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Get meetings for the selected date
  const selectedDateMeetings = meetings.filter(meeting => 
    selectedDate && isSameDay(meeting.date, selectedDate)
  );

  // Helper function to get meetings for a specific day (for the calendar dots)
  const getMeetingsOnDay = (day: Date) => {
    return meetings.filter(meeting => isSameDay(meeting.date, day));
  };

  // Handler for the calendar day click
  const handleDateSelect = (day: Date | undefined) => {
    setSelectedDate(day);
  };

  // Custom day rendering function to show dots for meetings
  const renderDay = (dayDate: Date) => {
    const meetingsOnDay = getMeetingsOnDay(dayDate);
    const isSelected = selectedDate && isSameDay(dayDate, selectedDate);
    
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div 
          className={cn(
            "flex items-center justify-center rounded-full h-8 w-8 transition-all duration-200",
            isSelected ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
          )}
        >
          {format(dayDate, "d")}
        </div>
        
        {meetingsOnDay.length > 0 && (
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex justify-center space-x-0.5">
            {meetingsOnDay.length > 3 ? (
              <span className="block rounded-full bg-primary/70 h-1 w-3" />
            ) : (
              meetingsOnDay.slice(0, 3).map((_, i) => (
                <span key={i} className="block rounded-full bg-primary/70 h-1 w-1" />
              ))
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col space-y-4 h-full animate-fade-in">
      <div className="flex p-4 items-center justify-between bg-white dark:bg-black rounded-xl glass-card">
        <div className="flex-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            {format(date, "MMMM yyyy")}
          </h2>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              const prevMonth = new Date(date);
              prevMonth.setMonth(prevMonth.getMonth() - 1);
              setDate(prevMonth);
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              const nextMonth = new Date(date);
              nextMonth.setMonth(nextMonth.getMonth() + 1);
              setDate(nextMonth);
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              const today = new Date();
              setDate(today);
              setSelectedDate(today);
            }}
          >
            Today
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 h-full grow">
        <div className="md:w-1/2 glass-card p-4 rounded-xl">
          <CalendarUI
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            month={date}
            onMonthChange={setDate}
            className="rounded-md max-w-full"
            components={{
              Day: ({ date: dayDate }) => renderDay(dayDate)
            }}
            showOutsideDays={false}
          />
        </div>
        
        <div className="md:w-1/2 glass-card rounded-xl p-4 flex flex-col">
          <div className="mb-2 px-2">
            <h3 className="text-lg font-medium">
              {selectedDate ? format(selectedDate, "EEEE, MMMM d, yyyy") : "No date selected"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {selectedDateMeetings.length === 0 
                ? "No meetings scheduled" 
                : `${selectedDateMeetings.length} meeting${selectedDateMeetings.length === 1 ? "" : "s"} scheduled`}
            </p>
          </div>
          
          <ScrollArea className="flex-1 pr-3 -mr-3 mt-2">
            <div className="space-y-3">
              {selectedDateMeetings.length === 0 ? (
                <div className="h-40 flex items-center justify-center text-muted-foreground text-sm">
                  No meetings for this date
                </div>
              ) : (
                selectedDateMeetings.map(meeting => (
                  <MeetingCard 
                    key={meeting.id} 
                    meeting={meeting} 
                    onClick={() => onSelectMeeting(meeting)}
                  />
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
