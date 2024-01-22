export interface AddProductFormInputs {
  name: string;
  reference?: string;
  company?: string;
  category?: string;
  retailPrice?: number;
  wholesalePrice?: number;
  stock?: number;
  thumbnail?: File | string | null;
}
