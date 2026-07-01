# The Shared Care Plan and Claude: An Opportunity for Community Health

**A discussion document for NDC / RCN members**
*June 2026*

---

## What We Have Built

Over the past several months, the RCN technology team has built a working prototype of a **Shared Care Plan (SCP)** — a patient-controlled digital health record that lives in FedWiki, the federated wiki platform developed by Ward Cunningham. The SCP is designed for use in communities like Superior, AZ where provider access is limited and Community Health Workers (CHWs) play a central role in care.

### The Health Record Itself

The SCP is organized into twelve structured sections, each managed by a dedicated tool (plugin) in FedWiki:

| Section | What It Holds |
|---|---|
| **About Me** | Name, age, pronouns, language, emergency contact |
| **Diagnoses** | Active conditions, ICD codes, notes |
| **Medications** | Current medications, directions, timing, prescriber |
| **Vitals** | Blood pressure, pulse, weight, temperature, and more — with date and time |
| **Symptoms** | Current symptoms, severity, duration, actions taken |
| **Care Plan / Next Steps** | Action items, who is responsible, deadlines, status |
| **Medical Providers** | Doctors, specialists, phone numbers, when to call |
| **Care Team** | Family, friends, peers, CHWs, and other community support |
| **Visits** | Provider appointment records, reason, outcome, follow-up |
| **Allergies & Reactions** | Substances, severity, reaction descriptions |
| **Medical History** | Past events, hospitalizations, surgeries |
| **Medical Directives** | Advance directives, proxy, document location |

Each section is designed so that a CHW and patient can fill it in together during a home visit or office meeting. The patient owns the record. The CHW helps keep it current. Family members can be granted access. The record travels with the patient — across providers, across community organizations, across time.

A **Health Log** captures timestamped entries that don't replace the structured record but add a chronological narrative: symptoms that came and went, vitals over time, notes from a visit.

A **Vitals Chart** visualizes blood pressure (with clinical reference bands for normal, elevated, and high), pulse rate, and weight trend over time — giving patients and CHWs a picture of change that individual readings cannot.

### The Pre-Visit Summary

When a patient is preparing for a doctor's appointment or CHW meeting, they can generate a **Pre-Visit Summary** — a clean, printable document assembled automatically from their SCP. It pulls:

- Patient information (name, age, language, emergency contact)
- Active diagnoses
- Current medications and how they're being taken
- Recent vitals (last four readings)
- Current symptoms
- Open next steps from the care plan
- Providers and care team members
- Recent visits (last three months)
- Allergies and reactions
- Medical history
- Advance directives

The summary can be printed and handed to a provider, shared digitally, or simply used by the patient to organize their thoughts before a conversation. It can optionally include the full Health Log — a chronological record of everything the patient has tracked.

This document gives any provider — doctor, nurse, CHW, specialist — a complete picture of the patient in two pages, without requiring them to have access to a particular health system or electronic medical record.

---

## The New Possibility: Claude as Appointment Preparation Partner

We have added a **"Chat with Claude"** feature to the Pre-Visit Summary tool. When a patient clicks the button, two things happen automatically:

1. Their Shared Care Plan — all twelve sections — is assembled into a structured briefing document
2. A private conversation opens with Claude, Anthropic's AI, which has read the full briefing

Claude opens the conversation by greeting the patient by name and asking what's on their mind about the upcoming appointment.

The patient can then:

- Talk through what they want to bring up with their provider
- Ask Claude to explain something in their care plan in plain language
- Get help organizing their questions and priorities
- Work through anxiety or uncertainty about a visit
- Identify things they may have forgotten to mention

At the end of the conversation, the patient can print a formatted transcript — their questions, Claude's responses, organized and ready to take into the room.

**Claude does not diagnose. It does not prescribe. It does not contradict the care team.** Its role is to help the patient show up prepared — which is something that currently happens only for people who have someone to help them prepare.

---

## Why This Matters

### The Access Problem

In communities like Superior, AZ, provider access is limited. A patient may see their doctor twice a year. A CHW visit may be thirty minutes. The window to communicate what matters — the new symptom, the medication that isn't working, the worry that hasn't been named — is narrow.

Patients who arrive prepared use that window better. They ask clearer questions. They report what's relevant. They leave with better understanding of what comes next. For decades, that preparation has been a privilege of patients who have educated family members, patient advocates, or the time and literacy to navigate the system themselves.

An AI with access to the patient's own health record — on their terms, in their language, before the appointment — is a meaningful equalizer.

### The CHW Connection

Community Health Workers are trusted, embedded, and effective. They are also overextended. The SCP is designed to support CHWs, not replace them: it gives a CHW a structured record to work from, a summary to generate before a visit, and a way to stay current between visits.

The Claude feature extends this further. A CHW can encourage a patient to use the chat tool before a provider appointment — preparing the patient for a conversation the CHW won't be in the room for. Or a CHW and patient can work through the chat together as part of a home visit, using Claude to surface questions neither of them thought to ask.

### What We Do Not Yet Know

This is a prototype. There are things we need to learn:

- **What patients actually find helpful.** The design is based on our best thinking — it needs to be tested with real patients and iterated based on what they say.
- **What CHWs need to trust it.** A CHW recommending a tool to a patient is an act of trust. We need to understand what would make them comfortable doing that.
- **Where Claude gets it wrong.** AI systems make mistakes. We need to understand what kinds of errors occur in this context and how to catch them.
- **Access and privacy.** The SCP is designed with the patient as the owner. Claude runs in a private, local session — the conversation is not stored or transmitted. But we need to be explicit about what that means and verify it technically.
- **Language and literacy.** The current prototype is in English. Many patients in pilot communities may have limited English literacy or prefer Spanish. This needs to be addressed before real deployment.

---

## A Larger Opportunity

The current Claude product is cautious in health contexts — by design. It is calibrated for an anonymous user with no context, asking questions it cannot verify. The SCP changes that. Claude is no longer speaking to a stranger — it is speaking to a patient it knows, grounded in a record the patient has built and controls.

That difference is significant. It suggests a path toward AI that is genuinely more helpful in health contexts — not because the AI has been made less careful, but because the context has been made richer and more trustworthy.

Realizing that potential at scale would require something this community is well-positioned to contribute:

- **Clinical grounding** — physicians and CHWs defining what Claude should and should not engage with, and what it should refer elsewhere
- **Community feedback** — patients and families reporting what was helpful, what was confusing, what was missing, and what felt wrong
- **Trust infrastructure** — community organizations like NDCs serving as accountable intermediaries between patients and AI, rather than leaving patients to navigate AI tools alone
- **Shared governance** — a structured channel for community knowledge to inform how AI developers like Anthropic design and constrain health AI

The communities that need this most — rural, underserved, under-resourced — are rarely in the room when these decisions are made. NDCs are designed to change that pattern.

---

## Questions for Discussion

1. What would it take for a CHW in Superior to feel confident recommending this tool to a patient?

2. What do patients most need help preparing before a provider visit? Does the current design address those needs?

3. What are the risks we are not seeing? Who could be harmed, and how?

4. What would a formal relationship between an NDC and Anthropic look like? What would each party contribute, and what would each receive?

5. Is there a role for RCN as a vehicle for community-grounded AI governance in health? What would that require?

6. What needs to be true before the Superior AZ pilot can include real patient data?

---

*This document was prepared for internal RCN/NDC discussion. The Shared Care Plan prototype was built by the RCN technology team using FedWiki (Ward Cunningham), Claude AI (Anthropic), and the Groove collaboration workspace. Pilot deployment target: Superior AZ NDC, late 2026.*
