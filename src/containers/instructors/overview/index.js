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
import { useMergeState } from "utils/custom-hooks";
import { getGymLocations, listInstructors } from "api";

export default function InstructorsOverviewContainer() {
  const { enqueueSnackbar } = useSnackbar();

  const [state, setState] = useMergeState({
    isLoading: false,
    locations: [],
    location: "",
    instructors: [],
  });

  const handleChangeLocation = async (event) => {
    try {
      const location = event?.target?.value;

      setState({ isLoading: true, location });

      const response = await listInstructors({
        location,
      });

      setState({
        instructors: response?.data,
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

      const response = await listInstructors({ location });

      setState({
        locations: locationResponse?.data,
        location,
        instructors: response?.data,
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
            <div className="text-4xl font-semibold text-grey">Instructors</div>

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
                  <TableCell align="left">
                    <span className="text-grey">Total Classes</span>
                  </TableCell>
                  <TableCell align="left">
                    <span className="text-grey">Total Earned</span>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody style={{ overflow: "visible" }}>
                {state?.instructors?.map((instructor) => (
                  <TableRow key={instructor._id}>
                    <TableCell component="th" scope="row" align="left">
                      <span className="text-grey text-xs">
                        {instructor?.user?.firstName}{" "}
                        {instructor?.user?.lastName}
                      </span>
                    </TableCell>
                    <TableCell component="th" scope="row" align="left">
                      <span className="text-grey text-xs">
                        {instructor?.user?.email}
                      </span>
                    </TableCell>
                    <TableCell component="th" scope="row" align="left">
                      <span className="text-grey text-xs">
                        {instructor?.user?.status}
                      </span>
                    </TableCell>
                    <TableCell component="th" scope="row" align="left">
                      <span className="text-grey text-xs">
                        {instructor?.totalClasses}
                      </span>
                    </TableCell>
                    <TableCell component="th" scope="row" align="left">
                      <span className="text-grey text-xs">
                        ${instructor?.totalEarned}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {!state?.instructors?.length && (
            <div className="flex justify-center mt-10">
              <div className="text-grey text-xl">
                Start by inviting an instructor
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
