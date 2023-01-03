import ReviewStatistics from 'types/ReviewStatistics';

type BriefText = {
  id: string;
  title: string;
  abstract: string;
  authorId: string;
  authorDisplayName: string;
  price: number;
  numberOfSales: number;
  numberOfReviews: number;
  updatedAt: string;
  isReleased: boolean;
  isBestSeller: boolean;
  reviewStatistics: ReviewStatistics;
};

export default BriefText;
