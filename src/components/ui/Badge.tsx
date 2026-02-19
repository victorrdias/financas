import { CATEGORY_COLORS, CATEGORY_LABELS, type ExpenseCategory } from '../../types';

interface BadgeProps {
  category: ExpenseCategory;
}

export function Badge({ category }: BadgeProps) {
  const { bg, text } = CATEGORY_COLORS[category];
  return (
    <span
      className="badge"
      style={{ backgroundColor: bg, color: text }}
    >
      {CATEGORY_LABELS[category]}
    </span>
  );
}
