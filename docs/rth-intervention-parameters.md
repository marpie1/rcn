# ReThink Health Dynamics — Intervention Parameters

Extracted from *Reference Guide for the ReThink Health Dynamics Simulation Model, Model Version 3v* (Jack Homer, Homer Consulting, for the Fannie E. Rippel Foundation; November 2018, edited February 2020), Tables 2 and 3, printed pages 7–19.

Source PDF: https://rethinkarchive.rippel.org/wp-content/uploads/2019/09/ReThink-Health-Dynamics-Reference-Guide-v3v-Nov-2018-1.pdf

## Why this file exists

The full RTH model is out of reach to rebuild — roughly 1,000 constants, 4,400 calculated output elements, 12 lookup functions, 34–38 exogenous trends, and a population subscripted into 10 segments. What *is* portable is this: 23 interventions, each with a calibrated effect size, a stated min–max uncertainty range, a program cost, and a literature citation. Those numbers are reusable as priors in a model of any size, in any tool, without importing a line of their Vensim code.

Every effect size below is a **multiplier or relative rate**, not an absolute prediction. A value of .50 means "halves the thing named." A value of 1.3 means "multiplies the thing named by 1.3." The min and max columns are the range Homer considers useful for sensitivity testing — treat them as the honest width of the uncertainty, not as error bars.

## Two calibration notes before using any number

**All dollar figures are 2010 dollars.** They need inflation adjustment before use in 2026 planning, and medical-care inflation has run well above general CPI over that span. Adjust deliberately and say which index you used.

**Anytown is close to Whatcom scale.** Anytown is calibrated as exactly one-thousandth of the US population — about 309,000 people at the 2010 base year. Whatcom County is roughly 226,000. Same order of magnitude, Whatcom about three-quarters the size. Per-capita figures transfer with reasonable confidence; absolute totals need scaling by roughly 0.73.

## Upstream / population-level interventions

These act on risk before it becomes illness. In the model, catalytic funds can be explicitly restricted to "upstream" initiatives — this is that set.

### 1. Enable healthier behaviors

Promote healthy behavior and help people stop behaviors leading to chronic physical illness — smoking, poor diet, inadequate exercise, alcohol and drug abuse, unprotected sex. May be targeted at the disadvantaged only, or at youth / working age / seniors only.

Modeled consequences: reduces onset of mild and severe chronic physical illness, the likelihood of urgent events (heart attacks from cigarette smoke), and onset of mental illness associated with drug abuse. Also reduces need for medications for lifestyle-related disorders such as asymptomatic hypertension and high cholesterol.

| Constant | Baseline | Min | Max |
|---|---|---|---|
| Relative behavior risk onset under healthy behavior initiative | .50 | .35 | .65 |
| Relative behavior risk reform under healthy behavior initiative | 2.5 | 2.0 | 3.0 |
| Per target population program cost ($ per person engaged in risky behavior per year) | $100/yr | $30/yr | $300/yr |

Sources: Angell et al 2009; Brown et al 1991; CDC 2007; CDC 2009; CEBP 2013; Chaloupka et al 1996; DHHS 2000; Farkas et al 2000; Farrelly et al 2008; Fichtenberg and Glantz 2002; Gerberding 2005; Glanz and Yaroch 2004; Glasgow et al 1997; Hingson and Sleet 2006; IOM 2007; Kahn et al 2002; Kruger et al 2007; Levi et al 2008; Longo et al 2001; McKinlay and Marceau 2000; Mokdad and Remington 2010; Moskowitz et al 2000; Powell et al 2007; Smedley and Syme 2000; Yach et al 2005; Homer et al 2010; Milstein et al 2011.

### 2. Reduce environmental hazards

Reduce the fraction of people with significant exposure to environmental hazards and pollutants in homes, neighborhoods, or workplaces. May be targeted at the disadvantaged only.

Modeled consequences: reduces onset of mild and severe chronic physical illness (cardiovascular disease, asthma, cancer, chronic lead poisoning), and the likelihood of injuries (fire, falls, drowning, heat stroke) and other urgent events (heart or respiratory attacks triggered by air pollution) requiring an ER visit.

| Constant | Baseline | Min | Max |
|---|---|---|---|
| Multiplier on fraction of population in hazardous environment | .50 | .35 | .65 |
| Time for initiative to reduce hazard prevalence | 5 yrs | 3 yrs | 7 yrs |
| Per target population program cost ($ per person in hazardous environment per year) | $200/yr | $60/yr | $600/yr |

Sources: Brownson et al 2006; Dominici et al 2007; Northridge et al 2003; NSC 2003; Homer 2013; Milstein et al 2011.

### 3. Reduce crime

Reduce the fraction of people who live and work in high crime areas. May be targeted at the disadvantaged only.

Modeled consequences: reduces the likelihood of injuries requiring an ER visit, and discourages unhealthy behaviors (physical inactivity, drug abuse, unprotected sex) while encouraging healthy ones.

| Constant | Baseline | Min | Max |
|---|---|---|---|
| Multiplier on fraction of population in high crime area | .50 | .35 | .65 |
| Time for initiative to reduce high crime prevalence | 5 yrs | 3 yrs | 7 yrs |
| Per target population program cost ($ per person in high crime area per year) | $200/yr | $60/yr | $600/yr |

Sources: CEBP 2013; NSC 2003; Milstein et al 2011.

### 4. Create student pathways to advantage

Programs for disadvantaged high school and college students to improve graduation and matriculation rates. Greater educational attainment improves the chance of becoming advantaged through higher-paying jobs.

Modeled consequences: the advantaged are less likely to engage in unhealthy behavior, live in hazardous or high-crime environments, develop chronic physical or mental illness, be uninsured, or go to hospital for non-urgent care — and more likely to engage in self-care and care-seeking.

| Constant | Baseline | Min | Max |
|---|---|---|---|
| Relative disadvantaged fraction for completors of student pathways programs | .81 | .70 | .92 |
| Time for initiative to reduce disadvantaged fraction | 5 yrs | 2 yrs | 8 yrs |
| Per completor program cost | $14,000 | $3,000 | $30,000 |

Source and rationale: CEBP 2013. Combines costs and effects of three programs — Carrera Adolescent (high school completion), H&R Block (financial aid application), and Inside Track (college completion). Educational attainment is translated to projected reductions in disadvantage based on analysis of ACS/Census 2006–10. **More than 90% of the combined cost and more than 50% of the projected impact is from the Carrera program alone.**

### 5. Create family pathways to advantage

Policies and programs — living wage policies, tax credits and subsidies, housing vouchers — to improve economic prospects so that some disadvantaged families earning below twice the federal poverty level may become advantaged.

Modeled consequences: same as student pathways.

| Constant | Baseline | Min | Max |
|---|---|---|---|
| Relative disadvantaged fraction under family pathways initiative | .825 | .70 | .95 |
| Time for initiative to reduce disadvantaged fraction | 3 yrs | 1 yr | 5 yrs |
| Per target population program cost ($ per disadvantaged person per year) | $1,000/yr | $300/yr | $3,000/yr |

Sources and rationale: CAP 2007; Giannarelli et al 2007. The latter indicates a combination of wage-tax-voucher policies could reduce poverty about 33%; translated to a 17.5% reduction in disadvantage via linear regression of Census data 1997–2010. The time constant reflects time for programs to be implemented community-wide and for recipients to make an established escape from disadvantage.

## Care quality interventions

### 6. Improve routine preventive & chronic physical illness care

Improve physician compliance with recommended guidelines for preventive and chronic physical illness care — screening, immunization, lifestyle counseling, referral to behavioral and mental health counselors. May require investment in reminder systems and training.

Modeled consequences: reduces death rates and frequency of acute and urgent episodes among patients with chronic physical illness, and rates of onset of mild and severe chronic physical illness; increases rates of behavioral reform and mental illness control. Benefits come at the cost of additional physician visits and increased medication use.

| Constant | Baseline | Min | Max |
|---|---|---|---|
| Multiplier on prev/chron guideline non-compliance under quality initiative | .50 | .35 | .65 |
| Time for prev/chron care to affect disease outcomes | 2 yrs | 1.5 yrs | 2.5 yrs |
| Relative rate of mild CPI onset under full prev/chron care | .67 | .50 | .84 |
| Relative rate of severe CPI onset under full prev/chron care | .33 | .25 | .41 |
| Relative risky behavior reform under full prev/chron care | 1.3 | 1.2 | 1.4 |
| Mitigation of excess risk of non-urgent acute episodes from CPI under proper chronic care | .50 | .35 | .65 |
| Mitigation of excess risk of urgent episodes from CPI under proper chronic care | .50 | .35 | .65 |
| Relative uncontrolled CMI under full physical prev/chron care | .80 | .70 | .90 |
| Time to implement quality initiative | 1 yr | 0.5 yrs | 3 yrs |
| Per office-based physician program cost (2010 $ per FTE per year) | $29,000/yr | $10,000/yr | $45,000/yr |

Sources: Asch et al 2006; CDC/DCEG 2002; Commonwealth Fund 2008; Donnelly et al 2008; Farley et al 2010; Ho et al 2006; IOM 2001; Jencks et al 2003; Kahn et al 2008; Kottke 2010; Larme and Pugh 2001; McGlynn et al 2003; Russell 2009; Wagner et al 1996; WHO 2002; Milstein et al 2010; Milstein et al 2011. Cost from Magill et al 2015 — "manage populations with outreach and registries, do care management, and enforce guidelines." Does not include pre-visit consultation, which is a separate intervention.

### 7. Improve care for chronic mental illness

Help the mentally ill better control their symptoms and live more positively and productively. May be targeted at the disadvantaged only.

Modeled consequences: reduces urgent psychological visits to the ER; improves routine physical care-seeking and self-care. Costs come as increased medication use and additional visits to mental health professionals.

| Constant | Baseline | Min | Max |
|---|---|---|---|
| Relative uncontrolled CMI under mental illness care initiative | .50 | .35 | .65 |
| Per target population program cost (2010 $ per otherwise uncontrolled CMI person per year) | $800/yr | $240/yr | $2,400/yr |

Sources and rationale: NIMH 2001; Pratt et al 2007; Homer 2013. The program steers people into proper care (talk therapy and medications); insurance is assumed to cover half or more of the cost, with the program subsidizing the balance.

### 8. Support self-care

Help people with adherence problems get regular preventive and chronic care and follow physician advice on medications and self-care. May involve reminder systems, transportation, and support services. May be targeted at the disadvantaged only.

Modeled consequences: improves the extent and effectiveness of preventive and chronic physical illness care, and reduces the likelihood of hospital readmission.

This intervention is specified per population segment rather than as a single multiplier. Values are given as (Insured Advantaged, Insured Disadvantaged, Uninsured Advantaged, Uninsured Disadvantaged), first initially and then under the initiative.

| Constant | Initially | Under initiative |
|---|---|---|
| Fraction seeking prev/chron care | .9, .7, .6, .35 | .95, .9, .7, .6 |
| Fraction adhering to self-care per doctor's orders | .8, .6, .8, .6 | .9, .8, .9, .8 |

| Constant | Baseline | Min | Max |
|---|---|---|---|
| Time for self-care support to affect behavior | 1 yr | 0.5 yrs | 3.0 yrs |
| Per target population cost, advantaged (2010 $ per otherwise non-adherent person per year) | $100/yr | $30/yr | $300/yr |
| Per target population cost, disadvantaged (2010 $ per otherwise non-adherent person per year) | $200/yr | $60/yr | $600/yr |

Sources: O'Connor 2006; Gonzales et al 2007; Milstein et al 2010. The program helps pay for self-care support including a reminder system and, for the disadvantaged, logistical assistance such as transportation and childcare.

## Provider capacity and efficiency interventions

### 9. Prevent hospital-acquired infections (HAI)

Procedural changes in hospitals to reduce the fraction of inpatients that develop an HAI.

Modeled consequences: fewer deaths and fewer extended lengths of stay. Because the reimbursement trend is toward reduced or non-reimbursement for HAI costs, a lower HAI rate will improve a hospital's profit margin.

| Constant | Baseline | Min | Max |
|---|---|---|---|
| Multiplier on HAI fraction of stays under prevention initiative | .50 | .35 | .65 |
| Time to implement | 1 yr | 0.5 yrs | 3.0 yrs |
| Per 100 beds program cost (2010 $ per 100 beds) | $1 million | $300 thousand | $3 million |
| Obsolescence rate for HAI prevention investments | 10%/yr | 5%/yr | 15%/yr |

Sources: Adams and Corrigan 2003; Pronovost et al 2006; Guerin et al 2010; Homer and Curry 2011. Assumes a full range of HAI prevention investments aimed at all major HAI categories. Obsolescence reflects that data-capture and reporting systems need periodic updating and new staff need training.

### 10. Redesign primary care practices for efficiency

Increase the fraction of PCP practices streamlined to run efficiently — the "idealized design of clinical office practices" (IDCOP) approach: appointment scheduling, staff utilization, information technology. May be focused on FQHC PCPs only.

Modeled consequences: practice redesign helps PCPs better accommodate demand.

| Constant | Baseline | Min | Max |
|---|---|---|---|
| Multiplier on General PCP visit capacity | 1.15 | 1.10 | 1.20 |
| Multiplier on FQHC PCP visit capacity | 1.15 | 1.10 | 1.20 |
| Time to implement | 1 yr | 0.5 yrs | 3.0 yrs |
| Per PCP program cost, one-time (2010 $ per FTE) | $20,000 | $6,000 | $60,000 |
| Per PCP program cost, ongoing (2010 $ per FTE per year) | $28,000/yr | $5,000/yr | $35,000/yr |

Sources: Milstein et al 2010; Radel et al 2001, and other IDCOP literature. Ongoing cost from Magill et al 2015 — "enhance access with extended hours, electronic access, and practice care team."

### 11. Recruit primary care providers for general (non-FQHC) offices and clinics

Recruit more general PCPs serving the non-poor (insured and self-paying) and the insured poor (Medicaid). Tactics include first-year income guarantees and local PCP residency programs.

| Constant | Baseline | Min | Max |
|---|---|---|---|
| Multiplier on General PCPs under recruitment initiative | 1.3 | 1.2 | 1.4 |
| General PCP relocation time | 2 yrs | 1.5 yrs | 3 yrs |
| Recruitment program cost per arriving PCP (2010 $ per FTE) | $200 thousand | $50 thousand | $500 thousand |

Rationale: assumes recruitment can significantly boost a community's ability to attract PCPs. Relocation time is the average time to consider options, including offers and negotiations, and to make the move. Cost is primarily subsidy of PCP income based on a guaranteed minimum for the first year or more.

### 12. Recruit primary care providers for FQHC clinics

Recruit more PCPs serving the poor, insured and uninsured, in Federally Qualified Health Center clinics.

| Constant | Baseline | Min | Max |
|---|---|---|---|
| Multiplier on FQHC PCPs under recruitment initiative | 1.3 | 1.2 | 1.4 |
| FQHC PCP relocation time | 2 yrs | 1.5 yrs | 3 yrs |
| Recruitment program cost per arriving PCP (2010 $ per FTE) | $200 thousand | $50 thousand | $500 thousand |

Rationale: as above, for FQHC clinics.

### 13. Improve hospital efficiency

Process improvements that reduce average length of stay for inpatients.

Modeled consequences: allows a reduction in beds for a given volume of inpatients, reducing operating costs and improving hospital profit margin.

| Constant | Baseline | Min | Max |
|---|---|---|---|
| Multiplier on length of stay | .85 | .80 | .90 |
| Time to implement | 1 yr | 0.5 yrs | 3.0 yrs |
| Per 100 beds program cost (2010 $ per 100 beds) | $1.7 million | $500 thousand | $5.0 million |
| Obsolescence rate for efficiency investments | 10%/yr | 5%/yr | 15%/yr |

Rationale: acute-care hospitals have already reduced length of stay — national average 7.2 days in 1990, 5.8 in 2000, 5.4 in 2010, 5.5 in 2016 — but hospital leaders report more could be done; the Vanguard hospital system is cited as planning 15% further cost reductions.

## Care delivery redesign interventions

### 14. Offer pre-visit consultation for non-urgent episodes

Telephone call centers staffed by trained triage nurses with software support, advising callers whether to seek medical care for a non-urgent episode or care for themselves at home.

Modeled consequences: reduces primary visits to physicians and non-urgent visits to ERs, without affecting quality or intensity of care for conditions that should receive medical care.

| Constant | Baseline | Min | Max |
|---|---|---|---|
| Relative non-urgent acute episodes to PCPs and Specialists | .85 | .80 | .90 |
| Relative non-urgent acute episodes to ER | .76 | .70 | .80 |
| Time to implement | 1 yr | 0.5 yrs | 3.0 yrs |
| Per capita program cost (2010 $ per total population) | $12/yr | $4/yr | $40/yr |

Sources and rationale: O'Connell et al 2001; St. George et al 2003. Cost based on average telephone triage nurse salary of $74k, approximately 20 office-based MDs per 10k population in the US (AMA/PCDUS), and a ratio of one triage nurse per 12 MDs.

### 15. Create patient-centered medical homes

Ensure more patients go to PCPs, rather than specialists or hospitals, for routine care and as first stop for non-urgent episodic care. Medical homes need electronic medical records and possibly decision-support systems for effective referrals.

Modeled consequences: can reduce cost of routine visits and non-urgent acute care, improve adherence, and reduce referrals and admissions generated by non-urgent acute care. Decision support should reduce PCP susceptibility to costly new hospital service offerings. **However**, more patients means more demand on PCPs, creating the possibility — unless averted by other means — of a PCP shortage for some population segments.

| Constant | Baseline | Min | Max |
|---|---|---|---|
| Relative prev/chron care to specialists under medical home | .50 | .35 | .65 |
| Relative non-urgent acute episodes to specialists | .50 | .35 | .65 |
| Relative prev/chron care to hospital OPDs | .67 | .50 | .84 |
| Relative non-urgent acute episodes to hospital OPDs | .67 | .50 | .84 |
| Fraction of self-care gap closed under medical home | .10 | .05 | .15 |
| Time to implement | 1 yr | 0.5 yrs | 3 yrs |
| Per PCP program cost, one-time (2010 $ per FTE) | $20,000 | $6,000 | $60,000 |
| Per PCP program cost, ongoing (2010 $ per FTE per year) | $10,000/yr | $3,000/yr | $15,000/yr |

Sources: Commonwealth Fund 2011; Rittenhouse et al 2011; Klein et al 2010. Commonwealth Fund 2011 shows approximately a 20% boost in physician use of self-care plans and reminders under medical home; assumes such plans can change behavior for half of initially non-adherent patients. Ongoing cost from Magill et al 2015 — "provide self-care support and referrals to community resources."

### 16. Coordinate health care

Coordinate patient care and provide coaching for patients and physicians to reduce duplicative or unnecessary referrals and admissions and reduce medication costs. Requires sophisticated integrated information systems, coaching arrangements, and shared decision-making protocols. Optionally includes a regular technology assessment process by which new, higher-priced medical technologies are assessed and rejected if they fail cost-effectiveness criteria.

Modeled consequences: reduces follow-up actions from an initial physician visit that might result in duplicative or unnecessary services — referrals to specialists, ambulatory tests and procedures, hospital admissions — without adversely affecting health outcomes. Also reduces ongoing medication costs by rationalizing prescription drug use.

| Constant | Baseline | Min | Max |
|---|---|---|---|
| Multiplier on fraction of non-urgent acute episodes with referral to specialist | .75 | .65 | .85 |
| Multiplier on fraction to outpatient tests or procedures | .75 | .65 | .85 |
| Multiplier on fraction to inpatient stay | .75 | .65 | .85 |
| Multiplier on Rx drug costs per mild CPI patient | .90 | .80 | 1 |
| Multiplier on Rx drug costs per severe CPI patient | .75 | .65 | .85 |
| Time to implement | 1 yr | 0.5 yrs | 3 yrs |
| Fraction of cost growth mitigated by technology assessment | .33 | .25 | .40 |
| Delay time for starting technology assessment | 2 yrs | 1 yr | 3 yrs |
| Multiplier on cost of care coordination from technology assessment | 1.25 | 1.10 | 1.40 |
| Per office-based physician program cost (2010 $ per FTE per year) | $15,000/yr | $5,000/yr | $20,000/yr |

Sources and rationale: Klein et al 2010; Commonwealth Fund 2011. Technology assessment assumes new technology brings progress, but that one-third of new things are not cost-effective and an enhanced coordination system with frequent assessment could screen them out before they become entrenched. Cost from Magill et al 2015 — "track and coordinate care, including follow-up and care transitions."

### 17. Reform medical malpractice

Institute tort limits or a fairer adjudication process so fewer lawsuits go forward and doctors see less need for purely defensive practices.

Modeled consequences: reduces referrals to specialists, ambulatory tests and procedures, hospital admissions, and use of high-priced medications — without adversely affecting health outcomes.

| Constant | Baseline | Min | Max |
|---|---|---|---|
| Multiplier on fraction of non-urgent acute episodes with referral to specialist | .975 | .965 | .985 |
| Multiplier on fraction to outpatient tests or procedures | .975 | .965 | .985 |
| Multiplier on fraction to inpatient stay | .975 | .965 | .985 |
| Multiplier on Rx drug costs per mild CPI patient | .99 | .985 | .995 |
| Multiplier on Rx drug costs per severe CPI patient | .975 | .965 | .985 |
| Time to implement | 1 yr | 0.5 yrs | 3 yrs |
| Per office-based physician program cost (2010 $ per FTE per year) | $1,500 | $500 | $5,000 |

Sources and rationale: Kessler and McClellan 1996; CBO 2006; Mello et al 2010; Wright 2011. Together these suggest malpractice reform can reduce total healthcare costs by 0.8–1.4%. Local communities may not be able to institute tort limits but should be able to establish lawsuit screening panels. **The modeled impact on utilization factors is deliberately set at 10% that of Care Coordination.**

### 18. Improve post-discharge care

Reduce readmission risk through improved discharge practices, including medication reconciliation and more referral to home health care and skilled nursing facilities for rehabilitation.

Modeled consequences: reduces hospital utilization and costs, but increases costs of home health care and nursing facilities.

| Constant | Baseline | Min | Max |
|---|---|---|---|
| Multiplier on fraction of inpatients to home health | 1.4 | 1.2 | 1.8 |
| Multiplier on fraction of inpatients to SNF | 1.4 | 1.2 | 1.8 |
| Multiplier on readmissions from inadequate medication reconciliation | 0.1 | 0 | 0.2 |
| Time to implement | 1 yr | 0.5 yrs | 3 yrs |
| Per 100 beds program cost (2010 $ per 100 beds) | $1 million | $300 thousand | $3 million |
| Obsolescence rate for post-discharge investments | 10%/yr | 5%/yr | 15%/yr |

Sources and rationale: a proprietary ACO study by Vanguard Health System indicates discharges to home health and SNF could be increased significantly. Hospital physicians consulted state that with proper attention the great majority of medication reconciliation problems could be eliminated — hence the 0.1 multiplier.

### 19. Expand the use of reduced-intensity end-of-life care

Increase the fraction of end-of-life patients using hospice services or hospital-based palliative care, both of which reduce the intensity of care.

Modeled consequences: reduces health care costs.

| Constant | Baseline | Min | Max |
|---|---|---|---|
| Multiplier on hospice use under hospice initiative | 1.35 | 1.25 | 1.45 |
| Time to implement | 1 yr | 0.5 yrs | 3 yrs |
| Fraction of deaths using hospital palliative care, initial | 27% | 20% | 35% |
| Multiplier on hospital palliative care use | 1.2 | 1.1 | 1.3 |
| Average savings per inpatient stay using palliative care (2010 $ per stay) | $5,400 | $3,000 | $7,000 |
| Per capita program cost (2010 $ per total population per year) | $1.25/yr | $0.50/yr | $3.00/yr |

Sources and rationale: Taylor et al 2007; NHPCO 2010; Garson and Engelhard 2011; Morrison et al 2008; McCarthy et al 2015. The 1.35 multiplier means hospice use in dying seniors would increase from 42% nationally to 57%. 37% of all deaths occur during an inpatient stay and about half of those get palliative care. Combined, the two would bring overall use of end-of-life care from 69% to 89% of all US deaths.

## Payment interventions

Neither of these has a program cost in the model — they are payment design changes, not funded programs.

### 20. Expand the use of value-based payments

Value-based payment establishes basic care standards and rewards activities that improve quality or efficiency of care. The fraction of the insured population under VBP may be expanded beyond default values via a single time series.

Modeled consequences: improves effort on six provider-driven activities — preventive and chronic care quality, care coordination, medical home, self-care support, PCP practice redesign, and post-discharge care quality.

| Constant | Baseline | Min | Max |
|---|---|---|---|
| Provider compliance with 6 community initiatives absent VBP | 0.8 | 0.6 | 1 |
| Provider effort on 6 improvements incentivized by VBP absent community initiative | 0.1 | 0 | 0.3 |

Sources: Robinson 2001; Hussey et al 2009; Mechanic and Altman 2009; Miller 2009; Miller 2011; Landon 2012; Homer 2015c. Parameter settings are noted as being at the suggestion of Dartmouth's Elliott Fisher.

### 21. Expand the use of global payments

Global payment for physicians typically means a fixed salary with no fee-for-service extras or bonuses. For hospitals it means an insurance plan paying a capitated amount per insured population. Fractions of PCPs, specialists, and hospital patients under global payment may be expanded beyond defaults via three time series.

Modeled consequences: suppresses the "pushback" responses of specialists to loss of income. For some number of years it mitigates the loss of income for specialists and hospitals that would accompany care coordination and other utilization-reducing initiatives.

| Constant | Baseline | Min | Max |
|---|---|---|---|
| Global payment adjustment time | 5 yrs | 2 yrs | 10 yrs |

Source and rationale: Homer 2015c. Salaries to physicians and global payments to hospitals are subject to annual adjustment by payers based on changing care intensity and utilization; the model assumes this adjustment converges over years toward the fee-for-service equivalent.

## Funding mechanisms

### 22. Obtain catalytic funds for funding initiatives

Six sources may be specified: (1) grants and assistance, (2) loans, (3) a tax on commercial healthcare costs, (4) a tax per employee, (5) a consumption tax on sweet beverages, (6) a consumption tax on cigarettes. The first two are specified by time series; taxes start at a given time and are specified by a rate constant. For each of the six, fractions may be restricted to "upstream" initiatives, "downstream" initiatives, or left unrestricted.

Modeled consequences: unused catalytic funds roll over to the next year and may be used at any time. If funding is insufficient to cover all desired program spending, spending on initiatives will be limited. **If funding ceases and all funds are depleted, gains made to date start to erode and will eventually erode entirely.**

| Mechanism | Baseline setting |
|---|---|
| Grants and assistance | $24 million per year (1% of healthcare costs) for 5 years starting 2015; no upstream or downstream restrictions |
| Loans | Zero inflow and repayment; no restrictions |
| Tax on commercial healthcare costs | Zero tax fraction, zero time delay, zero restrictions |
| Tax per employee | 100% of employees affected, zero tax rate, zero delay, zero restrictions |
| Sweet beverage tax | Rate base 0 (test value 1 cent/oz), zero delay, zero restrictions; does not exclude diet beverages |
| Cigarette tax | Rate base 0 (test value $1.00/pack), zero delay, zero restrictions |

Sweet beverage tax response parameters: 8 cents/oz base price; 8% reduction in consumption per 10% tax, with half-year response time; 5,200 oz per capita per year absent tax; 62% of sweet beverages are sugar-sweetened.

Cigarette tax response parameters: $6.24/pack base price; 8.4% reduction per 10% tax with 7.5 year average response time (PRISM); smokers are 24% of the high-risk-behavior population in 2015 (BRFSS); 300 average packs per smoker per year.

Rationale: communities reported the 1% × 5 years grant assumption as plausible. Tax response figures see Homer 2013 (PRISM); Campaign for Tobacco-Free Kids 2013; Tynan et al MMWR 2012.

### 23. Capture and reinvest savings

Negotiating with payers — Commercial, Medicare, Medicaid — to calculate healthcare cost savings against appropriate benchmarks and return some fraction to the community. Savings may fund the initiatives above, or be shared with providers or employers. For each of the three payer types, fractions of captured savings may be restricted to upstream or downstream initiatives.

Modeled consequences: the negotiated fraction returned starts at a nominal level but is adjusted downward if accumulated funds become much greater than the community needs. Unused savings roll over. Captured savings are not segregated from catalytic funds — the two merge as total funds available.

| Constant | Baseline setting |
|---|---|
| Maximum fraction of cost savings available to community, by insurer | .5 Commercial, .5 Medicare, .5 Medicaid |
| Fraction of captured savings shared with hospitals; physicians; employers | 0; 0; 0 |

Important nonlinearity: if accumulated funds exceed 6 years' worth of desired program spending, the actual captured fraction starts to be cut back from the maximum. If accumulated funds exceed 15 years' worth, the captured fraction is cut to zero.

Sources and rationale: Fisher, McClellan et al 2009; Merlis 2010; Miller 2011; McGinnis and Small 2012. The 50% capture is provisionally assumed for all insurer types based on Medicare's ACO design specifications. The zero sharing fractions are set provisionally — negotiations could result in a significant fraction.

## What to notice when reading these as a set

**The upstream interventions are slow.** Environmental hazards, crime, and student pathways all carry 5-year time constants to full effect, and family pathways 3 years. Every clinical and delivery intervention implements in 1 year. Any scenario judged on a short horizon will systematically favor downstream work — which is a property of the *timing*, not of the value.

**Malpractice reform is deliberately weak.** Homer set its effect at exactly 10% of Care Coordination's. It is in the model as a completeness item, not a lever.

**Two interventions have no program cost at all** — value-based payment and global payment. They are free in the model's accounting, which makes them unusually attractive in any ROI comparison. That is worth flagging when the numbers get used in an argument.

**One intervention creates a shortage.** Medical homes pull patients toward PCPs and the model explicitly warns this can create a PCP shortage unless paired with recruitment or practice redesign. This is the clearest example in the table of interventions that must be combined rather than chosen singly.

**The funding mechanisms have an erosion clause.** Gains are not permanent. If funding ceases and accumulated funds deplete, the model erodes accumulated gains back toward baseline. Any presentation of results needs to state the funding duration assumption alongside the outcome.

**More than 90% of the student pathways cost is one program.** The Carrera program dominates both cost and impact in that line. Treat "student pathways" as shorthand for Carrera plus two minor additions, not as a general category estimate.
