import { useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";
import { useSnackbar } from "notistack";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import IconButton from "@mui/material/IconButton";
import Button from "components/Button";
import TextField from "components/TextField";
import { useMergeState } from "utils/custom-hooks";
import { getGymLocations, inviteMembers } from "api";
import { useEffect } from "react";

const getMemberId = () => nanoid(10);

export default function MembersInviteContainer() {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const [state, setState] = useMergeState({
    isLoading: false,
    locations: [],
    location: "",
    members: [{ id: getMemberId(), firstName: "", lastName: "", email: "" }],
    errors: {},
  });

  const handleChangeLocation = (event) => {
    setState({ location: event?.target?.value });
  };

  const handleChangeMembers = (event, index) => {
    const newMembers = [...state?.members];

    newMembers[index][event?.target?.name] = event?.target?.value;

    setState({
      members: [...newMembers],
    });
  };

  const handleAddMember = () => {
    const newMembers = [...state?.members];

    newMembers.push({
      id: getMemberId(),
      firstName: "",
      lastName: "",
      email: "",
    });

    setState({
      members: newMembers,
    });
  };

  const handleRemoveMember = (index) => {
    const newMembers = [...state?.members];

    newMembers.splice(index, 1);

    setState({
      members: newMembers,
    });
  };

  const handleSave = async () => {
    try {
      setState({ isLoading: true });

      const response = await inviteMembers({
        members: state?.members,
        location: state?.location,
      });

      if (response?.success) {
        navigate("/members/overview");
      }
    } catch (error) {
      enqueueSnackbar(error?.message, { variant: "error" });
    } finally {
      setState({ isLoading: false });
    }
  };

  const init = async () => {
    const locationResponse = await getGymLocations();

    const location = locationResponse?.data[0]?._id;

    setState({
      locations: locationResponse?.data,
      location,
    });
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="text-4xl font-semibold text-grey mb-4">
          Invite new members
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

      <div className="w-4/5 my-8">
        <div className="mt-3">
          {state?.members?.map((member, index) => (
            <div
              key={member?.id}
              className="flex justify-between items-center mt-2"
            >
              <div className="w-full flex items-center">
                <div className="w-1/3">
                  <div className="text-grey text-sm">First Name</div>

                  <div className="mt-1">
                    <TextField
                      variant="outlined"
                      name="firstName"
                      value={state?.members[index]?.firstName}
                      onChange={(event) => handleChangeMembers(event, index)}
                      color="secondary"
                      InputProps={{
                        style: {
                          height: 40,
                          borderRadius: 6,
                          fontSize: 14,
                        },
                      }}
                      fullWidth
                    />
                  </div>
                </div>

                <div className="w-1/3 ml-4">
                  <div className="text-grey text-sm">Last Name</div>

                  <div className="mt-1">
                    <TextField
                      variant="outlined"
                      name="lastName"
                      value={state?.members[index]?.lastName}
                      onChange={(event) => handleChangeMembers(event, index)}
                      color="secondary"
                      InputProps={{
                        style: {
                          height: 40,
                          borderRadius: 6,
                          fontSize: 14,
                        },
                      }}
                      fullWidth
                    />
                  </div>
                </div>

                <div className="w-1/3 ml-4">
                  <div className="text-grey text-sm">Email</div>

                  <div className="mt-1">
                    <TextField
                      variant="outlined"
                      name="email"
                      value={state?.members[index]?.email}
                      onChange={(event) => handleChangeMembers(event, index)}
                      color="secondary"
                      InputProps={{
                        style: {
                          height: 40,
                          borderRadius: 6,
                          fontSize: 14,
                        },
                      }}
                      fullWidth
                    />
                  </div>
                </div>
              </div>

              <div className="w-36 mt-4 ml-4">
                {index === state?.members?.length - 1 ? (
                  <IconButton onClick={handleAddMember}>
                    <AddIcon />
                  </IconButton>
                ) : (
                  <IconButton onClick={() => handleRemoveMember(index)}>
                    <RemoveIcon />
                  </IconButton>
                )}

                {index !== 0 && index === state?.members?.length - 1 && (
                  <IconButton onClick={() => handleRemoveMember(index)}>
                    <RemoveIcon />
                  </IconButton>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="w-1/4 mt-8">
          <Button
            label="Invite Members"
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
      </div>
    </div>
  );
}
