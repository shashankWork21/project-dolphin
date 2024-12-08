"use client";

import { Button } from "../ui/button";

import { Textarea } from "../ui/textarea";

export default function AiTaskGenerateForm({ action }) {
  return (
    <form action={action} className="flex flex-col items-center">
      <Textarea
        name="description"
        className="bg-white mb-5"
        placeholder="Enter here"
        rows={5}
      />
      <Button type="submit" className="w-fit">
        Generate Tasks and Summary
      </Button>
    </form>
  );
}
