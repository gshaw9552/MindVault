import { Card } from "./Card";
import { ContentItem } from "../hooks/useContent";

interface ContentGridProps {
  items: ContentItem[];
  onDelete: (id: string) => void;
}

export function ContentGrid({ items, onDelete }: ContentGridProps) {
  return (
    <div className="flex flex-wrap gap-8 justify-center">
      {items.map((item) => (
        <div key={item._id} className="relative">
          <Card
            title={item.title}
            link={item.link}
            type={item.type}
            onDelete={() => onDelete(item._id)}
          />
        </div>
      ))}
    </div>
  );
}
