import isToday from 'date-fns/isToday'
import isThisWeek from "date-fns/isThisWeek";

export const friendlyDate = (value: Date | string | null): string | null => {
    if (!value) {
        return null;
    }
    const date = new Date(value);
    if (!date || !date.valueOf()) {
        return null;
    }
    if (isToday(date)) {
        return date.toLocaleTimeString(undefined, {timeStyle: 'short'});
    }
    if (isThisWeek(date)) {
        return date.toLocaleDateString(undefined, {weekday: 'short'}) +
            ' ' + date.toLocaleTimeString(undefined, {timeStyle: 'short'});
    }
    return date.toLocaleDateString(undefined, {dateStyle: 'short'});
}
