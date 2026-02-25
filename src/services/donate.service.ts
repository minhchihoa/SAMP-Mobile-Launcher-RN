import { URL_DONATE_API } from '@env';
import axios from 'axios';

export const DonateService = {
  async get() {
    try {
      const response = await axios.get<DonateResponseType>(URL_DONATE_API);
      return response.data;
    } catch (error) {
      console.error('Error fetching donates:', error);
      return [[], []]; // Return empty arrays on error to prevent crashes
    }
  },
};

export type DonateResponseType = {
  [0]: DonateType[];
  [1]: DonateCategoriesType[];
};

export type DonateType = {
  id: number;
  title: string;
  image: string;
  category_id: number;
  price: number;
  price_scont: null | number;
  count: null | number;
  sort: null | number;
  donate: number;
  money: number;
  random_car: number;
  random_skin: number;
  random_accessoaries: number;
  accessoaries: number;
  car: number;
  skin: number;
  trailer: null | number;
  licenses: string;
  weapon_skill: string;
  pay_day_x2: number;
  job_x2: number;
  mini_job_x2: number;
  donate_x2: number;
  tag: number;
  published: number;
};

export type DonateCategoriesType = {
  id: number;
  title: string;
  sort: number;
  published: number;
};
