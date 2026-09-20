import type {
  User,
  Bet,
  Transaction,
  Promotion,
  Affiliate,
  Commission,
  Campaign,
  FAQ,
  VIPTier,
  Ticket,
  TicketMessage,
  Post,
  Category,
  LogEntry,
  DashboardStats,
  GameSummary,
  ResponsibleItem,
} from './types';

const randomDate = (daysAgo: number = 90): string => {
  const now = new Date();
  const past = new Date(now.getTime() - Math.random() * daysAgo * 24 * 60 * 60 * 1000);
  return past.toISOString();
};

const randomFromArray = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const usernames = [
  'LuckyDragon', 'HighRoller99', 'CryptoKing', 'BetMaster', 'SlotQueen',
  'BlackjackPro', 'RouletteAce', 'PokerFace', 'DiamondWin', 'GoldenBoy',
  'SilverFox', 'PlatinumPlayer', 'StormRider', 'NightOwl', 'EarlyBird',
  'FearlessGamer', 'RiskTaker', 'SafePlayer', 'BigSpender', 'ThriftyBettor',
  'Newbie2024', 'VeteranGamer', 'CoolCat', 'HotStreak', 'ColdDeck',
  'JackpotHunter', 'BonusSeeker', 'FreeSpinFan', 'CashbackKing', 'VIPMember',
];

const fullNames = [
  'James Wilson', 'Maria Garcia', 'John Smith', 'Sophie Brown', 'Michael Davis',
  'Emma Johnson', 'Carlos Martinez', 'Lisa Anderson', 'David Taylor', 'Anna Thomas',
  'Robert Jackson', 'Jennifer White', 'William Harris', 'Patricia Martin', 'Richard Thompson',
  'Linda Robinson', 'Joseph Clark', 'Barbara Lewis', 'Thomas Walker', 'Elizabeth Hall',
  'Daniel Young', 'Susan King', 'Matthew Wright', 'Jessica Lopez', 'Anthony Hill',
  'Sarah Scott', 'Mark Green', 'Karen Adams', 'Steven Baker', 'Nancy Nelson',
];

const games = [
  { type: 'slot', id: 'sweet-bonanza', name: 'Sweet Bonanza' },
  { type: 'slot', id: 'gates-of-olympus', name: 'Gates of Olympus' },
  { type: 'slot', id: 'big-bass-bonanza', name: 'Big Bass Bonanza' },
  { type: 'table', id: 'blackjack', name: 'Blackjack Classic' },
  { type: 'table', id: 'roulette-european', name: 'European Roulette' },
  { type: 'table', id: 'baccarat', name: 'Baccarat Pro' },
  { type: 'live', id: 'live-blackjack', name: 'Live Blackjack' },
  { type: 'live', id: 'live-roulette', name: 'Live Roulette' },
  { type: 'crash', id: 'aviator', name: 'Aviator' },
  { type: 'dice', id: 'dice-duel', name: 'Dice Duel' },
];

const categories = ['slots', 'table-games', 'live-casino', 'crash', 'sports', 'virtuals'];
const currencies = ['USDT', 'BTC', 'ETH', 'USDC', 'BRL'];

export const mockUsers = (): User[] => {
  const users: User[] = [];
  const roles: User['role'][] = ['user', 'user', 'user', 'user', 'user', 'admin', 'superadmin'];
  const statuses: User['status'][] = ['active', 'active', 'active', 'active', 'banned', 'suspended'];
  const kycStatuses: User['kycStatus'][] = ['unverified', 'pending', 'verified', 'verified', 'verified', 'rejected'];

  for (let i = 0; i < 28; i++) {
    const vipLevel = Math.floor(Math.random() * 11);
    users.push({
      id: `user-${i + 1}`,
      username: usernames[i] || `Player${i + 1}`,
      email: `${usernames[i]?.toLowerCase() || `player${i + 1}`}@risebet.com`,
      fullName: fullNames[i] || `Player ${i + 1}`,
      avatar: `https://i.pravatar.cc/150?img=${(i % 70) + 1}`,
      role: i < 2 ? (i === 0 ? 'superadmin' : 'admin') : randomFromArray(roles),
      status: randomFromArray(statuses),
      kycStatus: randomFromArray(kycStatuses),
      vipLevel,
      balance: Math.round((Math.random() * 50000 + 100) * 100) / 100,
      currency: randomFromArray(currencies),
      registeredAt: randomDate(180),
      lastLoginAt: randomDate(7),
      totalWagered: Math.round(Math.random() * 500000 * 100) / 100,
      totalProfit: Math.round((Math.random() * 100000 - 30000) * 100) / 100,
      referralCode: `REF${(i + 1).toString().padStart(6, '0')}`,
    });
  }
  return users;
};

export const mockBets = (): Bet[] => {
  const bets: Bet[] = [];
  const users = mockUsers();
  const results: Bet['result'][] = ['win', 'loss', 'win', 'loss', 'loss', 'pending', 'cancelled'];

  for (let i = 0; i < 35; i++) {
    const game = randomFromArray(games);
    const user = randomFromArray(users);
    const result = randomFromArray(results);
    const amount = Math.round((Math.random() * 1000 + 5) * 100) / 100;
    const multiplier = result === 'win' ? Math.round((Math.random() * 20 + 1.1) * 100) / 100 : 0;
    const profitLoss = result === 'win'
      ? Math.round(amount * (multiplier - 1) * 100) / 100
      : result === 'loss' ? -amount : 0;

    bets.push({
      id: `bet-${i + 1}`,
      userId: user.id,
      username: user.username,
      gameType: game.type,
      gameId: game.id,
      amount,
      multiplier,
      result,
      profitLoss,
      timestamp: randomDate(3),
      currency: user.currency,
    });
  }
  return bets;
};

export const mockTransactions = (type?: Transaction['type']): Transaction[] => {
  const all: Transaction[] = [];
  const users = mockUsers();
  const types: Transaction['type'][] = ['deposit', 'deposit', 'withdrawal', 'bonus', 'raffle', 'race', 'adjustment', 'other'];
  const statuses: Transaction['status'][] = ['pending', 'approved', 'completed', 'completed', 'rejected', 'failed', 'cancelled'];
  const methods = ['Bitcoin', 'Ethereum', 'USDT (TRC20)', 'USDT (ERC20)', 'Bank Transfer', 'Pix'];

  for (let i = 0; i < 45; i++) {
    const tType = randomFromArray(types);
    const user = randomFromArray(users);
    const amount = tType === 'withdrawal'
      ? Math.round((Math.random() * 5000 + 50) * 100) / 100
      : Math.round((Math.random() * 2000 + 10) * 100) / 100;

    all.push({
      id: `tx-${i + 1}`,
      userId: user.id,
      username: user.username,
      type: tType,
      amount,
      method: randomFromArray(methods),
      status: randomFromArray(statuses),
      walletAddress: tType === 'withdrawal' ? `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}` : undefined,
      txHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      note: i % 7 === 0 ? 'Manual adjustment by admin' : undefined,
      createdAt: randomDate(30),
      updatedAt: randomDate(30),
      currency: user.currency,
    });
  }

  return type ? all.filter(t => t.type === type) : all;
};

export const mockPromotions = (): Promotion[] => {
  const promos: Promotion[] = [
    {
      id: 'promo-1', title: 'Welcome Bonus 200%', description: 'Get 200% match on your first deposit up to 1000 USDT',
      type: 'bonus', bonusAmount: 1000, wageringRequirement: 40, eligibleVipTiers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      startAt: randomDate(30), endAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active', claimedCount: 1247, isBanner: true, sortOrder: 1,
    },
    {
      id: 'promo-2', title: 'Weekly Cashback 15%', description: 'Get up to 15% cashback on your weekly losses',
      type: 'cashback', bonusAmount: 500, wageringRequirement: 10, eligibleVipTiers: [3, 4, 5, 6, 7, 8, 9, 10],
      startAt: randomDate(60), endAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active', claimedCount: 892, isBanner: true, sortOrder: 2,
    },
    {
      id: 'promo-3', title: 'Free Spins Friday', description: '50 free spins on Sweet Bonanza every Friday',
      type: 'freespin', bonusAmount: 50, wageringRequirement: 30, eligibleVipTiers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      startAt: randomDate(14), endAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active', claimedCount: 2341, isBanner: false, sortOrder: 3,
    },
    {
      id: 'promo-4', title: 'Grand Raffle January', description: 'Win a share of 50,000 USDT prize pool',
      type: 'raffle', bonusAmount: 50000, wageringRequirement: 0, eligibleVipTiers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      startAt: randomDate(10), endAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active', claimedCount: 5678, isBanner: true, sortOrder: 4,
    },
    {
      id: 'promo-5', title: 'VIP Exclusive Reload', description: '50% reload bonus for VIP members only',
      type: 'bonus', bonusAmount: 2000, wageringRequirement: 35, eligibleVipTiers: [5, 6, 7, 8, 9, 10],
      startAt: randomDate(5), endAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active', claimedCount: 156, isBanner: false, sortOrder: 5,
    },
    {
      id: 'promo-6', title: 'New Year Special', description: 'Start the year with 150% bonus up to 2025 USDT',
      type: 'bonus', bonusAmount: 2025, wageringRequirement: 45, eligibleVipTiers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      startAt: randomDate(45), endAt: randomDate(10),
      status: 'expired', claimedCount: 3892, isBanner: true, sortOrder: 6,
    },
    {
      id: 'promo-7', title: 'Crypto Deposit Boost', description: '10% extra on all BTC and ETH deposits',
      type: 'other', bonusAmount: 500, wageringRequirement: 20, eligibleVipTiers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      startAt: randomDate(1), endAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active', claimedCount: 445, isBanner: false, sortOrder: 7,
    },
    {
      id: 'promo-8', title: 'Referral Program Upgrade', description: 'Earn up to 50% commission on referrals',
      type: 'other', bonusAmount: 0, wageringRequirement: 0, eligibleVipTiers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      startAt: randomDate(100), endAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active', claimedCount: 8901, isBanner: true, sortOrder: 8,
    },
    {
      id: 'promo-9', title: 'Draft: Valentines Day', description: 'Special promotion for Valentines Day (not published)',
      type: 'bonus', bonusAmount: 1400, wageringRequirement: 30, eligibleVipTiers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      startAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      endAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'draft', claimedCount: 0, isBanner: false, sortOrder: 9,
    },
    {
      id: 'promo-10', title: 'Race Tournament Finals', description: 'Top 100 players share 25,000 USDT',
      type: 'raffle', bonusAmount: 25000, wageringRequirement: 0, eligibleVipTiers: [2, 3, 4, 5, 6, 7, 8, 9, 10],
      startAt: randomDate(2), endAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active', claimedCount: 1876, isBanner: true, sortOrder: 10,
    },
  ];
  return promos;
};

export const mockAffiliates = (): Affiliate[] => {
  const users = mockUsers();
  const statuses: Affiliate['status'][] = ['active', 'active', 'active', 'paused', 'banned'];
  const affiliates: Affiliate[] = [];

  for (let i = 0; i < 10; i++) {
    const user = users[i + 5];
    affiliates.push({
      id: `aff-${i + 1}`,
      userId: user.id,
      username: user.username,
      referralCode: user.referralCode || `AFF${(i + 1).toString().padStart(5, '0')}`,
      referralsCount: Math.floor(Math.random() * 500 + 10),
      commissionRate: Math.floor(Math.random() * 40 + 10),
      totalEarned: Math.round((Math.random() * 50000 + 1000) * 100) / 100,
      pendingPayout: Math.round((Math.random() * 5000 + 100) * 100) / 100,
      totalPaid: Math.round((Math.random() * 40000 + 500) * 100) / 100,
      status: randomFromArray(statuses),
      joinedAt: randomDate(200),
    });
  }
  return affiliates;
};

export const mockCommissions = (): Commission[] => {
  const affiliates = mockAffiliates();
  const commissions: Commission[] = [];

  for (let i = 0; i < 15; i++) {
    const aff = randomFromArray(affiliates);
    const isPaid = Math.random() > 0.4;
    const start = new Date();
    start.setDate(start.getDate() - (i * 7 + 1));
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    commissions.push({
      id: `comm-${i + 1}`,
      affiliateId: aff.id,
      periodStart: start.toISOString(),
      periodEnd: end.toISOString(),
      amount: Math.round((Math.random() * 3000 + 100) * 100) / 100,
      status: isPaid ? 'paid' : 'pending',
      paidAt: isPaid ? new Date(end.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString() : undefined,
    });
  }
  return commissions;
};

export const mockCampaigns = (): Campaign[] => {
  const statuses: Campaign['status'][] = ['active', 'active', 'paused', 'ended'];
  return [
    {
      id: 'camp-1', name: 'Google Ads Casino', description: 'Google search ads for casino keywords',
      clicks: 45230, conversions: 1247, commissionRate: 35,
      status: 'active', startAt: randomDate(60), endAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'camp-2', name: 'Facebook Social', description: 'Facebook and Instagram retargeting',
      clicks: 28910, conversions: 892, commissionRate: 30,
      status: 'active', startAt: randomDate(45), endAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'camp-3', name: 'YouTube Reviewers', description: 'Paid reviews with top crypto YouTubers',
      clicks: 12450, conversions: 567, commissionRate: 40,
      status: 'active', startAt: randomDate(20), endAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'camp-4', name: 'Reddit Communities', description: 'Targeted posts on crypto and gambling subreddits',
      clicks: 8720, conversions: 234, commissionRate: 25,
      status: 'paused', startAt: randomDate(30), endAt: randomDate(5),
    },
    {
      id: 'camp-5', name: 'Telegram Influencers', description: 'Shoutouts in large crypto telegram groups',
      clicks: 19870, conversions: 678, commissionRate: 38,
      status: 'active', startAt: randomDate(15), endAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'camp-6', name: 'Holiday Season Push', description: 'Black Friday and Christmas campaign',
      clicks: 62340, conversions: 2145, commissionRate: 45,
      status: 'ended', startAt: randomDate(90), endAt: randomDate(20),
    },
  ];
};

export const mockFAQs = (): FAQ[] => {
  return [
    { id: 'faq-1', question: 'How do I create an account?', answer: 'Click the Sign Up button, fill in your email and password, verify your email and start playing.', category: 'Account', sortOrder: 1 },
    { id: 'faq-2', question: 'What cryptocurrencies do you accept?', answer: 'We accept Bitcoin (BTC), Ethereum (ETH), Tether (USDT) on both TRC20 and ERC20 networks, and USDC.', category: 'Deposits', sortOrder: 1 },
    { id: 'faq-3', question: 'How long do withdrawals take?', answer: 'Crypto withdrawals are processed within 15 minutes during business hours. Bank transfers may take 1-3 business days.', category: 'Withdrawals', sortOrder: 1 },
    { id: 'faq-4', question: 'What is KYC and why do I need it?', answer: 'Know Your Customer (KYC) is required to prevent fraud and comply with regulations. You need to verify your identity before large withdrawals.', category: 'Account', sortOrder: 2 },
    { id: 'faq-5', question: 'How do VIP tiers work?', answer: 'VIP tiers are based on total wagering. Higher tiers unlock better cashback, exclusive bonuses, faster withdrawals and personal account managers.', category: 'VIP', sortOrder: 1 },
    { id: 'faq-6', question: 'Are my funds safe?', answer: 'Yes, we use cold storage for 95% of funds, SSL encryption, and regular security audits by third-party firms.', category: 'Security', sortOrder: 1 },
    { id: 'faq-7', question: 'What is the wagering requirement?', answer: 'Wagering requirement is how many times you need to play through a bonus before you can withdraw it. For example, 40x means $100 bonus requires $4000 in bets.', category: 'Bonuses', sortOrder: 1 },
    { id: 'faq-8', question: 'How do I contact support?', answer: 'Use the live chat widget 24/7, email support@risebet.com, or open a ticket in your account dashboard.', category: 'Support', sortOrder: 1 },
    { id: 'faq-9', question: 'Can I self-exclude?', answer: 'Yes, go to Responsible Gaming section in your account to set deposit limits, cooling-off periods, or self-exclusion.', category: 'Responsible Gaming', sortOrder: 1 },
    { id: 'faq-10', question: 'Do you offer a mobile app?', answer: 'Our website is fully responsive for mobile. Progressive Web App can be added to home screen for app-like experience.', category: 'General', sortOrder: 1 },
  ];
};

export const mockVIPTiers = (): VIPTier[] => {
  const perksByLevel = [
    ['Welcome bonus', 'Daily free spins'],
    ['5% cashback', 'Weekend reload bonus', 'Priority support'],
    ['8% cashback', 'Birthday bonus', 'Exclusive tournament access'],
    ['10% cashback', 'Higher withdrawal limits', 'Personal manager'],
    ['12% cashback', 'Custom bonuses', 'Gifts and merchandise'],
    ['15% cashback', 'Instant withdrawals', 'VIP events invites'],
  ];

  return [
    { id: 'vip-1', level: 0, name: 'Bronze', minWagering: 0, cashbackPercent: 0, rakebackPercent: 0, weeklyBonus: 0, perks: perksByLevel[0], usersCount: 12450, totalWagered: 2500000 },
    { id: 'vip-2', level: 1, name: 'Silver', minWagering: 10000, cashbackPercent: 5, rakebackPercent: 3, weeklyBonus: 10, perks: perksByLevel[1], usersCount: 3892, totalWagered: 8700000 },
    { id: 'vip-3', level: 3, name: 'Gold', minWagering: 50000, cashbackPercent: 8, rakebackPercent: 5, weeklyBonus: 50, perks: perksByLevel[2], usersCount: 1247, totalWagered: 15200000 },
    { id: 'vip-4', level: 5, name: 'Platinum', minWagering: 250000, cashbackPercent: 10, rakebackPercent: 7, weeklyBonus: 250, perks: perksByLevel[3], usersCount: 389, totalWagered: 28900000 },
    { id: 'vip-5', level: 7, name: 'Diamond', minWagering: 1000000, cashbackPercent: 12, rakebackPercent: 10, weeklyBonus: 1000, perks: perksByLevel[4], usersCount: 92, totalWagered: 45600000 },
    { id: 'vip-6', level: 10, name: 'Black Diamond', minWagering: 5000000, cashbackPercent: 15, rakebackPercent: 15, weeklyBonus: 5000, perks: perksByLevel[5], usersCount: 18, totalWagered: 92300000 },
  ];
};

const mockTicketMessages = (ticketId: string): TicketMessage[] => {
  return [
    {
      id: `${ticketId}-msg-1`,
      ticketId,
      authorName: 'Customer',
      authorRole: 'user',
      body: "Hi, I haven't received my withdrawal from 2 hours ago. Can you check?",
      createdAt: randomDate(1),
      internal: false,
    },
    {
      id: `${ticketId}-msg-2`,
      ticketId,
      authorName: 'Sarah Support',
      authorRole: 'admin',
      body: 'Hello! I can see your withdrawal was flagged for manual review due to the large amount. Let me check with the finance team.',
      createdAt: randomDate(1),
      internal: false,
    },
    {
      id: `${ticketId}-msg-3`,
      ticketId,
      authorName: 'Sarah Support',
      authorRole: 'admin',
      body: '[INTERNAL] Need to escalate to finance, amount exceeds $5k. Transaction ID: 0x1234...5678',
      createdAt: randomDate(1),
      internal: true,
    },
  ];
};

export const mockTickets = (): Ticket[] => {
  const users = mockUsers();
  const cats = ['Account', 'Deposit', 'Withdrawal', 'Bonus', 'Technical', 'Game Issue'];
  const priorities: Ticket['priority'][] = ['low', 'medium', 'medium', 'high'];
  const statuses: Ticket['status'][] = ['open', 'in-progress', 'resolved', 'closed'];
  const assignees = ['Sarah Support', 'Mike Admin', 'Alex Manager', undefined];

  const tickets: Ticket[] = [];
  const subjects = [
    'Withdrawal not received', 'Cannot login to account', 'Bonus not credited',
    'Game crashed during spin', 'Change email address', 'Verify my account',
    'VIP level not updated', 'Failed deposit stuck', 'Reset 2FA',
    'Responsible gaming limit request',
  ];

  for (let i = 0; i < 10; i++) {
    const user = randomFromArray(users);
    tickets.push({
      id: `ticket-${i + 1}`,
      userId: user.id,
      username: user.username,
      subject: subjects[i] || `Support inquiry ${i + 1}`,
      category: randomFromArray(cats),
      priority: randomFromArray(priorities),
      status: randomFromArray(statuses),
      assignee: randomFromArray(assignees),
      createdAt: randomDate(14),
      updatedAt: randomDate(3),
      messages: i < 3 ? mockTicketMessages(`ticket-${i + 1}`) : undefined,
    });
  }
  return tickets;
};

export const mockTicketById = (id: string): Ticket | undefined => {
  const ticket = mockTickets().find(t => t.id === id);
  if (ticket && !ticket.messages) {
    ticket.messages = mockTicketMessages(id);
  }
  return ticket;
};

export const mockPosts = (): Post[] => {
  const users = mockUsers().filter(u => u.role !== 'user');
  const cats = mockCategories();
  const titles = [
    'Welcome to the New RiseBet Platform',
    'Weekly Tournament Recap: Winners Announced',
    'Introducing VIP Program v2.0',
    'Security Update: 2FA Mandatory for Large Withdrawals',
    'New Game Release: Gates of Olympus 1000',
    'Year in Review: 2024 Highlights',
    'Responsible Gaming Week: Resources Available',
    'Referral Program Boosted to 50%',
    'Maintenance Notice: Server Upgrade Jan 15',
    'Community Spotlight: Interview with Top Player',
  ];
  const contents = Array.from({ length: 10 }, (_, i) =>
    `<p>This is the full content of the blog post titled "${titles[i]}". It contains rich information about the topic and engages our community of players. Our team works hard to bring you the best experience...</p>`
  );

  return titles.map((title, i) => {
    const cat = randomFromArray(cats);
    const author = randomFromArray(users);
    return {
      id: `post-${i + 1}`,
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      author: author.username,
      categoryId: cat.id,
      categoryName: cat.name,
      content: contents[i],
      image: `https://picsum.photos/seed/post${i}/800/400`,
      published: i < 8,
      viewsCount: Math.floor(Math.random() * 5000 + 100),
      createdAt: randomDate(60),
      updatedAt: randomDate(7),
    };
  });
};

export const mockCategories = (): Category[] => [
  { id: 'cat-1', name: 'News', slug: 'news', postCount: 4 },
  { id: 'cat-2', name: 'Promotions', slug: 'promotions', postCount: 3 },
  { id: 'cat-3', name: 'Guides', slug: 'guides', postCount: 2 },
  { id: 'cat-4', name: 'Announcements', slug: 'announcements', postCount: 1 },
  { id: 'cat-5', name: 'Community', slug: 'community', postCount: 0 },
];

export const mockLogs = (severity?: LogEntry['severity']): LogEntry[] => {
  const all: LogEntry[] = [];
  const severities: LogEntry['severity'][] = ['info', 'info', 'info', 'info', 'warning', 'warning', 'error', 'critical'];
  const actions = [
    'USER_LOGIN', 'USER_LOGOUT', 'USER_BANNED', 'USER_SUSPENDED',
    'BET_PLACED', 'BET_CANCELLED', 'WITHDRAWAL_REQUESTED', 'WITHDRAWAL_APPROVED',
    'WITHDRAWAL_REJECTED', 'DEPOSIT_RECEIVED', 'PROMO_CREATED', 'PROMO_UPDATED',
    'TICKET_RESPONDED', 'SETTINGS_CHANGED', 'ROLE_UPDATED', 'PASSWORD_RESET',
    'KYC_APPROVED', 'KYC_REJECTED', 'SECURITY_ALERT', 'API_RATE_LIMIT',
  ];
  const roles = ['admin', 'superadmin', 'user', 'system'];
  const targetTypes = ['user', 'bet', 'transaction', 'promotion', 'ticket', 'settings', 'post'];

  for (let i = 0; i < 25; i++) {
    const sev = randomFromArray(severities);
    const action = randomFromArray(actions);
    all.push({
      id: `log-${i + 1}`,
      action,
      actorName: sev === 'info' ? (Math.random() > 0.5 ? usernames[i % usernames.length] : 'system') : randomFromArray(roles),
      actorRole: randomFromArray(roles),
      targetType: randomFromArray(targetTypes),
      targetId: `${randomFromArray(targetTypes)}-${Math.floor(Math.random() * 100) + 1}`,
      ip: `${Math.floor(Math.random() * 223) + 1}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      metadata: i % 4 === 0 ? { detail: 'Additional context about the event', userAgent: 'Chrome 120' } : undefined,
      createdAt: randomDate(7),
      severity: sev,
    });
  }
  return severity ? all.filter(l => l.severity === severity) : all;
};

export const mockDashboardStats = (): DashboardStats => ({
  totalUsers: 18407,
  activeUsersToday: 2341,
  totalBets24h: 18765,
  totalWagered24h: 2847650.50,
  netRevenue24h: 284765.05,
  pendingWithdrawalsCount: 47,
  deposits24hCount: 892,
  withdrawals24hCount: 341,
});

export const mockGames = (): GameSummary[] => {
  const gameList: GameSummary[] = [];
  const statuses: GameSummary['status'][] = ['active', 'active', 'active', 'active', 'disabled', 'maintenance'];
  const gameNames = [
    'Sweet Bonanza', 'Gates of Olympus', 'Big Bass Bonanza', 'Wolf Gold', 'Book of Dead',
    'Starburst', 'Gonzo\'s Quest', 'Mega Moolah', 'Blackjack Classic', 'European Roulette',
    'Baccarat Pro', 'Texas Hold\'em', 'Craps', 'Live Blackjack', 'Live Roulette',
    'Live Baccarat', 'Dream Catcher', 'Lightning Roulette', 'Aviator', 'Dice Duel',
    'Mines', 'Plinko', 'Tower',
  ];
  const keys = gameNames.map(n => n.toLowerCase().replace(/[^a-z0-9]+/g, '-'));

  for (let i = 0; i < 23; i++) {
    const cat = i < 15 ? (i < 8 ? 'slots' : (i < 13 ? 'table' : 'live')) : (i < 20 ? 'crash' : 'other');
    gameList.push({
      id: `game-${i + 1}`,
      name: gameNames[i],
      key: keys[i],
      category: cat,
      rtp: Math.round((Math.random() * 8 + 92) * 100) / 100,
      status: randomFromArray(statuses),
      bets24h: Math.floor(Math.random() * 5000 + 50),
      volume24h: Math.round((Math.random() * 100000 + 1000) * 100) / 100,
      playersNow: Math.floor(Math.random() * 500 + 1),
      icon: `https://picsum.photos/seed/game${i}/64/64`,
    });
  }
  return gameList;
};

export const mockResponsibleItems = (type?: ResponsibleItem['type']): ResponsibleItem[] => {
  const users = mockUsers();
  const types: ResponsibleItem['type'][] = ['self-exclusion', 'cooling-off', 'deposit-limit', 'deposit-limit', 'deposit-limit'];
  const statuses: ResponsibleItem['status'][] = ['active', 'active', 'ended', 'revoked'];
  const reasons = [
    'Personal reasons - taking a break',
    'Gambling addiction concerns',
    'Family request',
    'Financial management',
    'Temporary break during exams',
  ];

  const items: ResponsibleItem[] = [];
  for (let i = 0; i < 10; i++) {
    const user = randomFromArray(users);
    const t = randomFromArray(types);
    const start = randomDate(60);
    const durDays = t === 'self-exclusion' ? (60 + Math.floor(Math.random() * 300))
      : t === 'cooling-off' ? (1 + Math.floor(Math.random() * 29))
      : 30;
    const end = new Date(new Date(start).getTime() + durDays * 24 * 60 * 60 * 1000).toISOString();

    items.push({
      id: `rg-${i + 1}`,
      userId: user.id,
      username: user.username,
      type: t,
      reason: randomFromArray(reasons),
      startAt: start,
      endAt: end,
      limitAmount: t === 'deposit-limit' ? [100, 250, 500, 1000, 2500][Math.floor(Math.random() * 5)] : undefined,
      status: randomFromArray(statuses),
    });
  }
  return type ? items.filter(r => r.type === type) : items;
};

export const mockUserById = (id: string): User | undefined => {
  return mockUsers().find(u => u.id === id);
};
