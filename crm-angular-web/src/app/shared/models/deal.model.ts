export type DealStage =
  | "Prospecting"
  | "Proposal"
  | "Negotiation"
  | "ClosedWon"
  | "ClosedLost";

export const DEAL_STAGES: DealStage[] = [
  "Prospecting",
  "Proposal",
  "Negotiation",
  "ClosedWon",
  "ClosedLost",
];

export const DEAL_STAGE_LABELS: Record<DealStage, string> = {
  Prospecting: "Prospecting",
  Proposal: "Proposal",
  Negotiation: "Negotiation",
  ClosedWon: "Closed Won",
  ClosedLost: "Closed Lost",
};

export interface Deal {
  id: string;
  title: string;
  value: number;
  closeDate: string | null;
  stage: DealStage;
  leadId: string;
}

export interface DealRequest {
  title: string;
  value: number;
  closeDate: string | null;
  stage: DealStage;
  leadId: string;
}
