
import { format } from 'date-fns-tz';

export default function dateToString(date: Date, formatter: string = "yy-MM-dd HH:mm"): string {
  return format(date, formatter, { timeZone: 'Asia/Seoul' });
}