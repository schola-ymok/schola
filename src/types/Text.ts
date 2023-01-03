import ReviewStatistics from 'types/ReviewStatistics';

type Text = {
  id: string;
  title: string;
  abstract: string;
  authorId: string;
  authorDisplayName: string;
  price: number;
  numberOfSales: number;
  numberOfReviews: number;
  createdAt: Date;
  updatedAt: string;
  numberOfUpdated: number;
  category1: number;
  category2: number;
  chapterOrder: string[];
  learningContents: string[];
  learningRequirements: string[];
  isReleased: boolean;
  isBestSeller: boolean;
  reviewStatistics: ReviewStatistics;
};

export default Text;
