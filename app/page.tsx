import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/Hero";
import GameGrid from "@/components/GameGrid";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen">
      <Navbar />
      <main className="px-6 py-8 space-y-12">
        <HeroBanner />
        <GameGrid />
      </main>
      <Footer />
    </div>
  );
}