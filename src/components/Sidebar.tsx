
import { useState } from "react";
import { cn } from "../lib/utils";
import { 
  ChartLine, 
  Bell, 
  MessageCircle, 
  ChartBar 
} from "lucide-react";

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const Sidebar = ({ activeSection, setActiveSection }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: ChartBar,
      description: "Overview & Insights",
      color: "text-coral"
    },
    {
      id: "warehouse",
      label: "Warehouse",
      icon: ChartLine,
      description: "Analytics & BI",
      color: "text-mint"
    },
    {
      id: "operator",
      label: "Operator Panel",
      icon: Bell,
      description: "Automation Engine",
      color: "text-tangerine"
    },
    {
      id: "feedback",
      label: "Feedback Loop",
      icon: MessageCircle,
      description: "Sentiment Analysis",
      color: "text-lavender"
    }
  ];

  return (
    <>
      <div 
        className={cn(
          "fixed left-0 top-0 h-full bg-card border-r border-border z-50 transition-all duration-300 shadow-lg",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        <div className="p-4 border-b border-border bg-gradient-to-r from-coral/5 to-mint/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-coral to-tangerine rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">OE</span>
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="font-semibold text-lg text-coral">Operator Engine</h1>
                <p className="text-xs text-muted-foreground">Analytics Platform</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3 top-6 w-6 h-6 bg-coral rounded-full flex items-center justify-center text-white text-xs hover:scale-110 transition-transform shadow-md"
          >
            {isCollapsed ? "→" : "←"}
          </button>
        </div>

        <nav className="p-2 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group hover:bg-accent",
                  activeSection === item.id && "bg-gradient-to-r from-coral/10 to-mint/5 border border-coral/20 shadow-sm"
                )}
              >
                <Icon className={cn("w-5 h-5 flex-shrink-0", 
                  activeSection === item.id ? "text-coral" : item.color
                )} />
                {!isCollapsed && (
                  <div className="text-left">
                    <div className={cn("font-medium text-sm", 
                      activeSection === item.id ? "text-coral" : "text-foreground"
                    )}>
                      {item.label}
                    </div>
                    <div className="text-xs text-muted-foreground">{item.description}</div>
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
