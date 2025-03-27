
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle, Calendar as CalendarIcon } from "lucide-react";
import Calendar from "@/components/Calendar";
import MeetingForm from "@/components/MeetingForm";
import SummaryOutput from "@/components/SummaryOutput";
import { Meeting, Provider, Model, EnvironmentConfig } from "@/utils/types";
import { useToast } from "@/hooks/use-toast";
import { sampleMeetings, sampleTags } from "@/utils/mockData";

const Index = () => {
  const [activeTab, setActiveTab] = useState("calendar");
  const [meetings, setMeetings] = useState<Meeting[]>(sampleMeetings);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | undefined>();
  const [showSummary, setShowSummary] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | undefined>();
  const [selectedModel, setSelectedModel] = useState<Model | undefined>();
  const [config, setConfig] = useState<EnvironmentConfig>({});
  const { toast } = useToast();

  const handleSelectMeeting = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    
    if (meeting.summary) {
      setShowSummary(true);
    } else {
      setActiveTab("form");
    }
  };

  const handleSaveMeeting = (meeting: Meeting) => {
    const updatedMeetings = meetings.some(m => m.id === meeting.id)
      ? meetings.map(m => m.id === meeting.id ? meeting : m)
      : [...meetings, meeting];
    
    setMeetings(updatedMeetings);
    setSelectedMeeting(meeting);
    
    toast({
      title: "Meeting saved",
      description: "The meeting details have been saved successfully.",
    });
    
    setActiveTab("calendar");
  };

  const handleGenerateSummary = (meeting: Meeting) => {
    toast({
      title: "Generating summary",
      description: "Please wait while we process your meeting data...",
    });
    
    setTimeout(() => {
      const generatedSummary = `# ${meeting.name}\n\n## Summary\nThe team discussed the roadmap priorities for the upcoming quarter. Several key decisions were made regarding timeline adjustments and resource allocation.\n\n## Key Points\n- Product roadmap priorities were aligned with strategic goals\n- Timeline concerns were addressed with a revised schedule\n- New feature requests from marketing will be evaluated in the next sprint planning\n\n## Action Items\n- Alex: Finalize the Q2 roadmap by next Monday\n- Sarah: Schedule a follow-up meeting with the marketing team\n- Team: Review resource allocation for the upcoming features`;
      
      const updatedMeeting = {
        ...meeting,
        summary: generatedSummary
      };
      
      const updatedMeetings = meetings.map(m => 
        m.id === updatedMeeting.id ? updatedMeeting : m
      );
      
      setMeetings(updatedMeetings);
      setSelectedMeeting(updatedMeeting);
      setShowSummary(true);
      
      toast({
        title: "Summary generated",
        description: "Your meeting summary is ready for review.",
      });
    }, 1500);
  };

  const handleRegenerateSummary = (instructions: string) => {
    if (!selectedMeeting) return;
    
    toast({
      title: "Regenerating summary",
      description: `Applying your instructions: "${instructions}"`,
    });
    
    setTimeout(() => {
      let newSummary = selectedMeeting.summary || "";
      
      if (instructions.toLowerCase().includes("shorter")) {
        newSummary = `# ${selectedMeeting.name}\n\n## Brief Summary\nTeam aligned on Q2 roadmap priorities and addressed timeline concerns.\n\n## Action Items\n- Alex: Finalize Q2 roadmap (Monday)\n- Sarah: Follow up with marketing\n- Team: Review resource allocation`;
      } else if (instructions.toLowerCase().includes("action")) {
        newSummary = `# ${selectedMeeting.name}\n\n## Action Items\n- Alex: Finalize the Q2 roadmap by next Monday\n- Sarah: Schedule a follow-up meeting with the marketing team\n- Team: Review resource allocation for the upcoming features\n- David: Update the sprint planning document\n- Michelle: Share the revised timeline with stakeholders`;
      } else {
        newSummary += "\n\n## Additional Notes\nBased on your instructions, we've updated this summary with more specific details about the meeting outcomes.";
      }
      
      const updatedMeeting = {
        ...selectedMeeting,
        summary: newSummary
      };
      
      const updatedMeetings = meetings.map(m => 
        m.id === updatedMeeting.id ? updatedMeeting : m
      );
      
      setMeetings(updatedMeetings);
      setSelectedMeeting(updatedMeeting);
      
      toast({
        title: "Summary updated",
        description: "The summary has been regenerated based on your instructions.",
      });
    }, 1000);
  };

  const handleNewMeeting = () => {
    setSelectedMeeting(undefined);
    setShowSummary(false);
    setActiveTab("form");
  };

  const handleCloseSummary = () => {
    setShowSummary(false);
    setActiveTab("calendar");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-2 animate-fade-in">
                Meeting Summary Tool
              </h1>
              <p className="text-lg text-muted-foreground animate-fade-in opacity-90">
                Transform your meeting notes into actionable summaries
              </p>
            </div>
            
            <Button 
              onClick={handleNewMeeting}
              className="md:self-end animate-fade-in flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              <span>New Meeting</span>
            </Button>
          </div>
        </header>

        <main className="min-h-[600px]">
          {showSummary && selectedMeeting ? (
            <SummaryOutput 
              meeting={selectedMeeting} 
              onRegenerateRequest={handleRegenerateSummary}
              onClose={handleCloseSummary}
            />
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="animate-fade-in">
              <TabsList className="glass-card mb-6">
                <TabsTrigger value="calendar" className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  <span>Calendar View</span>
                </TabsTrigger>
                <TabsTrigger value="form">Meeting Form</TabsTrigger>
              </TabsList>
              
              <TabsContent value="calendar" className="mt-0">
                <Calendar 
                  meetings={meetings} 
                  onSelectMeeting={handleSelectMeeting} 
                />
              </TabsContent>
              
              <TabsContent value="form" className="mt-0">
                <MeetingForm
                  meeting={selectedMeeting}
                  onSave={handleSaveMeeting}
                  onGenerate={handleGenerateSummary}
                  selectedProvider={selectedProvider}
                  selectedModel={selectedModel}
                  config={config}
                  onProviderChange={setSelectedProvider}
                  onModelChange={setSelectedModel}
                  onConfigChange={setConfig}
                />
              </TabsContent>
            </Tabs>
          )}
        </main>
        
        <footer className="mt-10 text-center text-sm text-muted-foreground animate-fade-in">
          <p>Meeting Summary Tool - For Mobileye Product & Project Managers</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
