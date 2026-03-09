export interface EducationField {
  label: string;
  value: string;
}

export interface EducationEntryData {
  level: string;
  title: string;
  institution: string;
  years: string;
  withHonor?: boolean;
  fields: EducationField[];
}
