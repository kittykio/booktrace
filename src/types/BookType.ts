export type BookType = {
  id: string;
  title: string;
  author: string;
  price: string;
  publisher: string;
  published: string;
  image: string;
  read?: Date;
  memo?: string;
};

export interface BookData {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    publishedDate?: string;
    description?: string;
    publisher?: string;
    imageLinks?: {
      smallThumbnail: string;
      thumbnail: string;
    };
    pageCount: number;
    previewLink?: string;
  };
  saleInfo?: {
    listPrice: {
      amount: number;
      currencyCode: string;
    };
  };
}

export interface Result {
  items: BookData[];
  kind: string;
  totalItems: number;
}
