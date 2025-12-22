"use client";

import { useState } from "react";
import css from "./DateRangeCalendar.module.css";

interface DateRangeCalendarProps {
  startDate: Date | null;
  endDate: Date | null;
  onRangeChange: (start: Date | null, end: Date | null) => void;
}

export default function DateRangeCalendar({
  startDate,
  endDate,
  onRangeChange,
}: DateRangeCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add days from previous month
    const prevMonthLastDay = new Date(year, month, 0);
    const prevMonthDays = prevMonthLastDay.getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthDays - i),
        isCurrentMonth: false,
        isPrevMonth: true,
      });
    }

    // Add days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        date: new Date(year, month, day),
        isCurrentMonth: true,
        isPrevMonth: false,
      });
    }

    // Add days from next month to fill the grid (6 weeks)
    const totalCells = 42; // 6 weeks * 7 days
    const remainingCells = totalCells - days.length;
    for (let day = 1; day <= remainingCells; day++) {
      days.push({
        date: new Date(year, month + 1, day),
        isCurrentMonth: false,
        isPrevMonth: false,
      });
    }

    return days;
  };

  const isDateInRange = (date: Date) => {
    if (!startDate || !endDate) return false;
    return date >= startDate && date <= endDate;
  };

  const isDateSelected = (date: Date) => {
    if (startDate && date.toDateString() === startDate.toDateString())
      return true;
    if (endDate && date.toDateString() === endDate.toDateString()) return true;
    return false;
  };

  const handleDateClick = (date: Date) => {
    // If clicking on start date, deselect it
    if (
      startDate &&
      date.toDateString() === startDate.toDateString() &&
      !endDate
    ) {
      onRangeChange(null, null);
      return;
    }
    // If clicking on end date when range is complete, deselect it
    if (
      endDate &&
      date.toDateString() === endDate.toDateString() &&
      startDate
    ) {
      onRangeChange(startDate, null);
      return;
    }
    // If clicking on start date when range is complete, deselect start
    if (
      startDate &&
      date.toDateString() === startDate.toDateString() &&
      endDate
    ) {
      onRangeChange(null, endDate);
      return;
    }

    if (!startDate || (startDate && endDate)) {
      // Start new selection
      onRangeChange(date, null);
    } else {
      // Complete the range
      if (date < startDate) {
        onRangeChange(date, startDate);
      } else {
        onRangeChange(startDate, date);
      }
    }
  };

  const [animating, setAnimating] = useState(false);

  const nextMonth = () => {
    setAnimating(true);
    setTimeout(() => {
      setCurrentMonth(
        new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
      );
      setAnimating(false);
    }, 150);
  };

  const prevMonth = () => {
    setAnimating(true);
    setTimeout(() => {
      setCurrentMonth(
        new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
      );
      setAnimating(false);
    }, 150);
  };

  const days = getDaysInMonth(currentMonth);
  const monthNames = [
    "Січень",
    "Лютий",
    "Березень",
    "Квітень",
    "Травень",
    "Червень",
    "Липень",
    "Серпень",
    "Вересень",
    "Жовтень",
    "Листопад",
    "Грудень",
  ];

  return (
    <div className={css.calendar}>
      <div className={css.header}>
        <div className={css.year}>{currentMonth.getFullYear()}</div>
        <div className={css.monthControls}>
          <button type="button" onClick={prevMonth} className={css.navBtn}>
            ‹
          </button>
          <span className={css.month}>
            {monthNames[currentMonth.getMonth()]}
          </span>
          <button type="button" onClick={nextMonth} className={css.navBtn}>
            ›
          </button>
        </div>
      </div>
      <div className={css.weekdays}>
        <div>Пн</div>
        <div>Вт</div>
        <div>Ср</div>
        <div>Чт</div>
        <div>Пт</div>
        <div>Сб</div>
        <div>Нд</div>
      </div>
      <div className={css.days}>
        {days.map((dayObj, index) => {
          const date = dayObj.date;
          const isCurrentMonth = dayObj.isCurrentMonth;

          return (
            <div
              key={index}
              className={`${css.day} ${
                !isCurrentMonth
                  ? css.otherMonth
                  : date < today
                    ? css.disabled
                    : isDateSelected(date)
                      ? css.selected
                      : isDateInRange(date)
                        ? css.inRange
                        : css.available
              }`}
              onClick={
                isCurrentMonth && date >= today
                  ? () => handleDateClick(date)
                  : undefined
              }
            >
              {date.getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );
}
