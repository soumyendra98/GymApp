import axios from "axios";

import { APP_TOKEN } from "utils/constants";

const getHeaders = () => ({
  "x-access-token": localStorage.getItem(APP_TOKEN) || "",
});

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  timeout: 30000,
});

const Exception = (message) => {
  const error = new Error(message);

  error.success = false;

  return error;
};

const processError = (error) => {
  if (error?.response?.data) {
    // client received an error response (5xx, 4xx)

    throw Exception(error.response.data?.message);
  }

  if (error?.request) {
    // client never received a response, or request never left
    throw Exception("It's not you, it's us, want to give it another try?");
  }

  // anything else
  throw Exception("Oops! Something went wrong.");
};

// ---------- GYM ----------

export const listGyms = async (params) => {
  try {
    const response = await API.get("/gyms", {
      params,
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    return processError(error);
  }
};

export const onboardGym = async (payload) => {
  try {
    const response = await API.post("/gyms/onboard", payload, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    return processError(error);
  }
};

export const createGymActivity = async (payload) => {
  try {
    const response = await API.post("/gyms/activity", payload, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    return processError(error);
  }
};

export const getGymProfile = async () => {
  try {
    const response = await API.get("/gyms/profile", {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    return processError(error);
  }
};

export const updateGymProfile = async (payload) => {
  try {
    const response = await API.put("/gyms/profile", payload, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    return processError(error);
  }
};

export const getGymTeam = async () => {
  try {
    const response = await API.get("/gyms/team", {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    return processError(error);
  }
};

export const inviteGymTeam = async (payload) => {
  try {
    const response = await API.post("/gyms/team/invite", payload, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    return processError(error);
  }
};

export const getGymLocations = async () => {
  try {
    const response = await API.get("/gyms/locations", {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    return processError(error);
  }
};

// ---------- USERS ----------

export const getUserInfo = async () => {
  try {
    const response = await API.get("/users/me", {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    return processError(error);
  }
};

export const signin = async (payload) => {
  try {
    const response = await API.post("/users/signin", payload, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    return processError(error);
  }
};

export const signup = async (payload) => {
  try {
    const response = await API.post("/users/signup", payload, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    return processError(error);
  }
};

// DASHBOARD

export const getStats = async (params) => {
  try {
    const response = await API.get("/users/stats", {
      params,
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    return processError(error);
  }
};

export const getActivity = async (params) => {
  try {
    const response = await API.get("/users/activity", {
      params,
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    return processError(error);
  }
};

// MEMBERS
export const listMembers = async (params) => {
  try {
    const response = await API.get("/members", {
      params,
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    return processError(error);
  }
};

export const inviteMembers = async (payload) => {
  try {
    const response = await API.post("/members/invite", payload, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    return processError(error);
  }
};

// INSTRUCTORS

export const listInstructors = async (params) => {
  try {
    const response = await API.get("/instructors", {
      params,
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    return processError(error);
  }
};

export const inviteInstructors = async (payload) => {
  try {
    const response = await API.post("/instructors/invite", payload, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    return processError(error);
  }
};

// PLANS

export const listPlans = async (params) => {
  try {
    const response = await API.get("/plans", { params, headers: getHeaders() });
    return response.data;
  } catch (error) {
    return processError(error);
  }
};

export const getPlan = async (id) => {
  try {
    const response = await API.get(`/plans/${id}`, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    return processError(error);
  }
};

export const createPlan = async (payload) => {
  try {
    const response = await API.post("/plans", payload, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    return processError(error);
  }
};

export const updatePlan = async (payload) => {
  try {
    const response = await API.put("/plans", payload, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    return processError(error);
  }
};

// MEMBERSHIPS

export const listMemberships = async (params) => {
  try {
    const response = await API.get("/memberships", {
      params,
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    return processError(error);
  }
};

export const getMembership = async (id) => {
  try {
    const response = await API.get(`/memberships/${id}`, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    return processError(error);
  }
};

export const enrollMemberships = async (payload) => {
  try {
    const response = await API.post("/memberships/enroll", payload, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    return processError(error);
  }
};

export const getMembershipActivity = async (id) => {
  try {
    const response = await API.get(`/memberships/activity/${id}`, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    return processError(error);
  }
};

export const createMembershipActivity = async (payload) => {
  try {
    const response = await API.post("/memberships/activity", payload, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    return processError(error);
  }
};

export const updateMembershipActivity = async (payload) => {
  try {
    const response = await API.put("/memberships/activity", payload, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    return processError(error);
  }
};
