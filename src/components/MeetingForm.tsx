
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import TagInput from "./TagInput";
import ModelSelector from "./ModelSelector";
import { Meeting, Tag, Provider, Model, EnvironmentConfig } from "@/utils/types";
import { sampleTags } from "@/utils/mockData";

interface MeetingFormProps {
  meeting?: Meeting;
  onSave: (meeting: Meeting) => void;
  onGenerate: (meeting: Meeting) => void;
  selectedProvider: Provider | undefined;
  selectedModel: Model | undefined;
  config: EnvironmentConfig;
  onProviderChange: (provider: Provider) => void;
  onModelChange: (model: Model) => void;
  onConfigChange: (config: EnvironmentConfig) => void;
}

const MeetingForm: React.FC<MeetingFormProps> = ({
  meeting,
  onSave,
  onGenerate,
  selectedProvider,
  selectedModel,
  config,
  onProviderChange,
  onModelChange,
  onConfigChange
}) => {
  const [name, setName] = useState(meeting?.name || "");
  const [date, setDate] = useState<Date | undefined>(meeting?.date || new Date());
  const [time, setTime] = useState(meeting?.time || "10:00");
  const [context, setContext] = useState(meeting?.context || "Product management context for Mobileye development team.");
  const [notes, setNotes] = useState(meeting?.notes || "");
  const [transcript, setTranscript] = useState(meeting?.transcript || "");
  const [tags, setTags] = useState<Tag[]>(meeting?.tags || []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !date || !time) {
      // Show validation errors
      return;
    }
    
    const updatedMeeting: Meeting = {
      id: meeting?.id || `new-${Date.now()}`,
      name,
      date: date!,
      time,
      context,
      notes,
      transcript,
      summary: meeting?.summary,
      tags,
      provider: selectedProvider,
      model: selectedModel
    };
    
    onSave(updatedMeeting);
  };

  const handleGenerate = () => {
    if (!name || !date || !time) {
      // Show validation errors
      return;
    }
    
    if (!notes && !transcript) {
      // Show validation error for required notes or transcript
      return;
    }
    
    const meetingData: Meeting = {
      id: meeting?.id || `new-${Date.now()}`,
      name,
      date: date!,
      time,
      context,
      notes,
      transcript,
      summary: meeting?.summary,
      tags,
      provider: selectedProvider,
      model: selectedModel
    };
    
    onGenerate(meetingData);
  };

  const isGenerateDisabled = !name || !date || !time || (!notes && !transcript) || !selectedProvider || !selectedModel;

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-xl">Meeting Details</CardTitle>
          <CardDescription>
            Enter the details of your meeting to generate a summary.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="glass-card p-4 rounded-xl">
            <ModelSelector
              selectedProvider={selectedProvider}
              selectedModel={selectedModel}
              onProviderChange={onProviderChange}
              onModelChange={onModelChange}
              config={config}
              onConfigChange={onConfigChange}
            />
          </div>
          
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="name">Meeting Name</Label>
                <Input
                  id="name"
                  placeholder="Weekly Product Planning"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                        type="button" // Ensure this doesn't submit the form
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="border rounded-md">
                <TagInput
                  allTags={sampleTags}
                  selectedTags={tags}
                  onTagsChange={setTags}
                />
              </div>
            </div>
            
            <Accordion
              type="single"
              collapsible
              defaultValue="context"
              className="w-full"
            >
              <AccordionItem value="context">
                <AccordionTrigger>Meeting Context</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pt-2">
                    <Label htmlFor="context">
                      General context for Mobileye meetings
                    </Label>
                    <Textarea
                      id="context"
                      placeholder="Context information for typical Mobileye product meetings..."
                      className="min-h-[100px]"
                      value={context}
                      onChange={(e) => setContext(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      This context will help the AI understand the typical nature of your meetings.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Meeting Notes (Hebrew or English)</Label>
              <Textarea
                id="notes"
                placeholder="• Discussed design changes
• Team voiced concerns about timeline
• Decision made to prioritize feature X"
                className="min-h-[150px] font-mono text-sm"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="transcript">
                Meeting Transcript (optional)
              </Label>
              <Textarea
                id="transcript"
                placeholder="Full meeting transcript..."
                className="min-h-[150px] font-mono text-sm"
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Include the transcript if available. Either notes or transcript is required.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-end">
          <Button variant="outline" type="submit">
            Save Meeting
          </Button>
          <Button 
            type="button" 
            onClick={handleGenerate}
            disabled={isGenerateDisabled}
          >
            Generate Summary
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default MeetingForm;
