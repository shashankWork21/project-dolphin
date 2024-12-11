"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardHeader, CardContent } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { getAreasBySearchTerm } from "@/actions/area";
import { getCoachesByArea } from "@/db/queries/coach";
import { Badge } from "../ui/badge";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

export default function SearchCoach() {
  const [areas, setAreas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [coaches, setCoaches] = useState([]);
  useEffect(() => {
    const fetchAreas = async () => {
      const areas = await getAreasBySearchTerm(searchTerm);
      setAreas(areas);
    };
    fetchAreas();
  }, [searchTerm]);

  const areaTitles = selectedAreas.map((area) => area?.title);
  const areaIds = useMemo(
    () => selectedAreas.map((area) => area.id),
    [selectedAreas]
  );

  const areaByTitle = (title) => areas.find((area) => area.title === title);

  const handleCheckboxChange = (title) => {
    if (!title) return;
    if (areaTitles.includes(title)) {
      setSelectedAreas(selectedAreas.filter((area) => area.title !== title));
    } else {
      setSelectedAreas([...selectedAreas, areaByTitle(title)]);
    }
  };

  useEffect(() => {
    const fetchCoaches = async () => {
      const coaches = await getCoachesByArea(areaIds);
      console.log(coaches);
      setCoaches(coaches);
    };
    fetchCoaches();
  }, [areaIds]);

  return (
    <div className="container mx-auto py-5 px-10 flex flex-col">
      <Input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search Areas"
      />
      <div className="flex flex-col space-y-3 mt-5 px-3">
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
      {coaches.length > 0 && (
        <>
          <h3 className="text-2xl mt-10 font-bold w-full text-center">
            Professionals
          </h3>
          <div className="flex space-x-5 flex-wrap w-full mt-10">
            {coaches.map((coach) => {
              return (
                <Card key={coach.id} className="w-1/3 bg-neutral-200">
                  <CardHeader className="flex flex-row justify-between">
                    <div className="flex gap-3">
                      <h2 className="font-bold text-2xl">
                        {coach.firstName} {coach.lastName}
                      </h2>
                      <Badge className="bg-lime-200 text-black">
                        Professional
                      </Badge>
                    </div>
                    <Link href={`/calendar/${coach.id}`}>
                      <ExternalLink className="cursor-pointer" />
                    </Link>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg mt-2">Areas of work:</p>
                    <ul className="flex flex-col mt-2 justify-start space-y-3 list-disc list-inside">
                      {coach.areas.map((area) => {
                        return <li key={area.id}>{area.title}</li>;
                      })}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}
      {coaches.length === 0 && (
        <div className="text-center mt-20 py-10 px-20 bg-neutral-100 text-neutral-400 w-1/2 mx-auto text-2xl font-bold">
          No coaches found in the selected areas
        </div>
      )}
    </div>
  );
}
