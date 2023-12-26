import { useEffect, useRef } from "react";
import { useSnackbar } from "notistack";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Button from "components/Button";
import Spinner from "components/Spinner";
import TextField from "components/TextField";
import ErrorMessage from "components/ErrorMessage";
import { useMergeState } from "utils/custom-hooks";
import { toBase64 } from "utils/common";
import { getGymProfile, updateGymProfile } from "api";

export default function SettingsProfileContainer() {
  const { enqueueSnackbar } = useSnackbar();

  const [state, setState] = useMergeState({
    businessName: "",
    businessDescription: "",

    businessBanner: "",
    businessBannerBase64: null,
    businessBannerFile: null,
    isEditingBusinessBanner: false,
    businessLogo: "",
    businessLogoFile: null,
    businessLogoBase64: null,
    isEditingBusinessLogo: false,

    shouldEditBusinessDetails: false,
    isSavingBusinessDetails: false,

    errors: {},
  });

  const businessBannerRef = useRef();

  const businessLogoRef = useRef();

  const handleChange = (event) => {
    setState({
      [event.target.name]: event.target.value,
      errors: {
        [event.target.name]: false,
      },
    });
  };

  const handleBusinessBanner = async (event) => {
    const file = event.target.files && event.target.files[0];

    if (!file) {
      return;
    }

    event.target.value = "";

    const base64 = await toBase64(file);

    setState({
      businessBannerFile: file,
      businessBannerBase64: base64,
      isEditingBusinessBanner: true,
    });
  };

  const handleBusinessLogo = async (event) => {
    const file = event.target.files && event.target.files[0];

    if (!file) {
      return;
    }

    event.target.value = "";

    const base64 = await toBase64(file);

    setState({
      businessLogoFile: file,
      businessLogoBase64: base64,
      isEditingBusinessLogo: true,
    });
  };

  const handleToggleEditBusinessDetails = () => {
    setState({ shouldEditBusinessDetails: !state?.shouldEditBusinessDetails });
  };

  const isFormValid = () => {
    let isValid = true;

    let payload = {};

    if (!state.businessName) {
      payload = { businessName: true, ...payload };
      isValid = false;
    }

    if (!state.businessDescription) {
      payload = { businessDescription: true, ...payload };
      isValid = false;
    }

    setState({ errors: { ...payload } });

    return isValid;
  };

  const handleBusinessBannerRef = () => {
    businessBannerRef.current.click();
  };

  const handleBusinessLogoRef = () => {
    businessLogoRef.current.click();
  };

  const shouldShowBusinessBanner = () => {
    if (state?.isEditingBusinessBanner && state?.businessBannerBase64) {
      return true;
    }

    if (!state.isEditingBusinessBanner && state?.businessBanner) {
      return true;
    }

    return false;
  };

  const shouldShowBusinessLogo = () => {
    if (state?.isEditingBusinessLogo && state?.businessLogoBase64) {
      return true;
    }

    if (!state.isEditingBusinessLogo && state?.businessLogo) {
      return true;
    }

    return false;
  };

  const handleSaveBusinessDetails = async () => {
    try {
      if (!isFormValid()) {
        return;
      }

      setState({ isLoading: true });

      const payload = {
        name: state?.businessName,
        description: state?.businessDescription,

        businessBannerBase64: null,
        businessBannerContentType: null,
        businessLogoBase64: null,
        businessLogoContentType: null,

        addressLine1: state?.addressLine1,
        addressLine2: state?.addressLine2,
        city: state?.city,
        state: state?.state,
        country: state?.country,
        zipcode: state?.zipcode,
      };

      if (state.businessBannerBase64) {
        payload.businessBannerBase64 = state.businessBannerBase64;
        payload.businessBannerContentType = state.businessBannerFile?.type;
      }

      if (state.businessLogoBase64) {
        payload.businessLogoBase64 = state.businessLogoBase64;
        payload.businessLogoContentType = state.businessLogoFile?.type;
      }

      await updateGymProfile(payload);
    } catch (error) {
      enqueueSnackbar(error?.message, { variant: "error" });
    } finally {
      setState({ isLoading: false });
    }
  };

  const init = async () => {
    try {
      setState({ isLoading: true });

      const response = await getGymProfile();

      setState({
        businessName: response?.data?.name,
        businessDescription: response?.data?.description,
        businessBanner: response?.data?.banner,
        businessLogo: response?.data?.logo,
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

                <div>
                  <IconButton onClick={handleToggleEditBusinessDetails}>
                    <EditIcon />
                  </IconButton>
                </div>
              </div>

              <div className="w-full mt-5">
                <div>
                  <TextField
                    fullWidth
                    label="NAME"
                    variant="outlined"
                    name="businessName"
                    value={state.businessName}
                    onChange={handleChange}
                    required
                    error={state?.errors?.businessName}
                    InputLabelProps={{
                      shrink: true,
                      disableAnimation: true,
                    }}
                    disabled={!state?.shouldEditBusinessDetails}
                  />

                  {state?.errors?.businessName && (
                    <ErrorMessage message="Name is required" />
                  )}
                </div>

                <div className="mt-4">
                  <TextField
                    fullWidth
                    label="DESCRIPTION"
                    variant="outlined"
                    name="businessDescription"
                    value={state.businessDescription}
                    onChange={handleChange}
                    required
                    error={state?.errors?.businessDescription}
                    multiline
                    minRows={4}
                    InputLabelProps={{
                      shrink: true,
                      disableAnimation: true,
                    }}
                    disabled={!state?.shouldEditBusinessDetails}
                  />

                  {state?.errors?.businessDescription && (
                    <ErrorMessage message="Description is required" />
                  )}
                </div>

                <hr className="mt-5 mb-2" />

                <div className="text-lg text-grey font-semibold">Banner</div>

                <div className="mt-5">
                  <div className="text-sm">
                    Your banner shows up on the consumer platform, so make sure
                    you put a nice enlarged image, usually 1600 * 500
                  </div>

                  <div className="w-full mt-4">
                    {shouldShowBusinessBanner() && (
                      <img
                        className="w-full h-[250px] rounded-md object-cover"
                        src={
                          state.isEditingBusinessBanner
                            ? state?.businessBannerBase64
                            : state?.businessBanner
                        }
                      />
                    )}
                  </div>

                  {state?.shouldEditBusinessDetails && (
                    <div className="mt-4">
                      <Button
                        label="Upload Banner"
                        color="info"
                        onClick={handleBusinessBannerRef}
                        style={{
                          borderRadius: 10,
                          fontSize: 16,
                          color: "#FFFFFF",
                          height: 40,
                        }}
                        disabled={state?.isSavingBusinessDetails}
                        startIcon={<UploadFileIcon />}
                      />
                    </div>
                  )}

                  <input
                    type="file"
                    className="hidden"
                    ref={businessBannerRef}
                    onChange={handleBusinessBanner}
                  />
                </div>

                <hr className="mt-5 mb-2" />

                <div className="text-lg text-grey font-semibold">Logo</div>

                <div className="mt-5">
                  <div className="text-sm">
                    Your logo shows up on the consumer platform, so make sure
                    you put a nice image, usually 200 * 200
                  </div>

                  <div className="mt-4">
                    {shouldShowBusinessLogo() && (
                      <img
                        className="w-52 h-52 rounded-full object-cover"
                        src={
                          state.isEditingBusinessLogo
                            ? state?.businessLogoBase64
                            : state?.businessLogo
                        }
                      />
                    )}
                  </div>

                  {state?.shouldEditBusinessDetails && (
                    <div className="mt-4">
                      <Button
                        label="Upload Logo"
                        color="info"
                        onClick={handleBusinessLogoRef}
                        style={{
                          borderRadius: 10,
                          fontSize: 16,
                          color: "#FFFFFF",
                          height: 40,
                        }}
                        disabled={state?.isSavingBusinessDetails}
                        startIcon={<UploadFileIcon />}
                      />
                    </div>
                  )}

                  <input
                    type="file"
                    className="hidden"
                    ref={businessLogoRef}
                    onChange={handleBusinessLogo}
                  />
                </div>

                {state?.shouldEditBusinessDetails && (
                  <div className="mt-4">
                    <Button
                      label="Save"
                      color="info"
                      onClick={handleSaveBusinessDetails}
                      style={{
                        borderRadius: 10,
                        fontSize: 16,
                        color: "#FFFFFF",
                        height: 40,
                      }}
                      loaderButton
                      loadingPosition="center"
                      loading={state?.isSavingBusinessDetails}
                      disabled={state?.isSavingBusinessDetails}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
