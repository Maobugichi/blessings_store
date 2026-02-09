import { useLogout } from "@/hooks/useAuth";
import type { Admin } from "@/types/auth.types";

export interface AdminComponentProps {
  admin: Admin | null;
}


export const AdminHeader = ({admin}:AdminComponentProps) => {
    const { mutate: logout } = useLogout();
    return(
        <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Welcome back, {admin?.username}!
                </p>
            </div>
            <button
                onClick={() => logout()}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
            >
                Logout
            </button>
            </div>
        </header>
    )
}