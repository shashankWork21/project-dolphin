"use client";

import { useActionState, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { createPost } from "@/actions/post";
import { Checkbox } from "../ui/checkbox";

export default function PostCreateForm() {
  const { user } = useAuth();
  const [selectedAreas, setSelectedAreas] = useState([]);

  const areaTitles = selectedAreas.map((area) => area?.title);
  const areaByTitle = (title) =>
    user.areas.find((area) => area.title === title);

  const handleCheckboxChange = (title) => {
    if (!title) return;
    if (areaTitles.includes(title)) {
      setSelectedAreas(selectedAreas.filter((area) => area.title !== title));
    } else {
      setSelectedAreas([...selectedAreas, areaByTitle(title)]);
    }
  };

  const [formState, action] = useActionState(
    createPost.bind(
      null,
      selectedAreas.map((area) => area?.id)
    ),
    {
      errors: { title: null, content: null },
      success: false,
    }
  );

  return (
    <Card className="flex flex-col space-y-2 p-4 mt-10 bg-neutral-100 w-2/3 mx-auto">
      <CardHeader>
        <h1 className="text-xl font-bold mx-auto">Create Post</h1>
      </CardHeader>

      <CardContent className="flex flex-col space-y-4">
        {!!user.areas.length > 0 && (
          <>
            <p className="text-lg font-bold">Areas</p>
            <div className="flex flex-col space-y-3  px-3">
              {user.areas.map((area) => {
                return (
                  <div key={area.id} className="flex items-center space-x-2">
                    <Checkbox
                      checked={areaTitles.includes(area.title)}
                      value={area.title}
                      onCheckedChange={() => {
                        handleCheckboxChange(area.title);
                      }}
                    />
                    <label>{area.title}</label>
                  </div>
                );
              })}
            </div>
          </>
        )}
        <form action={action} className="flex flex-col items-center space-y-5">
          <Input
            type="text"
            name="title"
            placeholder="Title"
            className="border border-neutral-400"
          />
          {!!formState.errors.title && (
            <ul className="text-red-600">
              {formState.errors.title.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          )}
          <Textarea
            name="content"
            label="Content"
            placeholder="Content"
            className="border border-neutral-400"
            rows={5}
          />
          {!!formState.errors.content && (
            <ul className="text-red-600">
              {formState.errors.content.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          )}
          <Button type="submit" className="w-full mt-5">
            Create Post
          </Button>
        </form>
        {!!formState.errors._form && (
          <ul className="text-red-600">
            {formState.errors._form.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
