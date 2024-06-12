"use client"

import {NextUIProvider} from "@nextui-org/react";
import Navbarprod from "@/components/ui/navbar"

import {FadeText} from "@/components/ui/fade-text";
import {OrbitingCirclesDemo} from "@/components/ui/hero-orbit";


export default function Home() {
  return (
    <NextUIProvider>
    <Navbarprod ></Navbarprod>
    <main className="flex w-full min-h-screen flex-col bg-snow1 items-center justify-between ">
      <div className={"flex justify-around w-full py-auto lp-res:flex-row xs:flex-col"}>
          <div className={"flex flex-col"}>
     <FadeText className={"text-polar4 text-5xl font-bold mt-32"} text={"Find your hobbies"} direction={"up"}  framerProps={{
       show: { transition: { delay: 0.2 } },
     }}></FadeText>
          <FadeText className={"text-polar4 mt-3 w-96"} text={"Find your hobbies asldkf sd sldij lsk sdkj skd sldj falksd ksd sdlkj lsdkj sldkj sj s Find your hobbies asldkf sd sldij lsk sdkj skd sldj falksd ksd sdlkj lsdkj sldkj sj s Find your hobbies asldkf sd sldij lsk sdkj skd sldj falksd ksd sdlkj lsdkj sldkj sj s Find your hobbies asldkf sd sldij lsk sdkj skd sldj falksd ksd sdlkj lsdkj sldkj sj s Find your hobbies asldkf sd sldij lsk sdkj skd sldj falksd ksd sdlkj lsdkj sldkj sj s"} direction={"up"}  framerProps={{
              show: { transition: { delay: 0.2 } },
          }}></FadeText>
      </div>

          <OrbitingCirclesDemo></OrbitingCirclesDemo>
      </div>
        

        <div className={"h-[128rem]"}></div>
    </main>

    </NextUIProvider>
  );
}
