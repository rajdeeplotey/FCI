"use client";

import { CircleHelp, Search, ShieldCheck } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";

const faqs = [
  {
    category: "Spousal sponsorship",
    items: [
      {
        question: "Can a Canadian citizen or permanent resident sponsor a spouse?",
        answer:
          "In many cases, yes. Eligibility depends on the sponsor's status, relationship history, and the applicant's admissibility. The right answer depends on the specific facts and current immigration rules.",
        searchTerms: "spouse visa partner common-law conjugal sponsor family class",
      },
      {
        question: "What is the difference between inland and outland sponsorship?",
        answer:
          "An outland family-class application is generally used when the sponsored spouse or partner lives outside Canada. An inland application is generally for a spouse or partner living in Canada with the sponsor. Each stream has specific requirements, and the appropriate option depends on the applicant's situation and current IRCC instructions.",
        searchTerms:
          "inside outside Canada abroad overseas application route spouse sponsorship from outside Canada India Indian applicant",
      },
      {
        question: "Can I apply for Canadian spouse sponsorship from India?",
        answer:
          "A person living in India may be included in an outland family-class spousal sponsorship application if the Canadian sponsor and the couple meet the applicable requirements. Applications are submitted through IRCC's current online process, with required forms and evidence. Eligibility and the correct process depend on individual circumstances; an application does not guarantee approval.",
        searchTerms:
          "apply applying application India Indian applicant spouse sponsorship spouse visa partner outland outside Canada live living from India",
      },
      {
        question: "Can my spouse in Canada sponsor me while I live in India?",
        answer:
          "A Canadian citizen or permanent resident may be able to sponsor an eligible spouse who lives in India through the outland family-class process. The sponsor must meet the sponsorship requirements, and the relationship and applicant must satisfy applicable rules. Check IRCC's current guide and document checklist for the correct process; approval is not guaranteed.",
        searchTerms:
          "apply application India Indian applicant spouse in Canada sponsor me live living outside Canada outland spouse sponsorship",
      },
      {
        question: "What documents are required when applying from India?",
        answer:
          "The documents depend on the immigration pathway and the applicants' circumstances. A spouse sponsorship application may require identity and civil-status records, relationship evidence, application forms, and any country-specific or case-specific documents listed by IRCC. A visitor visa or another permanent-residence program has different requirements. Follow the current IRCC checklist for the specific application, including instructions for documents issued in India.",
        searchTerms:
          "documents required India Indian applicant applying application paperwork proof evidence checklist spouse sponsorship visitor visa permanent residence outside Canada",
      },
      {
        question: "What are the basic eligibility requirements for spousal sponsorship?",
        answer:
          "Requirements can include the sponsor's immigration status, age, financial and undertaking obligations, and proof that the relationship is genuine and falls within an eligible category. Some circumstances can affect eligibility. Check current IRCC instructions or get advice based on your specific facts.",
        searchTerms:
          "qualify qualifications sponsor eligible requirements spouse visa spouse sponsorship",
      },
      {
        question: "What documents are commonly needed for a sponsorship application?",
        answer:
          "Applications commonly require identity and civil-status records, proof of the relationship, sponsor and applicant forms, and any documents requested for the specific case. The required evidence depends on the couple's circumstances and current IRCC checklists. Submit documents through the official application process, not this FAQ page.",
        searchTerms:
          "paperwork proof evidence checklist documents spouse visa spouse sponsorship application",
      },
      {
        question: "How long does a spousal sponsorship application take to process?",
        answer:
          "Processing times vary and can change based on application type, completeness, background checks, and IRCC workload. Consult IRCC's current processing-time tool for the latest estimate; an estimate is not a guarantee for an individual application.",
        searchTerms: "wait waiting duration timeline time to process",
      },
      {
        question: "What can I do if my sponsorship application is refused?",
        answer:
          "Read the refusal letter carefully to understand the reasons and any applicable deadlines. Depending on the case, options may include addressing the concerns in a new application or seeking a review or appeal where available. Get qualified advice promptly because routes and time limits depend on the decision and facts.",
        searchTerms: "denied rejection refusal rejected next steps appeal",
      },
    ],
  },
  {
    category: "Other immigration pathways",
    items: [
      {
        question: "Can I visit Canada while a sponsorship application is in progress?",
        answer:
          "A person may apply to visit Canada while a sponsorship application is being processed, but they must separately meet visitor requirements. A pending sponsorship application does not guarantee a visitor visa or entry to Canada; decisions are made by the relevant authorities.",
        searchTerms: "visitor visa tourist visit travel temporary resident",
      },
      {
        question: "Can I apply for a Canadian visitor visa from India?",
        answer:
          "You can submit a visitor visa application from India if you meet the requirements for the application. IRCC assesses each case individually, including the purpose of travel, supporting documents, and whether the applicant meets the temporary-resident requirements. A pending spouse sponsorship application does not guarantee a visitor visa or entry to Canada. Use IRCC's current application instructions and checklist.",
        searchTerms:
          "apply applying application Indian applicant India visitor visa temporary resident visitor from outside Canada",
      },
      {
        question: "Can a sponsored spouse apply for an open work permit?",
        answer:
          "Some spouses or partners in Canada may be eligible to apply for an open work permit under current public policies and program requirements. Eligibility depends on the application and the applicant's circumstances; check current IRCC guidance before applying.",
        searchTerms: "work permit open work authorization working",
      },
      {
        question: "What permanent residence options may be available for partners?",
        answer:
          "Options depend on the relationship, sponsor and applicant eligibility, and personal circumstances. Spousal or partner sponsorship is one possible family-class route; other pathways may exist but have separate criteria. A review of your facts is needed to identify relevant options.",
        searchTerms: "PR permanent resident residency partner spouse pathways",
      },
      {
        question: "Can I apply for Canadian permanent residence while living in India?",
        answer:
          "It may be possible to apply for permanent residence while living in India, but the available programs and eligibility criteria depend on the pathway and the applicant's circumstances. Options may include family sponsorship or qualifying economic and regional programs. Review the current IRCC requirements for the specific program; meeting basic criteria does not guarantee approval.",
        searchTerms:
          "apply applying application India Indian applicant live living outside Canada abroad permanent residence PR immigrate spouse sponsorship",
      },
    ],
  },
  {
    category: "Consultation and booking",
    items: [
      {
        question: "How do I book a consultation?",
        answer:
          "Use the Book Now flow to choose a consultation date and time, select your country of residence, and provide your contact details. The appointment is confirmed only after the booking flow is completed successfully.",
        searchTerms: "schedule appointment reserve meeting",
      },
      {
        question: "Do you guarantee an approval?",
        answer:
          "No. No ethical Canadian immigration professional can guarantee an approval. The goal is to provide authorized guidance, prepare a careful application, and reduce avoidable mistakes based on your facts.",
        searchTerms: "success approved acceptance outcome",
      },
    ],
  },
  {
    category: "Document preparation",
    items: [
      {
        question: "Do I need to upload passport copies or identity documents in the booking form?",
        answer:
          "No. The standard public booking form only requests a few basic contact details and does not ask for passport documents. Existing private records remain subject to FCI's internal handling and policies.",
        searchTerms: "passport upload identity documents private",
      },
      {
        question: "What information should I bring to the consultation?",
        answer:
          "Bring your current immigration status, your spouse or partner's location, the timeline of your relationship, and any relevant documents or prior application history. The consultation is most useful when you can explain your current situation clearly.",
        searchTerms: "prepare questions records paperwork meeting",
      },
    ],
  },
  {
    category: "Fees and payments",
    items: [
      {
        question: "Are consultation fees refundable?",
        answer:
          "Consultation fees are subject to the published cancellation and refund policy. Please review the policy before booking or paying. Policies may vary depending on how the consultation is scheduled and whether a payment was required.",
        searchTerms: "cost price refund cancellation payment",
      },
      {
        question: "Is every booking payment collected online?",
        answer:
          "No. Payment availability depends on the business setup and Stripe configuration. Some bookings may be processed without online payment, while others may require secure payment before the booking is confirmed.",
        searchTerms: "cost fee credit card online checkout",
      },
      {
        question: "How much are Canadian immigration application fees?",
        answer:
          "Government fees depend on the application and can change. Review the current fee list on IRCC's official website before submitting. Government application fees are separate from any consultation or professional service fees.",
        searchTerms: "cost price charges government fee IRCC",
      },
    ],
  },
  {
    category: "Contact and support",
    items: [
      {
        question: "How can I contact Future Canadian Immigration?",
        answer:
          "Use the Contact page inquiry form or email info@canadaspousevisa.com. Include a brief description of what you need; avoid sending passports or other sensitive documents by regular email unless you have been given appropriate instructions.",
        searchTerms: "email contact inquiry phone call reach firm",
      },
    ],
  },
];

const trustHighlights = [
  {
    title: "Clear Answers",
    description: "To common questions",
    Icon: CircleHelp,
  },
  {
    title: "Trusted Guidance",
    description: "From our immigration experts",
    Icon: ShieldCheck,
  },
];

function CanadaMapleLeafIcon() {
  return (
    <svg aria-hidden="true" fill="currentColor" viewBox="0 0 5000 4500">
      <path d="m2490 4430-45-863a95 95 0 0 1 111-98l859 151-116-320a65 65 0 0 1 20-73l941-762-212-99a65 65 0 0 1-34-79l186-572-542 115a65 65 0 0 1-73-38l-105-247-423 454a65 65 0 0 1-111-57l204-1052-327 189a65 65 0 0 1-91-27l-332-652-332 652a65 65 0 0 1-91 27l-327-189 204 1052a65 65 0 0 1-111 57l-423-454-105 247a65 65 0 0 1-73 38l-542-115 186 572a65 65 0 0 1-34 79l-212 99 941 762a65 65 0 0 1 20 73l-116 320 859-151a95 95 0 0 1 111 98l-45 863z" />
    </svg>
  );
}

const searchStopWords = new Set([
  "a",
  "an",
  "and",
  "are",
  "can",
  "do",
  "for",
  "how",
  "i",
  "in",
  "is",
  "my",
  "of",
  "the",
  "to",
  "what",
  "when",
  "where",
  "which",
  "who",
  "with",
  "you",
  "between",
  "difference",
  "need",
  "versus",
  "from",
  "while",
]);

const searchSynonyms: Record<string, string[]> = {
  apply: ["apply", "applying", "application", "applications", "submit", "file"],
  application: ["application", "applications", "apply", "applying", "submit"],
  applying: ["applying", "apply", "application", "applications", "submit"],
  applicant: ["applicant", "person", "spouse", "partner"],
  cost: ["cost", "fee", "fees", "price", "charges"],
  denied: ["denied", "refused", "rejected"],
  document: ["document", "documents", "paperwork", "evidence", "proof"],
  eligible: ["eligible", "eligibility", "qualify", "requirements"],
  fee: ["fee", "fees", "cost", "price", "charges"],
  india: ["india", "indian", "indian applicant"],
  indian: ["indian", "india", "indian applicant"],
  inland: ["inland", "inside", "inside canada"],
  outland: ["outland", "outside", "abroad", "overseas"],
  outside: ["outside", "outland", "abroad", "overseas"],
  partner: ["partner", "spouse", "common law", "conjugal"],
  process: ["process", "processing", "time", "duration", "wait"],
  processing: ["processing", "process", "time", "duration", "wait"],
  refused: ["refused", "denied", "rejected"],
  sponsor: ["sponsor", "sponsorship", "sponsored", "spouse sponsorship"],
  sponsorship: ["sponsorship", "sponsor", "spousal", "spouse sponsorship"],
  spouse: ["spouse", "spousal", "partner", "common law", "spouse sponsorship"],
  time: ["time", "processing", "duration", "wait", "timeline"],
  visa: ["visa", "visas"],
  work: ["work", "work permit", "open work permit"],
};

function normalizeSearchText(value: string) {
  return value
    .toLocaleLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

export default function FaqContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [hasSubmittedSearch, setHasSubmittedSearch] = useState(false);
  const resultsRef = useRef<HTMLElement>(null);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSearchTerm((current) => current.trim());
    setHasSubmittedSearch(true);
    requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start",
      });
    });
  }

  const query = normalizeSearchText(searchTerm);
  const queryTerms = query
    .split(/\s+/)
    .filter((term) => term && !searchStopWords.has(term));
  const spouseVisaQuery =
    queryTerms.includes("spouse") && queryTerms.includes("visa");
  const filteredItems = faqs
    .flatMap((category) =>
      category.items.map((item) => {
        const questionText = normalizeSearchText(item.question);
        const keywordText = normalizeSearchText(item.searchTerms);
        const answerText = normalizeSearchText(item.answer);
        const categoryText = normalizeSearchText(category.category);
        const questionAndKeywords = `${questionText} ${keywordText}`;
        const searchText = `${questionText} ${keywordText} ${answerText} ${categoryText}`;
        const matchedTerms = queryTerms.filter((term) => {
          const variants = (searchSynonyms[term] || [term]).map(
            normalizeSearchText,
          );
          return variants.some((variant) => searchText.includes(variant));
        });
        const score = queryTerms.reduce((total, term) => {
          const variants = (searchSynonyms[term] || [term]).map(
            normalizeSearchText,
          );
          if (variants.some((variant) => questionText.includes(variant))) {
            return total + 5;
          }
          if (variants.some((variant) => keywordText.includes(variant))) {
            return total + 3;
          }
          if (variants.some((variant) => answerText.includes(variant))) {
            return total + 1;
          }
          return total;
        }, 0);
        const meaningfulQuery = queryTerms.join(" ");
        const exactPhraseMatch =
          meaningfulQuery.length > 0 &&
          `${questionText} ${keywordText}`.includes(meaningfulQuery);
        return {
          ...item,
          category: category.category,
          matchesQuery:
            matchedTerms.length === queryTerms.length &&
            (!spouseVisaQuery ||
              (questionAndKeywords.includes("spouse") &&
                questionAndKeywords.includes("visa"))),
          score: score + (exactPhraseMatch ? 10 : 0),
        };
      }),
    )
    .filter((item) => !queryTerms.length || item.matchesQuery)
    .sort((a, b) => b.score - a.score);

  return (
    <>
      <section aria-labelledby="faq-hero-title" className="faq-hero">
        <div aria-hidden="true" className="faq-hero-watermark">
          <CanadaMapleLeafIcon />
        </div>
        <div className="faq-hero-content">
          <p className="faq-hero-eyebrow"><span />FAQ<span /></p>
          <h1 id="faq-hero-title">Answers before you book.</h1>
          <p className="faq-hero-description">
            Find quick answers to common questions about our services, process,
            fees and what to expect. Our FAQ section is here to help you make
            informed decisions about your Canadian immigration journey.
          </p>

          <div aria-label="Our service commitments" className="faq-trust-highlights">
            {trustHighlights.map(({ title, description, Icon }) => (
              <div className="faq-trust-item" key={title}>
                <span className="faq-trust-icon">
                  <Icon aria-hidden="true" />
                </span>
                <span className="faq-trust-copy">
                  <strong>{title}</strong>
                  <small>{description}</small>
                </span>
              </div>
            ))}
            <div className="faq-trust-item">
              <span className="faq-trust-icon">
                <CanadaMapleLeafIcon />
              </span>
              <span className="faq-trust-copy">
                <strong>Your Future</strong>
                <small>Is our priority</small>
              </span>
            </div>
          </div>

          <form className="faq-search" onSubmit={submitSearch} role="search">
            <Search aria-hidden="true" className="faq-search-icon" />
            <input
              aria-label="Search frequently asked questions"
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search for a question..."
              type="search"
              value={searchTerm}
            />
            <button type="submit">Search</button>
          </form>
        </div>
      </section>

      <section
        aria-label="Frequently asked questions"
        className="section-shell faq-results"
        id="faq-answers"
        ref={resultsRef}
        tabIndex={-1}
      >
        {hasSubmittedSearch ? (
          <div className="faq-search-results-heading">
            <h2>Search Results for “{searchTerm || "all questions"}”</h2>
            <p aria-live="polite" role="status">
              {filteredItems.length} matching{" "}
              {filteredItems.length === 1 ? "question" : "questions"}
            </p>
          </div>
        ) : null}
        {filteredItems.length > 0 ? (
          <>
            {!hasSubmittedSearch && queryTerms.length ? (
              <p aria-live="polite" className="faq-result-count" role="status">
                {filteredItems.length} matching{" "}
                {filteredItems.length === 1 ? "question" : "questions"}
              </p>
            ) : null}
            <div className="faq-list">
              {filteredItems.map((item) => (
                <div
                  className="faq-item"
                  key={`${item.category}-${item.question}`}
                >
                  <details>
                    <summary>{item.question}</summary>
                    <p>{item.answer}</p>
                  </details>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="faq-no-results" role="status">
            No matching answers found. Try different keywords or browse all
            FAQs. You could search for “spouse sponsorship,” “visitor visa,”
            “eligibility,” or “required documents.”
          </p>
        )}
      </section>
    </>
  );
}
