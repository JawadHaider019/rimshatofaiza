export interface QuotePair {
  quote1: string;
  quote2: string;
}

export interface BirthdayData {
  pages: QuotePair[];
}

export type WordColor = 'white' | 'yellow' | 'red' | 'lightblue' | 'neongreen'| 'orange'| 'blue' | 'purple' | 'green' | 'pink';

export interface StyledWord {
  text: string;
  color: string;
  id: string;
  isNewLine?: boolean;
}