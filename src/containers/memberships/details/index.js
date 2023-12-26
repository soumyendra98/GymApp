import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import Spinner from "components/Spinner";
import Button from "components/Button";
import InputAdornment from "@mui/material/InputAdornment";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "components/TextField";
import { ActivityTypes, EquipmentTypeList } from "utils/constants";
import { useMergeState } from "utils/custom-hooks";
import { getMembership, createMembershipActivity } from "api";
import { formatDate } from "utils/date";

export default function MembershipsOverviewContainer() {
  const [searchParams] = useSearchParams();

  const membershipId = searchParams.get("id");

  const { enqueueSnackbar } = useSnackbar();

  const [state, setState] = useMergeState({
    isLoading: false,
    membership: {},
    activity: [],

    equipmentType: "",
    description: "",
    duration: "",

    shouldShowLogActivity: false,
  });

  const handleChange = (event) => {
    setState({
      [event.target.name]: event.target.value,
      errors: {
        [event.target.name]: false,
      },
    });
  };

  const handleToggleLogActivity = () => {
    setState({ shouldShowLogActivity: !state?.shouldShowLogActivity });
  };

  const handleLogActivity = async () => {
    try {
      setState({ isLoading: true });

      const payload = {
        type: ActivityTypes.LOG,
        equipmentType: state?.equipmentType,
        description: state?.description,
        duration: Number(state?.duration),
        mId: state?.membership?._id,
        gId: state?.membership?.gym?._id,
      };

      const response = await createMembershipActivity(payload);

      await init();

      enqueueSnackbar(response?.message, { variant: "success" });
    } catch (error) {
      enqueueSnackbar(error?.message, { variant: "error" });
    } finally {
      setState({ isLoading: false, shouldShowLogActivity: false });
    }
  };

  const handleCreateActivity = async (type) => {
    try {
      setState({ isLoading: true });

      const response = await createMembershipActivity({
        type,
        mId: state?.membership?._id,
        gId: state?.membership?.gym?._id,
      });

      await init();

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

      const response = await getMembership(membershipId);

      setState({
        membership: response?.data?.membership,
        activity: response?.data?.activity,
      });
    } catch (error) {
      enqueueSnackbar(error?.message, { variant: "error" });
    } finally {
      setState({ isLoading: false });
    }
  };

  useEffect(() => {
    if (membershipId) {
      init();
    }
  }, []);

  return (
    <div>
      {state?.isLoading ? (
        <div className="mt-10 w-full h-screen flex justify-center">
          <Spinner loading={state?.isLoading} />
        </div>
      ) : (
        <div className="flex justify-center mt-2 mb-8">
          <div className="w-10/12 md:w-3/4">
            <div className="my-4">
              <div className="relative">
                <img
                  src={state?.membership?.gym?.banner}
                  className="rounded-md w-full h-[300px] object-cover"
                />

                <div>
                  <img
                    src={state?.membership?.gym?.logo}
                    className="rounded-full absolute right-0 -mt-10 mr-4 w-24 h-24"
                  />
                </div>
              </div>

              <div className="text-4xl font-bold mt-12 mb-2">
                {state?.membership?.gym?.name}
              </div>
            </div>

            <div className="sm:w-full bg-white border-[1px] rounded-lg border-solid border-[#f1f1f1] shadow-md p-5">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/2">
                  <div className="text-grey text-xl font-semibold">
                    Your Membership
                  </div>

                  <div className="text-grey font-medium mt-4">
                    {state?.membership?.plan?.name}
                  </div>

                  <div className="text-grey text-sm font-medium mt-2 bg-white w-fit h-6 flex justify-center items-center rounded-md p-2">
                    ${state?.membership?.plan?.price}
                  </div>

                  <div className="w-10/12 text-grey mt-2">
                    {state?.membership?.plan?.description}
                  </div>

                  <div className="block lg:flex w-3/4 justify-between mt-4">
                    <div className="md:w-[120px]">
                      <Button
                        label="Check In"
                        color="secondary"
                        onClick={() =>
                          handleCreateActivity(ActivityTypes.CHECK_IN)
                        }
                        style={{
                          borderRadius: 40,
                          fontSize: 14,
                          color: "#FFFFFF",
                          fontWeight: 500,
                          height: 40,
                        }}
                        fullWidth
                      />
                    </div>

                    <div className="md:w-[120px]">
                      <Button
                        label="Check Out"
                        color="secondary"
                        onClick={() =>
                          handleCreateActivity(ActivityTypes.CHECK_OUT)
                        }
                        style={{
                          borderRadius: 40,
                          fontSize: 14,
                          color: "#FFFFFF",
                          fontWeight: 500,
                          height: 40,
                        }}
                        fullWidth
                      />
                    </div>
                  </div>

                  <div className="md:w-[120px] mt-4">
                    <Button
                      label="Log Activity"
                      color="secondary"
                      onClick={handleToggleLogActivity}
                      style={{
                        borderRadius: 40,
                        fontSize: 14,
                        color: "#FFFFFF",
                        fontWeight: 500,
                        height: 40,
                      }}
                      fullWidth
                    />
                  </div>
                </div>

                <div className="w-full md:w-1/2">
                  <div className="text-grey text-xl font-semibold mb-4">
                    Class Schedule
                  </div>

                  {state?.membership?.plan?.schedule &&
                    Object.keys(state?.membership?.plan?.schedule)?.map(
                      (elem) =>
                        state?.membership?.plan?.schedule[elem]?.checked ? (
                          <div className="flex justify-between items-center">
                            <div className="w-1/4">{elem}</div>
                            <div>
                              {state?.membership?.plan?.schedule[elem]?.from}
                            </div>
                            <div>-</div>
                            <div>
                              {state?.membership?.plan?.schedule[elem]?.to}
                            </div>
                          </div>
                        ) : null
                    )}
                </div>
              </div>

              {state?.shouldShowLogActivity && (
                <div>
                  <div className="w-full lg:w-3/5 my-8">
                    <div>
                      <div className="text-grey font-medium">
                        Equipment Type
                      </div>

                      <div className="my-2">
                        <Select
                          fullWidth
                          variant="outlined"
                          name="equipmentType"
                          value={state?.equipmentType}
                          onChange={handleChange}
                          color="secondary"
                          style={{
                            width: 150,
                            height: 40,
                            borderRadius: 6,
                          }}
                        >
                          {EquipmentTypeList.map((item) => (
                            <MenuItem key={item.label} value={item.value}>
                              {item.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </div>
                    </div>

                    <div className="mt-5">
                      <div className="text-grey font-medium">
                        Would you like to add a description? (optional)
                      </div>

                      <div className="my-2">
                        <TextField
                          fullWidth
                          label="DESCRIPTION"
                          variant="outlined"
                          name="description"
                          value={state.description}
                          onChange={handleChange}
                          multiline
                          minRows={4}
                          InputLabelProps={{
                            shrink: true,
                            disableAnimation: true,
                          }}
                          autoComplete="off"
                        />
                      </div>

                      <div className="mt-5">
                        <div className="text-grey font-medium">Duration</div>

                        <div className="my-2">
                          <TextField
                            fullWidth
                            type="number"
                            variant="outlined"
                            name="duration"
                            value={state?.duration}
                            onChange={handleChange}
                            onWheel={(event) => event.target.blur()}
                            color="secondary"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  Minutes
                                </InputAdornment>
                              ),
                              style: {
                                width: 150,
                                height: 40,
                                borderRadius: 6,
                              },
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="w-full mt-8">
                      <Button
                        label="Save Activity"
                        color="info"
                        onClick={handleLogActivity}
                        style={{
                          borderRadius: 10,
                          fontSize: 14,
                          color: "#FFFFFF",
                          height: 50,
                        }}
                        fullWidth
                        loaderButton
                        loadingPosition="center"
                        loading={state?.isLoading}
                        disabled={state?.isLoading}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-12">
              <div className="text-grey text-xl font-semibold">
                Past Activity
              </div>

              <div className="grid sm:grid-cols-1 md:grid-cols-2 md:gap-2 ld:gap-3 lg:grid-cols-3">
                {state?.activity?.map((activity) => (
                  <div
                    key={activity?._id}
                    className="bg-white border-[1px] rounded-lg border-solid border-[#f1f1f1] shadow-md flex flex-col justify-between w-[220px] h-[100px] p-4 my-4"
                  >
                    <div className="text-grey text-xl font-semibold">
                      {activity?.type === ActivityTypes.LOG
                        ? activity?.equipmentType
                        : activity?.type}
                    </div>

                    <div className="text-grey text-sm my-1">
                      {formatDate(activity?.createdAt, "lll")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
