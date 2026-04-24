import type { Location } from '../types';

const LOCATIONS: { value: Location; label: string; icon: React.ReactNode }[] = [
  {
    value: 'McKeldin Library',
    label: 'McKeldin Library',
    icon: <LibraryIcon />,
  },
  {
    value: 'STAMP',
    label: 'STAMP',
    icon: <UnionIcon />,
  },
  {
    value: 'Van Munching',
    label: 'Van Munching',
    icon: <BuildingIcon />,
  },
  {
    value: 'Clarice',
    label: 'Clarice',
    icon: <ArtsIcon />,
  },
  {
    value: 'IRIBE',
    label: 'IRIBE',
    icon: <TechIcon />,
  },
];

interface LocationFilterBarProps {
  selectedLocation: Location | null;
  onSelectLocation: (location: Location | null) => void;
}

export default function LocationFilterBar({
  selectedLocation,
  onSelectLocation,
}: LocationFilterBarProps) {
  function handleClick(location: Location) {
    onSelectLocation(selectedLocation === location ? null : location);
  }

  return (
    <div className="flex items-center gap-6 px-6 py-3 bg-white border-b border-gray-200 overflow-x-auto">
      <span
        className="text-xs font-semibold tracking-widest text-gray-500 whitespace-nowrap"
        style={{ fontFamily: 'system-ui, sans-serif' }}
      >
        FILTER BY PICKUP LOCATION:
      </span>

      <div className="flex items-center gap-3">
        {LOCATIONS.map(({ value, label, icon }) => {
          const isActive = selectedLocation === value;
          return (
            <LocationChip
              key={value}
              label={label}
              icon={icon}
              isActive={isActive}
              onClick={() => handleClick(value)}
            />
          );
        })}
      </div>
    </div>
  );
}

interface LocationChipProps {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

function LocationChip({ label, icon, isActive, onClick }: LocationChipProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
      style={{
        backgroundColor: isActive ? '#E05353' : 'transparent',
        color: isActive ? '#fff' : '#374151',
        border: isActive ? '2px solid #E05353' : '2px solid #e5e7eb',
        fontFamily: 'system-ui, sans-serif',
        cursor: 'pointer',
        minWidth: '72px',
      }}
    >
      <span style={{ color: isActive ? '#fff' : '#6b7280' }}>{icon}</span>
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
}

function LibraryIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}

function UnionIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
    </svg>
  );
}

function ArtsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
    </svg>
  );
}

function TechIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
    </svg>
  );
}
