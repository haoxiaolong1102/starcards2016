export enum CarStatus {
  RECRUITING = 'RECRUITING', // 招募中
  FULL = 'FULL',             // 满员/待开
  OPENED = 'OPENED',         // 已开箱
  SHIPPED = 'SHIPPED'        // 已发货
}

export enum HostType {
  MERCHANT = 'MERCHANT',     // 商家
  FAN_LEADER = 'FAN_LEADER'  // 粉头
}

export interface ArtistSlot {
  id: string;
  name: string;
  avatarUrl: string;
  price: number;
  totalSpots: number;
  takenSpots: number;
  isHot?: boolean; // 热门角色
}

export interface Car {
  id: string;
  title: string;
  ipName: string; // e.g. "现在就出发3"
  seriesName: string; // e.g. "第一弹"
  boxCount: number;
  hostName: string;
  hostType: HostType;
  hostRating: number;
  status: CarStatus;
  coverImage: string;
  slots: ArtistSlot[];
  description: string;
  tags: string[]; // e.g., "含周边", "白敬亭专车"
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  favoriteArtists: string[]; // e.g. ["白敬亭", "范丞丞"]
  isMerchant?: boolean; // Add capability to switch view
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
  name: string; // e.g. "SSP 亲签"
  rarity: 'R' | 'SR' | 'SSR' | 'SSP';
  artistName: string;
}

export interface Order {
  id: string;
  carId: string; // Link back to car
  carTitle: string;
  carImage: string;
  items: { name: string; count: number }[]; // e.g. "白敬亭" x 2
  totalPrice: number;
  status: 'PAID' | 'OPENED' | 'SHIPPED'; // Added OPENED
  date: string;
  hits?: CardResult[]; // The cards won in this order
}