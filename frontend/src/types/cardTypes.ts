export type CardType = "youtube" | "twitter" | "instagram" | "note" | "music" | "link";

export interface CardProps {
  title: string;
  link: string;
  type: CardType;
  createdAt?: string;
  description?: string;
  onDelete?: () => void;
}