import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Lightbulb,
  FileText,
  ExternalLink
} from "lucide-react";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  suggestions?: string[];
  relatedIncidents?: string[];
}

const mockMessages: Message[] = [
  {
    id: "1",
    type: "assistant",
    content: "Hello! I'm your AI assistant for incident resolution. I can help you with troubleshooting, finding similar incidents, or answering questions about your IT infrastructure. How can I assist you today?",
    timestamp: new Date(Date.now() - 300000),
    suggestions: [
      "Show me incidents similar to email connectivity issues",
      "How do I troubleshoot VPN connection problems?",
      "What are the most common database performance issues?"
    ]
  }
];

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant", 
        content: `I understand you're asking about "${inputMessage}". Based on our knowledge base and incident history, here are some insights that might help you resolve this issue. Would you like me to search for similar incidents or provide specific troubleshooting steps?`,
        timestamp: new Date(),
        suggestions: [
          "Search for similar incidents",
          "Provide troubleshooting steps",
          "Check knowledge base articles"
        ],
        relatedIncidents: ["INC0012345", "INC0012340", "INC0012330"]
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 2000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  return (
    <div className="h-full flex flex-col">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="border-b bg-gradient-card">
          <CardTitle className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-primary" />
            <span>AI Assistant</span>
            <Badge variant="secondary" className="ml-auto">
              Available 24/7
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 p-0">
          <ScrollArea className="h-[600px] p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.type === "assistant" && (
                        <Bot className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                      )}
                      {message.type === "user" && (
                        <User className="h-4 w-4 mt-0.5 text-primary-foreground flex-shrink-0" />
                      )}
                      <div className="space-y-2">
                        <p className="text-sm">{message.content}</p>
                        
                        {message.suggestions && (
                          <div className="space-y-1">
                            <p className="text-xs opacity-75 flex items-center">
                              <Lightbulb className="h-3 w-3 mr-1" />
                              Suggested follow-ups:
                            </p>
                            {message.suggestions.map((suggestion, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                className="text-xs h-6 mr-1 mb-1"
                                onClick={() => handleSuggestionClick(suggestion)}
                              >
                                {suggestion}
                              </Button>
                            ))}
                          </div>
                        )}

                        {message.relatedIncidents && (
                          <div className="space-y-1">
                            <p className="text-xs opacity-75 flex items-center">
                              <FileText className="h-3 w-3 mr-1" />
                              Related incidents:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {message.relatedIncidents.map((incident, index) => (
                                <Button
                                  key={index}
                                  variant="ghost"
                                  size="sm"
                                  className="text-xs h-6 p-1"
                                >
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  {incident}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <p className="text-xs opacity-50">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-4 w-4 text-primary" />
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>

        <div className="border-t p-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Ask me anything about incident resolution..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              disabled={isLoading}
            />
            <Button 
              onClick={sendMessage} 
              disabled={!inputMessage.trim() || isLoading}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};