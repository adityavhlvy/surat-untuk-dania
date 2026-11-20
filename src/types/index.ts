export interface MemoryItem {
  id: number;
  image: string;
  title: string;
  dateStr: string;
  quote: string;
  tag: string;
  rotation?: number;
}

export interface WishItem {
  id: string;
  name: string;
  message: string;
  time: string;
  hearts: number;
}
