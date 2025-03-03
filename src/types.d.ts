export type Game = {
  order: number;
  id: string;
  title: string;
  description: string;
  desc_it?: string;
  desc_fr?: string;
  desc_en?: string;
  desc_de?: string;
  desc_es?: string;
  category: string;
  categories: string[];
  author: string;
  thumbnailUrl: string;
  thumbnailUrl100: string;
  image_url?:string
  url: string;
  rkScore: number;
  height: number;
  width: number;
  orientation: "landscape" | "portrait";
  responsive: boolean;
  touch: boolean;
  hwcontrols: boolean;
  featured: boolean;
  creation: string;
  lastUpdate: string;
  size: number;
  min_android_version: string;
  min_ios_version: string;
  min_wp_version: string;
};

export type Category = {
  id: string;
  name: string;
  description: string;
  games: Game[];
};
