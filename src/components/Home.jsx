import React from "react";
import { Searchbar } from "./HomeSearchBar/Searchbar";
import WithSpeechBubbles from "./Testimonials/Testimonials";

export function Home() {
  return (
    <div>
      <Searchbar />
      <WithSpeechBubbles />
    </div>
  );
}
