import { Dispatch, SetStateAction } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export type TabOption = {
  id: string;
  label: string;
};

export type TabStyleVariant = 'admin' | 'manager' | 'engineer' | 'custom';

interface TabButtonsProps {
  tabs: TabOption[];
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<any>>;
  className?: string;
  styleVariant?: TabStyleVariant;
}

export function TabButtons({
  tabs,
  activeTab,
  setActiveTab,
  className,
}: TabButtonsProps) {
  const getButtonStyles = (tabId: string, index: number) => {
    const isActive = activeTab === tabId;
    const marginRight = index < tabs.length - 1 ? 'mr-2' : '';

    // Base styles that apply to all variants
    const baseStyles = cn('flex-1', marginRight);

    return cn(
      baseStyles,
      isActive
        ? 'bg-[#00BFFF] text-[#111828] font-semibold tracking-[2px] hover:bg-[#00BFFF]/80'
        : 'bg-gray-700 text-text-primary font-semibold tracking-[2px] hover:bg-gray-600'
    );
  };

  return (
    <div
      className={cn(
        'flex bg-transparent rounded-t-md justify-center items-center p-2 border border-gray-700',
        className
      )}
    >
      {tabs.map((tab, index) => (
        <Button
          key={tab.id}
          variant={activeTab === tab.id ? 'default' : 'secondary'}
          className={getButtonStyles(tab.id, index)}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </Button>
      ))}
    </div>
  );
}
