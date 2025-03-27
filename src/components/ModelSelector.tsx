
import React, { useState, useEffect } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { ModelOption, Provider, Model, EnvironmentConfig } from "@/utils/types";
import { modelOptions } from "@/utils/mockData";

interface ModelSelectorProps {
  selectedProvider: Provider | undefined;
  selectedModel: Model | undefined;
  onProviderChange: (provider: Provider) => void;
  onModelChange: (model: Model) => void;
  config: EnvironmentConfig;
  onConfigChange: (config: EnvironmentConfig) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedProvider,
  selectedModel,
  onProviderChange,
  onModelChange,
  config,
  onConfigChange
}) => {
  const [availableModels, setAvailableModels] = useState<Model[]>([]);

  useEffect(() => {
    if (selectedProvider) {
      const option = modelOptions.find(opt => opt.provider === selectedProvider);
      if (option) {
        setAvailableModels(option.models);
        
        // If current model isn't in the new list, select the first one
        if (!option.models.includes(selectedModel || "")) {
          onModelChange(option.models[0]);
        }
      } else {
        setAvailableModels([]);
      }
    } else {
      setAvailableModels([]);
    }
  }, [selectedProvider, selectedModel, onModelChange]);

  const handleProviderChange = (value: string) => {
    onProviderChange(value as Provider);
  };

  const handleModelChange = (value: string) => {
    onModelChange(value);
  };

  const handleApiKeyChange = (provider: Provider, apiKey: string) => {
    const newConfig = { ...config };
    
    switch (provider) {
      case "openai":
        newConfig.openaiApiKey = apiKey;
        break;
      case "anthropic":
        newConfig.anthropicApiKey = apiKey;
        break;
      case "google":
        newConfig.googleApiKey = apiKey;
        break;
    }
    
    onConfigChange(newConfig);
  };

  return (
    <div className="flex flex-col space-y-4 md:flex-row md:items-end md:space-y-0 md:space-x-4 animate-fade-in">
      <div className="space-y-2 flex-1">
        <Label htmlFor="provider-select">AI Provider</Label>
        <Select 
          value={selectedProvider} 
          onValueChange={handleProviderChange}
        >
          <SelectTrigger id="provider-select" className="w-full">
            <SelectValue placeholder="Select Provider" />
          </SelectTrigger>
          <SelectContent>
            {modelOptions.map(option => (
              <SelectItem key={option.provider} value={option.provider}>
                {option.provider.charAt(0).toUpperCase() + option.provider.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 flex-1">
        <Label htmlFor="model-select">Model</Label>
        <Select 
          value={selectedModel} 
          onValueChange={handleModelChange}
          disabled={!selectedProvider || availableModels.length === 0}
        >
          <SelectTrigger id="model-select" className="w-full">
            <SelectValue placeholder="Select Model" />
          </SelectTrigger>
          <SelectContent>
            {availableModels.map(model => (
              <SelectItem key={model} value={model}>
                {model}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="h-10 w-10">
              <Settings className="h-4 w-4" />
              <span className="sr-only">Open API configuration</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" align="end">
            <div className="space-y-4">
              <h3 className="font-medium text-sm">API Configuration</h3>
              
              <div className="space-y-2">
                <Label htmlFor="openai-api-key">OpenAI API Key</Label>
                <Input 
                  id="openai-api-key"
                  type="password"
                  value={config.openaiApiKey || ""}
                  onChange={(e) => handleApiKeyChange("openai", e.target.value)}
                  placeholder="sk-..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="anthropic-api-key">Anthropic API Key</Label>
                <Input 
                  id="anthropic-api-key"
                  type="password"
                  value={config.anthropicApiKey || ""}
                  onChange={(e) => handleApiKeyChange("anthropic", e.target.value)}
                  placeholder="sk_ant-..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="google-api-key">Google API Key</Label>
                <Input 
                  id="google-api-key"
                  type="password"
                  value={config.googleApiKey || ""}
                  onChange={(e) => handleApiKeyChange("google", e.target.value)}
                  placeholder="key-..."
                />
              </div>
              
              <p className="text-xs text-muted-foreground">
                API keys are stored locally and never sent to our servers.
              </p>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default ModelSelector;
