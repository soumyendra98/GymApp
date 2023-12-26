import { useEffect } from "react";
import { useSnackbar } from "notistack";
import Avatar from "@mui/material/Avatar";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "components/Button";
import Spinner from "components/Spinner";
import InviteAdminDialog from "components/InviteAdminDialog";
import { wrapFullName } from "utils/common";
import { useMergeState } from "utils/custom-hooks";
import { getGymTeam, inviteGymTeam } from "api";

export default function SettingsTeamContainer() {
  const { enqueueSnackbar } = useSnackbar();

  const [state, setState] = useMergeState({
    isLoading: false,

    admins: [],

    shouldShowInviteAdminDialog: false,
  });

  const handleOpenInviteAdminDialog = () => {
    setState({ shouldShowInviteAdminDialog: true });
  };

  const handleCloseInviteAdminDialog = () => {
    setState({ shouldShowInviteAdminDialog: false });
  };

  const handleInviteAdmin = async (email) => {
    try {
      handleCloseInviteAdminDialog();

      setState({ isLoading: true });

      const response = await inviteGymTeam({ email });

      enqueueSnackbar(response?.message, { variant: "success" });
    } catch (error) {
      enqueueSnackbar(error?.message, { variant: "error" });
    } finally {
      setState({ isLoading: false });
    }
  };

  const init = async () => {
    try {
      setState({ isLoading: true });

      const response = await getGymTeam();

      setState({ admins: response?.data });
    } catch (error) {
      enqueueSnackbar(error?.message, { variant: "error" });
    } finally {
      setState({ isLoading: false });
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <div>
      {state?.isLoading ? (
        <div className="mt-10 w-full h-screen flex justify-center">
          <Spinner loading={state?.isLoading} />
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between">
            <div className="text-4xl font-semibold text-grey">Team</div>
            <div>
              <Button
                label="Invite"
                color="secondary"
                onClick={handleOpenInviteAdminDialog}
                style={{
                  borderRadius: 10,
                  fontSize: 14,
                  color: "#FFFFFF",
                  height: 40,
                }}
              />
            </div>
          </div>

          <TableContainer className="mt-10">
            <Table sx={{ minWidth: 750 }}>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <span className="text-grey">Name</span>
                  </TableCell>
                  <TableCell align="center">
                    <span className="text-grey">Role</span>
                  </TableCell>
                  <TableCell align="center">
                    <span className="text-grey">Status</span>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody style={{ overflow: "visible" }}>
                {state?.admins?.map((admin) => (
                  <TableRow key={admin._id}>
                    <TableCell component="th" scope="row">
                      <div className="flex items-center">
                        <Avatar sx={{ width: 34, height: 34 }}>
                          {admin?.status === "INVITED" ? (
                            String(admin?.email?.charAt(0)).toUpperCase()
                          ) : (
                            <span>
                              {String(
                                admin?.firstName?.charAt(0)
                              ).toUpperCase()}
                              {String(admin?.lastName?.charAt(0)).toUpperCase()}
                            </span>
                          )}
                        </Avatar>
                        <span className="text-grey text-sm ml-2">
                          {admin?.status === "INVITED"
                            ? admin?.email
                            : wrapFullName(admin?.firstName, admin?.lastName)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell component="th" scope="row" align="center">
                      <span className="text-grey text-xs">{admin?.role}</span>
                    </TableCell>
                    <TableCell component="th" scope="row" align="center">
                      <span className="text-grey text-xs">{admin?.status}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}

      {state?.shouldShowInviteAdminDialog && (
        <InviteAdminDialog
          open={state?.shouldShowInviteAdminDialog}
          onClose={handleCloseInviteAdminDialog}
          onSave={handleInviteAdmin}
        />
      )}
    </div>
  );
}
