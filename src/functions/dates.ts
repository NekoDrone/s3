/**
 * Converts a time string to a `Date` object with the date set to today and time set to the provided time.
 * @param {string} timeStr - A `string` containing some time in the format `"HH:MM"`
 * @returns A `Date` object where with the date set to today, and the time set to the provided timeStr
 */
export const timeStringToDateToday = (timeStr: string) => {
    if (timeStr.length < 5)
        throw new Error("timeStr must be in the format HH:MM");
    const [hours, minutes] = timeStr.split(":").map(Number);
    const date = new Date();

    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);

    return date;
};

/**
 * Converts a time string to a `Date` object with the date set to the provided date and time set to the provided time.
 * @param {string} timeStr - A `string` containing some time in the format `"HH:MM"`
 * @param date - Any `Date` object
 * @returns A `Date` object where with the date set to the provided, and the time set to the provided timeStr
 */
export const timeStringToDateSpecified = (timeStr: string, date: Date) => {
    if (timeStr.length < 5)
        throw new Error("timeStr must be in the format HH:MM");
    const [hours, minutes] = timeStr.split(":").map(Number);

    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);

    return date;
};
