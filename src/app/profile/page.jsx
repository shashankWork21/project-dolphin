import ProtectedRoute from "@/components/auth/protected-route";
import ProfilePageComponent from "@/components/profile/profile-page";

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfilePageComponent />
    </ProtectedRoute>
  );
}
