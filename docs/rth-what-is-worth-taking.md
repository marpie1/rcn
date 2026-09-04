# What Is Worth Taking From ReThink Health

The ReThink Health Dynamics model is a system dynamics simulation of a regional health system, built in Vensim by Jack Homer, Gary Hirsch and John Sterman under Bobby Milstein, for the Fannie E. Rippel Foundation. It won the System Dynamics Society's Applications Award. It has been calibrated for more than ten regions, and a national-average configuration called "Anytown USA" is free to use online. We went looking at it for [[Whatcom Wealth and Health]] and this page records what came back.

The short answer: take the parameters, not the model.

## Why we are not rebuilding it

The model's own accounting, from page 2 of its reference guide: about 1,000 constants, 12 X-Y lookup functions, 4,400 calculated output elements, 27 data time series for validation, and somewhere between 34 and 38 exogenous trends depending on which page you read. The Vensim equation listing runs from page 98 to page 265. The population is subscripted into ten segments — three age bands crossed with insured or uninsured, crossed with advantaged or disadvantaged — and most population, utilization and cost variables are calculated per segment and then rolled up.

That is not a tool gap we can close. It is a multi-year modelling programme with a professional modelling team, and it is exactly the kind of undertaking Homer does for a living.

There is a second reason, which matters more. Even a perfect copy would hand us Anytown. Those thousand constants are calibrated to US national survey data — NSCH, BRFSS, NHANES, NAMCS, MEPS, the American Hospital Association survey. Whatcom numbers are not in there. Copying the model would give us a very sophisticated way to describe the average American county.

## The shape of it

The model's own overview diagram carries roughly sixty nodes with arrows crossing in every direction. It is a reference for modellers. It is not an image a group can point at and argue about, which is the standard we hold ourselves to — see [[Cave Drawings]].

So we redrew it at fifteen nodes. The redraw is in the repository as tools/rth-overview-cave-drawing.rcn.json, openable in the [[RCN Graph Tool]].

Read it as one counterclockwise circulation. Along the top runs the causal spine: disadvantage raises risk exposure, risk raises chronic illness, illness produces acute episodes, episodes and illness together drive care utilization, and utilization drives cost. On the right, cost becomes savings measured against a benchmark. Savings flow left into a fund. The fund pushes up into four families of intervention. The interventions push up into the spine. Then round again.

Three feedback loops close the picture, and all three are vicious. Rising cost pushes employers to drop coverage, which cuts insurance coverage. Rising cost drives personal indebtedness, which raises disadvantage. And chronic illness causes disability, which also raises disadvantage. These loops are why the system does not drift back toward health on its own.

## The twenty-three interventions

The model offers 23 interventions, which fall into five groups. The model itself distinguishes "upstream" from "downstream" because catalytic funds can be restricted to one or the other.

- Upstream, acting on risk before it becomes illness: enable healthier behaviours; reduce environmental hazards; reduce crime; create student pathways to advantage; create family pathways to advantage.
- Care quality: improve routine preventive and chronic physical illness care; improve care for chronic mental illness; support self-care.
- Provider capacity and efficiency: prevent hospital-acquired infections; redesign primary care practices for efficiency; recruit primary care providers for general offices and clinics; recruit primary care providers for FQHC clinics; improve hospital efficiency.
- Care delivery redesign: offer pre-visit consultation for non-urgent episodes; create patient-centred medical homes; coordinate health care; reform medical malpractice; improve post-discharge care; expand reduced-intensity end-of-life care.
- Payment and funding: expand value-based payments; expand global payments; obtain catalytic funds; capture and reinvest savings.

Each one carries a calibrated effect size, a stated minimum and maximum for sensitivity testing, a program cost, and literature citations. That is the portable part. Those numbers are usable as priors in a model of any size, in any tool, without importing a line of Vensim.

## Six things to know before quoting any of it

**Upstream is slow by construction.** Environmental hazards, crime, and student pathways all carry five-year time constants to full effect, and family pathways three years. Every clinical and delivery intervention implements in one year. Judge a scenario on a short horizon and downstream work wins on timing alone, regardless of merit. This is a property of the clock, not of the value.

**Two interventions cost nothing.** Value-based payment and global payment have no program cost in the model at all. Free levers look extraordinarily attractive in any return-on-investment comparison, and that should be said out loud whenever these numbers enter an argument.

**Malpractice reform is a placeholder.** Homer set its effect at exactly ten per cent of care coordination's. It is in the model for completeness, not as a lever anyone should reach for.

**Medical homes create a shortage.** The model explicitly warns that pulling patients toward primary care can produce a primary care shortage for some population segments unless it is paired with recruitment or practice redesign. This is the clearest case in the whole table that interventions must be combined rather than chosen singly.

**Gains erode.** If funding ceases and accumulated funds deplete, the model erodes gains made to date and eventually erodes them entirely. There is also a nonlinearity worth knowing: if accumulated funds exceed six years of desired spending the captured savings fraction starts to be cut back, and beyond fifteen years it is cut to zero. Any result has to be presented alongside its funding-duration assumption.

**"Student pathways" is really one program.** More than ninety per cent of the cost and more than half the projected impact in that line comes from the Carrera Adolescent program alone. Treat it as shorthand for Carrera plus two minor additions, not as a general category estimate.

## Two calibration facts

All dollar figures in the model are 2010 dollars. They need inflation adjustment before they go anywhere near 2026 planning, and medical care inflation has run well above general CPI across that span. Adjust deliberately and state which index was used.

Anytown is close to Whatcom scale. It is calibrated as exactly one-thousandth of the US population, about 309,000 people at the 2000 base year. Whatcom County is roughly 226,000. Same order of magnitude, Whatcom about three-quarters the size. Per-capita figures transfer with reasonable confidence. Absolute totals need scaling by roughly 0.73.

## Where the details are

Every constant, with its baseline, minimum, maximum and sources, is extracted in the repository at docs/rth-intervention-parameters.md.

The source document is the Reference Guide for the ReThink Health Dynamics Simulation Model, Model Version 3v, November 2018, edited February 2020, prepared by Jack Homer for the Fannie E. Rippel Foundation. It is public at https://rethinkarchive.rippel.org/wp-content/uploads/2019/09/ReThink-Health-Dynamics-Reference-Guide-v3v-Nov-2018-1.pdf and needs no account.

The Anytown simulator itself is at https://forio.com/app/rippel/rethink-health/login.html and does need one. Access is a separate matter and not required for anything on this page.
