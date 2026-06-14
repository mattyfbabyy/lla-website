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
  modules:["Your Luxury Leasing Launchpad","Understanding Luxury Leasing","Getting Licensed","Choosing the Right Brokerage","Mastering Your Market","Building a Professional Foundation","Cultivating the Right Mindset","Action Plan: Track A","Action Plan: Track B"],
  deliverables:["Master Lead Tracker","Client Avatar Worksheet","Brokerage Interview Questionnaire & Checklist","Neighborhood Research Guide","Tour Log Template","Branding Quick Start Guide","Email Starter Pack","Luxury Leasing Vocabulary Guide","Client Introduction Video Scripts","CRM + Tools Setup","DM & Outreach Tracker","Mindset Journal","Professional Habits Tracker"]},
 {n:2, price:'$497', slug:'course-2', title:'Finding The Best Rental Properties', level:'Beginner', lessons:28,
  promise:"Build relationships with the right buildings and learn to spot the listings that actually pay. Your Building Bible starts here.",
  who:["You don't know which buildings in your market are worth your time","You're wasting hours on low-commission properties","You want property managers calling you with deals"],
  modules:["Welcome","Understanding Luxury Rental Properties","Researching Properties","Evaluating Buildings","Building Manager Relationships","Overcoming Challenges","Action Plan"],
  deliverables:["Building Bible","Building Details Worksheet","Tour Scheduling & Prep Script","Property Mapping & Route Planning","Leasing Agent Call Scripts"]},
 {n:3, price:'$697', slug:'course-3', title:'Lead Gen Mastery', level:'Intermediate', lessons:30,
  promise:"Fill your pipeline with a system: your sphere, online leads, offline leads, and the follow-up engines that turn names into appointments.",
  who:["You have no consistent lead flow and it shows in your income","You're relying on luck, walk-ins, or your brokerage to feed you","You're ready to prospect every day with an actual plan"],
  modules:["Foundations of Lead Generation","Your Sphere of Influence","Online Lead Generation","Offline Lead Generation","Qualifying & Following Up","Overcoming Challenges","Action Plan"],
  deliverables:["Weekly Lead Gen Tracker","Video Scripts","Social Media DM Scripts","Phone Call Scripts","Lead Magnet & Funnel Scripts","In Person & Networking Scripts","Email Scripts","Digital Door Knocking Scripts","Daily Prospecting Planner"]},
 {n:4, price:'$697', slug:'course-4', title:'Coffee Is For Closers', level:'Intermediate', lessons:29,
  promise:"Rapport, objection handling, and the ask. Turn showings into signed leases instead of maybes.",
  who:["You get showings but not signatures","You freeze when a client says they want to think about it","You're losing deals to rival brokers and don't know why"],
  modules:["Welcome","The Mindset of a Closer","Building Rapport","Asking for the Application","Handling Objections","Finalizing the Lease","Overcoming Challenges","Action Plan"],
  deliverables:["The Closer's Mental Edge","Objection Handling Playbook","Lease Prep Kit","Follow-Up Script Vault","Confidence Conditioning Journal","Client Close Checklist","Application Ask Scripts"]},
 {n:5, price:'$697', slug:'course-5', title:'Client Management', level:'Intermediate', lessons:29,
  promise:"CRM systems, AI tools, and the referral engine that makes every client worth three.",
  who:["You're juggling clients from memory and things slip","Past clients go silent because you never follow up","You're ready to build repeat and referral business on purpose"],
  modules:["Welcome","The Foundations of Client Management","Delivering a VIP Experience","Managing Your Sphere of Influence","CRM & AI Tools","Securing Referrals","Overcoming Challenges","Action Plan"],
  deliverables:["Client Journey Map","Client Intake Form + Qualifier Questionnaire","Client Follow Up Flowchart","Client Communication Templates","Agent Boundaries & Expectations"]},
 {n:6, price:'$997', slug:'course-6', title:'Personal Branding For Realtors', level:'Professional', lessons:39,
  promise:"Build a brand that attracts clients instead of chasing them. Most agents never think about their brand until it's already working against them.",
  who:["You're invisible online and clients have no reason to remember you","Your profile looks like every other agent's profile","You're ready to become the name people think of first"],
  modules:["Welcome","The Power of a Personal Brand","Building Your Brand Identity","Auditing Your Brand","Creating Branded Content","Building Your Community","Partnerships & Influencers","Measuring & Optimizing","Sustaining Your Brand","Action Plan"],
  deliverables:["Voice & Visual Identity Kit","Signature Service & Offer Framework","Positioning & Messaging Map","Personal Bio Builder","Content Pillar Builder + Operating System","Brand Video Script Templates","Brand Foundation Workbook","Brand Audit + Growth Tracker"]},
 {n:7, price:'$997', slug:'course-7', title:'Social Media Marketing For Realtors', level:'Professional', lessons:42,
  promise:"Organic content, paid ads, partnerships, and analytics. Turn social media into a lead machine instead of a time drain.",
  who:["You post sometimes, with no plan, and get nothing back","You know video matters but keep putting it off","You're ready to run content like a system, not a hobby"],
  modules:["Welcome","The Power of Social Media","Crafting Your Strategy","Organic Content","Paid Ads","Growing & Engaging Your Audience","Influencers & Partnerships","Measuring & Optimizing","Scaling Your Presence","Action Plan"],
  deliverables:["Social Media CTA Bank","Social Media Analytics Tracker","Platform Strategy Playbook","Lead Magnet Creation Guide","Engagement & Lead Funnel","Content Production Workflow","Collab & Partnership Playbook","Caption & Post Templates Library","30-Day Stories & Hooks Library"]},
 {n:8, price:'$997', slug:'course-8', title:'Building A Rental Business', level:'Expert', lessons:32,
  promise:"Financials, team building, and automation. Stop being an agent with deals and become a business with systems.",
  who:["You're producing well but you've hit a ceiling","You're drowning in your own volume with no systems","You're ready to hire, delegate, and run real numbers"],
  modules:["Welcome","Establishing Your Foundation","Scaling Your Lead Pipeline","Mastering Your Finances","Building Your Team","Leveraging Tech & Automation","Sustaining & Scaling","Action Plan"],
  deliverables:["Business Vision & Quarterly Planning","Business Entity & Legal Foundation","Business Operations SOPs","Financial Operations System","Rental Business Systems Map","Systems Audit & Self-Assessment","Time & Calendar Architecture","Tools & Tech Stack Blueprint","Year End Business Review & Reset"]},
 {n:9, price:'$997', slug:'course-9', title:'Scaling Your Rental Empire', level:'Expert', lessons:33,
  promise:"Advanced lead scaling, operational efficiency, and expanding into new markets. The business runs; now it multiplies.",
  who:["Your business works and you're ready to multiply it","You lead a team and want to scale without breaking it","You're eyeing a second market"],
  modules:["Welcome","Why Scale Now","Advanced Lead Scaling","Tech, Data & AI","Operational Efficiency","Expanding Your Team","Financial Optimization","Sustaining Growth & New Markets","Action Plan"],
  deliverables:["Scaling Readiness & Vision Framework","Hiring & Onboarding System","Team Performance & Culture Playbook","Outsourcing & Delegation Playbook","Scalable Lead Acquisition System","Scaled Financial Model","Scaled Tech & Infrastructure","Automation & Workflow Library","Market Expansion Playbook","Exit Strategy & Wealth Building Framework"]},
];
const TIERS = [["Start Here","Beginner",[0,1]],["Get Clients","Intermediate",[2,3,4]],["Go Pro","Professional",[5,6]],["Scale","Expert",[7,8]]];

module.exports = { fs, path, ROOT, OUT, C, CSS_SHARED, CSS_HOME, COURSES, TIERS };
