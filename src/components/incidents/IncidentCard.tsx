import { Clock, User, AlertCircle, Zap } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Incident {
  id: string;
  number: string;
  title: string;
  description: string;
  priority: "critical" | "high" | "medium" | "low";
  status: "new" | "in-progress" | "resolved" | "closed";
  assignee: string;
  createdAt: string;
  updatedAt: string;
  category: string;
}

interface IncidentCardProps {
  incident: Incident;
  onGenerateRecommendation: (incident: Incident) => void;
}

const priorityConfig = {
  critical: { color: "priority-critical", icon: AlertCircle },
  high: { color: "priority-high", icon: AlertCircle },
  medium: { color: "priority-medium", icon: Clock },
  low: { color: "priority-low", icon: Clock },
};

const statusConfig = {
  new: "status-new",
  "in-progress": "status-in-progress", 
  resolved: "status-resolved",
  closed: "status-closed",
};

export const IncidentCard = ({ incident, onGenerateRecommendation }: IncidentCardProps) => {
  const PriorityIcon = priorityConfig[incident.priority].icon;

  return (
    <Card className="hover:shadow-card transition-all duration-200 hover:scale-[1.02] border-l-4 border-l-primary">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-sm text-muted-foreground">
                {incident.number}
              </span>
              <Badge className={cn("text-xs", statusConfig[incident.status])}>
                {incident.status.replace("-", " ").toUpperCase()}
              </Badge>
            </div>
            <h3 className="font-semibold text-lg leading-tight">
              {incident.title}
            </h3>
          </div>
          <div className="flex items-center space-x-1">
            <PriorityIcon className={cn("h-4 w-4", 
              incident.priority === "critical" || incident.priority === "high" 
                ? "text-destructive" 
                : "text-warning"
            )} />
            <Badge variant="outline" className={cn("text-xs capitalize")}>
              {incident.priority}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {incident.description}
        </p>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <User className="h-3 w-3" />
              <span>{incident.assignee}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{incident.createdAt}</span>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs">
            {incident.category}
          </Badge>
        </div>

        <div className="pt-2">
          <Button
            onClick={() => onGenerateRecommendation(incident)}
            className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
            size="sm"
          >
            <Zap className="mr-2 h-4 w-4" />
            Generate AI Recommendation
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};