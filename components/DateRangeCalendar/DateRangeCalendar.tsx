"use client";

import { useState, useMemo } from "react";
import css from "./DateRangeCalendar.module.css";

interface DateRangeCalendarProps {
    startDate: string;
    endDate: string;
    onDateSelect: (date: Date) => void;
    unavailableDates?: Array<{ startDate: string; endDate: string }>;
    fieldId: string;
}

const UKRAINIAN_MONTHS = [
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

const UKRAINIAN_DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];

function isDateUnavailable(
    date: Date,
    unavailableDates?: Array<{ startDate: string; endDate: string }>
): boolean {
    if (!unavailableDates || unavailableDates.length === 0) return false;

    const dateOnly = new Date(date);
    dateOnly.setHours(0, 0, 0, 0);

    return unavailableDates.some((range) => {
        const rangeStart = new Date(range.startDate);
        rangeStart.setHours(0, 0, 0, 0);
        const rangeEnd = new Date(range.endDate);
        rangeEnd.setHours(0, 0, 0, 0);
        return dateOnly >= rangeStart && dateOnly <= rangeEnd;
    });
}

function isDateInSelectedRange(
    date: Date,
    startDate: string,
    endDate: string
): boolean {
    if (!startDate || !endDate) return false;

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Set time to midnight for accurate comparison
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    return date >= start && date <= end;
}

export default function DateRangeCalendar({
    startDate,
    endDate,
    onDateSelect,
    unavailableDates,
    fieldId,
}: DateRangeCalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const selectedStart = startDate ? new Date(startDate) : null;
    const selectedEnd = endDate ? new Date(endDate) : null;

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();

    // Adjust for Monday as first day (0 = Sunday, so we convert)
    const adjustedFirstDay = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    const days = useMemo(() => {
        const daysArray: (Date | null)[] = [];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < adjustedFirstDay; i++) {
            daysArray.push(null);
        }

        // Add all days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            daysArray.push(new Date(year, month, day));
        }

        return daysArray;
    }, [year, month, adjustedFirstDay, daysInMonth]);

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(year, month + 1, 1));
    };

    const handleDateClick = (date: Date | null) => {
        if (!date) return;
        if (isDateUnavailable(date, unavailableDates)) return;
        onDateSelect(date);
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
        <div className={css.calendar}>
            <div className={css.calendarHeader}>
                <button
                    type="button"
                    onClick={handlePrevMonth}
                    className={css.navButton}
                    aria-label="Попередній місяць"
                >
                    <svg width="24" height="24" aria-hidden="true">
                        <use href="/icons.svg#icon-arrow-back" />
                    </svg>
                </button>
                <h3 className={css.monthYear}>
                    {UKRAINIAN_MONTHS[month]} {year}
                </h3>
                <button
                    type="button"
                    onClick={handleNextMonth}
                    className={css.navButton}
                    aria-label="Наступний місяць"
                >
                    <svg width="24" height="24" aria-hidden="true">
                        <use href="/icons.svg#icon-arrow-forward" />
                    </svg>
                </button>
            </div>

            <div className={css.calendarGrid}>
                {/* Day headers */}
                {UKRAINIAN_DAYS.map((day, index) => (
                    <div key={index} className={css.dayHeader}>
                        {day}
                    </div>
                ))}

                {/* Calendar days */}
                {days.map((date, index) => {
                    if (!date) {
                        return <div key={`empty-${index}`} className={css.dayCell} />;
                    }

                    const dateStr = date.toISOString().split("T")[0];
                    const isUnavailable = isDateUnavailable(date, unavailableDates);
                    const isSelected = isDateInSelectedRange(date, startDate, endDate);
                    const isStart = selectedStart && dateStr === startDate;
                    const isEnd = selectedEnd && dateStr === endDate;
                    const isPast = date < today;

                    return (
                        <button
                            key={dateStr}
                            type="button"
                            onClick={() => handleDateClick(date)}
                            disabled={isUnavailable || isPast}
                            className={`${css.dayCell} ${css.dayButton} ${isUnavailable ? css.unavailable : ""
                                } ${isSelected ? css.selected : ""} ${isStart ? css.startDate : ""} ${isEnd ? css.endDate : ""
                                } ${isPast ? css.past : ""}`}
                            aria-label={`${date.getDate()} ${UKRAINIAN_MONTHS[month]}`}
                        >
                            {date.getDate()}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

