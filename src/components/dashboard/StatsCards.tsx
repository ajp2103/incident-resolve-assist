import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Ticket, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  Zap,
  Users
} from "lucide-react";

const stats = [
  {
    title: "My Open Incidents",
    value: "12",
    change: "+2 from yesterday",
    trend: "up",
    icon: Ticket,
    color: "text-blue-600"
  },
  {
    title: "Avg Resolution Time",
    value: "4.2h",
    change: "-15% this week",
    trend: "down",
    icon: Clock,
    color: "text-amber-600"
  },
  {
    title: "Resolved Today",
    value: "8",
    change: "+3 from yesterday",
    trend: "up", 
    icon: CheckCircle,
    color: "text-green-600"
  },
  {
    title: "AI Recommendations",
    value: "23",
    change: "Generated this week",
    trend: "neutral",
    icon: Zap,
    color: "text-purple-600"
  },
  {
    title: "Team Performance",
    value: "94%",
    change: "SLA compliance",
    trend: "up",
    icon: Users,
    color: "text-indigo-600"
  },
  {
    title: "Knowledge Base",
    value: "156",
    change: "Articles referenced",
    trend: "neutral",
    icon: TrendingUp,
    color: "text-teal-600"
  }
];

export const StatsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-card transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center mt-1">
              <span className="text-xs text-muted-foreground">{stat.change}</span>
              {stat.trend !== "neutral" && (
                <Badge 
                  variant="secondary" 
                  className={`ml-2 text-xs ${
                    stat.trend === "up" 
                      ? "text-green-700 bg-green-100" 
                      : "text-red-700 bg-red-100"
                  }`}
                >
                  {stat.trend === "up" ? "↗" : "↘"}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};