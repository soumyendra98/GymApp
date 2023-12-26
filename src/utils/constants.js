export const APP_TOKEN = "APP_TOKEN";

export const MESSAGE_SEVERITY = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
};

export const UserRoles = {
  ADMIN: "ADMIN",
  INSTRUCTOR: "INSTRUCTOR",
  MEMBER: "MEMBER",
};

export const ScheduleType = {
  RECURRING: "RECURRING",
  NON_RECURRING: "NON_RECURRING",
};

export const ScheduleTypeList = [
  {
    label: "Recurring",
    value: ScheduleType.RECURRING,
  },
  {
    label: "Non Recurring",
    value: ScheduleType.NON_RECURRING,
  },
];

export const ActivityTypes = {
  CHECK_IN: "CHECK_IN",
  CHECK_OUT: "CHECK_OUT",
  LOG: "LOG",
};

export const EquipmentTypeList = [
  {
    label: "Treadmill",
    value: "TREADMILL",
  },
  {
    label: "Cycle",
    value: "CYCLE",
  },
  {
    label: "Stair Climber",
    value: "STAIR_CLIMBER",
  },
  {
    label: "Cardio Climber",
    value: "CARDIO_CLIMBER",
  },
];
