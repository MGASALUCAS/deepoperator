
import { useState } from "react";
import { motion } from "framer-motion";
import HeroNavigation from "../components/HeroNavigation";
import DesktopSidebar from "../components/DesktopSidebar";
import PageTransition from "../components/PageTransition";
import ResponsiveContainer from "../components/ResponsiveContainer";
import Dashboard from "../components/Dashboard";
import Warehouse from "../components/Warehouse";
import OperatorPanel from "../components/OperatorPanel";
import FeedbackLoop from "../components/FeedbackLoop";
import Settings from "../components/Settings";

const Index = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const renderActiveSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard />;
      case "warehouse":
        return <Warehouse />;
      case "operator":
        return <OperatorPanel />;
      case "feedback":
        return <FeedbackLoop />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            background: [
              "radial-gradient(circle at 20% 20%, hsl(var(--coral-glow)) 0%, transparent 30%)",
              "radial-gradient(circle at 80% 40%, hsl(var(--mint-glow)) 0%, transparent 30%)",
              "radial-gradient(circle at 40% 80%, hsl(var(--violet-glow)) 0%, transparent 30%)",
              "radial-gradient(circle at 20% 20%, hsl(var(--coral-glow)) 0%, transparent 30%)",
            ],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-0 opacity-30 dark:opacity-20"
        />
      </div>

      {/* Desktop Sidebar */}
      <DesktopSidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
      />

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <HeroNavigation 
          activeSection={activeSection} 
          setActiveSection={setActiveSection} 
        />
      </div>

      {/* Main Content Area */}
      <main className="pt-24 pb-20 lg:pt-8 lg:pb-8 lg:pl-80 relative z-10">
        <ResponsiveContainer maxWidth="full" padding="lg">
          <PageTransition pageKey={activeSection}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass rounded-3xl shadow-magical border border-border/50 p-6 md:p-8 lg:p-12 backdrop-blur-xl"
            >
              {renderActiveSection()}
            </motion.div>
          </PageTransition>
        </ResponsiveContainer>
      </main>
    </div>
  );
};

export default Index;
