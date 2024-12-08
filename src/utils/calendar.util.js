export const months = [
  { value: 0, name: "January", short: "Jan" },
  { value: 1, name: "February", short: "Feb" },
  { value: 2, name: "March", short: "Mar" },
  { value: 3, name: "April", short: "Apr" },
  { value: 4, name: "May", short: "May" },
  { value: 5, name: "June", short: "Jun" },
  { value: 6, name: "July", short: "Jul" },
  { value: 7, name: "August", short: "Aug" },
  { value: 8, name: "September", short: "Sep" },
  { value: 9, name: "October", short: "Oct" },
  { value: 10, name: "November", short: "Nov" },
  { value: 11, name: "December", short: "Dec" },
];

export const daysOfWeek = [
  { value: 0, name: "Sunday" },
  { value: 1, name: "Monday" },
  { value: 2, name: "Tuesday" },
  { value: 3, name: "Wednesday" },
  { value: 4, name: "Thursday" },
  { value: 5, name: "Friday" },
  { value: 6, name: "Saturday" },
];

export function timeDisplay({ hours, minutes }) {
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
}

export function dateDisplay(date) {
  if (date) {
    return `${date.getDate()}-${
      months.find((month) => month.value === date.getMonth()).short
    }-${date.getFullYear()}`;
  }
  return "";
}
