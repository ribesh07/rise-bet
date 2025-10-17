
"use client";
import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqData = {
  General: [
    {
      question: "Why is Rise’s VIP program the best?",
      answer:
        "Rise’s VIP program is often rated as one of the best online casino experiences due to the amount of bonuses we give out to players.\n\nAdditionally, our award winning support team is online 24/7 to answer any questions you have. We have the highest customer satisfaction rate out of many online casinos where we have amassed a community of some of the most passionate gamblers across the globe.",
    },
    {
      question: "How much has Rise given out in bonuses?",
      answer:
        "We have given over $1 Billion in bonuses. This is primarily the reason we have the best VIP program online.\n\nWe truly believe in rewarding our players for their gameplay and loyalty.",
    },
    {
      question: "How do I enter the $75,000 weekly raffle?",
      answer:
        "To get one ticket to enter the raffle, you must wager $1000 on Rise.com. The more you wager, the more tickets you get, which increases your chances of winning.",
    },
    {
      question: "Where can I find the Rise Telegram Channel?",
      answer:
        "The Rise Telegram channel is (@RiseCasino).\n\nClick here to join if you have already downloaded Telegram.",
    },
    {
      question: "Where can I find the Rise VIP Telegram channel?",
      answer:
        "Once you reach Bronze, you can ask live support to be added to the Rise VIP Telegram Channel.\n\nAlternatively, you can find more information about this by joining the Rise Telegram channel (@RiseCasino).",
    },
  ],
  Benefits: [
    {
      question: "What are the benefits of being a rise VIP?",
      answer:
        "VIPs enjoy exclusive reloads, daily bonuses, level-up rewards, personal hosts, and custom-tailored promotions.",
    },
    {
      question: "What is a recent gameplay bonus?",
      answer:
        "This is a bonus given to you by the discretion of your host or VIP manager and is based on significant player wagers and luck.",
    },
    {
      question: "What is rakeback?",
      answer:
        "Rakeback is a percentage of a player's rake (house edge) refunded to you.",
    },
    {
      question: "What is a reload? How do I claim my reload?",
      answer:
        "Reload is a bonus which is calculated on the basis of a player's recent activity. A player is eligible to choose between either a Daily, Hourly or 10 Minute reload intervals.\n\nGo to the user panel on the top right-hand side of the screen and click on VIP. A modal will appear. Click on the reload tab and click on the reload button to claim your reload.\n\nHaving a host is dependable on your gameplay.",
    },
    {
      question: "When is the Monthly bonus scheduled for?",
      answer:
        "The monthly bonus is distributed once a month. The date is generally around the 15th. In some instances it can be a little later or even earlier. This is why it’s one of the most anticipated bonuses on Rise. When it’s released, you will be notified via email. To ensure you do not miss out on a bonus, please check your spam folder in your email.\n\nBronze, Silver & Gold players will receive the bonus in the form of a daily reload, whilst Platinum and Diamond players get their bonus in the form of a one-time bonus claim.",
    },
    {
      question: "How do I calculate the amount I need to wager to move to the next level?",
      answer:
        "Firstly, view the percentage left in your VIP progress bar in your account page on the top right-hand corner. Multiply the percentage number left to the full 100% bar with the wager requirement you need to meet to unlock the new level.\n\nClick here to learn more.",
    },
    {
      question: "What rewards do I get when I level up?",
      answer:
        "Level Up Bonuses: These are fixed bonuses that get larger every time you level up. However we add extra on top in the form of a recent gameplay bonus depending on your profit/loss between levels.\n\nWeekly/Monthly Bonuses: These are calculated with a base amount based on your VIP level. You will then receive extra for every $1,000 you wager in the corresponding time period.\n\nDaily bonuses: Reloads are renewed with your VIP host once they expire.",
    },
    {
      question: "How do you calculate bonuses?",
      answer:
        "Bonuses are calculated as a mix between both your wagered amount and profit. We believe that players should always be rewarded regardless of whether you're winning or losing. It'd be unfair to only reward losing players. However, if you are unlucky, we'll be adding extra on top!",
    },
  ],
  "VIP Hosts": [
    {
      question: "What can my VIP Host do for me?",
      answer:
        "Your VIP Host is there to ensure you are being rewarded for your gaming experiences. They assist with reload renewals, guide you through your level-up progression, review sports limits, assess extra bonuses when available and address any issues faced by a user on the site.",
    },
    {
      question:
        "When I’m assigned a VIP host, does my Reload become a continuous or renewable benefit?",
      answer:
        "When you reach Platinum IV and get assigned a host, you start receiving weekly reloads that are renewable. Once your weekly reload expires, you can contact your host who can renew your reload for the following 7 day period.\n\nYour reload amount is based on your weekly gaming activity, aiming to give extra on top if you’ve had an unlucky week in terms of profit.",
    },
    {
      question:
        "What is the job of a VIP host and how does it differ from regular Live Support assistance?",
      answer:
        "VIP hosts are only given to players in Platinum IV and beyond. They are there to answer your queries about the VIP program and to ensure that you are collecting all of the bonuses you are entitled to. VIP hosts have the ability to send more frequent and larger bonuses to players whilst ensuring the bonuses are befitting to your needs.\n\nLive Support is there to help you with any technical issues you encounter on the platform.",
    },
    {
      question: "When do I get a VIP host?",
      answer:
        "VIP hosts are given to a player when they reach Platinum IV. They will be your dedicated support member who will help you with all of your queries and help guide your gaming experience. Eligibility is also subject to recent activity.",
    },
    {
      question: "What can I do if my VIP host is on vacation?",
      answer:
        "Make sure you ask your VIP host for a link to their unique VIP hosting channel. If you’ve missed out on doing so, you can send a message to live support and you will be given a VIP backup link. This backup host will be temporary until your host comes back.",
    },
  ],
};

const VipFAQ = () => {
  const [activeTab, setActiveTab] = useState<keyof typeof faqData>("General");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [activeTab]);

  return (
    <section className="relative py-20 px-4 bg-[#0a111d] text-white border-t border-gray-800">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#102030_0%,_#050b13_100%)]"></div>

      <div className="relative max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Frequently Asked Questions
        </h2>

        {/* Mobile Tabs - Horizontal Scroll */}
        <div className="flex md:hidden overflow-x-auto space-x-3 mb-6 scrollbar-none">
          {Object.keys(faqData).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab as keyof typeof faqData);
                setOpenIndex(null);
              }}
              className={`px-4 py-2 whitespace-nowrap rounded-md font-semibold transition ${
                activeTab === tab
                  ? "text-blue-400 border-b-2 border-blue-500 bg-[#16263a]"
                  : "text-gray-300 hover:text-blue-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">
          {/* Desktop Sticky Sidebar */}
          <div className="hidden md:flex bg-[#101b2c] rounded-xl p-4 flex-col space-y-2 h-fit md:sticky md:top-28">
            {Object.keys(faqData).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab as keyof typeof faqData);
                  setOpenIndex(null);
                }}
                className={`text-left px-3 py-2 rounded-md font-semibold transition ${
                  activeTab === tab
                    ? "text-blue-400 border-l-4 border-blue-500 bg-[#16263a]"
                    : "text-gray-300 hover:text-blue-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Scrollable FAQ Section */}
          <div className="relative">
            <div
              ref={contentRef}
              className="space-y-3 max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
            >
              {faqData[activeTab].map((item, i) => {
                const isOpen = openIndex === i;
                return (
                  <div
                    key={i}
                    className="bg-[#152235] rounded-lg overflow-hidden hover:bg-[#1a2d46] transition"
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      className="flex justify-between items-center w-full text-left px-5 py-4 font-semibold text-gray-200"
                    >
                      <span>{item.question}</span>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-blue-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-4 text-gray-400 text-sm text-justify whitespace-pre-line">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VipFAQ;
