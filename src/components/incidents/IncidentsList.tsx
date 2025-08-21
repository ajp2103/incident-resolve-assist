import { useState } from "react";
import { IncidentCard } from "./IncidentCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, SortAsc } from "lucide-react";

// Mock data for demonstration
const mockIncidents = [
  {
    id: "1",
    number: "INC0012345",
    title: "Email Server Connectivity Issues",
    description: "Users unable to connect to email server. Multiple reports of timeout errors when trying to access mailboxes.",
    priority: "high" as const,
    status: "new" as const,
    assignee: "John Smith",
    createdAt: "2 hours ago",
    updatedAt: "1 hour ago",
    category: "Email Systems"
  },
  {
    id: "2", 
    number: "INC0012346",
    title: "VPN Connection Failures",
    description: "Remote users experiencing intermittent VPN disconnections. Issue appears to be affecting multiple locations.",
    priority: "medium" as const,
    status: "in-progress" as const,
    assignee: "Sarah Johnson",
    createdAt: "4 hours ago",
    updatedAt: "30 minutes ago",
    category: "Network"
  },
  {
    id: "3",
    number: "INC0012347", 
    title: "Database Performance Degradation",
    description: "Application database showing slow response times. Query execution taking significantly longer than normal.",
    priority: "critical" as const,
    status: "new" as const,
    assignee: "Mike Chen",
    createdAt: "1 hour ago",
    updatedAt: "1 hour ago",
    category: "Database"
  },
  {
    id: "4",
    number: "INC0012348",
    title: "Printer Queue Stuck",
    description: "Print jobs accumulating in queue but not processing. Affecting multiple printers on floor 3.",
    priority: "low" as const,
    status: "in-progress" as const,
    assignee: "Lisa Wong",
    createdAt: "6 hours ago", 
    updatedAt: "2 hours ago",
    category: "Hardware"
  }
];

interface IncidentsListProps {
  onGenerateRecommendation: (incident: any) => void;
}

export const IncidentsList = ({ onGenerateRecommendation }: IncidentsListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const filteredIncidents = mockIncidents.filter(incident => {
    const matchesSearch = incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.number.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || incident.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || incident.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search incidents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon">
            <SortAsc className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredIncidents.length} of {mockIncidents.length} incidents
        </p>
      </div>

      {/* Incidents Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredIncidents.map((incident) => (
          <IncidentCard
            key={incident.id}
            incident={incident}
            onGenerateRecommendation={onGenerateRecommendation}
          />
        ))}
      </div>

      {filteredIncidents.length === 0 && (
        <div className="text-center py-12">
          <Filter className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No incidents found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search criteria or filters.
          </p>
        </div>
      )}
    </div>
  );
};