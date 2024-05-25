export interface IBook {

  title: string;
  authors: string[];
  rating: Rating;
  yearOfPublication?: number;
  isbn?: string;
  coverUrl?: string;
}

export type Rating = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
