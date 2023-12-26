import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Spinner from "components/Spinner";
import Button from "components/Button";
import { useMergeState } from "utils/custom-hooks";
import { getGymLocations, listMemberships } from "api";

export default function MembershipsOverviewContainer() {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const [state, setState] = useMergeState({
    isLoading: false,
    locations: [],
    location: "",
    memberships: [],
  });

  const handleOpenMembershipDetails = (membershipId) => {
    navigate(`/memberships/details?id=${membershipId}`);
  };

  const handleChangeLocation = async (event) => {
    try {
      const location = event?.target?.value;

      setState({ isLoading: true, location });

      const response = await listMemberships({
        location,
      });

      setState({
        memberships: response?.data,
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

      const response = await listMemberships();

      setState({
        locations: locationResponse?.data,
        location,
        memberships: response?.data,
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
            <div className="text-4xl font-semibold text-grey mb-4">
              Your Memberships
            </div>

            {/* <div>
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
            </div> */}
          </div>

          <div className="flex flex-col lg:flex-row my-8">
            <div className="w-full lg:w-3/4">
              {state?.memberships.map((membership) => (
                <div
                  key={membership?._id}
                  className="bg-white border-[1px] rounded-lg border-solid border-[#f1f1f1] shadow-md p-5 mt-8"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="w-11/12">
                      <div className="text-grey font-semibold text-lg">
                        {membership?.plan?.name}
                      </div>

                      <div className="text-grey mt-2">
                        ${membership?.plan?.price}
                      </div>

                      <div className="text-grey text-sm mt-4">
                        {membership?.plan?.description}
                      </div>

                      {/* {plan?.images[0] && (
                        <div className="mt-4">
                          <img
                            src={plan?.images[0]}
                            className="rounded-lg h-52"
                          />
                        </div>
                      )} */}

                      <div className="mt-4">
                        <Button
                          label="Open Membership Details"
                          color="secondary"
                          onClick={() =>
                            handleOpenMembershipDetails(membership?._id)
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

                    {/* <div className="w-11/12 mt-2 sm:mt-0">
                      <div className="text-grey">
                        Active subscribers
                        <span className="text-green font-bold ml-2">
                          {plan?.stats?.activeSubscribers}
                        </span>
                      </div>

                      <div className="text-grey">
                        Previous month new subscribers
                        <span className="text-green font-bold ml-2">
                          {plan?.stats?.previousMonthNewSubscribers}
                        </span>
                      </div>

                      <div className="text-grey">
                        Current month new subscribers
                        <span className="text-green font-bold ml-2">
                          {plan?.stats?.currentMonthNewSubscribers}
                        </span>
                      </div>
                    </div> */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
