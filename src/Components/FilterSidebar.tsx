/*
Component Description:
- Sidebar used on the Catalog page to filter products.
- Includes controls for category, size, and pickup location to narrow down results.
*/

import { useState } from 'react';

const CATEGORIES = ['Tops', 'Bottoms', 'Accessories'] as const;
type CategoryOption = typeof CATEGORIES[number];

interface CatalogSidebarProps {
  selectedGender: 'Men' | 'Women' | null;
  selectedCategory: string | null;
  onSelectGender: (gender: 'Men' | 'Women' | null) => void;
  onSelectCategory: (category: string | null) => void;
}

export default function CatalogSidebar({
  selectedGender,
  selectedCategory,
  onSelectGender,
  onSelectCategory,
}: CatalogSidebarProps) {
  return (
    <aside
      className="bg-white border-r border-gray-200 p-5 shrink-0"
      style={{ width: '220px', minHeight: 'calc(100vh - 112px)', fontFamily: 'system-ui, sans-serif' }}
    >
      <SidebarCategorySection
        selectedGender={selectedGender}
        selectedCategory={selectedCategory}
        onSelectGender={onSelectGender}
        onSelectCategory={onSelectCategory}
      />
    </aside>
  );
}

interface SidebarCategorySectionProps {
  selectedGender: 'Men' | 'Women' | null;
  selectedCategory: string | null;
  onSelectGender: (gender: 'Men' | 'Women' | null) => void;
  onSelectCategory: (category: string | null) => void;
}

function SidebarCategorySection({
  selectedGender,
  selectedCategory,
  onSelectGender,
  onSelectCategory,
}: SidebarCategorySectionProps) {
  return (
    <div>
      <p
        className="text-xs font-bold tracking-widest text-gray-400 mb-3"
        style={{ letterSpacing: '0.12em' }}
      >
        CATEGORY
      </p>

      <GenderGroup
        gender="Men"
        selectedGender={selectedGender}
        selectedCategory={selectedCategory}
        onSelectGender={onSelectGender}
        onSelectCategory={onSelectCategory}
      />

      <GenderGroup
        gender="Women"
        selectedGender={selectedGender}
        selectedCategory={selectedCategory}
        onSelectGender={onSelectGender}
        onSelectCategory={onSelectCategory}
      />
    </div>
  );
}

interface GenderGroupProps {
  gender: 'Men' | 'Women';
  selectedGender: 'Men' | 'Women' | null;
  selectedCategory: string | null;
  onSelectGender: (gender: 'Men' | 'Women' | null) => void;
  onSelectCategory: (category: string | null) => void;
}

function GenderGroup({
  gender,
  selectedGender,
  selectedCategory,
  onSelectGender,
  onSelectCategory,
}: GenderGroupProps) {
  const isExpanded = useState(true);
  const [expanded, setExpanded] = isExpanded;
  const isGenderActive = selectedGender === gender;

  function handleGenderClick() {
    setExpanded(!expanded);
    if (isGenderActive) {
      onSelectGender(null);
      onSelectCategory(null);
    } else {
      onSelectGender(gender);
    }
  }

  function handleCategoryClick(category: CategoryOption) {
    if (selectedGender === gender && selectedCategory === category) {
      onSelectCategory(null);
    } else {
      onSelectGender(gender);
      onSelectCategory(category);
    }
  }

  return (
    <div className="mb-2">
      <button
        onClick={handleGenderClick}
        className="flex items-center justify-between w-full py-2 text-sm text-left"
        style={{
          fontWeight: isGenderActive ? '700' : '500',
          color: isGenderActive ? '#E05353' : '#111827',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '6px 0',
        }}
      >
        <span>{gender}</span>
        <ChevronIcon expanded={expanded} />
      </button>

      {expanded && (
        <ul className="pl-4 mt-1 space-y-1">
          {CATEGORIES.map((category) => {
            const isActive = isGenderActive && selectedCategory === category;
            return (
              <CategoryItem
                key={category}
                label={category}
                isActive={isActive}
                onClick={() => handleCategoryClick(category)}
              />
            );
          })}
        </ul>
      )}
    </div>
  );
}

interface CategoryItemProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function CategoryItem({ label, isActive, onClick }: CategoryItemProps) {
  return (
    <li>
      <button
        onClick={onClick}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px 0',
          fontSize: '0.875rem',
          fontWeight: isActive ? '700' : '400',
          color: isActive ? '#E05353' : '#374151',
          textDecoration: isActive ? 'underline' : 'none',
          textUnderlineOffset: '3px',
        }}
      >
        {label}
      </button>
    </li>
  );
}

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      style={{
        transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform 150ms',
        color: '#9ca3af',
      }}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}
