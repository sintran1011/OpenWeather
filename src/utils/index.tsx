import { IResponseLocation } from "@/models/weather";

export const removeSpaceString = (string: string) => {
  if (string) return string.replace(/\s/g, "");
  else return "";
};

export const removeDuplicateLocations = (arr: IResponseLocation[]) => {
  const removedLocation = arr.filter((x, index) => {
    const sameLocationIndex = arr.findIndex((y) => {
      if (y.state && x.state) {
        return (
          x.state === y.state && x.name === y.name && x.country === y.country
        );
      } else return x.name === y.name && x.country === y.country;
    });

    return index === sameLocationIndex;
  });
  return removedLocation;
};
