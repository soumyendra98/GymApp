import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "components/Button";
import Spinner from "components/Spinner";
import { useMergeState } from "utils/custom-hooks";
import { listGyms, enrollMemberships } from "api";

export default function HomeContainer({ user }) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const [state, setState] = useMergeState({
    isLoading: false,
    gyms: [],
  });

  const handleChangeLocation = async (event, gymId) => {
    try {
      const locationId = event?.target?.value;

      setState({ isLoading: true, selectedLocation: locationId });

      const response = await listGyms({
        gymId,
        locationId,
      });

      const updatedGyms = [...response?.data];

      const index = updatedGyms?.findIndex((elem) => elem?._id === gymId);

      updatedGyms[index].selectedLocation = locationId;

      setState({
        gyms: updatedGyms,
      });
    } catch (error) {
      enqueueSnackbar(error?.message, { variant: "error" });
    } finally {
      setState({ isLoading: false });
    }
  };

  const handlePlanEnroll = async (gymId, planId, locationId) => {
    try {
      const response = await enrollMemberships({
        gymId,
        planId,
        locationId,
        memberId: user?.member?._id || null,
      });

      enqueueSnackbar(response?.message, { variant: "success" });

      navigate("/memberships/overview");
    } catch (error) {
      enqueueSnackbar(error?.message, { variant: "error" });
    }
  };

  const init = async () => {
    try {
      setState({ isLoading: true });

      const response = await listGyms();

      const updatedGyms = response?.data?.map((elem) => ({
        ...elem,
        selectedLocation: elem?.locations[0]?._id,
      }));

      setState({
        gyms: updatedGyms,
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
    <div className="w-full min-h-screen sm:h-screen overflow-y-scroll overflow-x-scroll p-4 lg:px-12">
      {state?.isLoading ? (
        <div className="mt-10 w-full h-screen flex justify-center">
          <Spinner loading={state?.isLoading} />
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center">
            <div className="text-4xl font-semibold text-grey">Health Club</div>

            <div>
              <Link
                to="/signup?memberSignup=true"
                className="underline text-grey"
              >
                Member Signup
              </Link>
            </div>
          </div>

          <div className="w-full mt-10">
            {state?.gyms.map((gym) => (
              <div key={gym?._id}>
                <div className="flex justify-between items-center">
                  <div className="text-grey font-semibold text-xl">
                    {gym?.name}
                  </div>

                  <div>
                    <Select
                      fullWidth
                      variant="outlined"
                      name="location"
                      value={gym?.selectedLocation}
                      onChange={(event) =>
                        handleChangeLocation(event, gym?._id)
                      }
                      color="secondary"
                      style={{
                        width: 150,
                        height: 40,
                        borderRadius: 6,
                      }}
                    >
                      {gym?.locations?.map((location) => (
                        <MenuItem key={location?._id} value={location?._id}>
                          {location?.city}
                        </MenuItem>
                      ))}
                    </Select>
                  </div>
                </div>

                <div className="mt-4">
                  <div>Available plans</div>

                  <div className="grid grid-cols-3 gap-3">
                    {gym?.plans?.map((plan) => (
                      <div
                        key={plan?._id}
                        className="my-2 border-[1px] rounded-md p-4"
                      >
                        <div className="text-grey text-lg">{plan?.name}</div>

                        <div className="text-grey mt-2">${plan?.price}</div>

                        <div className="text-grey text-sm mt-4">
                          {plan?.description}
                        </div>

                        <div className="mt-4">
                          <Button
                            label="Enroll"
                            color="secondary"
                            onClick={() =>
                              handlePlanEnroll(
                                gym?._id,
                                plan?._id,
                                gym?.selectedLocation
                              )
                            }
                            style={{
                              borderRadius: 10,
                              fontSize: 14,
                              color: "#FFFFFF",
                            }}
                            fullWidth
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
