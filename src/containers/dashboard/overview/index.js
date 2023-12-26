import { useEffect } from "react";
import { useSnackbar } from "notistack";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Spinner from "components/Spinner";
import { useMergeState } from "utils/custom-hooks";
import { getGymLocations, getStats } from "api";
import { UserRoles } from "utils/constants";

export default function DashboardOverviewContainer({ user }) {
  const { enqueueSnackbar } = useSnackbar();

  const [state, setState] = useMergeState({
    isLoading: false,
    locations: [],
    location: "",
    stats: {},
  });

  const handleChangeLocation = async (event) => {
    try {
      const location = event?.target?.value;

      setState({ isLoading: true, location });

      const response = await getStats({
        location,
      });

      setState({
        stats: response?.data,
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

      const response = await getStats({ location });

      setState({
        locations: locationResponse?.data,
        location,
        stats: response?.data,
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
      <div>
        {state?.isLoading ? (
          <div className="mt-10 w-full h-screen flex justify-center">
            <Spinner loading={state?.isLoading} />
          </div>
        ) : (
          <div>
            <div>
              <div className="flex justify-between items-center">
                <div className="text-4xl font-semibold text-grey">Overview</div>

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

              {user?.role === UserRoles.ADMIN && (
                <div className="w-3/4 flex justify-between items-center mt-8">
                  <div className="bg-white border-[1px] rounded-lg border-solid border-[#f1f1f1] shadow-md p-4 w-[220px]">
                    <div className="text-grey text-xs font-normal">
                      Previous Month Revenue
                    </div>
                    <div className="text-2xl text-grey font-semibold">
                      ${state?.stats?.previousMonthRevenue}
                    </div>
                  </div>

                  <div className="bg-white border-[1px] rounded-lg border-solid border-[#f1f1f1] shadow-md p-4 w-[220px]">
                    <div className="text-grey text-xs font-normal">
                      Current Month Revenue
                    </div>
                    <div className="text-2xl text-grey font-semibold">
                      ${state?.stats?.currentMonthRevenue}
                    </div>
                  </div>

                  <div className="bg-white border-[1px] rounded-lg border-solid border-[#f1f1f1] shadow-md p-4 w-[220px]">
                    <div className="text-grey text-xs font-normal">
                      New Memberships
                    </div>
                    <div className="text-2xl text-grey font-semibold">
                      {state?.stats?.newMemberships}
                    </div>
                  </div>
                </div>
              )}

              {user?.role === UserRoles.ADMIN && (
                <div className="w-3/4 flex justify-between items-center mt-8">
                  <div className="bg-white border-[1px] rounded-lg border-solid border-[#f1f1f1] shadow-md p-4 w-[220px]">
                    <div className="text-grey text-xs font-normal">Members</div>
                    <div className="text-2xl text-grey font-semibold">
                      {state?.stats?.totalMembers}
                    </div>
                  </div>

                  <div className="bg-white border-[1px] rounded-lg border-solid border-[#f1f1f1] shadow-md p-4 w-[220px]">
                    <div className="text-grey text-xs font-normal">
                      Instructors
                    </div>
                    <div className="text-2xl text-grey font-semibold">
                      {state?.stats?.totalInstructors}
                    </div>
                  </div>

                  <div className="bg-white border-[1px] rounded-lg border-solid border-[#f1f1f1] shadow-md p-4 w-[220px]">
                    <div className="text-grey text-xs font-normal">
                      Total Classes Scheduled
                    </div>
                    <div className="text-2xl text-grey font-semibold">
                      {state?.stats?.totalClassesScheduled}
                    </div>
                  </div>
                </div>
              )}

              {user?.role === UserRoles.MEMBER && (
                <div className="w-3/4 flex justify-between items-center mt-8">
                  <div className="bg-white border-[1px] rounded-lg border-solid border-[#f1f1f1] shadow-md p-4 w-[220px]">
                    <div className="text-grey text-xs font-normal">
                      Previous Month Spent
                    </div>
                    <div className="text-2xl text-grey font-semibold">
                      ${state?.stats?.previousMonthSpent}
                    </div>
                  </div>

                  <div className="bg-white border-[1px] rounded-lg border-solid border-[#f1f1f1] shadow-md p-4 w-[220px]">
                    <div className="text-grey text-xs font-normal">
                      Current Month Spent
                    </div>
                    <div className="text-2xl text-grey font-semibold">
                      ${state?.stats?.currentMonthSpent}
                    </div>
                  </div>

                  <div className="bg-white border-[1px] rounded-lg border-solid border-[#f1f1f1] shadow-md p-4 w-[220px]">
                    <div className="text-grey text-xs font-normal">
                      Total Memberships
                    </div>
                    <div className="text-2xl text-grey font-semibold">
                      {state?.stats?.totalMemberships}
                    </div>
                  </div>
                </div>
              )}

              {user?.role === UserRoles.INSTRUCTOR && (
                <div className="w-3/4 flex justify-between items-center mt-8">
                  <div className="bg-white border-[1px] rounded-lg border-solid border-[#f1f1f1] shadow-md p-4 w-[220px]">
                    <div className="text-grey text-xs font-normal">
                      Previous Month Earned
                    </div>
                    <div className="text-2xl text-grey font-semibold">
                      ${state?.stats?.previousMonthEarned}
                    </div>
                  </div>

                  <div className="bg-white border-[1px] rounded-lg border-solid border-[#f1f1f1] shadow-md p-4 w-[220px]">
                    <div className="text-grey text-xs font-normal">
                      Current Month Earned
                    </div>
                    <div className="text-2xl text-grey font-semibold">
                      ${state?.stats?.currentMonthEarned}
                    </div>
                  </div>

                  <div className="bg-white border-[1px] rounded-lg border-solid border-[#f1f1f1] shadow-md p-4 w-[220px]">
                    <div className="text-grey text-xs font-normal">
                      Total Classes
                    </div>
                    <div className="text-2xl text-grey font-semibold">
                      {state?.stats?.totalClasses}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
