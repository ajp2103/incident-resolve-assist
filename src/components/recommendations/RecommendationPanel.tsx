import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle, 
  Clock, 
  Lightbulb, 
  FileText, 
  ThumbsUp, 
  ThumbsDown,
  MessageSquare,
  ExternalLink,
  Copy,
  Play,
  Pause,
  RefreshCw,
  Cog,
  Zap,
  Bot
} from "lucide-react";

interface RecommendationPanelProps {
  incident: any;
  onClose: () => void;
}

// Mock recommendation data
const mockRecommendation = {
  confidence: 85,
  steps: [
    {
      id: 1,
      title: "Verify Email Service Status",
      description: "Check if the email service is running on the server",
      command: "systemctl status postfix",
      estimatedTime: "2 minutes"
    },
    {
      id: 2, 
      title: "Check Network Connectivity",
      description: "Test network connectivity to email server from affected machines",
      command: "telnet mail.company.com 25",
      estimatedTime: "3 minutes"
    },
    {
      id: 3,
      title: "Review Email Logs",
      description: "Examine email server logs for error messages",
      command: "tail -f /var/log/mail.log",
      estimatedTime: "5 minutes"
    },
    {
      id: 4,
      title: "Restart Email Service",
      description: "If errors found, restart the email service",
      command: "systemctl restart postfix",
      estimatedTime: "1 minute"
    }
  ],
  similarIncidents: [
    {
      id: "INC0012001",
      title: "Email Server Down",
      resolvedDate: "2024-01-15",
      resolution: "Restarted postfix service after disk space cleanup",
      similarity: 92
    },
    {
      id: "INC0011890", 
      title: "SMTP Connection Timeout",
      resolvedDate: "2024-01-10",
      resolution: "Fixed firewall blocking SMTP traffic",
      similarity: 78
    },
    {
      id: "INC0011776",
      title: "Mail Queue Backup",
      resolvedDate: "2024-01-08", 
      resolution: "Cleared stuck messages in queue",
      similarity: 65
    }
  ]
};

export const RecommendationPanel = ({ incident, onClose }: RecommendationPanelProps) => {
  const [feedback, setFeedback] = useState("");
  const [selectedSteps, setSelectedSteps] = useState<number[]>([]);
  const [executingSteps, setExecutingSteps] = useState<number[]>([]);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [autoMode, setAutoMode] = useState(false);

  const toggleStep = (stepId: number) => {
    setSelectedSteps(prev => 
      prev.includes(stepId) 
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    );
  };

  const executeStep = async (stepId: number) => {
    setExecutingSteps(prev => [...prev, stepId]);
    
    // Simulate step execution
    setTimeout(() => {
      setExecutingSteps(prev => prev.filter(id => id !== stepId));
      setCompletedSteps(prev => [...prev, stepId]);
    }, 3000);
  };

  const executeAllSteps = async () => {
    setAutoMode(true);
    for (const step of mockRecommendation.steps) {
      await new Promise(resolve => {
        executeStep(step.id);
        setTimeout(resolve, 3500);
      });
    }
    setAutoMode(false);
  };

  const copyCommand = (command: string) => {
    navigator.clipboard.writeText(command);
  };

  const getStepStatus = (stepId: number) => {
    if (completedSteps.includes(stepId)) return "completed";
    if (executingSteps.includes(stepId)) return "executing";
    if (selectedSteps.includes(stepId)) return "selected";
    return "pending";
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
      <div className="fixed inset-4 bg-card rounded-lg shadow-elevation overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b bg-gradient-card">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold">AI Recommendation</h2>
                <p className="text-muted-foreground mt-1">
                  {incident.number} - {incident.title}
                </p>
                <div className="flex items-center mt-2 space-x-2">
                  <Badge className="bg-accent text-accent-foreground">
                    {mockRecommendation.confidence}% Confidence
                  </Badge>
                  <Badge variant="outline">
                    Based on {mockRecommendation.similarIncidents.length} similar cases
                  </Badge>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={executeAllSteps}
                  disabled={autoMode}
                  className="bg-gradient-agent hover:opacity-90"
                >
                  {autoMode ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Auto-Executing...
                    </>
                  ) : (
                    <>
                      <Bot className="mr-2 h-4 w-4" />
                      Auto-Execute All
                    </>
                  )}
                </Button>
                <Button onClick={onClose} variant="outline">
                  Close
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            <Tabs defaultValue="steps" className="h-full flex flex-col">
              <TabsList className="mx-6 mt-4 w-fit">
                <TabsTrigger value="steps">Resolution Steps</TabsTrigger>
                <TabsTrigger value="similar">Similar Incidents</TabsTrigger>
                <TabsTrigger value="agent">Agent Actions</TabsTrigger>
                <TabsTrigger value="feedback">Feedback</TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-auto p-6">
                <TabsContent value="steps" className="space-y-4 mt-0">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Recommended Resolution Steps</h3>
                    <Badge variant="outline">
                      {completedSteps.length}/{mockRecommendation.steps.length} completed
                    </Badge>
                  </div>
                  <div className="grid gap-4">
                    {mockRecommendation.steps.map((step) => {
                      const status = getStepStatus(step.id);
                      return (
                        <Card 
                          key={step.id} 
                          className={`cursor-pointer transition-all ${
                            status === "selected" || status === "completed"
                              ? 'ring-2 ring-accent bg-accent/5' 
                              : status === "executing"
                              ? 'ring-2 ring-primary bg-primary/5'
                              : 'hover:shadow-md'
                          }`}
                          onClick={() => !executingSteps.includes(step.id) && !completedSteps.includes(step.id) && toggleStep(step.id)}
                        >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                status === "completed"
                                  ? 'bg-accent text-accent-foreground'
                                  : status === "executing"
                                  ? 'bg-primary text-primary-foreground'
                                  : status === "selected"
                                  ? 'bg-accent text-accent-foreground'
                                  : 'bg-muted text-muted-foreground'
                              }`}>
                                {status === "completed" ? (
                                  <CheckCircle className="h-4 w-4" />
                                ) : status === "executing" ? (
                                  <RefreshCw className="h-4 w-4 animate-spin" />
                                ) : status === "selected" ? (
                                  <CheckCircle className="h-4 w-4" />
                                ) : (
                                  <span className="text-sm font-semibold">{step.id}</span>
                                )}
                              </div>
                              <div>
                                <CardTitle className="text-lg">{step.title}</CardTitle>
                                <CardDescription>{step.description}</CardDescription>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <span>{step.estimatedTime}</span>
                              </div>
                              {status === "pending" && selectedSteps.includes(step.id) && (
                                <Button
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    executeStep(step.id);
                                  }}
                                  className="bg-gradient-agent hover:opacity-90"
                                >
                                  <Play className="h-4 w-4 mr-1" />
                                  Execute
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="bg-muted rounded-lg p-3 font-mono text-sm flex items-center justify-between">
                            <code>{step.command}</code>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                copyCommand(step.command);
                              }}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )})}
                  </div>
                </TabsContent>

                <TabsContent value="agent" className="space-y-4 mt-0">
                  <div className="space-y-4">
                    <Card className="bg-gradient-agent text-white">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Bot className="h-5 w-5" />
                          <span>Autonomous Agent Controls</span>
                        </CardTitle>
                        <CardDescription className="text-gray-200">
                          Configure and monitor automated resolution execution
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Execution Mode</label>
                            <div className="flex space-x-2">
                              <Button
                                variant={autoMode ? "secondary" : "outline"}
                                size="sm"
                                onClick={() => setAutoMode(!autoMode)}
                                className="bg-white/10 border-white/20 hover:bg-white/20"
                              >
                                <Zap className="h-4 w-4 mr-1" />
                                Auto
                              </Button>
                              <Button
                                variant={!autoMode ? "secondary" : "outline"}
                                size="sm"
                                onClick={() => setAutoMode(false)}
                                className="bg-white/10 border-white/20 hover:bg-white/20"
                              >
                                <Cog className="h-4 w-4 mr-1" />
                                Manual
                              </Button>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Safety Checks</label>
                            <div className="flex items-center space-x-2">
                              <input type="checkbox" defaultChecked className="rounded" />
                              <span className="text-sm">Require approval for critical actions</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="pt-4 border-t border-white/20">
                          <h4 className="text-sm font-medium mb-2">Agent Capabilities</h4>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>✓ System diagnostics</div>
                            <div>✓ Log analysis</div>
                            <div>✓ Service restarts</div>
                            <div>✓ Configuration updates</div>
                            <div>✓ Network testing</div>
                            <div>✓ Performance monitoring</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="similar" className="space-y-4 mt-0">
                  <div className="grid gap-4">
                    {mockRecommendation.similarIncidents.map((similarIncident) => (
                      <Card key={similarIncident.id}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg flex items-center space-x-2">
                                <span>{similarIncident.id}</span>
                                <Badge variant="secondary">
                                  {similarIncident.similarity}% match
                                </Badge>
                              </CardTitle>
                              <CardDescription className="mt-1">
                                {similarIncident.title}
                              </CardDescription>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Resolved: {similarIncident.resolvedDate}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="bg-muted/50 rounded-lg p-3">
                            <h4 className="font-semibold text-sm mb-2 flex items-center">
                              <Lightbulb className="h-4 w-4 mr-2" />
                              Resolution Applied
                            </h4>
                            <p className="text-sm">{similarIncident.resolution}</p>
                          </div>
                          <Button variant="outline" size="sm" className="mt-3">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Full Incident
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="feedback" className="space-y-4 mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>How helpful was this recommendation?</CardTitle>
                      <CardDescription>
                        Your feedback helps improve our AI recommendations
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex space-x-2">
                        <Button variant="outline" className="flex-1">
                          <ThumbsUp className="h-4 w-4 mr-2" />
                          Helpful
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <ThumbsDown className="h-4 w-4 mr-2" />
                          Not Helpful
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Additional Comments</label>
                        <Textarea
                          placeholder="Tell us how we can improve these recommendations..."
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                          rows={4}
                        />
                      </div>
                      
                      <Button className="w-full">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Submit Feedback
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};