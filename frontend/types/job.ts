export interface Experience {
  min: number;
  max: number;
  _id: string;
}

export interface JobDocument {
  _id: string;
  url: string;
  __v: number;
  company: string;
  createdAt: string;
  description: string;
  discoveredAt: string;
  experience: Experience;
  location: string;
  maxExperience: number;
  minExperience: number;
  postedAt: string | null;
  rawHTML: string;
  source: string;
  sourceId: string;
  tags: string[];
  title: string;
  updatedAt: string;
}
