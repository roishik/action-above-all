
import { Meeting, ModelOption, Tag } from "./types";

export const modelOptions: ModelOption[] = [
  {
    provider: "openai",
    models: ["gpt-4", "gpt-4-turbo", "gpt-3.5-turbo"]
  },
  {
    provider: "anthropic",
    models: ["claude-3-opus", "claude-3-sonnet", "claude-3-haiku"]
  },
  {
    provider: "mobileye",
    models: ["mobileye-large", "mobileye-small"]
  }
];

export const sampleTags: Tag[] = [
  { id: "1", name: "product" },
  { id: "2", name: "project" },
  { id: "3", name: "weekly" },
  { id: "4", name: "roadmap" },
  { id: "5", name: "planning" },
  { id: "6", name: "design-review" },
  { id: "7", name: "strategy" },
  { id: "8", name: "important" },
  { id: "9", name: "follow-up" }
];

// Create sample meetings for the last 30 days
export const generateSampleMeetings = (): Meeting[] => {
  const meetings: Meeting[] = [];
  const now = new Date();
  
  // Past meetings
  for (let i = 0; i < 15; i++) {
    const meetingDate = new Date();
    meetingDate.setDate(now.getDate() - Math.floor(Math.random() * 30));
    
    const randomTags = sampleTags
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 3) + 1);
    
    const meeting: Meeting = {
      id: `past-${i}`,
      name: `${i % 2 === 0 ? 'Weekly' : 'Product'} Meeting ${i + 1}`,
      date: meetingDate,
      time: `${10 + Math.floor(Math.random() * 8)}:00`,
      context: "Mobileye product development team context",
      notes: "• Discussed roadmap priorities\n• Team raised concerns about timeline\n• New feature requests from marketing",
      transcript: i % 3 === 0 ? "Full transcript of the meeting..." : undefined,
      summary: "Team agreed on roadmap priorities with adjusted timeline. Marketing's new feature requests to be evaluated in next sprint planning.",
      tags: randomTags,
      provider: "openai",
      model: "gpt-4"
    };
    
    meetings.push(meeting);
  }
  
  // Future meetings
  for (let i = 0; i < 5; i++) {
    const meetingDate = new Date();
    meetingDate.setDate(now.getDate() + Math.floor(Math.random() * 10) + 1);
    
    const randomTags = sampleTags
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 3) + 1);
    
    const meeting: Meeting = {
      id: `future-${i}`,
      name: `Upcoming Meeting ${i + 1}`,
      date: meetingDate,
      time: `${10 + Math.floor(Math.random() * 8)}:00`,
      context: "Mobileye product development team context",
      tags: randomTags,
      provider: undefined,
      model: undefined
    };
    
    meetings.push(meeting);
  }
  
  return meetings.sort((a, b) => a.date.getTime() - b.date.getTime());
};

export const sampleMeetings = generateSampleMeetings();
