import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Lightbulb,
  FileText,
  ExternalLink,
  Zap,
  Play,
  Pause,
  CheckCircle,
  AlertTriangle,
  Brain,
  BarChart3,
  Search
} from "lucide-react";

interface Message {
  id: string;
  type: "user" | "assistant" | "agent";
  content: string;
  timestamp: Date;
  suggestions?: string[];
  relatedIncidents?: string[];
  agentActions?: AgentAction[];
  analysisResults?: AnalysisResult[];
}

interface AgentAction {
  id: string;
  name: string;
  description: string;
  status: "pending" | "running" | "completed" | "failed";
  progress?: number;
  result?: string;
}

interface AnalysisResult {
  type: "pattern" | "root_cause" | "recommendation" | "similar_incidents";
  title: string;
  description: string;
  confidence: number;
  data?: any;
}

const mockMessages: Message[] = [
  {
    id: "1",
    type: "assistant",
    content: "Hello! I'm your enhanced AI assistant for incident resolution. I can now perform deep incident analysis, pattern recognition, and execute automated resolution steps. How can I help you today?",
    timestamp: new Date(Date.now() - 300000),
    suggestions: [
      "Analyze incident patterns in my queue",
      "Execute automated diagnostics on INC0012345",
      "Find root cause for recurring email issues",
      "Generate automated resolution plan"
    ]
  }
];

export const EnhancedChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [runningAgents, setRunningAgents] = useState<string[]>([]);

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

    // Simulate AI response with agent capabilities
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "agent",
        content: `I'm analyzing "${inputMessage}". I can perform automated diagnostics and execute resolution steps. Here's what I found:`,
        timestamp: new Date(),
        suggestions: [
          "Execute automated resolution",
          "Run detailed analysis",
          "Schedule preventive actions"
        ],
        relatedIncidents: ["INC0012345", "INC0012340", "INC0012330"],
        agentActions: [
          {
            id: "1",
            name: "System Diagnostics",
            description: "Running automated system health checks",
            status: "pending"
          },
          {
            id: "2", 
            name: "Log Analysis",
            description: "Analyzing error logs for patterns",
            status: "pending"
          },
          {
            id: "3",
            name: "Network Connectivity",
            description: "Testing network connectivity and latency",
            status: "pending"
          }
        ],
        analysisResults: [
          {
            type: "pattern",
            title: "Recurring Pattern Detected",
            description: "Similar incidents occur every Tuesday at 2 PM",
            confidence: 85
          },
          {
            type: "root_cause",
            title: "Potential Root Cause",
            description: "Memory leak in email service causing periodic failures",
            confidence: 78
          }
        ]
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 2000);
  };

  const executeAgentAction = (messageId: string, actionId: string) => {
    setRunningAgents(prev => [...prev, actionId]);
    
    setMessages(prev => prev.map(message => {
      if (message.id === messageId && message.agentActions) {
        return {
          ...message,
          agentActions: message.agentActions.map(action => 
            action.id === actionId 
              ? { ...action, status: "running" as const, progress: 0 }
              : action
          )
        };
      }
      return message;
    }));

    // Simulate action execution
    const interval = setInterval(() => {
      setMessages(prev => prev.map(message => {
        if (message.id === messageId && message.agentActions) {
          return {
            ...message,
            agentActions: message.agentActions.map(action => {
              if (action.id === actionId && action.status === "running") {
                const newProgress = (action.progress || 0) + 20;
                if (newProgress >= 100) {
                  clearInterval(interval);
                  setRunningAgents(prev => prev.filter(id => id !== actionId));
                  return { 
                    ...action, 
                    status: "completed" as const, 
                    progress: 100,
                    result: "✅ Action completed successfully"
                  };
                }
                return { ...action, progress: newProgress };
              }
              return action;
            })
          };
        }
        return message;
      }));
    }, 500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  const getActionIcon = (status: string) => {
    switch (status) {
      case "running": return <Loader2 className="h-4 w-4 animate-spin" />;
      case "completed": return <CheckCircle className="h-4 w-4 text-accent" />;
      case "failed": return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default: return <Play className="h-4 w-4" />;
    }
  };

  const getAnalysisIcon = (type: string) => {
    switch (type) {
      case "pattern": return <BarChart3 className="h-4 w-4 text-primary" />;
      case "root_cause": return <Search className="h-4 w-4 text-warning" />;
      case "recommendation": return <Lightbulb className="h-4 w-4 text-accent" />;
      case "similar_incidents": return <FileText className="h-4 w-4 text-secondary" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="border-b bg-gradient-agent">
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-primary" />
            <span>AI Agent Assistant</span>
            <Badge variant="secondary" className="ml-auto bg-agent-accent text-purple-800">
              Enhanced Analytics & Automation
            </Badge>
          </CardTitle>
        </CardHeader>

        <div className="flex-1 flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="border-b p-2">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="chat">Chat & Analysis</TabsTrigger>
                <TabsTrigger value="agents">Agent Actions</TabsTrigger>
                <TabsTrigger value="insights">Insights</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="chat" className="flex-1 p-0">
              <ScrollArea className="h-[600px] p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className="space-y-3">
                      <div
                        className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.type === "user"
                              ? "bg-primary text-primary-foreground"
                              : message.type === "agent"
                              ? "bg-gradient-agent text-white shadow-glow"
                              : "bg-muted"
                          }`}
                        >
                          <div className="flex items-start space-x-2">
                            {message.type === "assistant" && (
                              <Bot className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                            )}
                            {message.type === "agent" && (
                              <Brain className="h-4 w-4 mt-0.5 text-white flex-shrink-0" />
                            )}
                            {message.type === "user" && (
                              <User className="h-4 w-4 mt-0.5 text-primary-foreground flex-shrink-0" />
                            )}
                            <div className="space-y-2">
                              <p className="text-sm">{message.content}</p>
                              
                              {/* Analysis Results */}
                              {message.analysisResults && (
                                <div className="space-y-2">
                                  <p className="text-xs opacity-75 flex items-center">
                                    <Brain className="h-3 w-3 mr-1" />
                                    Analysis Results:
                                  </p>
                                  {message.analysisResults.map((result, index) => (
                                    <div key={index} className="bg-black/10 rounded-lg p-2 text-xs">
                                      <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center space-x-1">
                                          {getAnalysisIcon(result.type)}
                                          <span className="font-medium">{result.title}</span>
                                        </div>
                                        <Badge className="h-4 text-xs">
                                          {result.confidence}%
                                        </Badge>
                                      </div>
                                      <p className="opacity-90">{result.description}</p>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Agent Actions */}
                              {message.agentActions && (
                                <div className="space-y-2">
                                  <p className="text-xs opacity-75 flex items-center">
                                    <Zap className="h-3 w-3 mr-1" />
                                    Available Actions:
                                  </p>
                                  {message.agentActions.map((action) => (
                                    <div key={action.id} className="bg-black/10 rounded-lg p-2">
                                      <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center space-x-2">
                                          {getActionIcon(action.status)}
                                          <span className="text-xs font-medium">{action.name}</span>
                                        </div>
                                        {action.status === "pending" && (
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-6 text-xs"
                                            onClick={() => executeAgentAction(message.id, action.id)}
                                          >
                                            Execute
                                          </Button>
                                        )}
                                      </div>
                                      <p className="text-xs opacity-90 mb-1">{action.description}</p>
                                      {action.progress !== undefined && (
                                        <div className="w-full bg-black/20 rounded-full h-1 mb-1">
                                          <div 
                                            className="bg-white h-1 rounded-full transition-all duration-300"
                                            style={{ width: `${action.progress}%` }}
                                          />
                                        </div>
                                      )}
                                      {action.result && (
                                        <p className="text-xs text-green-200">{action.result}</p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}

                              {message.suggestions && (
                                <div className="space-y-1">
                                  <p className="text-xs opacity-75 flex items-center">
                                    <Lightbulb className="h-3 w-3 mr-1" />
                                    Suggested actions:
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
                              
                              <p className="text-xs opacity-50">
                                {message.timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                        <div className="flex items-center space-x-2">
                          <Brain className="h-4 w-4 text-primary" />
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm">AI Agent is analyzing...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="agents" className="flex-1 p-4">
              <div className="text-center py-12">
                <Brain className="mx-auto h-12 w-12 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Agent Management</h3>
                <p className="text-muted-foreground">
                  Configure and monitor autonomous agents for incident resolution
                </p>
              </div>
            </TabsContent>

            <TabsContent value="insights" className="flex-1 p-4">
              <div className="text-center py-12">
                <BarChart3 className="mx-auto h-12 w-12 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Analytics & Insights</h3>
                <p className="text-muted-foreground">
                  View patterns, trends, and predictive insights from incident data
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="border-t p-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Ask me to analyze incidents, execute actions, or provide insights..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              disabled={isLoading}
            />
            <Button 
              onClick={sendMessage} 
              disabled={!inputMessage.trim() || isLoading}
              size="icon"
              className="bg-gradient-agent hover:opacity-90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};