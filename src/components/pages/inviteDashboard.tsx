import { useState } from 'react';
import { useAuthContext } from '@/context/authContext';
import {  useInviteCodes, useGenerateInvite, useRevokeInvite } from '../../hooks/useAuth';
import { AdminHeader } from '../adminDash/header';
import { AdminInfoCard } from '../adminDash/infoCard';
import { GenerateInviteCode } from '../adminDash/genIvc';


export const DashboardPage = () => {
  const { admin } = useAuthContext();
  
  const [showUsed, setShowUsed] = useState<boolean>(false);
  const [expiresInDays, setExpiresInDays] = useState<number>(7);

  const { data: inviteData, isLoading } = useInviteCodes(showUsed);
  const { mutate: generateInvite, isPending: isGenerating } = useGenerateInvite();
  const { mutate: revokeInvite, isPending: isRevoking } = useRevokeInvite();

  const handleGenerateInvite = () => {
    generateInvite({ expiresInDays });
  };

  const handleRevokeInvite = (id: number) => {
    if (window.confirm('Are you sure you want to revoke this invite code?')) {
      revokeInvite(id);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      
      <AdminHeader admin={admin}/>
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Admin Info Card */}
        <AdminInfoCard admin={admin}/>

        {/* Generate Invite Code Section */}
        <GenerateInviteCode
         expiresInDays={expiresInDays}
         setExpiresInDays={setExpiresInDays}
         handleGenerateInvite={handleGenerateInvite}
         isGenerating={isGenerating}
        />

        {/* Invite Codes List */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Invite Codes</h2>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showUsed}
                onChange={(e) => setShowUsed(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Show used codes</span>
            </label>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : inviteData?.inviteCodes.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No invite codes found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expires
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Used By
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {inviteData?.inviteCodes.map((invite) => {
                    const isExpired = new Date(invite.expiresAt) < new Date();
                    
                    return (
                      <tr key={invite.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                            {invite.code}
                          </code>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {invite.used ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              Used
                            </span>
                          ) : isExpired ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              Expired
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Available
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(invite.expiresAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {invite.createdBy || 'System'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {invite.usedBy || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {!invite.used && (
                            <>
                              <button
                                onClick={() => copyToClipboard(invite.code)}
                                className="text-blue-600 hover:text-blue-900 mr-4"
                              >
                                Copy
                              </button>
                              <button
                                onClick={() => handleRevokeInvite(invite.id)}
                                disabled={isRevoking}
                                className="text-red-600 hover:text-red-900 disabled:opacity-50"
                              >
                                Revoke
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};