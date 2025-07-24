import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  BarChart3, 
  Database, 
  Bell, 
  MessageCircle, 
  Settings,
  Zap,
  Heart
} from "lucide-react";

interface DesktopSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const DesktopSidebar = ({ activeSection, setActiveSection }: DesktopSidebarProps) => {
  const navigationItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: BarChart3,
      description: "Intelligence Hub",
      color: "coral",
      gradient: "from-coral to-coral-light"
    },
    {
      id: "warehouse",
      label: "Warehouse",
      icon: Database,
      description: "Analytics Engine",
      color: "mint",
      gradient: "from-mint to-mint-light"
    },
    {
      id: "operator",
      label: "Operator",
      icon: Bell,
      description: "Automation Suite",
      color: "violet",
      gradient: "from-violet to-violet-light"
    },
    {
      id: "feedback",
      label: "Feedback",
      icon: MessageCircle,
      description: "Emotional Intelligence",
      color: "gold",
      gradient: "from-gold to-gold-light"
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      description: "Control Center",
      color: "muted-foreground",
      gradient: "from-gray-400 to-gray-500"
    }
  ];

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed left-0 top-0 h-full w-80 bg-card/95 backdrop-blur-xl border-r border-border shadow-magical z-50 hidden lg:flex flex-col"
    >
      {/* Logo & Brand */}
      <div className="p-8 border-b border-border">
        <motion.div 
          className="flex items-center gap-4"
          whileHover={{ scale: 1.02 }}
        >
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-hero rounded-2xl flex items-center justify-center shadow-magical hover-scale">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-premium rounded-full flex items-center justify-center shadow-medium">
              <Heart className="w-3 h-3 text-white" />
            </div>
          </div>
          <div>
            <h1 className="font-display font-bold text-xl text-foreground">
              Deep Operator
            </h1>
            {/* <p className="text-sm text-muted-foreground">Revolutionary Analytics</p> */}
          </div>
        </motion.div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 p-6 space-y-3">
        {navigationItems.map((item, index) => {
          const isActive = activeSection === item.id;
          const Icon = item.icon;

          return (
            <motion.button
              key={item.id}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveSection(item.id)}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-2xl transition-smooth text-left group",
                isActive 
                  ? "bg-gradient-to-r from-coral/20 to-mint/20 border border-coral/30 text-coral shadow-medium" 
                  : "hover:bg-gradient-glass hover:shadow-soft text-foreground"
              )}
            >
              <div className={cn(
                "p-3 rounded-xl shadow-soft transition-smooth group-hover:shadow-medium",
                isActive 
                  ? `bg-gradient-to-br ${item.gradient} text-white shadow-magical`
                  : "bg-muted/50 text-muted-foreground group-hover:bg-muted"
              )}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className={cn(
                  "font-display font-semibold text-base",
                  isActive ? "text-coral" : "text-foreground"
                )}>
                  {item.label}
                </div>
                <div className="text-sm text-muted-foreground">{item.description}</div>
              </div>
              
              {isActive && (
                <motion.div
                  layoutId="sidebarActiveIndicator"
                  className="w-1 h-8 bg-gradient-to-b from-coral to-mint rounded-full shadow-magical"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-border">
        <div className="text-center">
          <div className="w-full h-2 bg-gradient-to-r from-coral via-mint to-violet rounded-full mb-3 shadow-magical"></div>
          <p className="text-xs text-muted-foreground">
           Business Intelligence Platform
          </p>
        </div>
      </div>
    </motion.aside>
  );
};

export default DesktopSidebar;