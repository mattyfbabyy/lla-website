// ============================================================
//  Luxury Leasing Academy - Site Builder
//  Reads content.json + templates, writes the full site to /public
//  You do NOT need to edit this file. Edit content.json instead.
// ============================================================
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const OUT = path.join(ROOT, 'public');
const C = JSON.parse(fs.readFileSync(path.join(ROOT, 'content.json'), 'utf8'));
const CSS_SHARED = fs.readFileSync(path.join(ROOT, 'templates_css_shared.css'), 'utf8');
const CSS_HOME = fs.readFileSync(path.join(ROOT, 'templates_css_home.css'), 'utf8');

// ---- Course data (structural; rarely changes, lives here not in content.json) ----
const COURSES = [
 {n:1, price:'$497', slug:'course-1', title:'Luxury Leasing Fundamentals', level:'Beginner', lessons:49,
  promise:"The foundation most agents skip: how the luxury rental market actually works, and how to position yourself as the agent high-end clients want to work with.",
  who:["You're brand new, or still working on your license, and want to start right","You started in real estate but never built a real foundation","You're switching from sales to rentals and want the full picture"],
  modules:["Welcome: Your Luxury Leasing Launchpad","Understanding Luxury Leasing","Getting Licensed","Choosing the Right Brokerage","Mastering Your Market","Building a Professional Foundation","Cultivating a Relentless Mindset","Your Launch Action Plan (Track A & Track B)"],
  deliverables:["LLA Master Lead Tracker","Professional Habits Tracker","Mindset Journal","CRM + Tools Setup","DM & Outreach Tracker","Email Starter Pack","Client Avatar Worksheet","Neighborhood Research Guide","Tour Log Template","Luxury Leasing Vocabulary Guide","Branding Quick Start Guide","Client Introduction Video Scripts","Brokerage Interview Questionnaire & Checklist"]},
 {n:2, price:'$497', slug:'course-2', title:'Finding The Best Rental Properties', level:'Beginner', lessons:28,
  promise:"Build relationships with the right buildings and learn to spot the listings that actually pay. Your Building Bible starts here.",
  who:["You don't know which buildings in your market are worth your time","You're wasting hours on low-commission properties","You want property managers calling you with deals"],
  modules:["Introduction","The Power of Luxury Rental Buildings","Researching Properties","Evaluating Properties","Building & Maintaining Relationships","Overcoming Challenges & Planning Success","Your 10-Day Action Plan"],
  deliverables:["Building Bible","Building Details Worksheet","Leasing Agent Call Scripts","Property Mapping & Route Planning","Tour Scheduling & Prep Scripts"]},
 {n:3, price:'$697', slug:'course-3', title:'Lead Gen Mastery', level:'Intermediate', lessons:30,
  promise:"Fill your pipeline with a system: your sphere, online leads, offline leads, and the follow-up engines that turn names into appointments.",
  who:["You have no consistent lead flow and it shows in your income","You're relying on luck, walk-ins, or your brokerage to feed you","You're ready to prospect every day with an actual plan"],
  modules:["Introduction","Foundations of Lead Generation","Mining Your Sphere of Influence","Online Leads","Offline Leads","Qualifying & Following Up","Overcoming Challenges","Your 30-Day Action Plan"],
  deliverables:["30-Day Lead Gen Action Plan","Daily Prospecting Planner","Digital Door Knocking Scripts","Email Scripts","In Person & Networking Scripts","Lead Magnet & Funnel Scripts","Phone Call Scripts","Social Media DM Scripts","Video Scripts","Weekly Lead Gen Tracker"]},
 {n:4, price:'$697', slug:'course-4', title:'Coffee Is For Closers', level:'Intermediate', lessons:29,
  promise:"Rapport, objection handling, and the ask. Turn showings into signed leases instead of maybes.",
  who:["You get showings but not signatures","You freeze when a client says they want to think about it","You're losing deals to rival brokers and don't know why"],
  modules:["Introduction","The Art of Closing Deals","Building Rapport","Asking for the Application","Handling Objections","Finalizing the Lease","Overcoming Challenges","Your 10-Day Action Plan"],
  deliverables:["Application Ask Scripts","Client Close Checklist","Confidence Conditioning Journal","Follow-Up Script Vault","Lease Prep Kit","Objection Handling Playbook","The Closer's Mental Edge"]},
 {n:5, price:'$697', slug:'course-5', title:'Client Management', level:'Intermediate', lessons:29,
  promise:"CRM systems, AI tools, and the referral engine that makes every client worth three.",
  who:["You're juggling clients from memory and things slip","Past clients go silent because you never follow up","You're ready to build repeat and referral business on purpose"],
  modules:["Introduction","The Power of Client Management","Delivering Exceptional Experiences","Managing SOI Relationships","Leveraging CRM & AI Tools","Securing Referrals","Overcoming Challenges","Your 10-Day Action Plan"],
  deliverables:["Agent Boundaries & Expectations","Client Communication Templates","Client Follow Up Flowchart","Client Intake Form + Qualifier Questionnaire","Client Journey Map"]},
 {n:6, price:'$997', slug:'course-6', title:'Personal Branding For Realtors', level:'Professional', lessons:39,
  promise:"Build a brand that attracts clients instead of chasing them. Most agents never think about their brand until it's already working against them.",
  who:["You're invisible online and clients have no reason to remember you","Your profile looks like every other agent's profile","You're ready to become the name people think of first"],
  modules:["Welcome","The Power of a Personal Brand","Defining Your Brand Identity","The Brand Audit","Creating Compelling Content","Engaging Your Audience & Community","Partnerships & Influencers","Measuring & Optimizing","Sustaining & Growing Your Brand","Your 10-Day Action Plan"],
  deliverables:["Brand Foundation Workbook","Positioning & Messaging Map","Signature Service & Offer Framework","Voice & Visual Identity Kit","Personal Bio Builder","Content Pillar Builder + Operating System","Brand Video Script Templates","Brand Audit + Growth Tracker"]},
 {n:7, price:'$997', slug:'course-7', title:'Social Media Marketing For Realtors', level:'Professional', lessons:42,
  promise:"Organic content, paid ads, partnerships, and analytics. Turn social media into a lead machine instead of a time drain.",
  who:["You post sometimes, with no plan, and get nothing back","You know video matters but keep putting it off","You're ready to run content like a system, not a hobby"],
  modules:["Welcome","The Power of Social Media","Crafting Your Strategy","Organic Content","Paid Ads","Building & Engaging Your Audience","Influencers & Partnerships","Measuring & Optimizing","Scaling Your Presence","Your 10-Day Action Plan"],
  deliverables:["Platform Strategy Playbook","Content Production Workflow","Caption & Post Templates Library","30-Day Stories & Hooks Library","Social Media CTA Bank","Engagement & Lead Funnel","Lead Magnet Creation Guide","Collab & Partnership Playbook","Social Media Analytics Tracker"]},
 {n:8, price:'$997', slug:'course-8', title:'Building A Rental Business', level:'Expert', lessons:32,
  promise:"Financials, team building, and automation. Stop being an agent with deals and become a business with systems.",
  who:["You're producing well but you've hit a ceiling","You're drowning in your own volume with no systems","You're ready to hire, delegate, and run real numbers"],
  modules:["Establishing Your Foundation","Scaling Your Lead Gen Pipeline","Mastering Your Financial Forecast","Building a High-Performance Team","Leveraging Tech & Automation","Optimizing the Client Experience","Planning for Sustainable Growth","Your 10-Day Action Plan"],
  deliverables:["Business Entity & Legal Foundation","Business Operations SOPs","Rental Business Systems Map","Systems Audit & Self-Assessment","Financial Operations System","Business Vision & Quarterly Planning","Time & Calendar Architecture","Tools & Tech Stack Blueprint","Year End Business Review & Reset"]},
 {n:9, price:'$997', slug:'course-9', title:'Scaling Your Rental Empire', level:'Expert', lessons:33,
  promise:"Advanced lead scaling, operational efficiency, and expanding into new markets. The business runs; now it multiplies.",
  who:["Your business works and you're ready to multiply it","You lead a team and want to scale without breaking it","You're eyeing a second market"],
  modules:["Foundations of Scaling","Advanced Lead Scaling","Optimizing Operational Efficiency","Expanding Your Team","Enhancing Financial Performance","Sustaining Growth & Expanding Markets","Your 10-Day Action Plan"],
  deliverables:["Scaling Readiness & Vision Framework","Scalable Lead Acquisition System","Hiring & Onboarding System","Team Performance & Culture Playbook","Outsourcing & Delegation Playbook","Automation & Workflow Library","Scaled Tech & Infrastructure","Scaled Financial Model","Market Expansion Playbook","Exit Strategy & Wealth Building Framework"]},
];
const TIERS = [["Start Here","Beginner",[0,1]],["Get Clients","Intermediate",[2,3,4]],["Go Pro","Professional",[5,6]],["Scale","Expert",[7,8]]];

module.exports = { fs, path, ROOT, OUT, C, CSS_SHARED, CSS_HOME, COURSES, TIERS };
