/**
 * Icon Component Registry
 * Maps icon names from WordPress to actual React components
 */

import {
  BellIcon,
  BrainIcon,
  CalendarIcon,
  ClockIcon,
  CloudIcon,
  UsersIcon,
  ShieldIcon,
  SparklesIcon,
  RocketIcon,
  ZapIcon,
  BookmarkIcon,
  TargetIcon,
  LayersIcon,
  TabletIcon,
  ComponentIcon,
  StarIcon,
  MessageCircleIcon,
  GlobeIcon,
  SettingsIcon,
  ListIcon,
  HeartIcon,
  CheckIcon,
  ArrowRightIcon,
  ChevronRightIcon,
} from "lucide-react";
import type { IconName } from "@next-wp/content-schema";

// Icon component mapping
const iconMap = {
  brain: BrainIcon,
  clock: ClockIcon,
  calendar: CalendarIcon,
  cloud: CloudIcon,
  users: UsersIcon,
  bell: BellIcon,
  shield: ShieldIcon,
  sparkles: SparklesIcon,
  rocket: RocketIcon,
  zap: ZapIcon,
  bookmark: BookmarkIcon,
  target: TargetIcon,
  layers: LayersIcon,
  tablet: TabletIcon,
  component: ComponentIcon,
  star: StarIcon,
  message: MessageCircleIcon,
  globe: GlobeIcon,
  settings: SettingsIcon,
  list: ListIcon,
  heart: HeartIcon,
  check: CheckIcon,
  "arrow-right": ArrowRightIcon,
  "chevron-right": ChevronRightIcon,
  none: null,
} as const;

// Props interface for icon components
interface IconProps {
  className?: string;
  size?: number;
  strokeWidth?: number;
}

// Default icon props
const defaultIconProps: IconProps = {
  className: "h-6 w-6",
  strokeWidth: 2,
};

/**
 * Get icon component by name
 */
export function getIconComponent(iconName: IconName | undefined): React.ComponentType<IconProps> | null {
  if (!iconName || iconName === "none") {
    return null;
  }
  
  return iconMap[iconName] || null;
}

/**
 * Render icon component with props
 */
export function renderIcon(iconName: IconName | undefined, props: IconProps = {}) {
  const IconComponent = getIconComponent(iconName);
  
  if (!IconComponent) {
    return null;
  }
  
  const mergedProps = { ...defaultIconProps, ...props };
  
  return <IconComponent {...mergedProps} />;
}

/**
 * Icon component that accepts name as prop
 */
interface DynamicIconProps extends IconProps {
  name: IconName | undefined;
}

export function DynamicIcon({ name, ...props }: DynamicIconProps) {
  return renderIcon(name, props);
}

// Export all available icon names for reference
export const availableIcons: IconName[] = Object.keys(iconMap) as IconName[];

// Export icon map for external use
export { iconMap };
