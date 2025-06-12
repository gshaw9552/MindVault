import { Card } from "./Card";
import { ContentItem } from "../hooks/useContent";

interface ContentGridProps {
  items: ContentItem[];
  onDelete: (id: string) => void;
}

export function ContentGrid({ items, onDelete }: ContentGridProps) {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-4 py-6">
      {items.map((item) => (
        <div key={item._id} className="relative">
          <Card
            title={item.title}
            link={item.link}
            type={item.type}
            description={item.description}
            createdAt={item.createdAt}
            onDelete={() => onDelete(item._id)}
          />
        </div>
      ))}
    </div>
  );
}
