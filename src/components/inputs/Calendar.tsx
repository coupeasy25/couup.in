"use client";

import { DateRange, Range, RangeKeyDict } from "react-date-range";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

interface CalendarProps {
  value: Range;
  onChange: (value: RangeKeyDict) => void;
  disabledDates?: Date[];
  months?: number;
  direction?: "vertical" | "horizontal";
}

const Calendar: React.FC<CalendarProps> = ({ 
  value, 
  onChange, 
  disabledDates,
  months = 1,
  direction = "vertical"
}) => {
  return (
    <DateRange
      rangeColors={["#0f3d30"]}
      ranges={[value]}
      date={new Date()}
      onChange={onChange}
      direction={direction}
      showDateDisplay={false}
      minDate={new Date()}
      disabledDates={disabledDates}
      months={months}
      showMonthAndYearPickers={false}
    />
  );
};

export default Calendar;
