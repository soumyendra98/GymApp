import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// layouts
import DefaultLayout from "layouts/default";

// containers

// auth
import GymOnboardingContainer from "containers/auth/onboard";
import SignupContainer from "containers/auth/signup";
import SigninContainer from "containers/auth/signin";

// home
import HomeContainer from "containers/home";

// dashboard
import DashboardOverviewContainer from "containers/dashboard/overview";
import DashboardActivityContainer from "containers/dashboard/activity";

// plans
import PlansOverviewContainer from "containers/plans/overview";
import PlansCreateContainer from "containers/plans/create";

// members
import MembersOverviewContainer from "containers/members/overview";
import MembersInviteContainer from "containers/members/invite";

// instructors
import InstructorsOverviewContainer from "containers/instructors/overview";
import InstructorsInviteContainer from "containers/instructors/invite";

// memberships
import MembershipsOverviewContainer from "containers/memberships/overview";
import MembershipDetailsContainer from "containers/memberships/details";

// settings
import SettingsProfileContainer from "containers/settings/profile";
import SettingsTeamContainer from "containers/settings/team";
import SettingsLocationsContainer from "containers/settings/locations";

// components
import ProtectedRoute from "components/ProtectedRoute";
import PageNotFound from "components/PageNotFound";
import Spinner from "components/Spinner";

// utils
import { APP_TOKEN, UserRoles } from "utils/constants";
import { useMergeState } from "utils/custom-hooks";

// api
import { getUserInfo } from "api";

const RoutesContainer = () => {
  const [state, setState] = useMergeState({
    isLoggedIn: false,
    user: {},
  });

  const isAppLoading = localStorage.getItem(APP_TOKEN) && !state?.isLoggedIn;

  const setUser = (user) => {
    setState({ isLoggedIn: true, user });
  };

  const handleLogout = () => {
    localStorage.removeItem(APP_TOKEN);
    window.location.href = "/signin";
  };

  const init = async () => {
    try {
      if (localStorage.getItem(APP_TOKEN)) {
        const response = await getUserInfo();

        if (response?.success) {
          setUser(response?.data?.user);
        }
      }
    } catch (error) {
      console.error(error);
      localStorage.removeItem(APP_TOKEN);
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <div>
      {isAppLoading ? (
        <div className="w-full h-screen flex justify-center mt-10">
          <Spinner loading={isAppLoading} />
        </div>
      ) : (
        <Routes>
          <Route
            path="onboarding"
            element={<GymOnboardingContainer setUser={setUser} />}
          />

          <Route
            path="signup"
            element={<SignupContainer setUser={setUser} />}
          />

          <Route
            path="signin"
            element={<SigninContainer setUser={setUser} />}
          />

          <Route path="home" element={<HomeContainer user={state?.user} />} />

          <Route
            path="/"
            element={
              <DefaultLayout
                isLoggedIn={state?.isLoggedIn}
                user={state?.user}
                onLogout={handleLogout}
              />
            }
          >
            <Route
              element={
                <ProtectedRoute
                  allowedRoles={[
                    UserRoles.ADMIN,
                    UserRoles.MEMBER,
                    UserRoles.INSTRUCTOR,
                  ]}
                  isLoggedIn={state?.isLoggedIn}
                  role={state?.user?.role}
                />
              }
            >
              <Route path="dashboard">
                <Route
                  path="overview"
                  element={<DashboardOverviewContainer user={state?.user} />}
                />
                <Route
                  path="activity"
                  element={<DashboardActivityContainer user={state?.user} />}
                />
                <Route
                  path="activity"
                  element={<DashboardActivityContainer />}
                />
              </Route>

              <Route path="plans">
                <Route
                  path="overview"
                  element={<PlansOverviewContainer user={state?.user} />}
                />
                <Route
                  path="create"
                  element={<PlansCreateContainer user={state?.user} />}
                />
              </Route>

              <Route path="members">
                <Route
                  path="overview"
                  element={<MembersOverviewContainer user={state?.user} />}
                />
                <Route path="invite" element={<MembersInviteContainer />} />
              </Route>

              <Route path="instructors">
                <Route
                  path="overview"
                  element={<InstructorsOverviewContainer />}
                />
                <Route path="invite" element={<InstructorsInviteContainer />} />
              </Route>

              <Route path="memberships">
                <Route
                  path="overview"
                  element={<MembershipsOverviewContainer />}
                />
                <Route
                  path="details"
                  element={<MembershipDetailsContainer />}
                />
              </Route>

              <Route path="settings">
                <Route path="profile" element={<SettingsProfileContainer />} />
                <Route path="team" element={<SettingsTeamContainer />} />
                <Route
                  path="locations"
                  element={<SettingsLocationsContainer />}
                />
              </Route>
            </Route>

            <Route
              path="/"
              element={
                <Navigate
                  to={state?.isLoggedIn ? "/dashboard/overview" : "/signin"}
                />
              }
            />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      )}
    </div>
  );
};

export default RoutesContainer;
