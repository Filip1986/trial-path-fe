import {
  Gender,
  Ethnicity,
  Race,
  BloodType,
  MaritalStatus,
  EducationLevel,
  Relationship,
  Country,
  RandomizationGroup,
} from '../../models/interfaces';

export const GENDERS: Gender[] = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Non-binary', value: 'non_binary' },
  { label: 'Prefer not to answer', value: 'prefer_not_to_answer' },
];

export const ETHNICITIES: Ethnicity[] = [
  { label: 'Hispanic or Latino', value: 'hispanic_latino' },
  { label: 'Not Hispanic or Latino', value: 'not_hispanic_latino' },
  { label: 'Unknown', value: 'unknown' },
];

export const RACES: Race[] = [
  { label: 'White', value: 'white' },
  { label: 'Black or African American', value: 'black_african_american' },
  { label: 'Asian', value: 'asian' },
  { label: 'American Indian or Alaska Native', value: 'american_indian_alaska_native' },
  { label: 'Native Hawaiian or Other Pacific Islander', value: 'native_hawaiian_pacific_islander' },
  { label: 'Other', value: 'other' },
];

export const BLOOD_TYPES: BloodType[] = [
  { label: 'A+', value: 'a_positive' },
  { label: 'A-', value: 'a_negative' },
  { label: 'B+', value: 'b_positive' },
  { label: 'B-', value: 'b_negative' },
  { label: 'AB+', value: 'ab_positive' },
  { label: 'AB-', value: 'ab_negative' },
  { label: 'O+', value: 'o_positive' },
  { label: 'O-', value: 'o_negative' },
  { label: 'Unknown', value: 'unknown' },
];

export const MARITAL_STATUSES: MaritalStatus[] = [
  { label: 'Single', value: 'single' },
  { label: 'Married', value: 'married' },
  { label: 'Divorced', value: 'divorced' },
  { label: 'Widowed', value: 'widowed' },
  { label: 'Separated', value: 'separated' },
  { label: 'Domestic Partnership', value: 'domestic_partnership' },
];

export const EDUCATION_LEVELS: EducationLevel[] = [
  { label: 'Less than High School', value: 'less_than_high_school' },
  { label: 'High School Diploma/GED', value: 'high_school_ged' },
  { label: 'Some College', value: 'some_college' },
  { label: 'Associate Degree', value: 'associate_degree' },
  { label: "Bachelor's Degree", value: 'bachelors_degree' },
  { label: "Master's Degree", value: 'masters_degree' },
  { label: 'Doctoral Degree', value: 'doctoral_degree' },
  { label: 'Professional Degree', value: 'professional_degree' },
];

export const RANDOMIZATION_GROUPS: RandomizationGroup[] = [
  { label: 'Treatment Group A', value: 'treatment_a' },
  { label: 'Treatment Group B', value: 'treatment_b' },
  { label: 'Control Group', value: 'control' },
  { label: 'Placebo Group', value: 'placebo' },
];

export const RELATIONSHIPS: Relationship[] = [
  { label: 'Spouse', value: 'spouse' },
  { label: 'Parent', value: 'parent' },
  { label: 'Child', value: 'child' },
  { label: 'Sibling', value: 'sibling' },
  { label: 'Friend', value: 'friend' },
  { label: 'Other', value: 'other' },
];

export const COUNTRIES: Country[] = [
  { label: 'United States', value: 'US' },
  { label: 'Canada', value: 'CA' },
  { label: 'United Kingdom', value: 'UK' },
  { label: 'Germany', value: 'DE' },
  { label: 'France', value: 'FR' },
  { label: 'Other', value: 'other' },
];
