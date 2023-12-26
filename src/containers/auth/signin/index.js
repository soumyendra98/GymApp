import { useNavigate, Link } from "react-router-dom";
import { useSnackbar } from "notistack";
import TextField from "components/TextField";
import ErrorMessage from "components/ErrorMessage";
import Button from "components/Button";
import { useMergeState } from "utils/custom-hooks";
import { APP_TOKEN } from "utils/constants";
import { signin } from "api";

export default function SigninContainer({ setUser }) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const [state, setState] = useMergeState({
    isLoading: false,
    email: "",
    password: "",
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

    if (!state.email) {
      payload = { email: true, ...payload };
      isValid = false;
    }

    if (!state.password) {
      payload = { password: true, ...payload };
      isValid = false;
    }

    setState({ errors: { ...payload } });

    return isValid;
  };

  const handleSignin = async () => {
    if (!isFormValid()) {
      return;
    }

    try {
      const response = await signin({
        email: state?.email,
        password: state?.password,
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
    <div className="w-full min-h-screen flex flex-col justify-center items-center bg-red-light">
      <div className="bg-white opacity-90 rounded-lg w-11/12 md:w-3/5 lg:w-2/5 pt-5 pb-10 pl-10 pr-10 md:pl-20 md:pr-20 flex items-center mt-10 mb-10">
        <div className="w-full">
          <div className="flex justify-center text-grey text-xl mt-4">
            Knock, knock who&apos;s there?
          </div>

          <div className="mt-10">
            <div>
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

            <div className="flex justify-end mt-4">
              <Link
                to="/forgot-password"
                className="text-grey text-xs underline w-fit"
              >
                Forgot password
              </Link>
            </div>

            <div className="mt-5">
              <Button
                label="Login"
                color="secondary"
                onClick={handleSignin}
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

            <div className="flex flex-col items-center mt-5">
              <div className="text-grey">OR</div>

              <div className="text-grey mt-5">
                Don&apos;t have an account?{" "}
                <Link to="/onboarding" className="underline">
                  Sign up here
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
