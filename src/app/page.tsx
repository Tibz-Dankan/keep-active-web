"use client";

import { Hero } from "@/app/home/Hero";
import Button from "@/app/shared/Button";
import { Link } from "@/lib/router-events";
import { NavBar } from "@/app/home/Navbar";
import { Features } from "@/app/home/Features";
import { WhyAppcrons } from "@/app/home/WhyAppcrons";
import { FAQ } from "./home/Faq";
import { CreatorsWords } from "@/app/home/CreatorWords";

export default function Home() {
  return (
    <div className="w-full flex items-center justify-center">
      <div className="w-full h-auto space-y-16 px-4 sm:px-8 lg:px-8 max-w-[1280px]">
        <Hero>
          <div className="w-full h-full flex flex-col items-center justify-center">
            <NavBar />
            <div
              className="flex items-center justify-center flex-col
            max-w-[768px] gap-5 z-10 mt-[10%]"
            >
              <h1 className="w-full text-5xl font-bold text-center text-color-text-primary">
                Optimize uptime for your free backend instance on
                <Link
                  href="https://render.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="text-[#7048e8] ml-2">Render</span>.
                </Link>
              </h1>
              <p className="text-center text-color-text-secondary text-lg w-4/5">
                Appcrons sends automated requests to prevent annoying cold
                starts and provides the capability to keep within free usage
                limits.
              </p>
              <Link href="/auth/signup" className="">
                <Button
                  label={"Get started"}
                  type={"button"}
                  className="w-32 bg-primary text-white shadow-md"
                />
              </Link>
            </div>
          </div>
        </Hero>
        <WhyAppcrons />
        <Features />
        <CreatorsWords />
        <FAQ />
      </div>
    </div>
  );
}
