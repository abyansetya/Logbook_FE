// src/routes/profile.tsx
import React from "react";
import {
  Mail,
  IdCard,
  Shield,
  Edit,
  BookOpen,
  Clock,
  Users,
} from "lucide-react";
import { useAuth } from "~/provider/auth-context";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { Link } from "react-router";

export default function ProfilePage() {
  const { user } = useAuth();

  const getInitials = (name?: string) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profil Saya</h1>
        <p className="text-muted-foreground">
          Kelola informasi profil dan preferensi akun Anda
        </p>
      </div>

      {/* Main Profile Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {getInitials(user?.nama)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <CardTitle className="text-2xl">
                  {user?.nama || "User"}
                </CardTitle>
                <CardDescription className="text-base">
                  {user?.email || "-"}
                </CardDescription>
                <div className="flex gap-2">
                  {user?.roles?.map((role, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-white border-2 border-black"
                    >
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="hover:bg-secondary hover:text-white"
            >
              <Link to="/profile/edit">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6">
          <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider text-muted-foreground">
            Detail Informasi
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <IdCard className="h-4 w-4" />
                <span>User ID</span>
              </div>
              <p className="text-base font-medium pl-6">{user?.id || "-"}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <IdCard className="h-4 w-4" />
                <span>NIM/NIP</span>
              </div>
              <p className="text-base font-medium pl-6">
                {user?.nim_nip || "-"}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </div>
              <p className="text-base font-medium pl-6">{user?.email || "-"}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>Role</span>
              </div>
              <p className="text-base font-medium pl-6">
                {user?.roles?.join(", ") || "-"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
