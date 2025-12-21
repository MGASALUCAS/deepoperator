import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Database,
  Bell,
  MessageCircle,
  Settings,
  Menu,
  X,
  TrendingUp,
  Zap,
  Heart,
  LogOut
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface HeroNavigationProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const HeroNavigation = ({ activeSection, setActiveSection }: HeroNavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { logout } = useAuth();

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      description: "Analytics Hub",
      color: "mint",
      gradient: "from-mint to-mint-light"
    },
    {
      id: "operator",
      label: "Operator",
      icon: Bell,
      description: "Automation Hub",
      color: "violet",
      gradient: "from-violet to-violet-light"
    },
    {
      id: "feedback",
      label: "Feedback",
      icon: MessageCircle,
      description: "Emotional Hub",
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

  const NavItem = ({ item, isMobile = false }: { item: typeof navigationItems[0], isMobile?: boolean }) => {
    const isActive = activeSection === item.id;
    const Icon = item.icon;

    if (isMobile) {
      return (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setActiveSection(item.id);
            setIsMobileMenuOpen(false);
          }}
          className={cn(
            "w-full flex items-center gap-3 p-3 rounded-xl transition-smooth text-left",
            isActive
              ? "bg-gradient-to-r from-coral/20 to-mint/20 border border-coral/30 text-coral shadow-medium"
              : "hover:bg-gradient-glass hover:shadow-soft text-foreground"
          )}
        >
          <div className={cn(
            "p-2.5 rounded-lg shadow-soft",
            isActive
              ? `bg-gradient-to-br ${item.gradient} text-white shadow-magical`
              : "bg-muted/50 text-muted-foreground"
          )}>
            <Icon className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-display font-semibold text-sm">{item.label}</div>
            <div className="text-xs text-muted-foreground truncate">{item.description}</div>
          </div>
        </motion.button>
      );
    }

    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setActiveSection(item.id)}
        className={cn(
          "relative flex flex-col items-center gap-2 p-4 rounded-2xl transition-smooth group",
          isActive
            ? "bg-gradient-to-br from-coral/10 to-mint/10 border border-coral/30 shadow-medium"
            : "hover:bg-gradient-glass hover:shadow-soft"
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
        <div className="text-center">
          <div className={cn(
            "font-display font-medium text-sm",
            isActive ? "text-coral" : "text-foreground"
          )}>
            {item.label}
          </div>
          <div className="text-xs text-muted-foreground hidden lg:block">
            {item.description}
          </div>
        </div>

        {isActive && (
          <motion.div
            layoutId="activeIndicator"
            className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-coral to-mint rounded-full shadow-magical"
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}
      </motion.button>
    );
  };

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-smooth",
          scrolled ? "bg-nav-bg/95 backdrop-blur-xl shadow-magical" : "bg-transparent"
        )}
      >
        <div className="container-responsive">
          <div className="flex items-center justify-between py-4">
            {/* Logo & Brand */}
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
              <div className="hidden md:block">
                <h1 className="font-display font-bold text-xl text-foreground">
                  Operator Engine
                </h1>
                {/* <p className="text-sm text-muted-foreground">Revolutionary Analytics</p> */}
              </div>
            </motion.div>

            {/* Desktop Navigation Items */}
            <div className="hidden lg:flex items-center gap-2">
              {navigationItems.map((item) => (
                <NavItem key={item.id} item={item} />
              ))}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <Button
                variant="glass"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="relative overflow-hidden"
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </div>

            {/* Desktop CTA & Logout */}
            <div className="hidden lg:flex items-center gap-3">
              <Button variant="hero" size="lg" className="group">
                <TrendingUp className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Insights Dashboard
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300"
                onClick={logout}
              >
                <LogOut className="w-5 h-5" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Full-Screen Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/95 backdrop-blur-xl"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute right-0 top-0 h-full w-full max-w-sm bg-card border-l border-border shadow-magical"
            >
              <div className="p-4 pt-20">
                <div className="space-y-2">
                  {navigationItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <NavItem item={item} isMobile />
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-6 pt-6 border-t border-border space-y-2"
                >
                  <Button variant="hero" size="sm" className="w-full text-sm py-2.5">
                    <TrendingUp className="w-4 h-4" />
                    Explore Insights
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-red-200 text-red-500 hover:bg-red-50 text-sm py-2.5"
                    onClick={logout}
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Navigation - Compact & Complete */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden glass border-t border-border backdrop-blur-xl">
        <div className="flex items-center justify-around py-1 px-2">
          {navigationItems.map((item) => {
            const isActive = activeSection === item.id;
            const Icon = item.icon;

            return (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveSection(item.id)}
                className={cn(
                  "flex flex-col items-center gap-0.5 p-2 rounded-lg transition-smooth min-w-0 flex-1",
                  isActive ? "text-coral" : "text-muted-foreground"
                )}
              >
                <div className={cn(
                  "p-1.5 rounded-md",
                  isActive ? "bg-coral/10 shadow-soft" : ""
                )}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-medium leading-tight text-center">{item.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default HeroNavigation;
