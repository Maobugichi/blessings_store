import type { SetStateAction } from "react"

interface GenerateInviteCodeProps {
    expiresInDays:number, 
    setExpiresInDays:React.Dispatch<SetStateAction<number>>, 
    handleGenerateInvite: () => void, 
    isGenerating:boolean
}



export const GenerateInviteCode = ({ 
    expiresInDays, 
    setExpiresInDays, 
    handleGenerateInvite, 
    isGenerating
}:GenerateInviteCodeProps
) => {
    return(
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Generate Invite Code</h2>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expires in (days)
              </label>
              <input
                type="number"
                min="1"
                max="365"
                value={expiresInDays}
                onChange={(e) => setExpiresInDays(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={handleGenerateInvite}
              disabled={isGenerating}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? 'Generating...' : 'Generate Code'}
            </button>
          </div>
        </div>
    )
}