export const getMonthWithZero = (date: Date) => {
    const month = date.getMonth() + 1;
    if (month < 10) return `0${month}`;
    return month.toString();
};

export const getDateWithZero = (date: Date) => {
    const month = date.getDate();
    if (month < 10) return `0${month}`;
    return month.toString();
};
