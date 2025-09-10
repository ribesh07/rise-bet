import Image from "next/image";
import React from "react";
import Navbar from "./Navbar";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative h-[500px] w-full">
      <Image
        src="/images/hero-bg.jpg"
        alt="Hero background"
        fill
        className="object-cover brightness-75"
        priority
      />
      {/* <Navbar /> */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to RISEBET</h1>
        <p className="text-lg md:text-xl">Experience the thrill of gaming</p>
        <div className="hidden md:flex space-x-5">
          <Link href="/auth/login" passHref>
            <button className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-100 transition">
              Login
            </button>
          </Link>
          <Link href="/auth/signup" passHref>
            <button className="bg-blue-600 px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition">
              Register
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
