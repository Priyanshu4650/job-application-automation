export const AtsType = {
  GREENHOUSE: 'greenhouse',
  LEVER: 'lever',
  WORKDAY: 'workday',
  CUSTOM: 'custom',
  UNKNOWN: 'unknown',
} as const;

export type AtsType = typeof AtsType[keyof typeof AtsType];

export interface Company {
  id: string;
  name: string;
  careerPageUrl: string;
  atsType: AtsType;
  active: boolean;
  createdAt: string;
}

export interface CreateCompanyDto {
  name: string;
  careerPageUrl: string;
  atsType: AtsType;
  active?: boolean;
}

export interface UpdateCompanyDto {
  name?: string;
  careerPageUrl?: string;
  atsType?: AtsType;
  active?: boolean;
}