
import { useState, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { X, Check, Tag as TagIcon } from "lucide-react";
import { Tag } from "@/utils/types";
import { cn } from "@/lib/utils";

interface TagInputProps {
  allTags: Tag[];
  selectedTags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
}

const TagInput = ({ allTags, selectedTags, onTagsChange }: TagInputProps) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSelect = (tagId: string) => {
    const selectedTag = allTags.find(tag => tag.id === tagId);
    
    if (selectedTag && !selectedTags.some(tag => tag.id === tagId)) {
      const newSelectedTags = [...selectedTags, selectedTag];
      onTagsChange(newSelectedTags);
    }
    
    setInputValue('');
    setOpen(false);
  };

  const createNewTag = () => {
    if (!inputValue.trim()) return;
    
    // Check if tag already exists
    const existingTag = allTags.find(tag => 
      tag.name.toLowerCase() === inputValue.trim().toLowerCase()
    );
    
    if (existingTag) {
      handleSelect(existingTag.id);
      return;
    }
    
    // Create a new tag
    const newTag: Tag = {
      id: `new-${Date.now()}`,
      name: inputValue.trim().toLowerCase()
    };
    
    // Simulate adding to all tags and selecting it
    // In a real app, you'd save this to your backend
    const newSelectedTags = [...selectedTags, newTag];
    onTagsChange(newSelectedTags);
    
    setInputValue('');
    setOpen(false);
  };

  const removeTag = (tagId: string) => {
    const filteredTags = selectedTags.filter(tag => tag.id !== tagId);
    onTagsChange(filteredTags);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const target = e.target as HTMLInputElement;
    
    if (e.key === 'Enter' && inputValue) {
      e.preventDefault();
      createNewTag();
    } else if (e.key === 'Backspace' && !target.value && selectedTags.length > 0) {
      removeTag(selectedTags[selectedTags.length - 1].id);
    }
  };

  // Filter tags based on input
  const filteredTags = allTags.filter(tag => 
    !selectedTags.some(selectedTag => selectedTag.id === tag.id) &&
    tag.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div className="relative">
      <div className="flex items-center h-10">
        <TagIcon className="ml-2 h-4 w-4 shrink-0 text-muted-foreground" />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              role="combobox"
              aria-expanded={open}
              className="flex-1 flex items-center h-full px-2 text-sm focus:outline-none focus:ring-0 rounded-md"
              onClick={() => inputRef.current?.focus()}
            >
              <div className="flex flex-wrap gap-1 flex-1">
                {selectedTags.map((tag) => (
                  <Badge 
                    key={tag.id} 
                    variant="secondary" 
                    className="px-2 py-0 h-6 text-xs gap-1 bg-secondary/50 backdrop-blur-sm animate-scale-in"
                  >
                    {tag.name}
                    <button
                      type="button"
                      className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeTag(tag.id);
                      }}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove {tag.name}</span>
                    </button>
                  </Badge>
                ))}
                <input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    if (!open && e.target.value) {
                      setOpen(true);
                    }
                  }}
                  onFocus={() => setOpen(true)}
                  className="flex-1 bg-transparent outline-none min-w-[120px] placeholder:text-muted-foreground text-sm"
                  placeholder={selectedTags.length > 0 ? "" : "Add tags..."}
                  onKeyDown={handleKeyDown}
                  disabled={false}
                />
              </div>
            </button>
          </PopoverTrigger>
          <PopoverContent 
            className="p-0 w-[var(--radix-popover-trigger-width)] max-h-[300px] overflow-auto" 
            align="start"
            side="bottom"
          >
            <Command className="rounded-lg border shadow-md animate-scale-in">
              <CommandInput placeholder="Search tags..." value={inputValue} onValueChange={setInputValue} />
              <CommandList>
                <CommandEmpty className="py-6 text-center text-sm">
                  <p className="mb-2">No tag found.</p>
                  {inputValue && (
                    <button
                      onClick={createNewTag}
                      className="mx-auto text-primary text-xs flex items-center gap-1 hover:underline"
                    >
                      <span>Create "{inputValue}"</span>
                    </button>
                  )}
                </CommandEmpty>
                <CommandGroup heading="Available Tags">
                  {filteredTags.map(tag => (
                    <CommandItem
                      key={tag.id}
                      value={tag.name}
                      onSelect={() => handleSelect(tag.id)}
                      className="text-sm flex items-center gap-2"
                    >
                      <span>{tag.name}</span>
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          selectedTags.some(selectedTag => selectedTag.id === tag.id)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default TagInput;
