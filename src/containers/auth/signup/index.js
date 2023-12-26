import { useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useSnackbar } from "notistack";
import TextField from "components/TextField";
import ErrorMessage from "components/ErrorMessage";
import Button from "components/Button";
import { useMergeState } from "utils/custom-hooks";
import { APP_TOKEN } from "utils/constants";
import { signup } from "api";

export default function SignupContainer({ setUser }) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const [searchParams] = useSearchParams();

  const memberSignup = searchParams.get("memberSignup");

  const firstName = searchParams.get("firstName");
  const lastName = searchParams.get("lastName");

  // not using searchParams because '+' sign in email is being converted to blank space
  const email = window?.location?.search?.split("email=")[1] || null;

  const [state, setState] = useMergeState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (!state.confirmPassword) {
      payload = { confirmPassword: true, ...payload };
      isValid = false;
    }

    if (state.password !== state.confirmPassword) {
      payload = { confirmPassword: true, ...payload };
      isValid = false;
    }

    setState({ errors: { ...payload } });

    return isValid;
  };

  const handleSignup = async () => {
    if (!isFormValid()) {
      return;
    }

    try {
      setState({ isLoading: true });

      const response = await signup({
        firstName: state?.firstName,
        lastName: state?.lastName,
        email: state?.email,
        password: state?.password,
        confirmPassword: state?.confirmPassword,
        memberSignup,
      });

      localStorage.setItem(APP_TOKEN, response?.data?.token);

      setUser(response?.data?.user);

      if (memberSignup) {
        navigate("/home");
      } else {
        navigate("/dashboard/overview");
      }
    } catch (error) {
      enqueueSnackbar(error?.message, { variant: "error" });
    } finally {
      setState({ isLoading: false });
    }
  };

  useEffect(() => {
    if (!memberSignup && !email) {
      return;
    }

    setState({
      firstName,
      lastName,
      email,
    });
  }, []);

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-red-light">
      <div className="bg-white opacity-90 rounded-lg w-11/12 md:w-3/5 lg:w-2/5 pt-5 pb-10 pl-10 pr-10 md:pl-20 md:pr-20 flex items-center mt-10 mb-10">
        <div className="w-full">
          <div className="text-grey text-center text-xl">
            Thanks a <span className="text-green-3">lot</span> for being a
            patreon
          </div>

          <div className="mt-10">
            <div>
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
                autoComplete="off"
                disabled={firstName}
              />

              {state?.errors?.firstName && (
                <ErrorMessage message="First name is required" />
              )}
            </div>

            <div className="mt-5">
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
                autoComplete="off"
                disabled={lastName}
              />

              {state?.errors?.lastName && (
                <ErrorMessage message="Last name is required" />
              )}
            </div>

            <div className="mt-5">
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
                autoComplete="off"
                disabled={!memberSignup}
              />

              {state?.errors?.email && (
                <ErrorMessage message="Email is required" />
              )}
            </div>

            <div className="mt-5">
              <TextField
                fullWidth
                type="password"
                label="PASSWORD"
                variant="outlined"
                name="password"
                value={state.password}
                onChange={handleChange}
                required
                error={state?.errors?.password}
                InputLabelProps={{
                  shrink: true,
                  disableAnimation: true,
                }}
                autoComplete="off"
              />

              {state?.errors?.password && (
                <ErrorMessage message="Password is required" />
              )}
            </div>

            <div className="mt-5">
              <TextField
                fullWidth
                type="password"
                label="CONFIRM PASSWORD"
                variant="outlined"
                name="confirmPassword"
                value={state.confirmPassword}
                onChange={handleChange}
                required
                error={state?.errors?.confirmPassword}
                InputLabelProps={{
                  shrink: true,
                  disableAnimation: true,
                }}
                autoComplete="off"
              />

              {state?.errors?.confirmPassword && (
                <ErrorMessage message="Please re-enter your password" />
              )}
            </div>

            <div className="mt-10">
              <Button
                label="Create Your Account"
                color="secondary"
                onClick={handleSignup}
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

            <div className="text-grey text-xs mt-5">
              Already have an account?{" "}
              <Link to="/signin" className="underline">
                Signin here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
