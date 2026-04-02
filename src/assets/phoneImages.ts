// Brand logos
import samsungLogo from './brands/samsung-logo.png';
import appleLogo from './brands/apple-logo.png';
import xiaomiLogo from './brands/xiaomi-logo.png';
import oppoLogo from './brands/oppo-logo.png';
import vivoLogo from './brands/vivo-logo.png';
import realmeLogo from './brands/realme-logo.png';
import oneplusLogo from './brands/oneplus-logo.png';
import motorolaLogo from './brands/motorola-logo.png';
import nokiaLogo from './brands/nokia-logo.png';
import googleLogo from './brands/google-logo.png';
import huaweiLogo from './brands/huawei-logo.png';
import tecnoLogo from './brands/tecno-logo.png';
import infinixLogo from './brands/infinix-logo.png';
import iqooLogo from './brands/iqoo-logo.png';
import nothingLogo from './brands/nothing-logo.png';

// Phone images - flagship
import samsungFlagship from './phones/samsung-flagship.jpg';
import appleFlagship from './phones/apple-flagship.jpg';
import xiaomiFlagship from './phones/xiaomi-flagship.jpg';
import oppoFlagship from './phones/oppo-flagship.jpg';
import vivoFlagship from './phones/vivo-flagship.jpg';
import realmeFlagship from './phones/realme-flagship.jpg';
import oneplusFlagship from './phones/oneplus-flagship.jpg';
import motorolaFlagship from './phones/motorola-flagship.jpg';
import nokiaFlagship from './phones/nokia-flagship.jpg';
import googleFlagship from './phones/google-flagship.jpg';
import huaweiFlagship from './phones/huawei-flagship.jpg';
import tecnoFlagship from './phones/tecno-flagship.jpg';
import infinixFlagship from './phones/infinix-flagship.jpg';
import iqooFlagship from './phones/iqoo-flagship.jpg';
import nothingFlagship from './phones/nothing-flagship.jpg';

// Phone images - budget
import samsungBudget from './phones/samsung-budget.jpg';
import appleBudget from './phones/apple-budget.jpg';
import xiaomiBudget from './phones/xiaomi-budget.jpg';
import oppoBudget from './phones/oppo-budget.jpg';
import vivoBudget from './phones/vivo-budget.jpg';
import realmeBudget from './phones/realme-budget.jpg';
import oneplusBudget from './phones/oneplus-budget.jpg';
import motorolaBudget from './phones/motorola-budget.jpg';
import nokiaBudget from './phones/nokia-budget.jpg';
import googleBudget from './phones/google-budget.jpg';
import huaweiBudget from './phones/huawei-budget.jpg';
import tecnoBudget from './phones/tecno-budget.jpg';
import infinixBudget from './phones/infinix-budget.jpg';
import iqooBudget from './phones/iqoo-budget.jpg';
import nothingBudget from './phones/nothing-budget.jpg';

export const brandLogos: Record<string, string> = {
  Samsung: samsungLogo,
  Apple: appleLogo,
  Xiaomi: xiaomiLogo,
  OPPO: oppoLogo,
  Vivo: vivoLogo,
  Realme: realmeLogo,
  OnePlus: oneplusLogo,
  Motorola: motorolaLogo,
  Nokia: nokiaLogo,
  Google: googleLogo,
  Huawei: huaweiLogo,
  Tecno: tecnoLogo,
  Infinix: infinixLogo,
  iQOO: iqooLogo,
  Nothing: nothingLogo,
};

export const phoneImages: Record<string, { flagship: string; budget: string }> = {
  Samsung: { flagship: samsungFlagship, budget: samsungBudget },
  Apple: { flagship: appleFlagship, budget: appleBudget },
  Xiaomi: { flagship: xiaomiFlagship, budget: xiaomiBudget },
  OPPO: { flagship: oppoFlagship, budget: oppoBudget },
  Vivo: { flagship: vivoFlagship, budget: vivoBudget },
  Realme: { flagship: realmeFlagship, budget: realmeBudget },
  OnePlus: { flagship: oneplusFlagship, budget: oneplusBudget },
  Motorola: { flagship: motorolaFlagship, budget: motorolaBudget },
  Nokia: { flagship: nokiaFlagship, budget: nokiaBudget },
  Google: { flagship: googleFlagship, budget: googleBudget },
  Huawei: { flagship: huaweiFlagship, budget: huaweiBudget },
  Tecno: { flagship: tecnoFlagship, budget: tecnoBudget },
  Infinix: { flagship: infinixFlagship, budget: infinixBudget },
  iQOO: { flagship: iqooFlagship, budget: iqooBudget },
  Nothing: { flagship: nothingFlagship, budget: nothingBudget },
};

export function getPhoneImage(brand: string, price: number): string {
  const images = phoneImages[brand];
  if (!images) return phoneImages.Samsung.flagship;
  return price > 25000 ? images.flagship : images.budget;
}
