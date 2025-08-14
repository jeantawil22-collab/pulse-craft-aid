import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  Dumbbell, 
  Apple, 
  Camera, 
  TrendingUp, 
  User,
  Menu
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
  SidebarHeader,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
    description: "Overview & Quick Actions"
  },
  {
    title: "Workouts",
    url: "/workouts",
    icon: Dumbbell,
    description: "AI-Generated Exercise Plans"
  },
  {
    title: "Nutrition",
    url: "/nutrition",
    icon: Apple,
    description: "Meal Plans & Diet Tracking"
  },
  {
    title: "Meal Scanner",
    url: "/meal-scanner",
    icon: Camera,
    description: "AI Food Recognition"
  },
  {
    title: "Progress",
    url: "/progress",
    icon: TrendingUp,
    description: "Analytics & Insights"
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
    description: "Settings & Preferences"
  }
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === 'collapsed';

  const isActive = (path: string) => {
    if (path === '/') {
      return currentPath === '/';
    }
    return currentPath.startsWith(path);
  };

  const getNavClasses = (itemUrl: string) => {
    const active = isActive(itemUrl);
    return `${active 
      ? 'bg-primary/10 text-primary font-medium border-r-2 border-primary shadow-sm' 
      : 'hover:bg-muted/50 hover:text-foreground'
    } transition-all duration-200`;
  };

  return (
    <Sidebar className={`${collapsed ? 'w-16' : 'w-64'} border-r bg-card`} collapsible="icon">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shadow-fitness">
            <Dumbbell className="h-4 w-4 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="font-bold text-lg gradient-primary bg-clip-text text-transparent">
                FitAI Pro
              </h2>
              <p className="text-xs text-muted-foreground">AI Fitness Assistant</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? 'sr-only' : ''}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === '/'}
                      className={getNavClasses(item.url)}
                    >
                      <item.icon className={`h-5 w-5 ${collapsed ? 'mx-auto' : 'mr-3'} flex-shrink-0`} />
                      {!collapsed && (
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{item.title}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            {item.description}
                          </div>
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Trigger button inside sidebar for collapsed state */}
      <div className="p-2 border-t">
        <SidebarTrigger className="w-full justify-center" />
      </div>
    </Sidebar>
  );
}