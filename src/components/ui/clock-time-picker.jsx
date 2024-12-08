"use client";
import { useState } from "react";
import { Button } from "./button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ClockTimePicker({ selectedTime, onTimeChange }) {
  const [mode, setMode] = useState("hours");
  const [ampm, setAmpm] = useState(selectedTime.hours >= 12 ? "PM" : "AM");

  const handleAmPmSwitch = () => {
    const newAmPm = ampm === "AM" ? "PM" : "AM";
    setAmpm(newAmPm);
    const hours = selectedTime.hours + (newAmPm === "PM" ? 12 : -12);
    handleTimeChange(hours, selectedTime.minutes);
  };
  const handleTimeChange = (hours, minutes) => {
    onTimeChange({ hours, minutes });
  };

  const handleClockClick = (event) => {
    const clockRect = event.currentTarget.getBoundingClientRect();
    const clockCenterX = clockRect.left + clockRect.width / 2;
    const clockCenterY = clockRect.top + clockRect.height / 2;
    const clickX = event.clientX;
    const clickY = event.clientY;

    const angle =
      Math.atan2(clickY - clockCenterY, clickX - clockCenterX) *
      (180 / Math.PI);
    const adjustedAngle = (angle + 360 + 90) % 360;

    if (mode === "hours") {
      const hours = Math.round(adjustedAngle / 30) || 12;
      handleTimeChange(
        (hours % 12) + (ampm === "PM" ? 12 : 0),
        selectedTime.minutes
      );
      setMode("minutes");
    } else {
      const minutes = Math.round(adjustedAngle / 6) % 60;
      const roundedMinutes = Math.round(minutes / 5) * 5;
      handleTimeChange(selectedTime.hours, roundedMinutes % 60);
    }
  };

  const renderedClockNumbers = () => {
    const numbers = [];
    const count = 12;
    const step = 1;
    const radius = 120;
    const clockSize = 300;

    for (let i = 1; i <= count; i += step) {
      const angle = ((i / count) * 360 - 90) * (Math.PI / 180); // Start at top
      const x = clockSize / 2 + radius * Math.cos(angle) - 22.5; // Adjust -15 to center
      const y = clockSize / 2 + radius * Math.sin(angle) - 22.5;

      let displayNumber;
      if (mode === "hours") {
        displayNumber = i % 12 || 12;
      } else {
        displayNumber = (i * 5) % 60;
      }

      const isSelected =
        (mode === "hours" && displayNumber === selectedTime.hours % 12) ||
        (mode === "minutes" && displayNumber === selectedTime.minutes);

      numbers.push(
        <div
          key={i}
          className={`absolute flex items-center justify-center text-xl  ${
            isSelected
              ? "bg-neutral-700 text-white hover:bg-neutral-700"
              : "text-neutral-700 hover:bg-neutral-400 hover:text-neutral-100"
          }`}
          style={{
            left: `${x}px`,
            top: `${y}px`,
            width: "45px",
            height: "45px",
            borderRadius: "50%",
            cursor: "pointer",
          }}
          onClick={() => {
            if (mode === "hours") {
              handleTimeChange(displayNumber, selectedTime.minutes);
            } else {
              handleTimeChange(selectedTime.hours, displayNumber);
            }
          }}
        >
          {displayNumber}
        </div>
      );
    }
    return numbers;
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative"
        style={{
          width: "300px",
          height: "300px",
        }}
        onClick={handleClockClick}
      >
        <div className="absolute inset-0 bg-neutral-200  rounded-full shadow-md" />
        {renderedClockNumbers()}
      </div>
      <div className="mt-5 text-xl font-semibold flex flex-row px-8 py-3 space-x-1 items-center">
        <p className="text-2xl">
          {`${
            selectedTime.hours +
            (ampm === "PM"
              ? selectedTime.hours === 12
                ? 0
                : -12
              : selectedTime.hours === 0
              ? 12
              : 0)
          }`.padStart(2, "0")}
          :{selectedTime.minutes.toString().padStart(2, "0")}
        </p>
        <Button
          onClick={handleAmPmSwitch}
          className="h-10 text-xl p-3 font-bold"
        >
          {ampm}
        </Button>
      </div>
      <div className="flex gap-3">
        <ChevronLeft
          onClick={() => setMode("hours")}
          className="cursor-pointer"
        />
        <ChevronRight
          onClick={() => setMode("minutes")}
          className="cursor-pointer"
        />
      </div>
    </div>
  );
}
