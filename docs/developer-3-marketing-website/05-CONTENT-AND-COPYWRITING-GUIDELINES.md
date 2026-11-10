# D3-05 — Content and Copywriting Guidelines

## 1. Voice

- Clear, calm, encouraging and specific. Speak to students (16–19) and their parents.
- Short sentences. Indian English spelling (colour, practise as a verb), ₹ for prices, IST for times.
- Explain exam terms simply the first time (e.g. "PYQs (previous years' questions)").

## 2. Claims policy (mandatory)

| Allowed | Not allowed |
|---|---|
| Factual product capabilities that ship | Features not yet built (unless labelled "Coming soon" with owner approval) |
| Real counts fetched from the API (courses, tests, questions) | Invented or rounded-up numbers ("10,000+ students") |
| Real, consented testimonials with documentation | Fabricated, paraphrased-as-quote or AI-generated testimonials |
| Verified results with written consent and evidence | Rank/selection claims without proof |
| "Based on the official exam pattern" + a verification note | "Guaranteed selection", "best in India", "100 % success" |
| Load/capacity statements only after a passing load-test report | Concurrency or uptime claims without evidence |

Every number on the site must have a source recorded in the PR (API field or document).

## 3. Testimonial and results consent

Required before publishing a testimonial: written consent (for minors, a parent or guardian too, per D-18), the exact approved text, a photo consent if a photo is used, the exam/year and the consent date. These are stored by the owner outside the repo. The repo stores only `consentOnFile: true` + `consentRef`.

## 4. Competitor references

Do not name or imitate competitors. Do not reuse phrasing, taglines or section names from competitor sites (including Quizrr). The research reports in the project folder are for product behaviour only, never for copy.

## 5. Exam information

Exam pattern descriptions are derived from the configured exam profile and include: "Exam patterns can change. Always check the official notification." Link to the official exam authority websites as plain external links (`rel="noopener"`).

## 6. Microcopy

| Context | Copy |
|---|---|
| Primary CTA | "Start free" |
| Paid CTA | "Buy now · ₹2,999" |
| Free CTA | "Enroll free" |
| Closed | "Enrollment closed" |
| Trial | "Your first N tests are free" (N from the API) |
| Contact success | "Thanks! We've received your message and will reply within N working days." |

## 7. Legal pages

Written or approved by the owner/legal adviser. They must cover: data collected, purposes, retention, minors, rights and grievance contact (DPDP), payment processor (Cashfree), refunds (D-05), cookies/analytics, and content usage rules. They show a "Last updated" date.
