import { useEffect } from "react";
import { useSnackbar } from "notistack";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useMergeState } from "utils/custom-hooks";
import { getGymLocations } from "api";

export default function LocationFilter({ selectedLocation, onChange }) {
  const { enqueueSnackbar } = useSnackbar();

  const [state, setState] = useMergeState({
    locations: [],
  });

  const handleChange = (event) => {
    onChange(event?.target?.value);
  };

  const init = async () => {
    try {
      const response = await getGymLocations();

      onChange(response?.data[0]?._id);

      setState({ locations: response?.data });
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
      <Select
        fullWidth
        variant="outlined"
        name="location"
        value={selectedLocation}
        onChange={handleChange}
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
  );
}
