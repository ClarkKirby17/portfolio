import type { Project } from '@/types';

/**
 * Case-study content. Every project answers the same six questions so a
 * recruiter can compare them without re-learning the format each time:
 * what was broken, what I built, what it does, what went wrong, what I learned,
 * and how it is put together.
 *
 * Ordering here is the display order everywhere on the site.
 */
export const projects: Project[] = [
  {
    slug: 'lumenfact',
    name: 'LumenFact',
    tagline: 'Checks health claims against real medical evidence, not vibes.',
    summary:
      'A mobile platform that takes a health claim, retrieves matching evidence from trusted medical sources, and returns a verdict a non-expert can actually read. Built for the HealthForge 2026 challenge.',
    category: 'AI',
    status: 'In development',
    year: '2026',
    stack: ['Flutter', 'Dart', 'Firebase', 'Unity', 'Gemini API', 'Cloud Functions'],
    thumbnail: '/projects/lumenfact.png',
    thumbnailAlt:
      'LumenFact mobile screens showing a health claim, its verdict badge, and the cited sources beneath it.',
    role: 'Full stack developer: Flutter client, Firebase backend, retrieval pipeline',
    context: 'Team project for the HealthForge 2026 Challenge',
    problem:
      'Health misinformation spreads faster than corrections do, and the corrections that exist are written for clinicians. When someone reads that a supplement cures a condition, the honest answer is buried in a PDF behind medical vocabulary they were never taught. The gap is not information. It is readability and speed.',
    solution:
      'LumenFact narrows the gap in three steps. A user pastes or scans a claim. The backend normalises it, retrieves passages from a curated set of health sources, and passes only those passages to a language model that is instructed to answer strictly from what it was given. The response comes back as a verdict, a plain-language explanation, and the exact citations behind it, so the user can disagree with the app and still learn something.',
    features: [
      'Claim submission by text, paste, or image capture with on-device OCR',
      'Retrieval-grounded verdicts: the model may only cite passages it was handed',
      'Three-state verdict (supported / contradicted / not enough evidence) instead of a binary true-false, because "unknown" is a real answer',
      'Every verdict links out to its sources, with publication date shown',
      'Saved claim history synced per account via Firestore',
      'A short Unity-built interactive module that teaches how to spot common misinformation patterns',
      'Offline queue: claims submitted without a connection are sent when it returns',
    ],
    challenges: [
      {
        title: 'The model confidently invented citations',
        body: 'Early versions asked the model to fact-check directly. It produced fluent answers with sources that did not exist. I rebuilt the flow as retrieval-first: the model never answers from its own memory, only from passages the backend supplies, and any response referencing an ID outside that set is rejected before it reaches the user.',
      },
      {
        title: 'Cost and latency on a student budget',
        body: 'Calling the model on every request was slow and burned free-tier quota. I added a normalised-claim cache in Firestore so repeated or near-identical claims return instantly, and moved retrieval into a Cloud Function so the API key never ships inside the app bundle.',
      },
      {
        title: 'Saying "I don\'t know" without feeling broken',
        body: 'Insufficient-evidence results initially looked like errors and users bounced. Redesigning that state to explain what was searched and what was missing turned it from a dead end into the most trusted screen in the app during testing.',
      },
    ],
    lessons: [
      'Grounding beats prompting. Constraining what a model can see fixes more problems than instructing it to behave.',
      'In health, an honest "not enough evidence" is a feature. Designing for uncertainty is a product decision, not a fallback.',
      'Keep secrets server-side from day one. Retrofitting a Cloud Function around a leaked key is far more work than starting with one.',
    ],
    architecture: [
      { layer: 'Client', detail: 'Flutter (Dart): claim capture, OCR, offline queue, result rendering' },
      { layer: 'Auth & Data', detail: 'Firebase Auth for accounts; Firestore for claim history and the verdict cache' },
      { layer: 'API', detail: 'Cloud Functions: normalisation, retrieval, prompt assembly, response validation' },
      { layer: 'Inference', detail: 'Gemini API called server-side only, constrained to retrieved passages' },
      { layer: 'Learning module', detail: 'Unity build embedded in the app for the misinformation-literacy mini-course' },
    ],
    links: { github: 'https://github.com/clarknormor/lumenfact', caseStudy: true },
    featured: true,
  },

  {
    slug: 'netquest',
    name: 'NETQUEST',
    tagline: 'Turns computer networking coursework into something you play.',
    summary:
      'A learning platform for networking fundamentals (subnetting, routing, the OSI layers) built around interactive exercises rather than slides. Ships with separate student and instructor experiences.',
    category: 'Full Stack',
    status: 'Shipped',
    year: '2025',
    stack: ['React', 'TypeScript', 'TailwindCSS', 'PHP', 'MySQL', 'REST API'],
    thumbnail: '/projects/netquest.png',
    thumbnailAlt:
      'NETQUEST dashboard showing a subnetting exercise, a progress track, and the instructor analytics panel.',
    role: 'Lead frontend developer and API designer',
    context: 'Coursework project, 3-person team',
    problem:
      'Networking is taught with static diagrams, but the skill being assessed is procedural. You either can subnet a network under time pressure or you cannot. Students memorise slide decks, fail the practical, and never find out where their understanding broke. Instructors, meanwhile, see a final grade and nothing about which step lost the class.',
    solution:
      'NETQUEST replaces reading with doing. Each topic is a track of generated exercises that are checked step by step, so a wrong subnet mask is caught at the mask, not at the final answer. Progress, streaks and unlocked topics give students a reason to return; the instructor dashboard aggregates where attempts fail so a lecturer can see that half the class is losing the same step and re-teach exactly that.',
    features: [
      'Procedurally generated subnetting and addressing exercises, so the answer key is never memorisable',
      'Step-level validation with targeted hints instead of a single pass/fail at the end',
      'Topic tracks that unlock as prerequisites are cleared',
      'Student dashboard: progress, streaks, weakest topics',
      'Instructor dashboard: cohort completion, per-question failure rates, exportable CSV',
      'Role-based access with session-backed PHP authentication',
      'Fully responsive, a genuine requirement since most students opened it on a phone',
    ],
    challenges: [
      {
        title: 'Generated questions had to be provably solvable',
        body: 'Random values produced exercises with no valid answer or with several. I wrote the generator to build the answer first and derive the question from it, then added a test suite that generates thousands of exercises per run and asserts exactly one valid solution exists.',
      },
      {
        title: 'Gamification quietly punished the students who needed help',
        body: 'The first scoring model rewarded speed, so struggling students lost streaks and stopped opening the app. I moved rewards onto completion and improvement rather than raw speed, and streaks now survive a wrong answer. Engagement among the lowest-scoring group recovered in the next round of testing.',
      },
      {
        title: 'A React frontend against a PHP backend I did not control',
        body: 'The API returned inconsistent shapes across endpoints. Rather than scatter defensive checks through the components, I added a typed API layer that validates and normalises every response at the boundary, so the UI only ever handles one known shape.',
      },
    ],
    lessons: [
      'Feedback timing is the whole product. Catching a mistake at the step beats grading it at the end.',
      'Gamification is a design choice with winners and losers. Check who your scoring rule is punishing.',
      'A typed boundary between frontend and an unpredictable API pays for itself within a week.',
    ],
    architecture: [
      { layer: 'Client', detail: 'React + TypeScript SPA, TailwindCSS, typed API client at the boundary' },
      { layer: 'API', detail: 'PHP REST endpoints, session auth, role middleware for student vs instructor' },
      { layer: 'Data', detail: 'MySQL: users, attempts, per-step results, topic progress' },
      { layer: 'Exercise engine', detail: 'Deterministic generator that constructs the answer first, then the prompt' },
    ],
    links: { github: 'https://github.com/ClarkKirby17/netquest', demo: 'https://netquest-flame.vercel.app/', caseStudy: true },
    featured: true,
  },

  {
    slug: 'ar-history-explorer',
    name: 'AR History Explorer',
    tagline: 'Points a phone at a historical marker and puts the past back on the site.',
    summary:
      'A mobile AR application that reconstructs historical scenes in place. Scan a QR marker at a landmark and a 3D reconstruction, narration, and guided route appear anchored to the real location.',
    category: 'AR / Game',
    status: 'Shipped',
    year: '2025',
    stack: ['Unity', 'C#', 'AR Foundation', 'Firebase', 'Blender'],
    thumbnail: '/projects/ar-history-explorer.png',
    thumbnailAlt:
      'A phone held up at a historical marker with a 3D reconstruction of the original structure overlaid on the scene.',
    role: 'Unity developer: AR interaction, content pipeline, Firebase integration',
    context: 'Solo project',
    problem:
      'Historical markers give you a plaque and a paragraph. Standing where something happened is powerful, but a bronze sign asks you to imagine everything that made it matter. Museums solve this with reconstructions; the sites themselves usually cannot.',
    solution:
      'AR History Explorer moves the reconstruction to the location. A QR marker at each site identifies the place, the app pulls that site\'s model and narration from Firebase, and AR Foundation anchors the reconstruction to the ground plane so you can walk around it. Content is fetched rather than bundled, so new sites are added without shipping an app update.',
    features: [
      'QR-based site identification with graceful fallback to a manual site picker',
      'Plane-anchored 3D reconstructions you can circle on foot',
      'Narrated audio with synced captions, for accessibility rather than decoration',
      'AR waypoint navigation between nearby sites',
      'Remote content: models, audio, and text stream from Firebase Storage',
      'Quality tiers that drop model detail on lower-end devices instead of crashing',
      'Offline caching so a downloaded site works without signal',
    ],
    challenges: [
      {
        title: 'Models were built for a desktop GPU, not a mid-range phone',
        body: 'The first reconstruction dropped the device to single-digit frame rates. I rebuilt the content pipeline in Blender around explicit polygon budgets, baked lighting into textures instead of computing it live, and added LOD tiers selected from a device capability check at launch.',
      },
      {
        title: 'AR anchors drifted the moment anyone walked',
        body: 'Objects placed on a detected plane slid several metres as tracking updated. Re-anchoring content to a persistent AR anchor rather than a world-space transform, and re-validating the plane before placement, made positions hold well enough to walk a full circle around a model.',
      },
      {
        title: 'Outdoor lighting broke plane detection',
        body: 'Bright sun on flat pavement gave the tracker nothing to lock onto. I added an onboarding step that guides the user to sweep the camera across textured ground first, with a live tracking-quality indicator. It was a UX fix for what looked like a hardware problem.',
      },
    ],
    lessons: [
      'On mobile AR, the performance budget is a design constraint you set before modelling, not a problem you optimise afterwards.',
      'When tracking fails, users blame the app. Explaining what the camera needs turns a failure into an instruction.',
      'Separating content from the binary changed the project from an app that ships once to a platform that grows.',
    ],
    architecture: [
      { layer: 'Client', detail: 'Unity + AR Foundation (ARCore/ARKit), C# interaction and state machines' },
      { layer: 'Content', detail: 'Firebase Storage for models, audio and captions; Firestore for site metadata' },
      { layer: 'Assets', detail: 'Blender pipeline with polygon budgets, baked lighting, and three LOD tiers' },
      { layer: 'Caching', detail: 'Local persistence layer so downloaded sites survive loss of signal' },
    ],
    links: { github: 'https://github.com/clarknormor/ar-history-explorer', caseStudy: true },
    featured: true,
  },

  {
    slug: 'eatsy',
    name: 'Eatsy',
    tagline: 'A recipe app built around what is already in your kitchen.',
    summary:
      'A full stack recipe platform with accounts, publishing, search by available ingredients, and automatic serving-size scaling. My first project taken from empty database to deployed application alone.',
    category: 'Web',
    status: 'Shipped',
    year: '2024',
    stack: ['React', 'TypeScript', 'TailwindCSS', 'PHP', 'MySQL', 'REST API'],
    thumbnail: '/projects/eatsy.png',
    thumbnailAlt:
      'Eatsy recipe grid alongside a recipe detail page with scaled ingredient quantities and step list.',
    role: 'Solo developer: schema, API, frontend, deployment',
    context: 'Personal project',
    problem:
      'Recipe sites are optimised for ad revenue, not for cooking. You scroll past a life story to reach a list of ingredients you do not have, in quantities for a household size that is not yours. The actual question, what can I make right now, is the one they answer worst.',
    solution:
      'Eatsy starts from the pantry. You enter what you have and it ranks recipes by how few extra items you need, rather than filtering to exact matches and returning nothing. Quantities scale to your serving count, including fractional and unit conversion, and the recipe page shows ingredients and steps first, with everything else below.',
    features: [
      'Ingredient-first search ranked by number of missing items, not exact match',
      'Serving-size scaling with sensible fraction handling and unit conversion',
      'Account system with hashed credentials and email-verified signup',
      'Full recipe CRUD with image upload, validation, and draft state',
      'Save-to-collection and personal recipe library',
      'Responsive layout built mobile-first, since recipes are read while cooking',
      'Server-side pagination and indexed search for large recipe sets',
    ],
    challenges: [
      {
        title: 'Ingredient matching failed on plain English',
        body: '"Tomato", "tomatoes" and "roma tomato" were three unrelated rows. I introduced a canonical ingredient table with aliases and normalised every input against it at write time, so search compares IDs rather than strings.',
      },
      {
        title: 'The recipe list query fell over as the data grew',
        body: 'Loading everything and filtering in React was fine at fifty recipes and unusable at five hundred. I moved filtering, sorting and pagination into SQL, added covering indexes on the join columns, and cut a multi-second render to something that feels instant.',
      },
      {
        title: 'Scaling quantities produced numbers nobody cooks with',
        body: 'Naive multiplication gave "0.6667 cups". I wrote a formatter that rounds to the nearest usable kitchen measure and converts up a unit when the number gets awkward. Small, unglamorous work that changed how the app feels to use.',
      },
    ],
    lessons: [
      'Normalise messy human input once, at the boundary. Every downstream feature gets easier.',
      'Push filtering to the database before it becomes an architecture problem.',
      'Owning a project end to end, from schema and API through UI and deploy, taught me more than any single layer could.',
    ],
    architecture: [
      { layer: 'Client', detail: 'React + TypeScript, TailwindCSS, client-side routing' },
      { layer: 'API', detail: 'PHP REST endpoints with prepared statements and input validation' },
      { layer: 'Data', detail: 'MySQL: normalised recipe, ingredient, alias and user tables with covering indexes' },
      { layer: 'Media', detail: 'Server-side image validation, resizing and content-type checks on upload' },
    ],
    links: { github: 'https://github.com/clarknormor/eatsy', demo: '#', caseStudy: true },
    featured: true,
  },
];

/** Filter chips on /projects, derived so the list never drifts from the data. */
export const projectCategories = [
  'All',
  ...Array.from(new Set(projects.map((p) => p.category))),
] as const;

export const getProjectBySlug = (slug: string): Project | undefined =>
  projects.find((project) => project.slug === slug);

export const featuredProjects = projects.filter((project) => project.featured);
