export interface User {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  avatar?: string;
  role: 'user' | 'admin' | 'superadmin';
  status: 'active' | 'banned' | 'suspended';
  kycStatus: 'unverified' | 'pending' | 'verified' | 'rejected';
  vipLevel: number;
  balance: number;
  currency: string;
  registeredAt: string;
  lastLoginAt?: string;
  totalWagered?: number;
  totalProfit?: number;
  referralCode?: string;
}

export interface Bet {
  id: string;
  userId: string;
  username?: string;
  gameType: string;
  gameId?: string;
  amount: number;
  multiplier?: number;
  result: 'win' | 'loss' | 'pending' | 'cancelled';
  profitLoss: number;
  timestamp: string;
  currency: string;
}

export interface Transaction {
  id: string;
  userId: string;
  username?: string;
  type: 'deposit' | 'withdrawal' | 'bonus' | 'raffle' | 'race' | 'other' | 'adjustment';
  amount: number;
  method?: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'failed' | 'cancelled';
  walletAddress?: string;
  txHash?: string;
  note?: string;
  createdAt: string;
  updatedAt?: string;
  currency: string;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  image?: string;
  type: 'bonus' | 'freespin' | 'cashback' | 'raffle' | 'other';
  bonusAmount: number;
  wageringRequirement?: number;
  eligibleVipTiers: number[];
  startAt: string;
  endAt: string;
  status: 'draft' | 'active' | 'expired';
  claimedCount: number;
  isBanner: boolean;
  sortOrder: number;
}

export interface Affiliate {
  id: string;
  userId: string;
  username: string;
  referralCode: string;
  referralsCount: number;
  commissionRate: number;
  totalEarned: number;
  pendingPayout: number;
  totalPaid: number;
  status: 'active' | 'paused' | 'banned';
  joinedAt: string;
}

export interface Commission {
  id: string;
  affiliateId: string;
  periodStart: string;
  periodEnd: string;
  amount: number;
  status: 'pending' | 'paid';
  paidAt?: string;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  clicks: number;
  conversions: number;
  commissionRate: number;
  status: 'active' | 'paused' | 'ended';
  startAt: string;
  endAt: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
}

export interface VIPTier {
  id: string;
  level: number;
  name: string;
  minWagering: number;
  cashbackPercent: number;
  rakebackPercent: number;
  weeklyBonus: number;
  perks: string[];
  usersCount: number;
  totalWagered: number;
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  authorName: string;
  authorRole: string;
  body: string;
  createdAt: string;
  internal: boolean;
}

export interface Ticket {
  id: string;
  userId: string;
  username: string;
  subject: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  assignee?: string;
  createdAt: string;
  updatedAt: string;
  messages?: TicketMessage[];
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  author: string;
  categoryId: string;
  categoryName?: string;
  content: string;
  image?: string;
  published: boolean;
  viewsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  postCount: number;
}

export interface LogEntry {
  id: string;
  action: string;
  actorName: string;
  actorRole: string;
  targetType: string;
  targetId?: string;
  ip: string;
  metadata?: Record<string, any>;
  createdAt: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
}

export interface DashboardStats {
  totalUsers: number;
  activeUsersToday: number;
  totalBets24h: number;
  totalWagered24h: number;
  netRevenue24h: number;
  pendingWithdrawalsCount: number;
  deposits24hCount: number;
  withdrawals24hCount: number;
}

export interface GameSummary {
  id: string;
  name: string;
  key: string;
  category: string;
  rtp: number;
  status: 'active' | 'disabled' | 'maintenance';
  bets24h: number;
  volume24h: number;
  playersNow: number;
  icon?: string;
}

export interface ResponsibleItem {
  id: string;
  userId: string;
  username: string;
  type: 'self-exclusion' | 'cooling-off' | 'deposit-limit';
  reason?: string;
  startAt: string;
  endAt: string;
  limitAmount?: number;
  status: 'active' | 'ended' | 'revoked';
}
