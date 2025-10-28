
'use client';
import React, { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import {
  Info,
  Shield,
  AlertTriangle,
  Target,
  Coins,
  Scale,
  BookOpen,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Sidebar } from '@/components/sidebar';
import  TopNavbar  from '@/components/topnavbar';
import MobileBottomBar from '@/components/mobilebuttombar';
import Footer from '@/components/footer';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { LoginForm } from '@/components/auths/loginform';
import { SignupForm } from '@/components/auths/signupform';

// ✅ Auth Modal Component
type AuthModalProps = {
  open: boolean;
  onClose: () => void;
  initialType: 'login' | 'register';
  isMobile: boolean;
};
const AuthModal: React.FC<AuthModalProps> = ({ open, onClose, initialType, isMobile }) => {
  const [modalMode, setModalMode] = useState<'login' | 'register'>(initialType);
  

  useEffect(() => {
    if (open) setModalMode(initialType);
  }, [open, initialType]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 flex items-center justify-center p-4 z-50"
            initial={{ scale: isMobile ? 1 : 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: isMobile ? 1 : 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div
              className={`relative z-50 w-full ${
                isMobile ? 'h-full rounded-none' : 'max-w-md max-h-screen rounded-xl'
              } overflow-auto bg-[#0f172a] p-6`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <div className="relative w-32 h-15">
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    fill
                    style={{ objectFit: 'contain' }}
                    priority
                  />
                </div>
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-white text-2xl leading-none"
                >
                  &times;
                </button>
              </div>

              {modalMode === 'login' ? (
                <LoginForm onSuccess={onClose} onSwitch={() => setModalMode('register')} />
              ) : (
                <SignupForm onSuccess={onClose} onSwitch={() => setModalMode('login')} />
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ✅ Responsible Gambling Page
const ResponsibleGamblingPage = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authType, setAuthType] = useState<'login' | 'register'>('login');
  const [active, setActive] = useState('Risebet Smart');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");
  const mainRef = useRef<HTMLDivElement | null>(null);
  const sidebarWidth = 64;
  const collapsedWidth = 20;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSidebarToggle = () => {
    if (isMobile) setSidebarOpen((prev) => !prev);
    else setSidebarCollapsed((prev) => !prev);
  };

  const handleSidebarClose = () => isMobile && setSidebarOpen(false);

  const handleAuthClick = (type: 'login' | 'register') => {
    setAuthType(type);
    setAuthOpen(true);
  };

  const tips = [
    { icon: <Info className="text-blue-400 w-6 h-6" />, text: 'Effective management of your gambling activities can be done by prioritizing other recreational activities too' },
    { icon: <Target className="text-blue-400 w-6 h-6" />, text: 'Before a gambling session, have a plan in mind of how much you want to spend gambling, and how long you will be gambling for' },
    { icon: <AlertTriangle className="text-blue-400 w-6 h-6" />, text: 'Do not spend more than what you can afford to lose' },
    { icon: <Scale className="text-blue-400 w-6 h-6" />, text: 'Understanding the odds and knowing the risks associated with gambling' },
    { icon: <Shield className="text-blue-400 w-6 h-6" />, text: 'Identify when you are no longer having fun or where gambling has become a problem for you, and stop' },
    { icon: <Coins className="text-blue-400 w-6 h-6" />, text: 'Set loss limits, wager limits to assist with managing your gambling activities' },
  ];

  const sidebarItems = ['Risebet Smart', 'Recognise the Signs', "Responsible Gambling FAQ's"];

  return (
    <div className="flex min-h-screen bg-[#0f172a] text-white overflow-x-hidden">
     {/* Sidebar */}
             {!isMobile && (
               <motion.div
                 animate={{ width: sidebarCollapsed ? collapsedWidth * 4 : sidebarWidth * 4 }}
                 transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                 className="h-screen bg-[#0f172a] shadow-lg overflow-hidden fixed left-0 top-0 z-50"
               >
                 <Sidebar
                   collapsed={sidebarCollapsed}
                   setCollapsed={setSidebarCollapsed}
                   open={true}
                   setOpen={() => {}}
                 />
               </motion.div>
             )}

      {/* Top Navbar */}
     
         <motion.div
          className="fixed top-0 left-0 right-0 z-40"
          animate={{
            marginLeft: !isMobile
              ? sidebarCollapsed
                ? collapsedWidth * 4
                : sidebarWidth * 4
              : 0,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <TopNavbar searchValue={search} onSearchChange={setSearch} />
        </motion.div>

      {/* ===== Main Content Area ===== */}
      <motion.main
       ref={mainRef}
        className="flex-1 flex flex-col pt-[100px] pb-16 px-3 md:px-8 bg-[#0f172a]"
        animate={{
          marginLeft: !isMobile
            ? sidebarCollapsed
              ? collapsedWidth * 4
              : sidebarWidth * 4
            : 0,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="flex flex-col  md:flex-row gap-6 py-10 min-h-screen">
          {/* ===== Sticky Sidebar ===== */}
          <aside className="hidden md:block w-[220px] ml-4">
            <div className="sticky top-20 bg-[#0f172a]/95 rounded-md p-2 shadow-md">
              {sidebarItems.map((item) => (
                <div
                  key={item}
                  onClick={() => setActive(item)}
                  className={clsx(
                    'cursor-pointer px-3 py-2 rounded-sm text-sm font-semibold transition-all',
                    active === item
                      ? 'bg-[#122334] text-white border-l-2 border-[#2b8eff]'
                      : 'text-gray-300 hover:bg-[#122334] hover:text-white'
                  )}
                >
                  {item}
                </div>
              ))}
            </div>
          </aside>

          {/* ===== Mobile Dropdown ===== */}
          <div className="relative md:hidden px-2">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full flex justify-between items-center bg-[#0f1a24b0] px-4 py-3 rounded-md text-sm font-semibold border border-[#1c2a38]"
            >
              {active}
              {dropdownOpen ? (
                <ChevronUp className="w-5 h-5 text-gray-300" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-300" />
              )}
            </button>

            {dropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-full bg-[#0f1a24] rounded-md shadow-lg z-10 border border-[#1c2a38] overflow-hidden">
                {sidebarItems.map((item) => (
                  <div
                    key={item}
                    onClick={() => {
                      setActive(item);
                      setDropdownOpen(false);
                    }}
                    className={clsx(
                      'px-4 py-2 cursor-pointer text-sm transition-all',
                      active === item
                        ? 'bg-[#122334] text-white'
                        : 'text-gray-300 hover:bg-[#16293d] hover:text-white'
                    )}
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ===== Page Content ===== */}
         
            
            
                                {/* ============ Risebet SMART ============ */}
                                {active === "Risebet Smart" && (
                                  <div className="max-w-4xl mx-auto">
                                    <img
                                         src="/images/responsible1.png"
                                         alt="Risebet Smart"
                                         className="w-full h-auto rounded-lg"
                                         />
                                            <div className="flex items-center justify-between mt-2 mb-6">
                                              <div>
                                                <h1 className="text-xl font-semibold mb-2">Mission Statement</h1>
                                                <p className="text-gray-300 max-w-3xl text-sm leading-relaxed">
                                                  Risebet is dedicated to fostering responsible gambling practices to
                                                  all customers on our platform and within our community. We are
                                                  committed to ensuring that our customers are educated on our
                                                  various responsible gambling tools available for use, promote
                                                  gambling as a form of entertainment, and empower individuals to
                                                  make informed decisions about their gambling activities.
                                                </p>
                                              </div>
                                              
                                            </div>
                                    
                                            {/* 6 Tips Section */}
                                            <section>
                                               <h3 className="text-lg font-semibold text-gray-100 mb-4">
                                                 6 Tips For Effective Management Of Your Gambling Activities
                                               </h3>
                                               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                 {tips.map((tip, i) => (
                                                  <div
                                                    key={i}
                                                    className="flex items-start gap-3 bg-[#0f1b25] rounded-xl p-4 hover:bg-[#16293d] transition"
                                                  >
                                                    {tip.icon}
                                                    <p className="text-sm text-gray-300 leading-relaxed">{tip.text}</p>
                                                  </div>
                                                ))}
                                              </div>
                                            </section>
                                    
                                            {/* Info Sections */}
                                            <div className="mt-8 space-y-6 text-sm text-gray-300">
                                              <section>
                                                <h3 className="text-white font-semibold mb-1">
                                                  House Advantage/House Edge
                                                </h3>
                                                <p>
                                                  Games have a house edge to ensure a percentage of the total amount
                                                  wagered is returned to the House, which in this case is Risebet.
                                                </p>
                                              </section>
                                    
                                              <section>
                                                <h3 className="text-white font-semibold mb-1">Randomness</h3>
                                                <p>
                                                  All gambling has an element of randomness — there is no way to
                                                  control the outcome of any casino game or sporting event.
                                                </p>
                                              </section>
                                    
                                              <section>
                                                <h3 className="text-white font-semibold mb-1">
                                                  Independent Outcomes
                                                </h3>
                                                <p>
                                                  Games/Spins are not related. Their outcomes are not dependent on
                                                  how much, or how long, you’ve previously played the game for.
                                                </p>
                                              </section>
                                    
                                              <section>
                                                <h3 className="text-white font-semibold mb-1">
                                                  Odds and Probability
                                                </h3>
                                                <p>
                                                  Odds and probability are ways to describe your chances of winning.
                                                  Whilst the odds can appear to be low, there are no certainties in
                                                  betting.
                                                </p>
                                              </section>
                                    
                                              <section>
                                                <h3 className="text-white font-semibold mb-1">
                                                  Introducing Our Responsible Gambling Tools
                                                </h3>
                                                <p>
                                                  Gambling should always be a form of entertainment. In order to
                                                  assist you in keeping your gambling activities fun, Risebet has a
                                                  range of responsible gambling tools which you are able to make use
                                                  of at any point in time.
                                                </p>
                                                <p className="text-[#2b8eff] mt-2 font-semibold">
                                                  Play for fun, not for funds.
                                                </p>
                                              </section>
                                            </div>
                                            {/* Gambling Limits */}
                                            <section className="bg-[#0d1721] rounded-2xl mt-1 p-6 space-y-6">
                                              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                                                <BookOpen className="text-blue-400" /> Gambling Limits
                                              </h3>
                                    
                                              <div className="space-y-4 text-sm text-gray-300 leading-relaxed">
                                                <h4 className="text-gray-100 font-semibold">Loss Limits</h4>
                                                <p>
                                                  A loss limit allows you to set a limit on how much you can afford to lose over your
                                                  set period of time. The limit can be set over a period of one day, one week or one
                                                  month. It is a net loss limit. Profits made during your set period will not count
                                                  towards your limit amount. If you are profitable during the set period, you are able
                                                  to use your profits to continue to wager and bet until you reach your loss limit.
                                                  Unsettled bets count towards the limit.
                                                </p>
                                    
                                                <h4 className="text-gray-100 font-semibold pt-2">Wager Limits</h4>
                                                <p>
                                                  A wager limit allows you to set a limit on how much you can wager over your set period
                                                  of time. The maximum bet limit can be set over a period of one day, one week or one
                                                  month. The limit is not a net limit, so profits are excluded.
                                                </p>
                                                <p>
                                                  Decreasing a limit is effective immediately. Increasing a limit applies after a
                                                  24-hour cool-off period.
                                                </p>
                                    
                                                <h4 className="text-gray-100 font-semibold pt-2">Deposit Limits</h4>
                                                <p>
                                                  Deposit limits allow you to cap the amount of money you can deposit daily. Once you
                                                  reach your set limit, you won’t be able to deposit more funds until the daily limit
                                                  resets. Risebet currently supports daily deposit limits only.
                                                </p>
                                                <ul className="list-disc pl-5 space-y-1">
                                                  <li>Withholding balance holds excess deposits temporarily.</li>
                                                  <li>Daily resets release funds back into your balance.</li>
                                                  <li>
                                                    To set or change deposit limits, visit <strong>Responsible Gambling &gt; Deposit
                                                    Limits</strong>.
                                                  </li>
                                                </ul>
                                                <p className="text-gray-400 italic">
                                                  Note: Setting or decreasing your limit is immediate. Increasing/removing it has a
                                                  24-hour cooling-off period.
                                                </p>
                                              </div>
                                    
                                              {/* Self Exclusion & Break */}
                                              <div className="space-y-4 text-sm text-gray-300 leading-relaxed">
                                                <h4 className="text-gray-100 font-semibold">Self-Exclusion</h4>
                                                <p>
                                                  A self-exclusion tool offers the ability to suspend all access to your account should
                                                  you feel you are at risk of developing a gambling problem. The available periods are:
                                                  6 months, 1 year, 2 years, 3 years, 4 years, 5 years, 10 years, or indefinite.
                                                </p>
                                                <p>
                                                  For indefinite exclusions, your account remains blocked for at least 6 months before
                                                  review. Contact support via email to initiate reactivation.
                                                </p>
                                    
                                                <h4 className="text-gray-100 font-semibold pt-2">Break in Play</h4>
                                                <p>
                                                  Risebet also provides temporary account suspension for self-managed breaks. Options
                                                  include: 1 day, 1 week, 1 month, 2 months, or 3 months.
                                                </p>
                                                <p>
                                                  To apply, go to Risebet Smart Self-Exclusion, click “Request Self-Exclusion”, select the
                                                  period, and confirm. Your account will auto-reactivate after the selected time.
                                                </p>
                                              </div>
                                    
                                              {/* Account Closure */}
                                              <div className="space-y-4 text-sm text-gray-300 leading-relaxed">
                                                <h4 className="text-gray-100 font-semibold">Closing My Risebet Account</h4>
                                                <p>
                                                  You may request account closure for personal reasons. Contact support via chat or
                                                  email at <span className="text-blue-400">support@Risebet.com</span>.
                                                </p>
                                                <p>
                                                  Once closed, you cannot access your account, receive bonuses, or promotional material.
                                                  Reactivation requires a written request after a 24-hour cool-off period.
                                                </p>
                                              </div>
                                    
                                              {/* Help Organizations */}
                                              <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
                                                <h4 className="text-gray-100 font-semibold">Help Organizations</h4>
                                                <ul className="space-y-2">
                                                  <li>
                                                    <strong>Gamblers Anonymous:</strong>{" "}
                                                    <a href="https://gamblersanonymous.org/ga/" className="text-blue-400 underline">
                                                      gamblersanonymous.org/ga/
                                                    </a>
                                                  </li>
                                                  <li>
                                                    <strong>Gambling Therapy:</strong>{" "}
                                                    <a href="https://www.gamblingtherapy.org/" className="text-blue-400 underline">
                                                      gamblingtherapy.org
                                                    </a>{" "}
                                                    | Email: support@gamblingtherapy.org
                                                  </li>
                                                   <li>
                                                     <strong>National Council on Problem Gambling:</strong>{" "}
                                                     <a
                                                      href="https://www.ncpgambling.org/help-treatment/chat/"
                                                      className="text-blue-400 underline"
                                                    >
                                                      Chat Here
                                                    </a>{" "}
                                                    | Tel: +1-800-426-2537
                                                  </li>
                                                  <li>
                                                    <strong>Gamtalk:</strong>{" "}
                                                    <a href="https://www.gamtalk.org/treatment-support/" className="text-blue-400 underline">
                                                      gamtalk.org
                                                    </a>
                                                  </li>
                                                </ul>
                                              </div>
                                    
                                              {/* Minors */}
                                              <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
                                                <h4 className="text-gray-100 font-semibold">Minors</h4>
                                                <p>
                                                  Risebet.com does not support underage gambling (under 18). No winnings will be paid to
                                                  underage users.
                                                </p>
                                                <h5 className="font-semibold text-gray-200">Tips for Parents</h5>
                                                <ul className="list-disc pl-5 space-y-1">
                                                  <li>Do not leave casino software unattended.</li>
                                                  <li>Password-protect your account.</li>
                                                  <li>Do not allow minors to gamble or access casino data.</li>
                                                  <li>Keep account numbers and cards out of reach.</li>
                                                  <li>Limit children’s online time and use blocking software.</li>
                                                </ul>
                                              </div>
                                    
                                              {/* Gambling Blocks */}
                                              <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
                                                <h4 className="text-gray-100 font-semibold">Gambling Blocks</h4>
                                                <ul className="list-disc pl-5 space-y-1">
                                                  <li>
                                                    <strong>BetBlocker:</strong>{" "}
                                                    <a href="https://www.betblocker.org/" className="text-blue-400 underline">
                                                      betblocker.org
                                                    </a>
                                                  </li>
                                                  <li>
                                                    <strong>NetNanny:</strong>{" "}
                                                    <a href="https://www.netnanny.com/" className="text-blue-400 underline">
                                                      netnanny.com
                                                    </a>
                                                  </li>
                                                  <li>
                                                    <strong>Gamblock:</strong>{" "}
                                                    <a href="http://www.gamblock.com/" className="text-blue-400 underline">
                                                      gamblock.com
                                                    </a>
                                                  </li>
                                                </ul>
                                                <p className="text-gray-400 italic">
                                                  *Risebet does not accept any liability in respect of any third-party software.
                                                </p>
                                              </div>
                                            </section>
                                  </div>
                                )}
                        
                                {/* ============ RECOGNISE THE SIGNS ============ */}
                                {active === "Recognise the Signs" && (
                                    
                                  <div className="max-w-4xl mx-auto space-y-8">
                                    <div className="bg-[#0d1721] rounded-t-2xl p-6 text-center">
                                      
                                      <img
              src="/images/responsible2.png"
              alt="Risebet Smart"
              className="w-full h-auto rounded-lg"
            />
                                      <h2 className="text-white text-xl font-bold">
                                        Recognise The Signs of Gambling Dependency
                                      </h2>
                                      <p className="text-gray-300 mt-2 text-sm leading-relaxed">
                                        Often we find it easier identifying problem gambling in others,
                                        but harder to recognise when this affects us as individuals.
                                        Although problem gambling often results in financial problems,
                                        the impact usually stretches much further than this.
                                      </p>
                                    </div>
                        
                                    {/* Mental Health */}
                                    <section className="bg-[#0f1b25] rounded-xl p-6 space-y-4">
                                      <h3 className="text-lg font-semibold text-white">
                                        Is Gambling Affecting My Mental Health?
                                      </h3>
                                      <p className="text-gray-300 text-sm">
                                        Problem gambling can have a serious impact on your mental
                                        health. Do any of these statements sound familiar to you?
                                      </p>
                                      <ul className="list-disc pl-6 text-gray-300 text-sm space-y-1">
                                        <li>I have extreme emotions or mood swings</li>
                                        <li>I feel gambling is the only thing I enjoy</li>
                                        <li>I have difficulty sleeping</li>
                                        <li>I often feel depressed or anxious</li>
                                        <li>I have suicidal thoughts</li>
                                        <li>I use gambling to avoid difficulties</li>
                                      </ul>
                                    </section>
                        
                                    {/* Relationships */}
                                    <section className="bg-[#0f1b25] rounded-xl p-6 space-y-4">
                                      <h3 className="text-lg font-semibold text-white">
                                        Is Gambling Affecting My Relationships?
                                      </h3>
                                      <p className="text-gray-300 text-sm">
                                        Gambling addiction can have a serious impact on relationships.
                                        Consider the following:
                                      </p>
                                      <ul className="list-disc pl-6 text-gray-300 text-sm space-y-1">
                                        <li>I’m arguing more with my partner or family</li>
                                        <li>
                                          I’m preoccupied with gambling and find it hard to focus on
                                          other things
                                        </li>
                                        <li>I’m spending less time with my friends</li>
                                        <li>
                                          I’m not able to tell people the truth about how much I’ve lost
                                        </li>
                                        <li>I’m stealing money from friends or family to gamble</li>
                                      </ul>
                                      <p className="text-gray-400 italic text-sm">
                                        The impact of gambling on relationships is profound, affecting
                                        not only the individuals directly involved but also loved ones.
                                        Recognizing the signs and seeking help early is crucial.
                                        Counseling, therapy, and support groups can help rebuild trust
                                        and communication.
                                      </p>
                                    </section>
                        
                                    {/* Finances */}
                                    <section className="bg-[#0f1b25] rounded-xl p-6 space-y-4">
                                      <h3 className="text-lg font-semibold text-white">
                                        Is Gambling Affecting My Finances?
                                      </h3>
                                      <p className="text-gray-300 text-sm">
                                        One of the most obvious ways gambling can become problematic is
                                        when debt begins to mount or savings are used for gambling.
                                      </p>
                                      <ul className="list-disc pl-6 text-gray-300 text-sm space-y-1">
                                        <li>I’m struggling to pay my bills on time</li>
                                        <li>I’m juggling credit card debt</li>
                                        <li>I’ve taken out payday loans</li>
                                        <li>I’ve borrowed money to gamble</li>
                                        <li>I’ve gambled with my savings</li>
                                        <li>I’m hiding gambling losses</li>
                                      </ul>
                                      <p className="text-gray-300 text-sm">
                                        Recognizing the signs of gambling addiction and seeking
                                        professional help is key to recovery. With counseling, support
                                        groups, and financial planning, you can regain control of your
                                        finances and well-being.
                                      </p>
                                      <p className="text-gray-300 text-sm">
                                        For more information visit:{" "}
                                        <a
                                          href="https://www.gamblingtherapy.org"
                                          target="_blank"
                                          className="text-blue-400 underline"
                                        >
                                          gamblingtherapy.org
                                        </a>
                                      </p>
                                      <p className="text-gray-300 text-sm">
                                        Contact:{" "}
                                        <a
                                          href="mailto:support@gamblingtherapy.org"
                                          className="text-blue-400 underline"
                                        >
                                          support@gamblingtherapy.org
                                        </a>
                                      </p>
                                    </section>
                                  </div>
                                )}
                        
                                {/* ============ RESPONSIBLE GAMBLING FAQ'S ============ */}
                                {active === "Responsible Gambling FAQ's" && (
                                  <div className="max-w-4xl mx-auto">
                                    <div className="bg-[#0d1721] rounded-2xl p-6">
                                        <img
              src="/images/responsible3.png"
              alt="Risebet Smart"
              className="w-full h-auto rounded-lg"
            />
                                      <div className="flex items-center gap-3 mb-4">
                                        
                                        
                                        <h2 className="text-white text-xl font-bold">
                                          Responsible Gambling FAQ's
                                        </h2>
                                      </div>
                        
                                      <div className="text-sm text-gray-300 space-y-6 leading-relaxed">
                                        <p>
                                          <strong>1. Isn't problem gambling just a financial problem?</strong><br />
                                          No. Problem gambling is a behavioural addiction that has financial and other consequences. Even if the person pays off their gambling debts, they can still have other problems caused by gambling.
                                        </p>
                        
                                        <p>
                                          <strong>2. Do you have to wager often to be considered as someone being affected by problem gambling?</strong><br />
                                          It really doesn’t matter how often a person wagers. If a person’s gambling is causing emotional, physical, financial, relationship or other challenges for themselves and the people around them, then they are affected as a result of problem gambling.
                                        </p>
                        
                                        <p>
                                          <strong>3. How much money do you have to lose before gambling is a problem?</strong><br />
                                          The amount of money lost or won does not determine when gambling becomes problematic. Problem gambling is a behavioural addiction, of which negatively affects ones finances simply as a direct result of the behavioural addiction. While gambling can cause financial problems, it is not the only warning sign of a gambling problem. When gambling affects an individual’s relationships, job, mental, physical or financial well-being, it is problematic.
                                        </p>
                        
                                        <p>
                                          <strong>4. Who is at risk for problem gambling?</strong><br />
                                          Problem gambling does not discriminate and can impact anyone who gambles regardless of economic, social, cultural or levels of education. Anyone who gambles can develop a gambling problem. Certain factors can increase your risk of developing a gambling addiction, genetics, environment, medical history and age may all play a role.
                                        </p>
                        
                                        <p>
                                          <strong>5. How can I protect myself from problem gambling?</strong><br />
                                          Educate yourself on the risks, use responsible tools, set budgets, and stop when the fun stops.
                                        </p>
                        
                                        <p>
                                          <strong>6. What are responsible gambling interactions?</strong><br />
                                          Responsible gambling interactions are communicated in the form of an email or software messaging. These interactions are aimed at promoting healthy gambling activity, assisting you in understanding the tools and resources available in order to manage your gambling activities. They typically include information about setting limits, 
                                          recognising signs of problem gambling, and accessing 
                                          support resources.
                                        </p>
                        
                                        <div className="pt-6 border-t border-gray-700">
                                          <h3 className="text-white font-semibold mb-2">
                                            Help Organizations
                                          </h3>
                                          <p>
                                            If you are worried about yourself, or if someone you know is having problems managing their gambling, there are several external support agencies that can assist with providing advice.
                                          </p>
                                          <ul className="text-gray-300 mt-2 space-y-2 text-sm">
                                            <li>
                                              <strong>Gamblers Anonymous</strong><br />
                                              <a
                                                href="https://gamblersanonymous.org/ga/"
                                                className="text-blue-400 underline"
                                              >
                                                https://gamblersanonymous.org/ga/
                                              </a>
                                            </li>
                        
                                            <li>
                                              <strong>Gambling Therapy</strong><br />
                                              <a
                                                href="https://www.gamblingtherapy.org/"
                                                className="text-blue-400 underline"
                                              >
                                                https://www.gamblingtherapy.org/
                                              </a><br />
                                              Email: support@gamblingtherapy.org
                                            </li>
                        
                                            <li>
                                              <strong>National Council on Problem Gambling (Canada)</strong><br />
                                              Helpline: +1-800-426-2537<br />
                                              Chat:{" "}
                                              <a
                                                href="https://www.ncpgambling.org/help-treatment/chat/"
                                                className="text-blue-400 underline"
                                              >
                                                Chat Link
                                              </a>
                                            </li>
                                          </ul>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                        
                                )}
        </div>

        <Footer />

      </motion.main>
                                
      {/* ===== Mobile Bottom Bar ===== */}
      {isMobile && (
        <div className="fixed bottom-0 w-full z-50 h-16">
          <MobileBottomBar onBrowseClick={() => setSidebarOpen(true)} />
        </div>
      )}

      {/* ===== Mobile Sidebar ===== */}
      <AnimatePresence>
              {isMobile && sidebarOpen && (
                <motion.div
                  initial={{ x: -256 }}
                  animate={{ x: 0 }}
                  exit={{ x: -256 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="fixed inset-y-0 left-0 z-50 w-64 bg-[#0f172a] shadow-lg"
                >
                  <Sidebar
                    collapsed={false}
                    setCollapsed={() => {}}
                    open={sidebarOpen}
                    setOpen={setSidebarOpen}
                  />
                </motion.div>
              )}
            </AnimatePresence>
      
            {isMobile && sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black z-40"
                onClick={() => setSidebarOpen(false)}
              />
            )}

      {/* ===== Auth Modal ===== */}
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        initialType={authType}
        isMobile={isMobile}
      />
    </div>
  );
};

export default ResponsibleGamblingPage;
