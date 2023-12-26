export const truncateString = (input, maxAllowedLength) =>
  input?.length > maxAllowedLength
    ? `${input?.substring(0, maxAllowedLength)}...`
    : input;

export const humanize = (value) =>
  value.replace(/^[\s_]+|[\s_]+$/g, "").replace(/[_\s]+/g, " ");
