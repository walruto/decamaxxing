export interface ClusterColors {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  gradient: string;
  bgLight: string;
  text: string;
  border: string;
}

export const CLUSTER_COLORS: Record<string, ClusterColors> = {
  'Entrepreneurship': {
    primary: 'orange-600',
    primaryDark: 'orange-700',
    primaryLight: 'orange-500',
    gradient: 'from-orange-900 to-amber-900',
    bgLight: 'orange-50',
    text: 'orange-600',
    border: 'orange-200',
  },
  'Marketing': {
    primary: 'blue-600',
    primaryDark: 'blue-700',
    primaryLight: 'blue-500',
    gradient: 'from-blue-900 to-indigo-900',
    bgLight: 'blue-50',
    text: 'blue-600',
    border: 'blue-200',
  },
  'Finance': {
    primary: 'green-600',
    primaryDark: 'green-700',
    primaryLight: 'green-500',
    gradient: 'from-green-900 to-emerald-900',
    bgLight: 'green-50',
    text: 'green-600',
    border: 'green-200',
  },
  'Hospitality': {
    primary: 'purple-600',
    primaryDark: 'purple-700',
    primaryLight: 'purple-500',
    gradient: 'from-purple-900 to-violet-900',
    bgLight: 'purple-50',
    text: 'purple-600',
    border: 'purple-200',
  },
  'Business Admin': {
    primary: 'red-600',
    primaryDark: 'red-700',
    primaryLight: 'red-500',
    gradient: 'from-red-900 to-rose-900',
    bgLight: 'red-50',
    text: 'red-600',
    border: 'red-200',
  },
};

export function getClusterColors(cluster: string): ClusterColors {
  return CLUSTER_COLORS[cluster] || CLUSTER_COLORS['Entrepreneurship'];
}
