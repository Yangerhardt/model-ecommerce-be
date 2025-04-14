export interface UserAddress {
  userId?: string;
  id: string;
  firstName: string;
  lastName: string;
  zip: string;
  address1: string;
  address2?: string;
  city: string;
  province: string;
  phoneNumber: string;
  neighborhood?: string;
}
