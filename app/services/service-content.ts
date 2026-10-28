export type ServiceDetail = {
  eyebrow: string;
  title: string;
  headline: string;
  intro: string;
  image: string;
  imageAlt: string;
  benefits: string[];
  overviewHeading: string;
  overview: string[];
  helpItems: Array<{ title: string; description: string }>;
  journey: Array<{ title: string; description: string }>;
  documentsHeading: string;
  documentsIntro: string;
  documentExamples: string[];
  whyFci: Array<{ title: string; description: string }>;
  faqs: Array<{ question: string; answer: string }>;
  officialUrl: string;
  officialLinkLabel: string;
  ctaEyebrow: string;
  ctaHeading: string;
  ctaDescription: string;
};

const sponsorshipUrl =
  "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/family-sponsorship/spouse-partner-children.html";
const visitorUrl =
  "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada.html";
const workPermitUrl =
  "https://www.canada.ca/en/immigration-refugees-citizenship/services/work-canada/permit.html";

export const serviceDetails = {
  "outland-spousal-sponsorship": {
    eyebrow: "Spousal sponsorship",
    title: "Outland Spousal Sponsorship",
    headline: "Build your future together in Canada.",
    intro:
      "Planning to sponsor your spouse or partner who lives outside Canada? Understand the process, prepare supporting documents, and move forward with guidance tailored to your circumstances.",
    image: "/services/outland-couple.jpg",
    imageAlt: "A couple walking hand in hand through a park in Waterloo, Ontario",
    benefits: [
      "Guidance tailored to your circumstances",
      "Relationship evidence and document preparation support",
      "Clear explanations of application stages",
    ],
    overviewHeading: "Understand your sponsorship options",
    overview: [
      "Outland sponsorship is a family-class pathway that may be relevant when the person being sponsored lives outside Canada. The sponsor and applicant must meet the requirements that apply to their circumstances.",
      "The right approach depends on factors such as the relationship, sponsor eligibility, where each person lives, and the documents available. Accurate forms, consistent information, and well-organised relationship evidence help make the application easier to assess.",
    ],
    helpItems: [
      {
        title: "Initial case assessment",
        description:
          "Talk through your relationship, locations, goals, and circumstances to identify questions to address before preparing an application.",
      },
      {
        title: "Document checklist and preparation",
        description:
          "Understand which forms and supporting records may be relevant to your situation and organise them for review.",
      },
      {
        title: "Relationship evidence organisation",
        description:
          "Arrange relevant records into a clear, consistent account of your relationship and shared history.",
      },
      {
        title: "Application review and next steps",
        description:
          "Review completeness and consistency, then discuss submission-related considerations and what may follow.",
      },
    ],
    journey: [
      {
        title: "Discuss your situation",
        description:
          "Share where you and your partner live, your relationship history, and what you hope to achieve.",
      },
      {
        title: "Prepare your documents",
        description:
          "Identify relevant forms, relationship evidence, and supporting records for your circumstances.",
      },
      {
        title: "Review your application",
        description:
          "Check the assembled information for completeness and consistency before submission.",
      },
      {
        title: "Understand the next steps",
        description:
          "Discuss submission considerations and how to approach later requests or communication.",
      },
    ],
    documentsHeading: "Prepare with the right records",
    documentsIntro:
      "The documents required depend on your circumstances. Examples that may be relevant include:",
    documentExamples: [
      "Identity and civil-status documents",
      "Relationship history and supporting evidence",
      "Communication, travel, or shared-life evidence where relevant",
      "Forms and supporting records requested for your specific case",
    ],
    whyFci: [
      {
        title: "Clear communication",
        description:
          "Get practical explanations of the process and the questions that matter to your file.",
      },
      {
        title: "Organised preparation",
        description:
          "Approach forms and supporting evidence with a structured, case-specific plan.",
      },
      {
        title: "Individual guidance",
        description:
          "Discuss your own circumstances rather than relying on a one-size-fits-all checklist.",
      },
      {
        title: "A clearer path forward",
        description:
          "Understand key stages and practical next steps while recognising that decisions rest with IRCC.",
      },
    ],
    faqs: [
      {
        question: "What is outland spousal sponsorship?",
        answer:
          "It is a family-class sponsorship route that may be used when the spouse or partner being sponsored lives outside Canada. The appropriate pathway depends on the specific circumstances and current IRCC requirements.",
      },
      {
        question: "Who may be eligible to sponsor a spouse or partner?",
        answer:
          "Sponsor and applicant eligibility depends on requirements set by IRCC, including the sponsor's circumstances and the nature of the relationship. A review of your facts is needed before reaching a conclusion.",
      },
      {
        question: "What relationship evidence might be relevant?",
        answer:
          "Evidence varies by relationship and case. It can include records that help explain your history together, communication, visits, or shared responsibilities. The selection should be truthful, relevant, and consistent with the application.",
      },
      {
        question: "Can my spouse or partner live outside Canada during the process?",
        answer:
          "Outland applications generally relate to a person living outside Canada, but travel and residence plans are individual. Discuss changes in circumstances and any travel plans with a qualified professional.",
      },
      {
        question: "Where can I check official requirements?",
        answer:
          "Use the current IRCC family sponsorship information linked below. Official instructions can change, and they should be checked alongside any case-specific guidance.",
      },
    ],
    officialUrl: sponsorshipUrl,
    officialLinkLabel: "IRCC: sponsor your spouse, partner or child",
    ctaEyebrow: "Plan with care",
    ctaHeading: "Your next chapter together starts with a clear plan.",
    ctaDescription:
      "Discuss your circumstances with our team and understand practical next steps for your sponsorship journey.",
  },
  "inland-spousal-sponsorship": {
    eyebrow: "Spousal sponsorship",
    title: "Inland Spousal Sponsorship",
    headline: "Make a thoughtful plan for your life together in Canada.",
    intro:
      "If you and your spouse or partner are living in Canada, learn how sponsorship requirements may apply to your situation and prepare for the decisions ahead.",
    image: "/services/spouse.png",
    imageAlt: "A couple looking together at a map",
    benefits: [
      "Guidance based on your current circumstances",
      "Support organising forms and relationship evidence",
      "Clear discussion of application stages and next steps",
    ],
    overviewHeading: "Explore the pathway that fits your situation",
    overview: [
      "Inland spousal sponsorship may be relevant when the sponsor and the spouse or partner being sponsored are living together in Canada. The route and any related options depend on individual facts and current IRCC rules.",
      "Current immigration status, relationship evidence, sponsor eligibility, and changes during the process can all matter. Careful preparation helps keep the information in the application complete and consistent.",
    ],
    helpItems: [
      {
        title: "Initial case assessment",
        description:
          "Review your living arrangements, immigration circumstances, relationship history, and goals.",
      },
      {
        title: "Document checklist and preparation",
        description:
          "Identify records that may support your application and organise the required forms and information.",
      },
      {
        title: "Relationship evidence organisation",
        description:
          "Present relevant evidence of your relationship and life together in a clear, consistent way.",
      },
      {
        title: "Application review and next steps",
        description:
          "Consider the file for completeness and discuss what to expect after submission, based on current guidance.",
      },
    ],
    journey: [
      {
        title: "Discuss your situation",
        description:
          "Review where you live, your current status, relationship history, and plans.",
      },
      {
        title: "Prepare your documents",
        description:
          "Gather case-specific forms and records that explain your relationship and circumstances.",
      },
      {
        title: "Review your application",
        description:
          "Check the details and supporting evidence for completeness and consistency.",
      },
      {
        title: "Understand the next steps",
        description:
          "Discuss submission considerations and how to keep your information current if circumstances change.",
      },
    ],
    documentsHeading: "Gather case-specific supporting documents",
    documentsIntro:
      "The records needed depend on your history and circumstances. Examples may include:",
    documentExamples: [
      "Identity, civil-status, and immigration-status documents",
      "Evidence of your relationship and shared life in Canada",
      "Communication, household, or financial records where relevant",
      "Forms and supporting records listed in the current IRCC instructions",
    ],
    whyFci: [
      {
        title: "Clear communication",
        description:
          "Understand the process in straightforward terms and identify the questions that need attention.",
      },
      {
        title: "Organised preparation",
        description:
          "Build a case-specific document plan instead of relying on a generic list.",
      },
      {
        title: "Guidance for your situation",
        description:
          "Consider how your current status and relationship details may affect preparation.",
      },
      {
        title: "Practical next steps",
        description:
          "Know what to review and what to keep in mind as your circumstances evolve.",
      },
    ],
    faqs: [
      {
        question: "What does inland spousal sponsorship mean?",
        answer:
          "It generally refers to a sponsorship application where the sponsor and the spouse or partner being sponsored live in Canada. The exact requirements and options depend on the case and current IRCC instructions.",
      },
      {
        question: "Does living in Canada mean I qualify to apply inland?",
        answer:
          "Not necessarily. Eligibility depends on the relationship, sponsor and applicant circumstances, and current program requirements. Review your facts before choosing a route.",
      },
      {
        question: "What if the applicant's status changes during the process?",
        answer:
          "Changes can affect the options available and should be considered promptly. Seek case-specific advice and consult current IRCC information rather than assuming an application resolves every status issue.",
      },
      {
        question: "What documents should we prepare?",
        answer:
          "The required forms and supporting records vary. Identity and civil-status records, relationship evidence, and documents relevant to your immigration circumstances may be requested.",
      },
      {
        question: "Where can I find the current official instructions?",
        answer:
          "Consult the IRCC spouse and partner sponsorship information linked below. Requirements can change, so use the current official guide for your application.",
      },
    ],
    officialUrl: sponsorshipUrl,
    officialLinkLabel: "IRCC: sponsor your spouse, partner or child",
    ctaEyebrow: "Plan your next steps",
    ctaHeading: "Talk through your inland sponsorship plans with clarity.",
    ctaDescription:
      "Discuss your circumstances and understand what to consider before preparing or submitting an application.",
  },
  "common-law-sponsorship": {
    eyebrow: "Partner sponsorship",
    title: "Common-Law Sponsorship",
    headline: "Tell the story of your relationship with clarity.",
    intro:
      "Considering sponsorship as common-law partners? Understand which details may matter and how to organise supporting records that reflect your shared life.",
    image: "/services/common-law-couple.jpg",
    imageAlt: "A couple walking together through a leafy park",
    benefits: [
      "Guidance tailored to your relationship history",
      "Support organising relevant shared-life evidence",
      "A clear review of forms and application details",
    ],
    overviewHeading: "Understand how your relationship evidence fits",
    overview: [
      "Common-law sponsorship has specific relationship requirements under Canadian immigration rules. The facts, timeline, and evidence available to each couple can differ, so it is important to consult current IRCC definitions and instructions.",
      "A well-prepared application should present accurate, consistent information and supporting evidence relevant to your relationship. Do not assume that one type of document or a generic checklist will fit every case.",
    ],
    helpItems: [
      {
        title: "Initial case assessment",
        description:
          "Discuss your relationship timeline, living arrangements, goals, and the questions you want answered.",
      },
      {
        title: "Document checklist and preparation",
        description:
          "Identify the forms and records that may be relevant to your specific history and circumstances.",
      },
      {
        title: "Relationship evidence organisation",
        description:
          "Bring together relevant records to explain your shared life in a clear and consistent way.",
      },
      {
        title: "Application review and next steps",
        description:
          "Review the assembled information and discuss considerations before submission.",
      },
    ],
    journey: [
      {
        title: "Discuss your situation",
        description:
          "Walk through your relationship history, living arrangements, and application goals.",
      },
      {
        title: "Prepare your documents",
        description:
          "Identify records that may help explain your relationship and its timeline.",
      },
      {
        title: "Review your application",
        description:
          "Check that the information and supporting evidence are complete and consistent.",
      },
      {
        title: "Understand the next steps",
        description:
          "Discuss submission considerations and where to find current official updates.",
      },
    ],
    documentsHeading: "Organise relevant relationship records",
    documentsIntro:
      "Supporting evidence depends on your own circumstances. Examples may include:",
    documentExamples: [
      "Identity and civil-status documents",
      "Records that help show shared residence or household arrangements",
      "Financial, communication, travel, or other relationship evidence where relevant",
      "Forms and supporting records required by current IRCC instructions",
    ],
    whyFci: [
      {
        title: "A clear explanation",
        description:
          "Get help understanding the details that may be relevant to your relationship history.",
      },
      {
        title: "Structured preparation",
        description:
          "Organise forms and supporting records around your specific circumstances.",
      },
      {
        title: "Individual guidance",
        description:
          "Discuss your evidence and questions in the context of your own case.",
      },
      {
        title: "A practical overview",
        description:
          "Understand preparation and submission considerations without promises about an outcome.",
      },
    ],
    faqs: [
      {
        question: "What is common-law sponsorship?",
        answer:
          "It is a sponsorship category for qualifying common-law partners under Canadian immigration rules. IRCC has specific requirements, so review the current official definition and consider how it applies to your facts.",
      },
      {
        question: "What evidence might support a common-law application?",
        answer:
          "Relevant records vary by case and may help explain shared residence, household arrangements, finances, communication, or relationship history. Evidence should be genuine and consistent with the application.",
      },
      {
        question: "Can every couple use the same document checklist?",
        answer:
          "No. The most relevant evidence depends on your history and circumstances. Use current IRCC instructions and case-specific guidance to prepare.",
      },
      {
        question: "How do we prepare for a consultation?",
        answer:
          "Be ready to outline your relationship timeline, living arrangements, immigration circumstances, and key questions. You can also bring a list of records you already have.",
      },
      {
        question: "Where can I check official requirements?",
        answer:
          "IRCC's spouse and partner sponsorship information is linked below. Check the current instructions because definitions and requirements may be updated.",
      },
    ],
    officialUrl: sponsorshipUrl,
    officialLinkLabel: "IRCC: sponsor your spouse, partner or child",
    ctaEyebrow: "Start with a conversation",
    ctaHeading: "Get clarity on your common-law sponsorship questions.",
    ctaDescription:
      "Discuss your relationship history and understand practical steps for preparing your application.",
  },
  "conjugal-partner-sponsorship": {
    eyebrow: "Partner sponsorship",
    title: "Conjugal Partner Sponsorship",
    headline: "Get careful guidance for a complex relationship pathway.",
    intro:
      "Conjugal partner sponsorship may apply only in limited circumstances. Explore the requirements carefully and understand which facts and records may need attention.",
    image: "/placeholder-hands-passports.png",
    imageAlt: "Hands holding travel documents together",
    benefits: [
      "A careful discussion of your circumstances",
      "Support organising relevant relationship evidence",
      "Clear explanations of requirements and next steps",
    ],
    overviewHeading: "Start with a careful assessment of your facts",
    overview: [
      "The conjugal partner category is limited and has specific requirements under Canadian immigration rules. It may be relevant in some cases where significant barriers have prevented a couple from marrying or living together, but the category is not a general alternative to other sponsorship routes.",
      "The reasons, relationship history, and supporting evidence require careful consideration. Eligibility is fact-specific and should be assessed against the current IRCC instructions before relying on this pathway.",
    ],
    helpItems: [
      {
        title: "Initial case assessment",
        description:
          "Discuss your relationship, barriers, history, and circumstances that may be relevant to this limited category.",
      },
      {
        title: "Document checklist and preparation",
        description:
          "Identify the forms and supporting records to consider for your individual case.",
      },
      {
        title: "Relationship evidence organisation",
        description:
          "Organise accurate records that help explain the relationship and relevant circumstances.",
      },
      {
        title: "Application review and next steps",
        description:
          "Review the information for clarity and discuss current requirements before deciding how to proceed.",
      },
    ],
    journey: [
      {
        title: "Discuss your situation",
        description:
          "Explain your relationship, circumstances, and any barriers that may be relevant.",
      },
      {
        title: "Prepare your documents",
        description:
          "Identify current forms and records that may help explain your specific case.",
      },
      {
        title: "Review your application",
        description:
          "Check that the information and evidence are accurate, complete, and consistent.",
      },
      {
        title: "Understand the next steps",
        description:
          "Discuss whether this route may fit and what official requirements to review before proceeding.",
      },
    ],
    documentsHeading: "Document the circumstances carefully",
    documentsIntro:
      "Requirements are specific to each case. Depending on your circumstances, relevant records may include:",
    documentExamples: [
      "Identity and civil-status documents",
      "Relationship history and evidence of ongoing commitment",
      "Records explaining barriers to marrying or living together, where relevant",
      "Forms and supporting records required by current IRCC instructions",
    ],
    whyFci: [
      {
        title: "Careful communication",
        description:
          "Discuss a complex pathway in clear terms, including questions that need further assessment.",
      },
      {
        title: "Organised preparation",
        description:
          "Structure relevant information and records around the facts of your case.",
      },
      {
        title: "Case-specific perspective",
        description:
          "Avoid assuming this category applies without reviewing your circumstances and current requirements.",
      },
      {
        title: "Practical next steps",
        description:
          "Understand what to verify and consider before choosing how to proceed.",
      },
    ],
    faqs: [
      {
        question: "What is conjugal partner sponsorship?",
        answer:
          "It is a limited sponsorship category with specific IRCC requirements. It is not a general substitute for spouse or common-law sponsorship, and whether it may apply depends on the individual facts.",
      },
      {
        question: "When might this category be considered?",
        answer:
          "It may be considered in some circumstances involving significant barriers to marrying or living together. The requirements are specific, and a detailed review of the facts and current official instructions is important.",
      },
      {
        question: "What kind of evidence could matter?",
        answer:
          "Evidence may relate to the relationship, its history, and the circumstances or barriers relevant to the application. The appropriate records vary by case and should be truthful and consistent.",
      },
      {
        question: "Can I know from this page whether I qualify?",
        answer:
          "No. Eligibility depends on individual facts and current IRCC rules. A case-specific assessment is needed before deciding whether this route may be appropriate.",
      },
      {
        question: "Where can I review official information?",
        answer:
          "Consult the current IRCC spouse and partner sponsorship information linked below and seek guidance based on your circumstances.",
      },
    ],
    officialUrl: sponsorshipUrl,
    officialLinkLabel: "IRCC: sponsor your spouse, partner or child",
    ctaEyebrow: "Assess your circumstances",
    ctaHeading: "Start with a clear discussion of your situation.",
    ctaDescription:
      "Talk through your circumstances and understand the questions to consider before pursuing a conjugal partner application.",
  },
  "spouse-open-work-permit": {
    eyebrow: "Work permit options",
    title: "Spouse Open Work Permit",
    headline: "Understand which work permit options may fit your family.",
    intro:
      "Open work permit eligibility for spouses and partners depends on current rules and individual circumstances. Get help understanding the requirements relevant to your situation.",
    image: "/services/spouse-work-permit.jpg",
    imageAlt: "A woman working on a laptop at home",
    benefits: [
      "Guidance grounded in your current circumstances",
      "Support understanding relevant forms and documents",
      "Clear discussion of eligibility questions and next steps",
    ],
    overviewHeading: "Check current eligibility before you plan",
    overview: [
      "An open work permit may allow a person to work for an eligible employer without a job-specific offer, but not every spouse or partner qualifies. Eligibility can depend on the principal applicant's circumstances, immigration pathway, and current program rules.",
      "Rules and qualifying situations can change. Before making plans, confirm the current IRCC requirements and consider how your family’s status and application details affect the options available.",
    ],
    helpItems: [
      {
        title: "Initial case assessment",
        description:
          "Review the family member's status, immigration pathway, and the questions that may affect eligibility.",
      },
      {
        title: "Document checklist and preparation",
        description:
          "Identify application forms and supporting records relevant to the current requirements.",
      },
      {
        title: "Application information review",
        description:
          "Check that the information provided is complete and consistent with the supporting documents.",
      },
      {
        title: "Application review and next steps",
        description:
          "Discuss timing considerations and where to verify current official instructions before applying.",
      },
    ],
    journey: [
      {
        title: "Discuss your situation",
        description:
          "Review each family member's status, pathway, and plans for working in Canada.",
      },
      {
        title: "Check current requirements",
        description:
          "Identify which current IRCC eligibility criteria and forms may apply to your case.",
      },
      {
        title: "Prepare and review",
        description:
          "Organise the supporting records and check the application details for consistency.",
      },
      {
        title: "Understand the next steps",
        description:
          "Discuss submission considerations and confirm any changes against current IRCC guidance.",
      },
    ],
    documentsHeading: "Prepare documents for your situation",
    documentsIntro:
      "The applicable checklist depends on current eligibility rules and your circumstances. Records may include:",
    documentExamples: [
      "Identity and immigration-status documents",
      "Evidence relevant to the principal applicant's status or pathway",
      "Relationship records where required",
      "Forms and supporting documents specified in current IRCC instructions",
    ],
    whyFci: [
      {
        title: "Clear explanations",
        description:
          "Understand the questions that may affect eligibility in your family’s circumstances.",
      },
      {
        title: "Current-rule awareness",
        description:
          "Use current official information as rules and qualifying situations can change.",
      },
      {
        title: "Organised preparation",
        description:
          "Approach the forms and supporting information with a structured plan.",
      },
      {
        title: "Practical planning",
        description:
          "Discuss next steps without assuming eligibility or a particular decision.",
      },
    ],
    faqs: [
      {
        question: "Can every spouse or partner apply for an open work permit?",
        answer:
          "No. Eligibility depends on the person’s circumstances and current IRCC program requirements. Check the official criteria before making plans.",
      },
      {
        question: "What affects eligibility?",
        answer:
          "Factors may include the principal applicant's status or immigration pathway and other program-specific requirements. The rules can change, so a case-specific review is important.",
      },
      {
        question: "What documents are required?",
        answer:
          "The forms and supporting records depend on the relevant eligibility category and your situation. Follow the current IRCC instructions for the application being made.",
      },
      {
        question: "Where can I check current work permit rules?",
        answer:
          "Use the official IRCC work permit information linked below and verify the specific instructions that apply to your situation.",
      },
    ],
    officialUrl: workPermitUrl,
    officialLinkLabel: "IRCC: work permits",
    ctaEyebrow: "Clarify your pathway",
    ctaHeading: "Understand your options before making plans.",
    ctaDescription:
      "Discuss your family’s circumstances and the current requirements that may affect a spouse open work permit application.",
  },
  "visitor-visa": {
    eyebrow: "Temporary visits",
    title: "Visitor Visa for a Spouse Outside Canada",
    headline: "Plan a visit with a clear, well-prepared application.",
    intro:
      "If your spouse or partner hopes to visit Canada, understand how the purpose of travel, personal circumstances, and supporting documents may shape the application.",
    image: "/services/visitor-travel.jpg",
    imageAlt: "A traveler walking through an airport terminal with luggage",
    benefits: [
      "Guidance focused on the purpose of travel",
      "Support organising relevant supporting documents",
      "A clear review of the application and next steps",
    ],
    overviewHeading: "Understand the purpose of a visitor application",
    overview: [
      "A visitor visa is for travel to Canada as a temporary visitor. Applying does not guarantee a visa or entry, and a visitor application is separate from a permanent residence sponsorship application.",
      "The appropriate preparation depends on the travel plan, the applicant's circumstances, and current IRCC requirements. Clear, truthful information about the visit and relevant supporting records can help explain the application.",
    ],
    helpItems: [
      {
        title: "Initial case assessment",
        description:
          "Discuss the proposed visit, the applicant's circumstances, and how the visit relates to family plans.",
      },
      {
        title: "Document checklist and preparation",
        description:
          "Identify relevant forms and supporting records for the purpose and details of the trip.",
      },
      {
        title: "Application information review",
        description:
          "Check that travel plans and supporting information are accurate and consistent.",
      },
      {
        title: "Application review and next steps",
        description:
          "Discuss submission considerations and where to confirm current visitor requirements.",
      },
    ],
    journey: [
      {
        title: "Discuss your travel plans",
        description:
          "Outline the purpose, timing, and intended details of the visit.",
      },
      {
        title: "Prepare your documents",
        description:
          "Identify current forms and supporting records relevant to the applicant and trip.",
      },
      {
        title: "Review your application",
        description:
          "Check that the travel purpose and supporting information are clear and consistent.",
      },
      {
        title: "Understand the next steps",
        description:
          "Discuss submission considerations and check current IRCC travel information.",
      },
    ],
    documentsHeading: "Build a case-specific visitor file",
    documentsIntro:
      "The documents needed depend on the applicant and proposed visit. Examples may include:",
    documentExamples: [
      "Identity and travel documents",
      "Information about the purpose and planned details of the visit",
      "Records relevant to the applicant's circumstances and travel plans",
      "Forms and supporting records specified in current IRCC instructions",
    ],
    whyFci: [
      {
        title: "Purpose-led preparation",
        description:
          "Keep the proposed visit and the applicant’s circumstances central to the discussion.",
      },
      {
        title: "Organised documents",
        description:
          "Prepare supporting records that are relevant to the specific application.",
      },
      {
        title: "Clear communication",
        description:
          "Review the information for clarity and consistency before submission.",
      },
      {
        title: "Realistic guidance",
        description:
          "Understand the process without promises about visa issuance or admission to Canada.",
      },
    ],
    faqs: [
      {
        question: "What is a visitor visa for?",
        answer:
          "A visitor visa may allow an eligible person to travel to Canada and seek entry as a temporary visitor. It is not a permanent residence application, and a decision is made by the relevant authorities.",
      },
      {
        question: "Does a sponsorship application guarantee a visitor visa?",
        answer:
          "No. A visitor visa is assessed separately under the requirements that apply to temporary visits. Outcomes cannot be guaranteed.",
      },
      {
        question: "What information should we prepare?",
        answer:
          "Be prepared to explain the purpose and details of the visit and provide records relevant to the applicant's circumstances. The right documents vary by case.",
      },
      {
        question: "Where can I find current visitor visa instructions?",
        answer:
          "Consult the official IRCC visit Canada information linked below and follow the current instructions for the applicant's situation.",
      },
    ],
    officialUrl: visitorUrl,
    officialLinkLabel: "IRCC: visit Canada",
    ctaEyebrow: "Plan your next steps",
    ctaHeading: "Discuss your family’s visitor visa plans with care.",
    ctaDescription:
      "Talk through the proposed visit and understand the practical preparation that may be relevant to your circumstances.",
  },
} satisfies Record<string, ServiceDetail>;
