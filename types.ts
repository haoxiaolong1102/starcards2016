
export enum CarStatus {
  RECRUITING = 'RECRUITING', // 招募中
  FULL = 'FULL',             // 满员/待开
  OPENED = 'OPENED',         // 已开箱
  SHIPPED = 'SHIPPED'        // 已发货
}

export enum HostType {
  MERCHANT = 'MERCHANT',     // 商家 (A类)
  FAN_LEADER = 'FAN_LEADER'  // 粉头 (B类)
}

export enum UserRole {
  USER = 'USER',             // 普通用户 (只能买)
  MERCHANT_A = 'MERCHANT_A', // A类: 直播间/卡店 (有货有执照)
  MERCHANT_B = 'MERCHANT_B'  // B类: 粉头/应援会 (需绑定A类)
}

export interface LiveInfo {
  platform: string;
  roomId: string;
  isLive: boolean;
}

export interface ArtistSlot {
  id: string;
  name: string;
  avatarUrl: string;
  price: number;
  totalSpots: number;
  takenSpots: number;
  isHot?: boolean;
}

export interface Car {
  id: string;
  title: string;
  ipName: string;
  seriesName: string;
  boxCount: number;
  hostName: string;
  hostType: HostType;
  hostRating: number;
  status: CarStatus;
  coverImage: string;
  slots: ArtistSlot[];
  description: string;
  extraNote?: string;
  tags: string[];
  createdAt: string;
  supplierName?: string;
  liveInfo?: LiveInfo;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  favoriteArtists: string[];
  role: UserRole;
}

export interface Merchant {
  id: number;
  name: string;
  rating: number;
  activeCars: number;
  tags: string[];
  isLive: boolean;
  avatar: string;
  fans: number;
  description: string;
}

export interface CardResult {
  id: string;
  imageUrl: string;
  name: string;
  rarity: 'R' | 'SR' | 'SSR' | 'SSP';
  artistName: string;
}

export interface Order {
  id: string;
  carId: string;
  carTitle: string;
  carImage: string;
  items: { name: string; count: number }[];
  totalPrice: number;
  status: 'PAID' | 'OPENED' | 'SHIPPED' | 'COMPLETED'; // Added COMPLETED
  date: string;
  hits?: CardResult[];
  // Settlement Info
  isSettled?: boolean;
  serviceFee?: number; // 平台技术服务费
  paymentFee?: number; // 支付通道费
  settledAmount?: number; // 实际入账
}

// --- NEW: Wallet & Financials ---

export interface Transaction {
  id: string;
  type: 'INCOME' | 'WITHDRAW' | 'FEE' | 'REFUND';
  amount: number;
  date: string;
  description: string; // e.g., "订单结算-现在就出发3"
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
}

export interface WithdrawalRequest {
  id: string;
  amount: number;
  fee: number;
  actualAmount: number; // amount - fee
  requestDate: string;
  expectedDate: string; // T+1
  status: 'PENDING' | 'COMPLETED' | 'REJECTED';
}

export interface MerchantWallet {
  merchantName: string; // Key
  totalIncome: number; // 历史总GMV
  availableBalance: number; // 可提现
  pendingBalance: number; // 结算中 (未确认收货)
  frozenBalance: number; // 保证金/风控冻结
  transactions: Transaction[];
  withdrawals: WithdrawalRequest[];
}

// --- NEW: Banner & Ads ---

export enum BannerSlotId {
  HOME_TOP = 'HOME_TOP',
  MERCHANT_LIST_TOP = 'MERCHANT_LIST_TOP',
  CAR_DETAIL_MID = 'CAR_DETAIL_MID'
}

export interface BannerCampaign {
  id: string;
  merchantName: string;
  slotId: BannerSlotId;
  imageUrl: string;
  targetUrl: string; // Simple string for now
  title: string;
  startTime: string;
  endTime: string;
  status: 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'REJECTED';
  price: number; // Price paid for this slot
  impressionCount: number;
  clickCount: number;
}
