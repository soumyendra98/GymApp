import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import SportsOutlinedIcon from "@mui/icons-material/SportsOutlined";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import { useMergeState } from "utils/custom-hooks";
import { UserRoles } from "utils/constants";

const PlansNav = {
  id: "2",
  icon: LocalMallOutlinedIcon,
  title: "Plans",
  path: "/plans",
  childNavs: [
    {
      id: "21",
      title: "Overview",
      path: "/overview",
    },
    {
      id: "22",
      title: "Create",
      path: "/create",
    },
  ],
};

const MembersNav = {
  id: "3",
  icon: PeopleAltOutlinedIcon,
  title: "Members",
  path: "/members",
  childNavs: [
    {
      id: "31",
      title: "Overview",
      path: "/overview",
    },
    {
      id: "32",
      title: "Invite",
      path: "/invite",
    },
  ],
};

const InstructorsNav = {
  id: "4",
  icon: SportsOutlinedIcon,
  title: "Instructors",
  path: "/instructors",
  childNavs: [
    {
      id: "41",
      title: "Overview",
      path: "/overview",
    },
    {
      id: "42",
      title: "Invite",
      path: "/invite",
    },
  ],
};

const MembershipsNav = {
  id: "5",
  icon: SportsOutlinedIcon,
  title: "Memberships",
  path: "/memberships",
  childNavs: [
    {
      id: "51",
      title: "Overview",
      path: "/overview",
    },
  ],
};

const SettingsNav = {
  id: "6",
  icon: SettingsOutlinedIcon,
  title: "Settings",
  path: "/settings",
  childNavs: [
    {
      id: "61",
      title: "Profile",
      path: "/profile",
    },
    {
      id: "62",
      title: "Team",
      path: "/team",
    },
    {
      id: "63",
      title: "Locations",
      path: "/locations",
    },
  ],
};

export const NAVS = [
  {
    id: "1",
    icon: AccountBalanceOutlinedIcon,
    title: "Dashboard",
    path: "/dashboard",
    childNavs: [
      {
        id: "11",
        title: "Overview",
        path: "/overview",
      },
      {
        id: "12",
        title: "Activity",
        path: "/activity",
      },
    ],
  },
];

export default function NavBar({ user, onLogout }) {
  const navigate = useNavigate();

  const { pathname } = useLocation();

  const [state, setState] = useMergeState({
    navs: NAVS,
    selectedNav: NAVS[0],
    selectedChildNav: NAVS[0]?.childNavs?.length ? NAVS[0]?.childNavs[0] : null,
    profileMenuAnchorEl: null,
    navbarMenuAnchorEl: null,
  });

  const handleNavChange = (nav) => {
    setState({ selectedNav: nav, selectedChildNav: nav.childNavs[0] });

    if (nav.childNavs[0]) {
      navigate(`${nav.path}${nav.childNavs[0].path}`);
    } else {
      navigate(`${nav.path}`);
    }
  };

  const handleChildNavChange = (childNav) => {
    setState({ selectedChildNav: childNav });
    navigate(`${state.selectedNav.path}${childNav.path}`);
  };

  const handleOpenProfileMenu = (event) => {
    setState({ profileMenuAnchorEl: event.currentTarget });
  };

  const handleCloseProfileMenu = () => {
    setState({ profileMenuAnchorEl: null });
  };

  const handleLogout = () => {
    handleCloseProfileMenu();
    onLogout();
  };

  useEffect(() => {
    const mainNav = pathname.split("/")[1];
    const nestedNav = pathname.split("/")[2];

    const topNav = NAVS.find((elem) => elem.path === `/${mainNav}`);

    if (topNav?.path) {
      setState({ selectedNav: topNav });

      if (nestedNav) {
        const childNav = topNav?.childNavs?.find(
          (elem) => elem.path === `/${nestedNav}`
        );

        if (childNav?.path) {
          setState({ selectedChildNav: childNav });
        }
      } else {
        setState({ selectedChildNav: topNav?.childNavs[0] });
      }
    }
  }, [pathname]);

  useEffect(() => {
    let newNavs = [...NAVS];

    if (user?.role === UserRoles.ADMIN) {
      newNavs = [...newNavs, PlansNav, MembersNav, InstructorsNav, SettingsNav];
    }

    if (user?.role === UserRoles.MEMBER) {
      newNavs = [...newNavs, MembershipsNav];
    }

    if (user?.role === UserRoles.INSTRUCTOR) {
      newNavs = [
        ...newNavs,
        {
          ...PlansNav,
          title: "Classes",
          childNavs: PlansNav.childNavs.filter(
            (elem) => elem.path !== "/create"
          ),
        },
      ];
    }

    setState({ navs: newNavs });
  }, []);

  return (
    <div className="w-full h-screen">
      <div className="flex">
        <div className="w-16 max-w-[80px] flex flex-col justify-between">
          <div className="flex flex-col items-center">
            <div className="w-full flex flex-col items-center my-6">
              {state.navs.map((nav) => (
                <div
                  key={nav.id}
                  className={`w-full  flex justify-center py-1 ${
                    state.selectedNav?.id === nav.id
                      ? "bg-[#F6F7F8] border-l-2 border-[#F36]"
                      : ""
                  }`}
                >
                  {nav?.icon && (
                    <Tooltip title={nav.title} placement="right">
                      <IconButton onClick={() => handleNavChange(nav)}>
                        <nav.icon
                          sx={{
                            color:
                              state.selectedNav?.id === nav.id ? "#0a2032" : "",
                          }}
                        />
                      </IconButton>
                    </Tooltip>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center mb-4">
            <div>
              <IconButton onClick={handleOpenProfileMenu}>
                <Avatar sx={{ width: 34, height: 34 }}>
                  {String(user?.firstName?.charAt(0)).toUpperCase()}
                  {String(user?.lastName?.charAt(0)).toUpperCase()}
                </Avatar>
              </IconButton>
            </div>

            <Menu
              anchorEl={state.profileMenuAnchorEl}
              open={Boolean(state.profileMenuAnchorEl)}
              onClose={handleCloseProfileMenu}
              transformOrigin={{ horizontal: "left", vertical: "top" }}
              anchorOrigin={{ horizontal: "left", vertical: "top" }}
            >
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </div>
        </div>

        <div className="w-full max-w-[200px] h-screen bg-[#F6F7F8] flex flex-col justify-between items-center">
          <div className="py-8 w-10/12">
            <div className="flex text-2xl font-semibold">
              {state.selectedNav?.title}
            </div>

            <div className="mt-8 flex flex-col">
              {state.selectedNav?.childNavs.map((childNav) => (
                <div
                  key={childNav.id}
                  className={`w-full h-full flex mb-4 text-gray-500 text-sm ${
                    state.selectedChildNav?.id === childNav.id
                      ? "text-gray-900 font-medium"
                      : ""
                  }`}
                >
                  <div
                    className="cursor-pointer"
                    onClick={() => handleChildNavChange(childNav)}
                  >
                    {childNav.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
