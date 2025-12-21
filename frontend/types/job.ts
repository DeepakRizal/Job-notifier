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
  source: string;
  sourceId: string;
  tags: string[];
  title: string;
  updatedAt: string;
}

export interface JobDetail {
  _id: string;
  title: string;
  company: string;
  location: string;

  description: string;

  experience?: {
    min: number;
    max: number;
  };

  minExperience?: number;
  maxExperience?: number;

  tags: string[];

  postedAt: string;
  source?: string;
  url: string;
}

export interface JobDetailResponse {
  success: boolean;
  job: JobDetail;
}
