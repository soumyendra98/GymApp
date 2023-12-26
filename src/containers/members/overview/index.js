import { useEffect } from "react";
import { useSnackbar } from "notistack";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Spinner from "components/Spinner";
import EnrollMemberDialog from "components/EnrollMemberDialog";
import { useMergeState } from "utils/custom-hooks";
import {
  listMembers,
  enrollMemberships,
  createGymActivity,
  getGymLocations,
} from "api";
import Button from "components/Button";
import { ActivityTypes } from "utils/constants";

export default function MembersOverviewContainer({ user }) {
  const { enqueueSnackbar } = useSnackbar();

  const [state, setState] = useMergeState({
    isLoading: false,
    locations: [],
    location: "",
    members: [],

    shouldShowEnrollDialog: false,
    selectedMemberId: null,
  });

  const handleOpenEnrollDialog = (selectedMemberId) => {
    setState({ shouldShowEnrollDialog: true, selectedMemberId });
  };

  const handleCloseEnrollDialog = () => {
    setState({ shouldShowEnrollDialog: false, selectedMemberId: null });
  };

  const handleEnroll = async (planId) => {
    try {
      setState({ isLoading: true });
      debugger; // eslint-disable-line
      await enrollMemberships({
        locationId: state?.location,
        gymId: user?.gym?._id,
        planId,
        memberId: state?.selectedMemberId,
      });

      enqueueSnackbar("Member enrolled successfully!", { variant: "success" });

      handleCloseEnrollDialog();
    } catch (error) {
      enqueueSnackbar(error?.message, { variant: "error" });
    } finally {
      setState({ isLoading: false });
    }
  };

  const handleCreateActivity = async (memberUserId, type) => {
    try {
      setState({ isLoading: true });

      await createGymActivity({
        type,
        memberUserId,
        locationId: state?.location,
        gymId: user?.gym?._id,
      });

      let message = "Member checked in successfully!";

      if (type === ActivityTypes.CHECK_OUT) {
        message = "Member checked out successfully!";
      }

      enqueueSnackbar(message, { variant: "success" });
    } catch (error) {
      enqueueSnackbar(error?.message, { variant: "error" });
    } finally {
      setState({ isLoading: false });
    }
  };

  const handleChangeLocation = async (event) => {
    try {
      const location = event?.target?.value;

      setState({ isLoading: true, location });

      const response = await listMembers({
        location,
      });

      setState({
        members: response?.data,
      });
    } catch (error) {
      enqueueSnackbar(error?.message, { variant: "error" });
    } finally {
      setState({ isLoading: false });
    }
  };

  const init = async () => {
    try {
      setState({ isLoading: true });

      const locationResponse = await getGymLocations();

      const location = locationResponse?.data[0]?._id;

      const response = await listMembers({
        location,
      });

      setState({
        locations: locationResponse?.data,
        location,
        members: response?.data,
      });
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
          <div className="flex justify-between items-center">
            <div className="text-4xl font-semibold text-grey">Members</div>

            <div>
              <Select
                fullWidth
                variant="outlined"
                name="location"
                value={state?.location}
                onChange={handleChangeLocation}
                color="secondary"
                style={{
                  width: 150,
                  height: 40,
                  borderRadius: 6,
                }}
              >
                {state?.locations?.map((location) => (
                  <MenuItem key={location?._id} value={location?._id}>
                    {location?.city}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </div>

          <TableContainer className="my-8">
            <Table sx={{ minWidth: 750 }}>
              <TableHead>
                <TableRow>
                  <TableCell align="left">
                    <span className="text-grey">Name</span>
                  </TableCell>
                  <TableCell align="left">
                    <span className="text-grey">Email Address</span>
                  </TableCell>
                  <TableCell align="left">
                    <span className="text-grey">Status</span>
                  </TableCell>
                  <TableCell align="right">
                    <span className="text-grey">Total Memberships</span>
                  </TableCell>
                  <TableCell align="right">
                    <span className="text-grey">Total Spent</span>
                  </TableCell>
                  <TableCell align="left" />
                </TableRow>
              </TableHead>
              <TableBody style={{ overflow: "visible" }}>
                {state?.members?.map((member) => (
                  <TableRow key={member._id}>
                    <TableCell component="th" scope="row" align="left">
                      <span className="text-grey text-xs">
                        {member?.user?.firstName} {member?.user?.lastName}
                      </span>
                    </TableCell>
                    <TableCell component="th" scope="row" align="left">
                      <span className="text-grey text-xs">
                        {member?.user?.email}
                      </span>
                    </TableCell>
                    <TableCell component="th" scope="row" align="left">
                      <span className="text-grey text-xs">
                        {member?.user?.status}
                      </span>
                    </TableCell>
                    <TableCell component="th" scope="row" align="right">
                      <span className="text-grey text-xs">
                        {member?.totalMemberships}
                      </span>
                    </TableCell>
                    <TableCell component="th" scope="row" align="right">
                      <span className="text-grey text-xs">
                        ${member?.totalSpent}
                      </span>
                    </TableCell>
                    <TableCell component="th" scope="row" align="left">
                      <div className="flex justify-between">
                        <div>
                          <Button
                            label="Enroll"
                            color="secondary"
                            onClick={() => handleOpenEnrollDialog(member?._id)}
                            style={{
                              borderRadius: 40,
                              fontSize: 14,
                              color: "#FFFFFF",
                              fontWeight: 500,
                              height: 40,
                            }}
                          />
                        </div>

                        <div>
                          <Button
                            label="Check In"
                            color="secondary"
                            onClick={() =>
                              handleCreateActivity(
                                member?.user?._id,
                                ActivityTypes.CHECK_IN
                              )
                            }
                            style={{
                              borderRadius: 40,
                              fontSize: 14,
                              color: "#FFFFFF",
                              fontWeight: 500,
                              height: 40,
                            }}
                          />
                        </div>

                        <div>
                          <Button
                            label="Check Out"
                            color="secondary"
                            onClick={() =>
                              handleCreateActivity(
                                member?.user?._id,
                                ActivityTypes.CHECK_OUT
                              )
                            }
                            style={{
                              borderRadius: 40,
                              fontSize: 14,
                              color: "#FFFFFF",
                              fontWeight: 500,
                              height: 40,
                            }}
                          />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {!state?.members?.length && (
            <div className="flex justify-center mt-10">
              <div className="text-grey text-xl">
                Start by inviting a member
              </div>
            </div>
          )}
        </div>
      )}

      {state?.shouldShowEnrollDialog && (
        <EnrollMemberDialog
          open={state?.shouldShowEnrollDialog}
          onClose={handleCloseEnrollDialog}
          onSave={handleEnroll}
          location={state?.location}
        />
      )}
    </div>
  );
}
