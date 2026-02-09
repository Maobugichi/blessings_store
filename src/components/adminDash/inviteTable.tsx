import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { InviteCodesResponse } from "@/types/auth.types";


interface InviteTableProps {
    inviteData:InviteCodesResponse;
    copyToClipboard:(text:string) => null;
    handleRevokeInvite:(id:number) => null
    isRevoking:boolean
}


export const InviteTable = ({ inviteData , copyToClipboard , handleRevokeInvite, isRevoking }:InviteTableProps) => {
    return(
        <div className="w-full overflow-x-auto rounded-lg border bg-background">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead className="hidden md:table-cell">Created By</TableHead>
                    <TableHead className="hidden md:table-cell">Used By</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
                </TableHeader>

                <TableBody>
                {inviteData?.inviteCodes.map((invite) => {
                    const isExpired = new Date(invite.expiresAt) < new Date();

                    return (
                    <TableRow key={invite.id}>
                        <TableCell>
                        <code className="rounded bg-muted px-2 py-1 text-xs font-mono">
                            {invite.code}
                        </code>
                        </TableCell>

                        <TableCell>
                        {invite.used ? (
                            <Badge variant="destructive">Used</Badge>
                        ) : isExpired ? (
                            <Badge variant="secondary">Expired</Badge>
                        ) : (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                              Available
                            </Badge>
                        )}
                        </TableCell>

                        <TableCell className="text-sm text-muted-foreground">
                        {new Date(invite.expiresAt).toLocaleDateString()}
                        </TableCell>

                        <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                        {invite.createdBy || "System"}
                        </TableCell>

                        <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                        {invite.usedBy || "-"}
                        </TableCell>

                        <TableCell className="text-right">
                        {!invite.used && (
                            <div className="flex justify-end gap-2 flex-col sm:flex-row">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyToClipboard(invite.code)}
                            >
                                Copy
                            </Button>

                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleRevokeInvite(invite.id)}
                                disabled={isRevoking}
                            >
                                Revoke
                            </Button>
                            </div>
                        )}
                        </TableCell>
                    </TableRow>
                    );
                })}
                </TableBody>
            </Table>
        </div>
    )
}
