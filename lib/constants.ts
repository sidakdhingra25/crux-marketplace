// Framework constants for the marketplace
export const VALID_FRAMEWORKS = ['qbcore', 'qbox', 'esx', 'ox', 'standalone'] as const;
export type ValidFramework = typeof VALID_FRAMEWORKS[number];

// Framework display names
export const FRAMEWORK_LABELS: Record<ValidFramework, string> = {
  qbcore: 'QBCore',
  qbox: 'Qbox', 
  esx: 'ESX',
  ox: 'OX',
  standalone: 'Standalone'
};

// Helper function to validate frameworks
export function validateFrameworks(frameworks: string[]): ValidFramework[] {
  return frameworks.filter(framework => 
    VALID_FRAMEWORKS.includes(framework as ValidFramework)
  ) as ValidFramework[];
}

// Helper function to check if framework is valid
export function isValidFramework(framework: string): framework is ValidFramework {
  return VALID_FRAMEWORKS.includes(framework as ValidFramework);
}

// Get all frameworks for forms
export const FRAMEWORK_OPTIONS = VALID_FRAMEWORKS.map(framework => ({
  value: framework,
  label: FRAMEWORK_LABELS[framework]
}));
