import { Deal } from "./deal.model";

export type LeadStatus = "New" | "Contacted" | "Qualified" | "Lost";

export const LEAD_STATUSES: LeadStatus[] = [
  "New",
  "Contacted",
  "Qualified",
  "Lost",
];

export const LEAD_SOURCES = [
  "Email",
  "Referral",
  "Social",
  "Website",
  "Other",
];

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  source: string | null;
  status: LeadStatus;
  deals: Deal[];
}

export interface LeadRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  source: string | null;
  status: LeadStatus;
}
