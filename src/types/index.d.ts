export interface Resume {
  id: string;
  companyName?: string;
  jobTitle?: string;
  imagePath: string;
  resumePath: string;
  feedback: Feedback;
}

export interface FeedbackTip {
  type: "good" | "improve";
  tip: string;
}

export interface FeedbackTipWithExplanation extends FeedbackTip {
  explanation: string;
}

export interface FeedbackCategory {
  score: number;
  tips: FeedbackTipWithExplanation[];
}

export interface Feedback {
  overallScore: number;
  ATS: {
    score: number;
    tips: FeedbackTip[];
  };
  toneAndStyle: FeedbackCategory;
  content: FeedbackCategory;
  structure: FeedbackCategory;
  skills: FeedbackCategory;
}
