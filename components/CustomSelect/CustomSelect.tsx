"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import css from "./CustomSelect.module.css";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  hasError?: boolean;
  id?: string;
  name?: string;
}

export default function CustomSelect({
  options,
  value,
  onChange,
  onBlur,
  placeholder = "Оберіть...",
  disabled = false,
  hasError = false,
  id,
  name,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const thumbHeight = 56;
  const [thumbTop, setThumbTop] = useState(0);
  const [showScrollbar, setShowScrollbar] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartY = useRef(0);
  const dragStartScrollTop = useRef(0);

  const selectedOption = options.find((opt) => opt.value === value);

  const updateScrollbar = useCallback(() => {
    const list = listRef.current;
    if (!list) return;

    const { scrollTop, scrollHeight, clientHeight } = list;
    const hasScroll = scrollHeight > clientHeight;
    setShowScrollbar(hasScroll);

    if (hasScroll) {
      const trackHeight = clientHeight - 24; // 12px margin top + bottom
      const scrollRatio = scrollTop / (scrollHeight - clientHeight);
      const maxThumbTop = trackHeight - thumbHeight;
      setThumbTop(scrollRatio * maxThumbTop);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        if (onBlur) onBlur();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onBlur]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(updateScrollbar, 0);
    }
  }, [isOpen, updateScrollbar]);

  const handleScroll = () => {
    updateScrollbar();
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    if (onBlur) onBlur();
  };

  const handleThumbMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartY.current = e.clientY;
    dragStartScrollTop.current = listRef.current?.scrollTop || 0;
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !listRef.current) return;

      const list = listRef.current;
      const { scrollHeight, clientHeight } = list;
      const trackHeight = clientHeight - 24;
      const deltaY = e.clientY - dragStartY.current;
      const scrollRatio = deltaY / (trackHeight - thumbHeight);
      const newScrollTop =
        dragStartScrollTop.current +
        scrollRatio * (scrollHeight - clientHeight);

      list.scrollTop = Math.max(
        0,
        Math.min(scrollHeight - clientHeight, newScrollTop)
      );
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, thumbHeight]);

  const handleTrackClick = (e: React.MouseEvent) => {
    if (!listRef.current || e.target === thumbRef.current) return;

    const list = listRef.current;
    const track = e.currentTarget;
    const rect = track.getBoundingClientRect();
    const clickY = e.clientY - rect.top - 12; // 12px margin top
    const trackHeight = rect.height - 24;
    const scrollRatio = clickY / trackHeight;
    const { scrollHeight, clientHeight } = list;

    list.scrollTop = scrollRatio * (scrollHeight - clientHeight);
  };

  return (
    <div
      ref={containerRef}
      className={`${css["select-container"]} ${isOpen ? css["open"] : ""} ${hasError ? css["error"] : ""} ${disabled ? css["disabled"] : ""}`}
      id={id}
      data-name={name}
    >
      <button
        type="button"
        className={css["select-trigger"]}
        onClick={handleToggle}
        disabled={disabled}
      >
        <span className={value ? css["value"] : css["placeholder"]}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className={css["arrow"]} />
      </button>

      {isOpen && (
        <div className={css["dropdown"]}>
          <div
            ref={listRef}
            className={css["options-list"]}
            onScroll={handleScroll}
          >
            {options.map((option) => (
              <div
                key={option.value}
                className={`${css["option"]} ${option.value === value ? css["selected"] : ""}`}
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </div>
            ))}
          </div>
          {showScrollbar && (
            <div className={css["scrollbar-track"]} onClick={handleTrackClick}>
              <div
                ref={thumbRef}
                className={css["scrollbar-thumb"]}
                style={{
                  top: `${thumbTop + 12}px`,
                }}
                onMouseDown={handleThumbMouseDown}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
