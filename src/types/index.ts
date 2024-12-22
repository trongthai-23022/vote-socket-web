export interface Vote {
  id: string;
  voterName: string;
  optionId: string;
  createdAt: Date;
}

export interface VoteResult {
  voterName: string;
  selectedOption: string;
  votedAt: string;
}

export interface Option {
  id: string;
  option: string;
  votes: number;
  voteId: string;
}

export interface VoteData {
  id: string;
  title: string;
  options: Option[];
} 