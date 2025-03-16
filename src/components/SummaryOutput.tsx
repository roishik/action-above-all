
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Copy, Download, Sparkles } from "lucide-react";
import { Meeting } from "@/utils/types";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface SummaryOutputProps {
  meeting: Meeting;
  onRegenerateRequest: (instructions: string) => void;
  onClose: () => void;
}

const SummaryOutput: React.FC<SummaryOutputProps> = ({
  meeting,
  onRegenerateRequest,
  onClose,
}) => {
  const [summary, setSummary] = useState(meeting.summary || "");
  const [instructions, setInstructions] = useState("");
  const { toast } = useToast();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(summary);
    toast({
      title: "Copied to clipboard",
      description: "The summary has been copied to your clipboard.",
    });
  };

  const downloadJSON = () => {
    const data = {
      id: meeting.id,
      name: meeting.name,
      date: format(meeting.date, "yyyy-MM-dd"),
      time: meeting.time,
      context: meeting.context,
      notes: meeting.notes,
      transcript: meeting.transcript,
      summary: summary,
      tags: meeting.tags,
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = `${meeting.name.replace(/\s+/g, "_")}_${format(meeting.date, "yyyy-MM-dd")}.json`;
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
    
    toast({
      title: "Summary exported",
      description: "The meeting data has been exported as JSON.",
    });
  };

  return (
    <Card className="glass-card animate-scale-in">
      <CardHeader>
        <CardTitle className="text-xl">Meeting Summary</CardTitle>
        <CardDescription>
          Review and edit the generated summary for your meeting.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground mb-2">
            <strong>{meeting.name}</strong> • {format(meeting.date, "PPP")} at {meeting.time}
          </div>
          <Textarea
            className="min-h-[300px] font-sans text-base"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Your meeting summary will appear here..."
          />
        </div>

        <div className="space-y-2 pt-4 border-t">
          <Label htmlFor="instructions">Regeneration Instructions</Label>
          <div className="flex space-x-2">
            <Input
              id="instructions"
              placeholder="Make it shorter" 
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => {
                if (instructions.trim()) {
                  onRegenerateRequest(instructions);
                }
              }}
              disabled={!instructions.trim()}
            >
              <Sparkles className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Add specific instructions to refine the summary (e.g., "Make it shorter", "Focus on action items")
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="space-x-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={copyToClipboard}
          >
            <Copy className="h-4 w-4" />
            <span>Copy</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={downloadJSON}
          >
            <Download className="h-4 w-4" />
            <span>Export JSON</span>
          </Button>
        </div>
        <Button onClick={onClose}>Done</Button>
      </CardFooter>
    </Card>
  );
};

export default SummaryOutput;
