import React, { useState, useEffect } from "react";
import { useSubscription } from "@/hooks/useSubscription";
import { UserProfile, PlanType } from "@/lib/subscription-service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Shield,
  Crown,
  Mail,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  X,
  Plus,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import SubscriptionGuard from "./SubscriptionGuard";

export const AdminDashboard: React.FC = () => {
  return (
    <SubscriptionGuard requiresAdmin>
      <AdminDashboardContent />
    </SubscriptionGuard>
  );
};

const AdminDashboardContent: React.FC = () => {
  const { getAllUsers, addAdmin, removeAdmin, profile } = useSubscription();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPlan, setFilterPlan] = useState<PlanType | "all">("all");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const allUsers = await getAllUsers();
      setUsers(allUsers);
    } catch (error) {
      console.error("Error loading users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async () => {
    if (!newAdminEmail.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    try {
      const success = await addAdmin(newAdminEmail.trim());
      if (success) {
        toast.success("Admin privileges granted successfully");
        setNewAdminEmail("");
        await loadUsers();
      } else {
        toast.error("Failed to grant admin privileges");
      }
    } catch (error) {
      console.error("Error adding admin:", error);
      toast.error("Failed to grant admin privileges");
    }
  };

  const handleRemoveAdmin = async (userId: string, userEmail: string) => {
    try {
      const success = await removeAdmin(userId);
      if (success) {
        toast.success("Admin privileges removed successfully");
        await loadUsers();
      } else {
        toast.error("Failed to remove admin privileges");
      }
    } catch (error) {
      console.error("Error removing admin:", error);
      toast.error("Failed to remove admin privileges");
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      !searchTerm ||
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPlan = filterPlan === "all" || user.plan === filterPlan;

    return matchesSearch && matchesPlan;
  });

  const userStats = {
    total: users.length,
    free: users.filter((u) => u.plan === "free").length,
    pro: users.filter((u) => u.plan === "pro").length,
    team: users.filter((u) => u.plan === "team").length,
    admins: users.filter((u) => u.is_admin).length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading admin dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">
            Manage users, subscriptions, and system settings
          </p>
        </div>
        <Badge className="bg-purple-100 text-purple-800">
          <Crown className="h-4 w-4 mr-1" />
          Administrator
        </Badge>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatCard
          title="Total Users"
          value={userStats.total}
          icon={<Users className="h-5 w-5 text-blue-600" />}
          color="blue"
        />
        <StatCard
          title="Free Plan"
          value={userStats.free}
          icon={<Users className="h-5 w-5 text-gray-600" />}
          color="gray"
        />
        <StatCard
          title="Pro Plan"
          value={userStats.pro}
          icon={<TrendingUp className="h-5 w-5 text-green-600" />}
          color="green"
        />
        <StatCard
          title="Team Plan"
          value={userStats.team}
          icon={<Shield className="h-5 w-5 text-purple-600" />}
          color="purple"
        />
        <StatCard
          title="Admins"
          value={userStats.admins}
          icon={<Crown className="h-5 w-5 text-orange-600" />}
          color="orange"
        />
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="admins">Admin Management</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
                <Select
                  value={filterPlan}
                  onValueChange={(value: PlanType | "all") =>
                    setFilterPlan(value)
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Plans</SelectItem>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="pro">Pro</SelectItem>
                    <SelectItem value="team">Team</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <UserCard
                    key={user.id}
                    user={user}
                    onRemoveAdmin={handleRemoveAdmin}
                    currentUserId={profile?.id}
                  />
                ))}
                {filteredUsers.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No users found matching your criteria.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admins" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Admin Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter email address"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleAddAdmin}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Admin
                </Button>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">
                  Current Administrators
                </h4>
                {users
                  .filter((u) => u.is_admin)
                  .map((admin) => (
                    <div
                      key={admin.id}
                      className="flex items-center justify-between p-3 bg-purple-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <Crown className="h-5 w-5 text-purple-600" />
                        <div>
                          <div className="font-medium">
                            {admin.full_name || "Admin User"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {admin.id}
                          </div>
                        </div>
                      </div>
                      {admin.id !== "djuliusvdijk@protonmail.com" &&
                        admin.id !== profile?.id && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleRemoveAdmin(admin.id, admin.id)
                            }
                          >
                            <X className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        )}
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                Analytics dashboard coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className={`p-2 bg-${color}-100 rounded-lg`}>{icon}</div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface UserCardProps {
  user: UserProfile;
  onRemoveAdmin: (userId: string, userEmail: string) => void;
  currentUserId?: string;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  onRemoveAdmin,
  currentUserId,
}) => {
  const getPlanColor = (plan: PlanType) => {
    switch (plan) {
      case "free":
        return "bg-gray-100 text-gray-800";
      case "pro":
        return "bg-green-100 text-green-800";
      case "team":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600";
      case "trial":
        return "text-blue-600";
      case "cancelled":
        return "text-red-600";
      case "past_due":
        return "text-orange-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <Users className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <div className="font-medium">{user.full_name || "User"}</div>
            {user.is_admin && <Crown className="h-4 w-4 text-purple-600" />}
          </div>
          <div className="text-sm text-gray-500">{user.id}</div>
          <div className="text-xs text-gray-400">
            Joined: {new Date(user.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <div className="text-right">
          <Badge className={getPlanColor(user.plan)}>
            {user.plan.toUpperCase()}
          </Badge>
          <div
            className={`text-xs ${getStatusColor(user.subscription_status)}`}
          >
            {user.subscription_status}
          </div>
        </div>
        {user.is_admin && user.id !== currentUserId && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onRemoveAdmin(user.id, user.id)}
          >
            <X className="h-4 w-4 mr-1" />
            Remove Admin
          </Button>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
