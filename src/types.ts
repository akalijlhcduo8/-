export type Platform = 'Steam' | 'Epic' | 'EA' | 'Ubisoft' | 'Xbox' | 'PlayStation';

export type Genre = 
  | 'Action' 
  | 'RPG' 
  | 'Sports' 
  | 'Open World' 
  | 'Shooter' 
  | 'Strategy' 
  | 'Horror' 
  | 'Adventure' 
  | 'Racing';

export type Region = 'GLOBAL' | 'MENA' | 'EU' | 'US';

export interface SystemSpec {
  os: string;
  cpu: string;
  ram: string;
  gpu: string;
  storage: string;
  directx?: string;
}

export interface UserReview {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  commentAr: string;
  verifiedPurchase: boolean;
}

export interface Game {
  id: string;
  slug: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  shortDesc: string;
  shortDescAr: string;
  coverImage: string;
  bannerImage: string;
  screenshots: string[];
  trailerUrl?: string;
  price: number;
  originalPrice: number;
  discount: number;
  platform: Platform;
  genre: Genre;
  genreAr: string;
  region: Region;
  rating: number;
  reviewsCount: number;
  releaseDate: string;
  developer: string;
  publisher: string;
  inStock: boolean;
  isBestseller?: boolean;
  isNewRelease?: boolean;
  isFlashDeal?: boolean;
  flashDealEndsAt?: string;
  purchasesToday: number;
  systemRequirements: {
    minimum: SystemSpec;
    recommended: SystemSpec;
  };
  features: string[];
  featuresAr: string[];
  reviews: UserReview[];
}

export interface CartItem {
  game: Game;
  quantity: number;
}

export interface PurchasedKey {
  id: string;
  orderId: string;
  gameId: string;
  gameTitle: string;
  gameTitleAr: string;
  gameCover: string;
  platform: Platform;
  activationKey: string;
  purchaseDate: string;
  price: number;
  status: 'Active' | 'Redeemed';
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  emailVerified: boolean;
  avatar: string;
  gamerTag: string;
  level: number;
  rewardPoints: number;
  walletBalance: number;
  role?: 'user' | 'admin';
}

export type Language = 'ar' | 'en';
export type Currency = 'USD' | 'SAR' | 'AED';

export type PageView = 
  | 'home' 
  | 'catalog' 
  | 'product' 
  | 'checkout' 
  | 'account' 
  | 'how-it-works' 
  | 'contact'
  | 'merchant';

export interface FilterState {
  search: string;
  platforms: Platform[];
  genres: Genre[];
  regions: Region[];
  maxPrice: number;
  sortBy: 'featured' | 'bestseller' | 'price-asc' | 'price-desc' | 'rating' | 'discount';
  onlyDiscounted: boolean;
  inStockOnly: boolean;
}
