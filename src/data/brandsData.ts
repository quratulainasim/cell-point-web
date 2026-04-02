import { brandLogos } from '@/assets/phoneImages';

export interface Brand {
  id: string;
  name: string;
  tagline: string;
  color: string;
  phoneCount: number;
  logo: string;
}

export const brands: Brand[] = [
  { id: "samsung", name: "Samsung", tagline: "Do What You Can't", color: "#1428A0", phoneCount: 30, logo: brandLogos.Samsung },
  { id: "apple", name: "Apple", tagline: "Think Different", color: "#A2AAAD", phoneCount: 30, logo: brandLogos.Apple },
  { id: "xiaomi", name: "Xiaomi", tagline: "Innovation For Everyone", color: "#FF6900", phoneCount: 30, logo: brandLogos.Xiaomi },
  { id: "oppo", name: "OPPO", tagline: "Inspiration Ahead", color: "#1BA784", phoneCount: 30, logo: brandLogos.OPPO },
  { id: "vivo", name: "Vivo", tagline: "Camera & Music", color: "#415FFF", phoneCount: 30, logo: brandLogos.Vivo },
  { id: "realme", name: "Realme", tagline: "Dare To Leap", color: "#F5C518", phoneCount: 30, logo: brandLogos.Realme },
  { id: "oneplus", name: "OnePlus", tagline: "Never Settle", color: "#EB0028", phoneCount: 30, logo: brandLogos.OnePlus },
  { id: "motorola", name: "Motorola", tagline: "Hello Moto", color: "#5C2D91", phoneCount: 30, logo: brandLogos.Motorola },
  { id: "nokia", name: "Nokia", tagline: "Connecting People", color: "#124191", phoneCount: 30, logo: brandLogos.Nokia },
  { id: "google", name: "Google", tagline: "Made By Google", color: "#4285F4", phoneCount: 30, logo: brandLogos.Google },
  { id: "huawei", name: "Huawei", tagline: "Make It Possible", color: "#CF0A2C", phoneCount: 30, logo: brandLogos.Huawei },
  { id: "tecno", name: "Tecno", tagline: "Stop At Nothing", color: "#0071CE", phoneCount: 30, logo: brandLogos.Tecno },
  { id: "infinix", name: "Infinix", tagline: "The Future Is Now", color: "#F37021", phoneCount: 30, logo: brandLogos.Infinix },
  { id: "iqoo", name: "iQOO", tagline: "Monster Inside", color: "#FF4500", phoneCount: 30, logo: brandLogos.iQOO },
  { id: "nothing", name: "Nothing", tagline: "Pure Instinct", color: "#D7D7D7", phoneCount: 30, logo: brandLogos.Nothing },
];
