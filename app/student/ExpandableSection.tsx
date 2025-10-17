'use client';

import { useState, Children, cloneElement, isValidElement } from 'react';

interface ExpandableSectionProps {
  title: string;
  children: React.ReactNode;
  initialLimit?: number;
  totalCount: number;
}

export default function ExpandableSection({ title, children, initialLimit = 3, totalCount }: ExpandableSectionProps) {
  const [showAll, setShowAll] = useState(false);
  
  const childrenArray = Children.toArray(children);
  const visibleChildren = showAll ? childrenArray : childrenArray.slice(0, initialLimit);

  return (
    <div className="border rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        {totalCount > initialLimit && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {showAll ? 'Show Less' : `Show More (${totalCount - initialLimit})`}
          </button>
        )}
      </div>
      <div className="space-y-3">
        {visibleChildren}
      </div>
    </div>
  );
}