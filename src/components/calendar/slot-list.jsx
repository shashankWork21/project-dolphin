"use client";

import SlotCard from "./slot-card";

export default function SlotList({ slots, user }) {
  return (
    <div className="container mx-auto flex flex-col space-y-5">
      {slots.map((slot) => {
        return <SlotCard key={slot.id} slot={slot} user={user} />;
      })}
    </div>
  );
}
