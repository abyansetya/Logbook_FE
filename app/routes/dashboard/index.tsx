import { Button } from "~/components/ui/button";
import { useAuth } from "~/provider/auth-context";

export default function Dashboard() {
  const { user, logout, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <p className="p-6">Loading...</p>;
  }

  if (!isAuthenticated || !user) {
    return <p className="p-6">Unauthorized</p>;
  }

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <div className="space-y-2">
        <p>
          <strong>Nama:</strong> {user.nama}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>NIM/NIP:</strong> {user.nim_nip}
        </p>
        <p>
          <strong>Role:</strong> {user.roles.join(", ")}
        </p>
      </div>
    </div>
  );
}
