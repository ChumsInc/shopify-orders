import dayjs from "dayjs";
import dayjsBusinessTime from 'dayjs-business-time';

dayjs.extend(dayjsBusinessTime);
const businessTimes: dayjs.BusinessHoursMap = {
    sunday: null,
    monday: [{start: '06:00:00', end: '17:00:00'}],
    tuesday: [{start: '06:00:00', end: '17:00:00'}],
    wednesday: [{start: '06:00:00', end: '17:00:00'}],
    thursday: [{start: '06:00:00', end: '17:00:00'}],
    friday: [{start: '06:00:00', end: '11:30:00'}],
    saturday: null,
}
dayjs.setBusinessTime(businessTimes);


export const friendlyDate = (value: Date | string | null): string | null => {
    if (!value || !dayjs(value).isValid()) {
        return null;
    }
    const date = dayjs(value);
    if (date.isSame(new Date(), 'date')) {
        return date.format('h:mm a');
    }
    if (date.isSame(new Date(), 'week')) {
        return date.format('ddd h:mm a');
    }
    return date.format('MM/DD/YYYY');
}

export const businessDayjs = dayjs;
