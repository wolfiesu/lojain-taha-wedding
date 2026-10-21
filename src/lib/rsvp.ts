export type Attendance = "accept" | "decline";
export const MIN_GUESTS = 1;
export const MAX_GUESTS = 10;

export type RsvpErrors = Partial<Record<"name" | "attendance" | "guests", string>>;

export function validateRsvp(v: { name: string; attendance: Attendance | null; guests: number }): RsvpErrors {
  const errors: RsvpErrors = {};
  if (v.name.trim().length < 2) errors.name = "Please enter your full name.";
  if (!v.attendance) errors.attendance = "Please let us know if you can attend.";
  if (v.attendance === "accept" && (!Number.isInteger(v.guests) || v.guests < MIN_GUESTS || v.guests > MAX_GUESTS))
    errors.guests = `Please choose between ${MIN_GUESTS} and ${MAX_GUESTS} guests.`;
  return errors;
}
