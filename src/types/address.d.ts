export interface UserAddress {
  userId?: string;
  id: string;
  zip: string;
  address1: string;
  address2?: string;
  city: string;
  province: string;
  phoneNumber: string;
  neighborhood?: string;
}
