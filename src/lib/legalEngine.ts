export type MatterType =
  "consumer" | "family" | "property" | "cyber" | "employment" | "motor" | "cheque" | "criminal";

export interface AnalysisData {
  laws: string[];
  forum: string;
  docs: string[];
  steps: string[];
  outcomes: string[];
  question: string;
}

export const matterData: Record<MatterType, AnalysisData> = {
  consumer: {
    laws: ["Consumer Protection Act, 2019", "Indian Contract Act, 1872"],
    forum: "District Consumer Commission",
    docs: [
      "Invoice or bill",
      "Warranty or service papers",
      "Emails or chat screenshots",
      "Complaint copy",
    ],
    steps: [
      "Collect purchase records and photos.",
      "Record the defect or service failure.",
      "Send a written complaint or notice.",
    ],
    outcomes: [
      "Refund or replacement may be possible.",
      "Mediation or settlement may be suggested.",
      "A consumer complaint may be filed in the appropriate commission.",
    ],
    question: "What did you buy, what went wrong, and what proof do you have?",
  },
  family: {
    laws: [
      "Hindu Marriage Act, 1955",
      "Special Marriage Act, 1954",
      "Protection of Women from Domestic Violence Act, 2005",
    ],
    forum: "Family Court",
    docs: [
      "Marriage certificate",
      "Messages or notices",
      "Medical or financial records",
      "Children's documents if relevant",
    ],
    steps: [
      "Write a clear timeline of events.",
      "Preserve messages and records.",
      "Speak to an advocate for forum-specific advice.",
    ],
    outcomes: [
      "Mediation may be directed first.",
      "Interim relief or protection orders may be considered.",
      "Maintenance, custody, or divorce issues may be heard in Family Court.",
    ],
    question: "What family issue are you facing, and what dates or notices matter most?",
  },
  property: {
    laws: [
      "Transfer of Property Act, 1882",
      "Specific Relief Act, 1963",
      "Rent Control law or state tenancy law",
    ],
    forum: "Civil Court or Rent Controller",
    docs: ["Rent agreement", "Ownership papers", "Notice letters", "Photos or possession records"],
    steps: [
      "Confirm the property status and location.",
      "Check whether a legal notice was sent.",
      "Keep all receipts and messages.",
    ],
    outcomes: [
      "Notice and reply process may be relevant.",
      "Injunction or eviction-related relief may be discussed.",
      "A civil suit or rent proceeding may be appropriate.",
    ],
    question: "Is this a tenancy, ownership, possession, or eviction issue?",
  },
  cyber: {
    laws: ["Information Technology Act, 2000", "Bharatiya Nyaya Sanhita, 2023"],
    forum: "Cyber Police or Criminal Court",
    docs: [
      "Screenshots",
      "Transaction records",
      "UPI or bank details",
      "Complaint reference number",
    ],
    steps: [
      "Preserve all digital evidence.",
      "Report the issue quickly.",
      "Change passwords and secure accounts.",
    ],
    outcomes: [
      "Police report or cyber complaint may be needed.",
      "Bank reversal or account freezing steps may matter.",
      "Further criminal procedure may follow.",
    ],
    question: "Was this fraud, harassment, impersonation, or account misuse?",
  },
  employment: {
    laws: ["Industrial Disputes Act, 1947", "Indian Contract Act, 1872", "State labour laws"],
    forum: "Labour Court or Industrial Tribunal",
    docs: ["Appointment letter", "Payslips", "Termination notice", "Email or HR communication"],
    steps: [
      "Collect employment records.",
      "Check notice and termination terms.",
      "Document salary or service issues.",
    ],
    outcomes: [
      "Back wages or settlement may be discussed.",
      "Conciliation may be attempted.",
      "Labour dispute or service claim may arise.",
    ],
    question: "Is this about termination, salary, harassment, or service benefits?",
  },
  motor: {
    laws: ["Motor Vehicles Act, 1988", "Bharatiya Nyaya Sanhita, 2023"],
    forum: "MACT or Criminal Court",
    docs: ["FIR or accident report", "Medical records", "Vehicle papers", "Insurance details"],
    steps: [
      "Preserve medical and repair records.",
      "Note witnesses and location details.",
      "Check insurance and claim timelines.",
    ],
    outcomes: [
      "Compensation claim may be possible.",
      "Insurance dispute may need follow-up.",
      "Criminal procedure may also apply if there was negligence.",
    ],
    question: "Was there injury, vehicle damage, or an insurance dispute after the accident?",
  },
  cheque: {
    laws: ["Negotiable Instruments Act, 1881"],
    forum: "Magistrate Court",
    docs: ["Cheque copy", "Bank return memo", "Demand notice", "Delivery proof"],
    steps: [
      "Check the cheque date and return memo.",
      "Preserve the legal notice and postal proof.",
      "Track limitation periods carefully.",
    ],
    outcomes: [
      "Complaint process under cheque law may be possible.",
      "Settlement or repayment may resolve the matter.",
      "The timelines are strict and should be checked locally.",
    ],
    question: "Was the cheque dishonoured, and do you have the return memo and notice?",
  },
  criminal: {
    laws: [
      "Bharatiya Nyaya Sanhita, 2023",
      "Bharatiya Nagarik Suraksha Sanhita, 2023",
      "Bharatiya Sakshya Adhiniyam, 2023",
    ],
    forum: "Police Station or Criminal Court",
    docs: [
      "FIR or complaint copy",
      "Summons or notice",
      "Witness details",
      "Evidence and messages",
    ],
    steps: [
      "Read any notice or summons carefully.",
      "Preserve evidence and dates.",
      "Speak to a criminal lawyer for urgent matters.",
    ],
    outcomes: [
      "Bail, notice, or arrest-related steps may be relevant.",
      "Statements and evidence matter heavily.",
      "An advocate should review urgent criminal cases.",
    ],
    question: "Is this about a police complaint, FIR, summons, or arrest-related issue?",
  },
};

export const samples = {
  consumer: {
    state: "Maharashtra",
    district: "Pune",
    issue:
      "I bought a phone and it stopped working within two weeks. The seller is ignoring my complaint and I want a refund or replacement.",
    urgency: "medium",
  },
  family: {
    state: "Delhi",
    district: "South Delhi",
    issue:
      "My spouse and I are separated and there is a maintenance and child custody dispute. I need to know what documents to keep.",
    urgency: "high",
  },
  property: {
    state: "Karnataka",
    district: "Bengaluru",
    issue:
      "My landlord has sent an eviction notice and I want to understand my rights and what notice period applies.",
    urgency: "high",
  },
  cyber: {
    state: "Telangana",
    district: "Hyderabad",
    issue:
      "Someone used my UPI account for fraud and I want to report it, preserve proof, and recover the money.",
    urgency: "high",
  },
};

export function inferMatter(text: string): MatterType {
  const lower = text.toLowerCase();
  if (/(cheque|bounce|dishonour)/.test(lower)) return "cheque";
  if (/(fraud|upi|cyber|online|hack|impersonat|harass)/.test(lower)) return "cyber";
  if (/(wife|husband|custody|maintenance|divorce|marriage|domestic|family)/.test(lower))
    return "family";
  if (/(rent|tenant|evict|possession|property|landlord)/.test(lower)) return "property";
  if (/(salary|job|termination|employment|hr|service)/.test(lower)) return "employment";
  if (/(accident|vehicle|insurance|injury|mact)/.test(lower)) return "motor";
  if (/(police|fir|summons|arrest|criminal|complaint)/.test(lower)) return "criminal";
  return "consumer";
}

export function getAnalysis(matter: MatterType, issueText: string): AnalysisData {
  const data = matterData[matter] || matterData.consumer;
  const text = issueText.toLowerCase();
  const extraLaws: string[] = [];

  if (/(notice|reply)/.test(text))
    extraLaws.push("Legal notice process under Indian procedural practice");
  if (/(documents|proof|evidence|photo|screenshot)/.test(text))
    extraLaws.push("Bharatiya Sakshya Adhiniyam, 2023");
  if (/(bank|payment|upi|transaction)/.test(text))
    extraLaws.push("Payment and banking complaint channels");
  if (/(children|minor|custody)/.test(text))
    extraLaws.push("Juvenile Justice (Care and Protection of Children) Act, 2015");

  return {
    laws: Array.from(new Set([...data.laws, ...extraLaws])),
    forum: data.forum,
    docs: data.docs,
    steps: data.steps,
    outcomes: data.outcomes,
    question: data.question,
  };
}

export function practiceDeck(matter: MatterType): string[] {
  const decks: Record<MatterType, string[]> = {
    consumer: [
      "What exactly did you buy, and what proof do you have of the defect?",
      "When did you first complain to the seller or service provider?",
      "What remedy are you asking for: refund, repair, replacement, or compensation?",
    ],
    family: [
      "What is the present family dispute and what relief do you need?",
      "What dates, notices, or messages support your version of events?",
      "Have you already tried mediation or discussion?",
    ],
    property: [
      "Who is in possession of the property and what does your agreement say?",
      "Was any legal notice served, and do you have a copy?",
      "What outcome do you want from the court or authority?",
    ],
    cyber: [
      "What happened online, and which account or transaction was affected?",
      "What evidence have you preserved, including screenshots and receipts?",
      "Did you already report the matter to the bank or cyber police?",
    ],
    employment: [
      "What happened at work, and what documents prove your employment terms?",
      "Did HR or management give you a written notice or reply?",
      "What result are you seeking from the dispute?",
    ],
    motor: [
      "What happened in the accident and what injuries or damage were caused?",
      "Do you have police, medical, or insurance records?",
      "Are you seeking compensation, repair, or claim support?",
    ],
    cheque: [
      "What was the amount and date on the cheque?",
      "Do you have the bank return memo and demand notice?",
      "What response did the other side give, if any?",
    ],
    criminal: [
      "What police or court notice did you receive?",
      "What facts are important for your defense or explanation?",
      "Do you need urgent legal help for bail or appearance?",
    ],
  };

  return decks[matter] || decks.consumer;
}

export function questionFeedback(answer: string): string {
  const trimmed = answer.trim();
  if (!trimmed) return "Give a factual answer with dates, documents, and the result you want.";
  if (trimmed.length < 80)
    return "Add more detail: include the date, the notice, and the proof you have.";
  if (/maybe|not sure|i think/.test(trimmed.toLowerCase()))
    return "Keep the answer precise. State only what you know and mark uncertainty clearly.";
  return "That is a clear answer. Stay factual and avoid guessing about legal consequences.";
}
