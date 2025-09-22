import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Box,
  ShoppingCart,
  Users,
  BarChart2,
  Bell,
  Settings,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo1.png";

const AppSidebar = () => {
  const location = useLocation();
  const [isProductsMenuOpen, setIsProductsMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <img src={logo} alt="Spodut" className="h-8 w-auto" />
          <span className="text-xl font-semibold">Spodut</span>
        </div>
      </SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <Link to="/admin/dashboard">
            <SidebarMenuButton isActive={isActive("/admin/dashboard")}>
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton onClick={() => setIsProductsMenuOpen(!isProductsMenuOpen)}>
            <Box className="h-4 w-4" />
            <span>Products</span>
          </SidebarMenuButton>
          {isProductsMenuOpen && (
            <SidebarMenuSub>
              <SidebarMenuSubItem>
                <Link to="/admin/product-management">
                  <SidebarMenuSubButton isActive={isActive("/admin/product-management")}>
                    Product List
                  </SidebarMenuSubButton>
                </Link>
              </SidebarMenuSubItem>
              <SidebarMenuSubItem>
                <Link to="/categories">
                  <SidebarMenuSubButton isActive={isActive("/categories")}>
                    Categories
                  </SidebarMenuSubButton>
                </Link>
              </SidebarMenuSubItem>
            </SidebarMenuSub>
          )}
        </SidebarMenuItem>
        <SidebarMenuItem>
          <Link to="#">
            <SidebarMenuButton>
              <ShoppingCart className="h-4 w-4" />
              <span>Sales</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <Link to="#">
            <SidebarMenuButton>
              <Users className="h-4 w-4" />
              <span>Customers</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <Link to="#">
            <SidebarMenuButton>
              <BarChart2 className="h-4 w-4" />
              <span>Analytics</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <Link to="#">
            <SidebarMenuButton>
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      </SidebarMenu>
      <SidebarFooter>
        <SidebarMenuItem>
          <Link to="#">
            <SidebarMenuButton>
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
