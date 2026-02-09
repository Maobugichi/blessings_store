import type { AdminComponentProps } from "./header"

export const AdminInfoCard = ({admin}:AdminComponentProps) => {
    return(
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Username</p>
              <p className="text-lg font-medium">{admin?.username}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-lg font-medium">{admin?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Admin ID</p>
              <p className="text-lg font-medium">#{admin?.id}</p>
            </div>
          </div>
        </div>
    )
}