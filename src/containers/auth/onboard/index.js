import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import TextField from "components/TextField";
import ErrorMessage from "components/ErrorMessage";
import Button from "components/Button";
import { useMergeState } from "utils/custom-hooks";
import { APP_TOKEN } from "utils/constants";
import { onboardGym } from "api";

export default function GymOnboardingContainer({ setUser }) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const [state, setState] = useMergeState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    gymName: "",
    errors: {},
  });

  const isFormValid = () => {
    let isValid = true;

    let payload = {};

    if (!state.firstName) {
      payload = { firstName: true, ...payload };
      isValid = false;
    }

    if (!state.lastName) {
      payload = { lastName: true, ...payload };
      isValid = false;
    }

    if (!state.email) {
      payload = { email: true, ...payload };
      isValid = false;
    }

    if (!state.password) {
      payload = { password: true, ...payload };
      isValid = false;
    }

    if (!state.confirmPassword || state.confirmPassword !== state.password) {
      payload = { confirmPassword: true, ...payload };
      isValid = false;
    }

    if (!state.gymName) {
      payload = { gymName: true, ...payload };
      isValid = false;
    }

    setState({ errors: { ...payload } });

    return isValid;
  };

  const handleChange = (event) => {
    setState({
      [event.target.name]: event.target.value,
      errors: {
        [event.target.name]: false,
      },
    });
  };

  const handleOnboarding = async () => {
    if (!isFormValid()) {
      return;
    }

    try {
      const response = await onboardGym({
        firstName: state?.firstName,
        lastName: state?.lastName,
        email: state?.email,
        password: state?.password,
        confirmPassword: state?.confirmPassword,
        gymName: state?.gymName,
      });

      if (response?.success) {
        localStorage.setItem(APP_TOKEN, response?.data?.token);

        setUser(response?.data?.user);

        navigate("/dashboard/overview");
      }
    } catch (error) {
      enqueueSnackbar(error?.message, { variant: "error" });
    }
  };

  return (
    <div className="min-h-screen">
      <div className="my-8">
        <div className="flex justify-center">
          <div className="rounded-2xl px-8 py-2 lg:w-1/2">
            <div className="text-xl font-semibold my-1">Start free trial</div>

            <div className="w-full mt-5">
              <TextField
                fullWidth
                label="FIRST NAME"
                variant="outlined"
                name="firstName"
                value={state.firstName}
                onChange={handleChange}
                required
                error={state?.errors?.firstName}
                InputLabelProps={{
                  shrink: true,
                  disableAnimation: true,
                }}
              />

              {state?.errors?.firstName && (
                <ErrorMessage message="First name is required" />
              )}
            </div>

            <div className="w-full mt-8">
              <TextField
                fullWidth
                label="LAST NAME"
                variant="outlined"
                name="lastName"
                value={state.lastName}
                onChange={handleChange}
                required
                error={state?.errors?.lastName}
                InputLabelProps={{
                  shrink: true,
                  disableAnimation: true,
                }}
              />

              {state?.errors?.lastName && (
                <ErrorMessage message="Last name is required" />
              )}
            </div>

            <div className="w-full mt-8">
              <TextField
                fullWidth
                label="EMAIL"
                variant="outlined"
                name="email"
                value={state.email}
                onChange={handleChange}
                required
                error={state?.errors?.email}
                InputLabelProps={{
                  shrink: true,
                  disableAnimation: true,
                }}
              />

              {state?.errors?.email && (
                <ErrorMessage message="Email is required" />
              )}
            </div>

            <div className="w-full mt-8">
              <TextField
                fullWidth
                label="PASSWORD"
                variant="outlined"
                name="password"
                type="password"
                value={state.password}
                onChange={handleChange}
                required
                error={state?.errors?.password}
                InputLabelProps={{
                  shrink: true,
                  disableAnimation: true,
                }}
              />

              {state?.errors?.password && (
                <ErrorMessage message="Password is required" />
              )}
            </div>

            <div className="w-full mt-8">
              <TextField
                fullWidth
                label="CONFIRM PASSWORD"
                variant="outlined"
                name="confirmPassword"
                type="password"
                value={state.confirmPassword}
                onChange={handleChange}
                required
                error={state?.errors?.confirmPassword}
                InputLabelProps={{
                  shrink: true,
                  disableAnimation: true,
                }}
              />

              {state?.errors?.confirmPassword && (
                <ErrorMessage message="Confirm password is required" />
              )}
            </div>

            <div className="w-full mt-8">
              <TextField
                fullWidth
                label="GYM NAME"
                variant="outlined"
                name="gymName"
                value={state.gymName}
                onChange={handleChange}
                required
                error={state?.errors?.gymName}
                InputLabelProps={{
                  shrink: true,
                  disableAnimation: true,
                }}
              />

              {state?.errors?.gymName && (
                <ErrorMessage message="Gym name is required" />
              )}
            </div>

            <div className="w-full mt-8">
              <Button
                label="Onboard"
                color="info"
                onClick={handleOnboarding}
                style={{
                  borderRadius: 10,
                  fontSize: 16,
                  color: "#FFFFFF",
                  height: 50,
                }}
                fullWidth
                loaderButton
                loadingPosition="center"
                loading={state?.isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
