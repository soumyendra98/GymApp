import { useEffect } from "react";
import { useSnackbar } from "notistack";
import Spinner from "components/Spinner";
import TextField from "components/TextField";
import { useMergeState } from "utils/custom-hooks";
import { getGymLocations } from "api";

export default function SettingsLocationsContainer() {
  const { enqueueSnackbar } = useSnackbar();

  const [state, setState] = useMergeState({
    isLoading: false,
    locations: [],
  });

  const handleChange = (event, index) => {
    const updatedLocations = [...state?.locations];

    updatedLocations[index][event?.target?.name] = event?.target?.value;

    setState({ locations: updatedLocations });
  };

  const init = async () => {
    try {
      setState({ isLoading: true });

      const response = await getGymLocations();

      setState({
        locations: response?.data,
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
        <div className="flex justify-between">
          <div className="w-full lg:w-8/12">
            <div className="profile-box p-4">
              <div className="flex justify-between items-center">
                <div className="text-lg text-grey font-semibold">Overview</div>
              </div>

              {state?.locations?.map((location, index) => (
                <div key={location?._id} className="w-full mt-5">
                  <div className="text-lg text-grey font-semibold">
                    Location {index + 1}
                  </div>

                  <div className="mt-5">
                    <TextField
                      fullWidth
                      label="ADDRESS LINE 1"
                      variant="outlined"
                      name="addressLine1"
                      value={location?.addressLine1}
                      onChange={(event) => handleChange(event, index)}
                      InputLabelProps={{
                        shrink: true,
                        disableAnimation: true,
                      }}
                      disabled={!state?.shouldEdit}
                    />
                  </div>

                  <div className="mt-4">
                    <TextField
                      fullWidth
                      label="ADDRESS LINE 2"
                      variant="outlined"
                      name="addressLine2"
                      value={location?.addressLine2}
                      onChange={(event) => handleChange(event, index)}
                      InputLabelProps={{
                        shrink: true,
                        disableAnimation: true,
                      }}
                      disabled={!state?.shouldEdit}
                    />
                  </div>

                  <div className="flex justify-between mt-4">
                    <div className="w-1/2">
                      <TextField
                        fullWidth
                        label="CITY"
                        variant="outlined"
                        name="city"
                        value={location?.city}
                        onChange={(event) => handleChange(event, index)}
                        InputLabelProps={{
                          shrink: true,
                          disableAnimation: true,
                        }}
                        disabled={!state?.shouldEdit}
                      />
                    </div>

                    <div className="w-1/2 ml-2">
                      <TextField
                        fullWidth
                        label="STATE"
                        variant="outlined"
                        name="state"
                        value={location?.state}
                        onChange={(event) => handleChange(event, index)}
                        InputLabelProps={{
                          shrink: true,
                          disableAnimation: true,
                        }}
                        disabled={!state?.shouldEdit}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between mt-4">
                    <div className="w-1/2">
                      <TextField
                        fullWidth
                        label="ZIP CODE"
                        variant="outlined"
                        name="zipcode"
                        value={location?.zipcode}
                        onChange={(event) => handleChange(event, index)}
                        InputLabelProps={{
                          shrink: true,
                          disableAnimation: true,
                        }}
                        disabled={!state?.shouldEdit}
                      />
                    </div>

                    <div className="w-1/2 ml-2">
                      <TextField
                        fullWidth
                        label="COUNTRY"
                        variant="outlined"
                        name="country"
                        value={location?.country}
                        InputLabelProps={{
                          shrink: true,
                          disableAnimation: true,
                        }}
                        disabled
                      />
                    </div>
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
