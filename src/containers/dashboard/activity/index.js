import { useEffect } from "react";
import { useSnackbar } from "notistack";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Spinner from "components/Spinner";
import { useMergeState } from "utils/custom-hooks";
import { getActivity, getGymLocations } from "api";
import { formatDate } from "utils/date";
import { ActivityTypes, UserRoles } from "utils/constants";

export default function DashboardActivityContainer({ user }) {
  const { enqueueSnackbar } = useSnackbar();

  const [state, setState] = useMergeState({
    isLoading: false,
    locations: [],
    location: "",
    activity: [],
  });

  const handleChangeLocation = async (event) => {
    try {
      const location = event?.target?.value;

      setState({ isLoading: true, location });

      const response = await getActivity({
        location,
      });

      setState({
        activity: response?.data,
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

      const response = await getActivity({ location });

      setState({
        locations: locationResponse?.data,
        location,
        activity: response?.data,
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
            <div className="text-4xl font-semibold text-grey">Activity</div>
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

          {!state?.activity?.length && (
            <div className="flex flex-col justify-center items-center mt-20">
              <span className="text-lg font-semibold">
                No activity available yet.
              </span>
            </div>
          )}

          {state?.activity?.map((elem) => (
            <div
              key={elem._id}
              className="bg-white border-[1px] rounded-lg border-solid border-[#f1f1f1] shadow-md p-5 mt-8"
            >
              <div>
                {[UserRoles.ADMIN, UserRoles.INSTRUCTOR].includes(
                  user?.role
                ) && (
                  <div className="text-sm">
                    {elem?.type === ActivityTypes.CHECK_IN &&
                      !elem?.membership && (
                        <span>
                          <b>
                            {elem?.user?.firstName} {elem?.user?.lastName}
                          </b>{" "}
                          checked-in
                        </span>
                      )}

                    {elem?.type === ActivityTypes.CHECK_OUT &&
                      !elem?.membership && (
                        <span>
                          <b>
                            {elem?.user?.firstName} {elem?.user?.lastName}
                          </b>{" "}
                          checked-out
                        </span>
                      )}

                    {elem?.type === ActivityTypes.CHECK_IN &&
                      elem?.membership && (
                        <span>
                          <b>
                            {elem?.user?.firstName} {elem?.user?.lastName}
                          </b>{" "}
                          checked-in for membership{" "}
                          <b>{elem?.membership?.plan?.name}</b> at{" "}
                          <b>{elem?.membership?.gym?.name}</b>
                        </span>
                      )}

                    {elem?.type === ActivityTypes.CHECK_OUT &&
                      elem?.membership && (
                        <span>
                          <b>
                            {elem?.user?.firstName} {elem?.user?.lastName}
                          </b>{" "}
                          checked-out for membership{" "}
                          <b>{elem?.membership?.plan?.name}</b> at{" "}
                          <b>{elem?.membership?.gym?.name}</b>
                        </span>
                      )}

                    {elem?.type === ActivityTypes.LOG && (
                      <span>
                        <b>
                          {elem?.user?.firstName} {elem?.user?.lastName}
                        </b>{" "}
                        logged workout, {elem?.equipmentType}, {elem?.duration}{" "}
                        mins
                      </span>
                    )}
                  </div>
                )}

                {user?.role === UserRoles.MEMBER && (
                  <div className="text-sm">
                    {elem?.type === ActivityTypes.CHECK_IN &&
                      !elem?.membership && (
                        <span>
                          <b>Checked-in</b> at <b>{elem?.gym?.name}</b>
                        </span>
                      )}

                    {elem?.type === ActivityTypes.CHECK_OUT &&
                      !elem?.membership && (
                        <span>
                          <b>Checked-out</b> at <b>{elem?.gym?.name}</b>
                        </span>
                      )}

                    {elem?.type === ActivityTypes.CHECK_IN &&
                      elem?.membership && (
                        <span>
                          <b>Checked-in</b> for membership{" "}
                          <b>{elem?.membership?.plan?.name}</b> at{" "}
                          <b>{elem?.membership?.gym?.name}</b>
                        </span>
                      )}

                    {elem?.type === ActivityTypes.CHECK_OUT &&
                      elem?.membership && (
                        <span>
                          <b>Checked-out</b> for membership{" "}
                          <b>{elem?.membership?.plan?.name}</b> at{" "}
                          <b>{elem?.membership?.gym?.name}</b>
                        </span>
                      )}

                    {elem?.type === ActivityTypes.LOG && (
                      <span>
                        <b>Logged</b> workout, {elem?.equipmentType},{" "}
                        <b>{elem?.duration}</b> mins at <b>{elem?.gym?.name}</b>
                      </span>
                    )}
                  </div>
                )}

                <div className="text-xs mt-2">
                  {formatDate(elem?.createdAt, "lll")}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
