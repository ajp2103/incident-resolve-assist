import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { IncidentsList } from "@/components/incidents/IncidentsList";
import { RecommendationPanel } from "@/components/recommendations/RecommendationPanel";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { StatsCards } from "@/components/dashboard/StatsCards";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedIncident, setSelectedIncident] = useState(null);

  const handleGenerateRecommendation = (incident: any) => {
    setSelectedIncident(incident);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">
                Overview of your incident resolution activities
              </p>
            </div>
            <StatsCards />
            <div>
              <h2 className="text-xl font-semibold mb-4">Recent Incidents</h2>
              <IncidentsList onGenerateRecommendation={handleGenerateRecommendation} />
            </div>
          </div>
        );
      case "incidents":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">My Incidents</h1>
              <p className="text-muted-foreground">
                Incidents assigned to you for resolution
              </p>
            </div>
            <IncidentsList onGenerateRecommendation={handleGenerateRecommendation} />
          </div>
        );
      case "search":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Search & Resolve</h1>
              <p className="text-muted-foreground">
                Search for incidents and generate AI-powered recommendations
              </p>
            </div>
            <IncidentsList onGenerateRecommendation={handleGenerateRecommendation} />
          </div>
        );
      case "chat":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">AI Assistant</h1>
              <p className="text-muted-foreground">
                Get instant help with incident resolution and troubleshooting
              </p>
            </div>
            <ChatInterface />
          </div>
        );
      case "knowledge":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Knowledge Base</h1>
              <p className="text-muted-foreground">
                Browse articles, documentation, and best practices
              </p>
            </div>
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
              <p className="text-muted-foreground">
                Knowledge base integration is being developed
              </p>
            </div>
          </div>
        );
      case "analytics":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Analytics</h1>
              <p className="text-muted-foreground">
                Performance metrics and insights
              </p>
            </div>
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
              <p className="text-muted-foreground">
                Analytics dashboard is being developed
              </p>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">
                Overview of your incident resolution activities
              </p>
            </div>
            <StatsCards />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
      
      {selectedIncident && (
        <RecommendationPanel
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
        />
      )}
    </div>
  );
};

export default Index;
