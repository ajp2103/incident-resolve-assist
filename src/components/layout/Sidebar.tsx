import { 
  Home, 
  Ticket, 
  Search, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  Users,
  Brain,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const menuItems = [
    { id: "dashboard", icon: Home, label: "Dashboard", count: null },
    { id: "incidents", icon: Ticket, label: "My Incidents", count: 12 },
    { id: "search", icon: Search, label: "Search & Resolve", count: null },
    { id: "chat", icon: MessageSquare, label: "AI Assistant", count: null },
    { id: "knowledge", icon: Brain, label: "Knowledge Base", count: null },
    { id: "reports", icon: FileText, label: "Reports", count: null },
  ];

  const adminItems = [
    { id: "analytics", icon: BarChart3, label: "Analytics", count: null },
    { id: "teams", icon: Users, label: "Teams & Queues", count: null },
    { id: "settings", icon: Settings, label: "Admin Settings", count: null },
  ];

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border">
      <div className="p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              className={cn(
                "w-full justify-start",
                activeTab === item.id 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
              onClick={() => onTabChange(item.id)}
            >
              <item.icon className="mr-3 h-4 w-4" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.count && (
                <Badge variant="secondary" className="ml-auto">
                  {item.count}
                </Badge>
              )}
            </Button>
          ))}
        </nav>

        <div className="mt-8">
          <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Administration
          </h3>
          <nav className="space-y-1">
            {adminItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  activeTab === item.id 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
                onClick={() => onTabChange(item.id)}
              >
                <item.icon className="mr-3 h-4 w-4" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.count && (
                  <Badge variant="secondary" className="ml-auto">
                    {item.count}
                  </Badge>
                )}
              </Button>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
};