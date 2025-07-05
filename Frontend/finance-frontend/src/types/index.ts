// Declare the enum separately
export enum Category {
  Food = "Food",
  Rent = "Rent",
  Utilities = "Utilities",
  Travel = "Travel",
  Entertainment = "Entertainment",
}
export const CategoryOptions = Object.values(Category);

// Use it in the interface
export interface Transaction {
  _id?: string;
  amount: number;
  date: string;
  description: string;
  category: Category;
}
