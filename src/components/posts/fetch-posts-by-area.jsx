"use client";

import { useEffect, useState } from "react";
import PostList from "./post-list";
import { getAreasBySearchTerm } from "@/actions/area";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";

export default function FetchPostsByArea({}) {
  const [areas, setAreas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAreas, setSelectedAreas] = useState([]);

  useEffect(() => {
    const fetchAreas = async () => {
      const areas = await getAreasBySearchTerm(searchTerm);
      setAreas(areas);
    };
    fetchAreas();
  }, [searchTerm]);

  const areaTitles = selectedAreas.map((area) => area?.title);
  const areaIds = selectedAreas.map((area) => area.id);
  const areaByTitle = (title) => areas.find((area) => area.title === title);

  const handleCheckboxChange = (title) => {
    if (!title) return;
    if (areaTitles.includes(title)) {
      setSelectedAreas(selectedAreas.filter((area) => area.title !== title));
    } else {
      setSelectedAreas([...selectedAreas, areaByTitle(title)]);
    }
  };

  return (
    <div className="container mx-auto py-5 px-10 flex flex-col space-y-5">
      <Input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search Areas"
      />
      <div className="flex flex-col space-y-3 px-3">
        {areas.map((area) => {
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
      <PostList url={`api/posts/search?areaIds=${areaIds.join(",")}`} />
    </div>
  );
}
