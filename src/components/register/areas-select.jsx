"use client";
import { useActionState, useEffect, useState } from "react";
import { Input } from "../ui/input";
import { connectCoachAndAreas, getAreasBySearchTerm } from "@/actions/area";
import { Checkbox } from "../ui/checkbox";
import { CircleX } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";

export default function AreaSelect() {
  const [areas, setAreas] = useState([]);
  const [selectedTitles, setSelectedTitles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newTitles, setNewTitles] = useState([]);
  const [checked, setChecked] = useState(false);

  function handleSearchTermChange(event) {
    setSearchTerm(event.target.value);
  }

  useEffect(() => {
    const fetchAreasBySearchTerm = async () => {
      const searchedAreas = await getAreasBySearchTerm(searchTerm);
      setAreas(searchedAreas);
    };
    const timeout = setTimeout(() => {
      fetchAreasBySearchTerm();
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  useEffect(() => {
    setChecked(false);
  }, [searchTerm]);

  const handleCheckboxChange = (title) => {
    if (!title) return;
    if (selectedTitles.includes(title)) {
      setSelectedTitles(
        selectedTitles.filter((selectedTitle) => selectedTitle !== title)
      );
    } else {
      setSelectedTitles([...selectedTitles, title]);
    }
  };
  const handleNewCheckboxChange = (title) => {
    if (!title) return;
    if (newTitles.includes(title)) {
      setNewTitles(
        newTitles.filter((selectedTitle) => selectedTitle !== title)
      );
    } else {
      setNewTitles([...newTitles, title]);
    }
  };

  const [formState, action] = useActionState(
    connectCoachAndAreas.bind(null, [...selectedTitles, ...newTitles]),
    {
      errors: {},
    }
  );

  return (
    <div className="flex flex-col items-center justify-start space-y-4 container mx-auto">
      <Card className="flex flex-col space-y-3 p-4 mt-10 bg-neutral-100 w-1/2">
        <CardHeader>
          <h1 className="text-xl font-bold mx-auto">
            Choose your areas of work
          </h1>
        </CardHeader>
        <CardContent>
          <Input
            className="border border-neutral-500"
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchTermChange}
          />
          {!!newTitles.length && (
            <>
              <h3 className="mt-5 text-lg font-bold">Selected Areas:</h3>
              <div className="flex flex-row space-x-3">
                {newTitles.map((title, index) => {
                  return (
                    <Badge key={index} className="p-3 rounded-md">
                      {title}
                      <CircleX
                        className="cursor-pointer ml-2 h-4"
                        onClick={() => {
                          setNewTitles(
                            newTitles.filter(
                              (selectedTitle) => selectedTitle !== title
                            )
                          );
                        }}
                      />
                    </Badge>
                  );
                })}
              </div>
            </>
          )}
          <form className="flex flex-col" action={action}>
            {areas.length > 0 ? (
              <div className="flex flex-col space-y-3 my-10 px-3">
                {areas.map((area) => {
                  return (
                    <div key={area.id} className="flex items-center space-x-2">
                      <Checkbox
                        checked={selectedTitles.includes(area.title)}
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
            ) : (
              <div className="flex items-center my-4 space-x-2">
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => {
                    setChecked(!checked);
                    handleNewCheckboxChange(searchTerm);
                  }}
                />
                <label>
                  No areas found. Create an area with title {searchTerm}?
                </label>
              </div>
            )}
            <Button type="submit">Submit</Button>
            {!!formState.errors._form && (
              <ul className="text-red-600">
                {formState.errors._form.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
