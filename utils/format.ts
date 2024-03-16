import { formatDistance } from "date-fns";

export function getTimeFromNow(timeStamp: string): string {
  return formatDistance(new Date(timeStamp), new Date(), { addSuffix: true });
}