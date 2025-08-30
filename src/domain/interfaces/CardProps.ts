export interface CardImage {
  src: string;
  alt: string;
  loading?: "lazy" | "eager";
}

export interface CardSlots {
  header?: boolean;
  content?: boolean;
  footer?: boolean;
}

export interface CardProps {
  title?: string;
  subtitle?: string;
  content?: string;
  image?: CardImage;
  variant: "default" | "featured" | "minimal";
  className?: string;
  slots?: CardSlots;
}