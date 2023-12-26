import { useEffect } from "react";
import { useSnackbar } from "notistack";
import { useSearchParams, useNavigate } from "react-router-dom";
import Checkbox from "@mui/material/Checkbox";
import InputAdornment from "@mui/material/InputAdornment";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "components/Button";
import TextField from "components/TextField";
import ErrorMessage from "components/ErrorMessage";
import { ScheduleTypeList, UserRoles } from "utils/constants";
import { useMergeState } from "utils/custom-hooks";
import {
  listInstructors,
  getPlan,
  createPlan,
  updatePlan,
  getGymLocations,
} from "api";

const DAYS_OF_WEEK = [
  { id: "1", label: "SUN", value: "SUN", checked: false, from: "", to: "" },
  {
    id: "2",
    label: "MON",
    value: "MON",
    checked: true,
    from: "8:00 AM",
    to: "9:00 AM",
  },
  {
    id: "3",
    label: "TUE",
    value: "TUE",
    checked: true,
    from: "8:00 AM",
    to: "9:00 AM",
  },
  {
    id: "4",
    label: "WED",
    value: "WED",
    checked: true,
    from: "8:00 AM",
    to: "9:00 AM",
  },
  {
    id: "5",
    label: "THU",
    value: "THU",
    checked: true,
    from: "8:00 AM",
    to: "9:00 AM",
  },
  {
    id: "6",
    label: "FRI",
    value: "FRI",
    checked: true,
    from: "8:00 AM",
    to: "9:00 AM",
  },
  { id: "7", label: "SAT", value: "SAT", checked: false, from: "", to: "" },
];

const TIME_LIST = [
  "12:00 AM",
  "12:15 AM",
  "12:30 AM",
  "12:45 AM",
  "1:00 AM",
  "1:15 AM",
  "1:30 AM",
  "1:45 AM",
  "2:00 AM",
  "2:15 AM",
  "2:30 AM",
  "2:45 AM",
  "3:00 AM",
  "3:15 AM",
  "3:30 AM",
  "3:45 AM",
  "4:00 AM",
  "4:15 AM",
  "4:30 AM",
  "4:45 AM",
  "5:00 AM",
  "5:15 AM",
  "5:30 AM",
  "5:45 AM",
  "6:00 AM",
  "6:15 AM",
  "6:30 AM",
  "6:45 AM",
  "7:00 AM",
  "7:15 AM",
  "7:30 AM",
  "7:45 AM",
  "8:00 AM",
  "8:15 AM",
  "8:30 AM",
  "8:45 AM",
  "9:00 AM",
  "9:15 AM",
  "9:30 AM",
  "9:45 AM",
  "10:00 AM",
  "10:15 AM",
  "10:30 AM",
  "10:45 AM",
  "11:00 AM",
  "11:15 AM",
  "11:30 AM",
  "11:45 AM",
  "12:00 PM",
  "12:15 PM",
  "12:30 PM",
  "12:45 PM",
  "1:00 PM",
  "1:15 PM",
  "1:30 PM",
  "1:45 PM",
  "2:00 PM",
  "2:15 PM",
  "2:30 PM",
  "2:45 PM",
  "3:00 PM",
  "3:15 PM",
  "3:30 PM",
  "3:45 PM",
  "4:00 PM",
  "4:15 PM",
  "4:30 PM",
  "4:45 PM",
  "5:00 PM",
  "5:15 PM",
  "5:30 PM",
  "5:45 PM",
  "6:00 PM",
  "6:15 PM",
  "6:30 PM",
  "6:45 PM",
  "7:00 PM",
  "7:15 PM",
  "7:30 PM",
  "7:45 PM",
  "8:00 PM",
  "8:15 PM",
  "8:30 PM",
  "8:45 PM",
  "9:00 PM",
  "9:15 PM",
  "9:30 PM",
  "9:45 PM",
  "10:00 PM",
  "10:15 PM",
  "10:30 PM",
  "10:45 PM",
  "11:00 PM",
  "11:15 PM",
  "11:30 PM",
  "11:45 PM",
];

export default function PlansCreateContainer({ user }) {
  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const planId = searchParams.get("id");

  const [state, setState] = useMergeState({
    isLoading: false,

    name: "",
    description: "",
    price: "",
    type: "",
    schedule: {},
    instructors: [],
    instructor: "",
    locations: [],
    location: "",

    isEditMode: false,
    errors: {},
  });

  const handleChange = (event) => {
    setState({
      [event.target.name]: event.target.value,
      errors: {
        [event.target.name]: false,
      },
    });
  };

  const handleChangeSchedule = (day, key, value) => {
    setState({
      schedule: {
        ...state?.schedule,
        [day]: { ...state?.schedule[day], [key]: value },
      },
    });
  };

  const handleChangeLocation = (event) => {
    setState({ location: event?.target?.value });
  };

  const handleSave = async () => {
    try {
      setState({ isLoading: true });

      const payload = {
        name: state?.name,
        description: state?.description,
        price: Number(state?.price),
        type: state?.type,
        schedule: state?.schedule,
        instructor: state?.instructor,
        location: state?.location,
      };

      let response = {};

      if (state?.isEditMode) {
        response = await updatePlan({ ...payload, id: planId });
      } else {
        response = await createPlan(payload);
        navigate("/plans/overview");
      }

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

      const locationResponse = await getGymLocations();
      const location = locationResponse?.data[0]?._id;
      setState({
        locations: locationResponse?.data,
        location,
      });

      const instructorsResponse = await listInstructors({ location });
      setState({ instructors: instructorsResponse?.data });

      if (planId) {
        const response = await getPlan(planId);

        setState({
          name: response?.data?.name,
          description: response?.data?.description,
          price: response?.data?.price,
          type: response?.data?.type,
          schedule: response?.data?.schedule,
          instructor: response?.data?.instructor,
          location: response?.data?.location,

          isEditMode: true,
        });
      } else {
        setState({
          schedule: DAYS_OF_WEEK.reduce((acc, key) => {
            acc[key?.value] = { ...key };
            return acc;
          }, {}),
        });
      }
    } catch (error) {
      enqueueSnackbar(error?.message, { variant: "error" });
    } finally {
      setState({ isLoading: false });
    }
  };

  const shouldDisable = user?.role === UserRoles.INSTRUCTOR;

  useEffect(() => {
    init();
  }, []);

  return (
    <div>
      {shouldDisable ? (
        <div className="text-4xl font-semibold text-grey mb-4">
          Class Details{" "}
        </div>
      ) : (
        <div className="text-4xl font-semibold text-grey mb-4">
          {state?.isEditMode ? "Edit plan" : "Create a new plan"}
        </div>
      )}

      <div className="w-full lg:w-3/5 my-8">
        <div>
          <div className="text-grey font-medium">
            What do you want to call your plan?
          </div>

          <div className="my-2">
            <TextField
              fullWidth
              label="NAME"
              variant="outlined"
              name="name"
              value={state?.name}
              onChange={handleChange}
              required
              error={state?.errors?.name}
              InputLabelProps={{
                shrink: true,
                disableAnimation: true,
              }}
              autoComplete="off"
              disabled={shouldDisable}
            />

            {state?.errors?.name && <ErrorMessage message="Name is required" />}
          </div>
        </div>

        <div className="mt-5">
          <div className="text-grey font-medium">
            How would you describe this plan?
          </div>

          <div className="my-2">
            <TextField
              fullWidth
              label="DESCRIPTION"
              variant="outlined"
              name="description"
              value={state.description}
              onChange={handleChange}
              required
              error={state?.errors?.description}
              multiline
              minRows={4}
              InputLabelProps={{
                shrink: true,
                disableAnimation: true,
              }}
              autoComplete="off"
              disabled={shouldDisable}
            />

            {state?.errors?.description && (
              <ErrorMessage message="Description is required" />
            )}
          </div>

          <div className="mt-5">
            <div className="text-grey font-medium">Price</div>

            <div className="my-2">
              <TextField
                fullWidth
                type="number"
                variant="outlined"
                name="price"
                value={state?.price}
                onChange={handleChange}
                onWheel={(event) => event.target.blur()}
                color="secondary"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                  style: {
                    width: 150,
                    height: 40,
                    borderRadius: 6,
                  },
                }}
                disabled={shouldDisable}
              />
            </div>
          </div>

          <div className="mt-5">
            <div className="text-grey font-medium">Schedule Type</div>

            <div className="my-2">
              <Select
                fullWidth
                variant="outlined"
                name="type"
                value={state?.type}
                onChange={handleChange}
                color="secondary"
                style={{
                  width: 150,
                  height: 40,
                  borderRadius: 6,
                }}
                disabled={shouldDisable}
              >
                {ScheduleTypeList.map((item) => (
                  <MenuItem key={item.label} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </div>

          <div className="mt-5">
            <div className="text-grey font-medium">Class Schedule</div>

            <div>
              {Object.keys(state?.schedule).map((day) => (
                <div key={day} className="flex items-center my-4">
                  <div className="w-1/4 flex items-center">
                    <div>
                      <Checkbox
                        checked={state?.schedule[day]?.checked}
                        onChange={(event) =>
                          handleChangeSchedule(
                            day,
                            "checked",
                            event?.target?.checked
                          )
                        }
                        disabled={shouldDisable}
                      />
                    </div>

                    <div className="font-medium">
                      {state?.schedule[day]?.label}
                    </div>
                  </div>

                  {!state?.schedule[day]?.checked && (
                    <div className="text-grey-2">Unavailable</div>
                  )}

                  {state?.schedule[day]?.checked && (
                    <div className="w-3/4 flex justify-between items-center">
                      <div>
                        <Select
                          variant="outlined"
                          value={state?.schedule[day]?.from}
                          onChange={(event) =>
                            handleChangeSchedule(
                              day,
                              "from",
                              event?.target?.value
                            )
                          }
                          color="secondary"
                          style={{
                            width: 150,
                            height: 40,
                            borderRadius: 6,
                          }}
                          disabled={shouldDisable}
                        >
                          {TIME_LIST.map((time) => (
                            <MenuItem key={time} value={time}>
                              {time}
                            </MenuItem>
                          ))}
                        </Select>
                      </div>

                      <div className="font-medium">-</div>

                      <div>
                        <Select
                          variant="outlined"
                          value={state?.schedule[day]?.to}
                          onChange={(event) =>
                            handleChangeSchedule(
                              day,
                              "to",
                              event?.target?.value
                            )
                          }
                          color="secondary"
                          style={{
                            width: 150,
                            height: 40,
                            borderRadius: 6,
                          }}
                          disabled={shouldDisable}
                        >
                          {TIME_LIST.map((time) => (
                            <MenuItem key={time} value={time}>
                              {time}
                            </MenuItem>
                          ))}
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center mt-5">
            <div>
              <div className="text-grey font-medium">Instructor</div>

              <div className="my-2">
                <Select
                  fullWidth
                  variant="outlined"
                  name="instructor"
                  value={state?.instructor}
                  onChange={handleChange}
                  color="secondary"
                  style={{
                    width: 300,
                    height: 40,
                    borderRadius: 6,
                  }}
                  disabled={shouldDisable}
                >
                  {state?.instructors?.map((item) => (
                    <MenuItem key={item?._id} value={item?._id}>
                      {item?.user?.firstName} {item?.user?.lastName}
                    </MenuItem>
                  ))}
                </Select>
              </div>
            </div>

            <div>
              <div className="text-grey font-medium">Location</div>

              <div className="my-2">
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
                  disabled={shouldDisable}
                >
                  {state?.locations?.map((location) => (
                    <MenuItem key={location?._id} value={location?._id}>
                      {location?.city}
                    </MenuItem>
                  ))}
                </Select>
              </div>
            </div>
          </div>
        </div>

        {!shouldDisable && (
          <div className="w-full mt-8">
            <Button
              label={state?.isEditMode ? "Edit Plan" : "Create Plan"}
              color="secondary"
              onClick={handleSave}
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
        )}
      </div>
    </div>
  );
}
