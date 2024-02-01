export interface AddProductFormInputs {
  name: string;
  reference?: string;
  company?: string;
  category?: string;
  retailPercentage: number;
  wholesalePercentage: number;
  retailPrice: number;
  wholesalePrice: number;
  stock: number;
  thumbnail?: File | string | null;
  currentShipmentId?: string;
  unitPrice?: number;
}
