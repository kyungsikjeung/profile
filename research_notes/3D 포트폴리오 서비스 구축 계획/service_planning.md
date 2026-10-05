# 3D Portfolio Service Planning Research

## Optimal User Journey from Sign-up to Published 3D Portfolio

### Takeaway
The optimal user journey minimizes time-to-first-value (ideally under 5 minutes), uses progressive disclosure to avoid cognitive overload, and front-loads the "aha moment" of seeing a photo transformed into 3D. The journey should follow a Signup → First Value → Activation → Habit → Conversion pipeline with specific, measurable activation milestones.

### Cited Findings
- The first 5 minutes determine whether a user will ever return; get them to their "aha moment" as fast as possible — [Source](https://uxerwave.com/grow-your-creator-tool/saas-onboarding-best-practices/)
- Most onboarding falls apart at "First Value" — if the user doesn't see the product work within 5 minutes, they're gone — [Source](https://uxerwave.com/grow-your-creator-tool/saas-onboarding-best-practices/)
- The onboarding funnel is: Signup → First Value (Aha Moment) → Activation → Habit → Conversion, with First Value targeted at Minutes 1-5, Activation at Day 1-3 — [Source](https://uxerwave.com/grow-your-creator-tool/saas-onboarding-best-practices/)
- Multi-step workflows fail not because of length but because of abrupt jumps in cognitive load; pacing the increase matters more than reducing steps — [Source](https://www.wearetenet.com/thoughts/how-tenet-approach-ux-for-multi-step-workflows)
- Progress is psychology, not math — "Step 2 of 4 complete" with visible checkmarks shifts motivation from finishing a long process to celebrating small wins — [Source](https://www.wearetenet.com/thoughts/how-tenet-approach-ux-for-multi-step-workflows)
- For multi-step forms, keep steps to 3-5, show progress from the start, make the first step effortless, and push heavier asks later — [Source](https://blog.powr.io/building-high-converting-multi-step-forms-without-friction-loss/)
- Inline validation improves success rates by 22% by removing the friction of hitting "Next" and getting blocked — [Source](https://blog.powr.io/building-high-converting-multi-step-forms-without-friction-loss/)
- The final step before completion should always be a summary or review screen — skipping it is one of the most common mistakes in wizard design — [Source](https://timgraf.com/ux-design/designing-multi-step-flows-and-wizards-a-comprehensive-ux-framework-for-complex-wizards-setup-flows-and-multi-page-decision-processes/)
- For any wizard that takes more than five minutes, a Save Draft option is essential — [Source](https://timgraf.com/ux-design/designing-multi-step-flows-and-wizards-a-comprehensive-ux-framework-for-complex-wizards-setup-flows-and-multi-page-decision-processes/)
- A 5% improvement on each step in a multi-step funnel turns into roughly a 34% lift end-to-end due to compounding — [Source](https://www.metricuno.com/multi-step-funnel-optimization)
- Each step in a multi-step funnel costs 8-20% of remaining users in a typical DTC quiz — [Source](https://www.metricuno.com/multi-step-funnel-optimization)
- The four highest-leverage transition fixes: keep all steps on a single URL with client-side state, preload next step's assets, show progress that makes remaining work feel small, and make the back button work as expected — [Source](https://www.metricuno.com/multi-step-funnel-optimization)
- 38% of freemium products let users try the product before creating an account — [Source](https://chartmogul.com/reports/saas-conversion-report/)
- Ungated freemium experiences see 70 free signups and 5.6 paying customers vs. freemium with regular signup at 90 signups and 5 paying customers — [Source](https://chartmogul.com/reports/saas-conversion-report/)

### Inferences
- The ideal journey for a 3D portfolio tool would be: Landing → Try a demo 3D transformation (no signup) → Signup → Upload first photo → See 3D result (aha moment) → Customize → Publish. This front-loads value before requiring commitment.
- The "try before signup" pattern is particularly relevant for a 3D conversion tool because the core value (seeing your photo in 3D) is visually compelling and self-explanatory.
- A populated workspace at signup (with 2-5 example 3D portfolios) dramatically improves activation rates (40-60% vs 20-30% for empty states) — [Source](https://www.vibeweek.ai/grow/onboarding-tour-implementation-chat)
- The activation metric for this service should be "user uploads a photo and receives their first 3D model" — this is the moment they experience the core value.

### Gaps
- No specific research found on user journeys for photo-to-3D conversion services specifically; most findings are generalized from SaaS and creative tools.
- No data found on optimal number of steps specifically for 3D portfolio creation workflows.

---

## Feature Tiers (Free, Pro, Studio, Enterprise)

### Takeaway
Feature gating should follow the principle of giving away enough to demonstrate value while withholding capabilities that create ongoing, compounding need. Usage limits (quantity-based) create more natural conversion moments than feature limits or time limits. The free tier must be genuinely useful, not a teaser.

### Cited Findings
- The core principle of feature gating: give away enough to demonstrate value but withhold capabilities that create ongoing, compounding need — [Source](https://ivanhub.co.uk/insights/saas-freemium-conversion-optimisation-framework-2026)
- Usage limits (best): a specific quantity of value is free; more requires payment — creates natural, value-correlated conversion moments — [Source](https://saasdash.ai/blog/freemium-conversion-rate-benchmarks)
- Feature limits (good): core features are free; advanced features require payment — [Source](https://saasdash.ai/blog/freemium-conversion-rate-benchmarks)
- Time limits (weakest for freemium): full access for N days, then restricted — produces lower-quality conversions and higher early churn — [Source](https://saasdash.ai/blog/freemium-conversion-rate-benchmarks)
- The over-restriction trap: free plans that are too limited don't produce conversions — they produce disengaged free users who never reach the activation moment — [Source](https://saasdash.ai/blog/freemium-conversion-rate-benchmarks)
- Freemium users who fully activate convert at 3-7x the rate of users who partially activate or never activate — [Source](https://saasdash.ai/blog/freemium-conversion-rate-benchmarks)
- The median free-to-paid conversion rate for B2B SaaS freemium products is 2-5%; top quartile PLG companies achieve 8-15% — [Source](https://saasdash.ai/blog/freemium-conversion-rate-benchmarks)
- 3-5% is a GOOD conversion rate for a freemium self-serve product, and 8-12% is GREAT — [Source](https://chartmogul.com/reports/saas-conversion-report/)
- For a freemium product with an ungated experience, a GOOD conversion rate is 7-9% — [Source](https://chartmogul.com/reports/saas-conversion-report/)
- AI-native and AI plus SaaS hybrid products see slightly higher conversion: GOOD is 6-8% and GREAT is 15-20% — [Source](https://chartmogul.com/reports/saas-conversion-report/)
- The strongest behavioral signals for conversion: repeated attempts to access a gated feature, usage approaching a cap, requests to export or share beyond free-tier limits — [Source](https://ivanhub.co.uk/insights/saas-freemium-conversion-optimisation-framework-2026)
- Upgrade prompts should be event-driven, not time-driven — trigger when the user clicks a gated feature, when usage reaches 80% of a cap, or when they attempt a paid action — [Source](https://ivanhub.co.uk/insights/saas-freemium-conversion-optimisation-framework-2026)
- Framing should focus on value being unlocked, not limitation being enforced — "Upgrade to create unlimited projects" vs "You have reached your free plan limit" — [Source](https://ivanhub.co.uk/insights/saas-freemium-conversion-optimisation-framework-2026)
- Products with network effects among free users generate team conversion rates 3-5x higher — [Source](https://saasdash.ai/blog/freemium-conversion-rate-benchmarks)
- Giving free users limited AI credits every month drove increase in activity (MAU) — [Source](https://chartmogul.com/reports/saas-conversion-report-2/)
- The worst middle ground is a timid free experience that neither drives adoption nor creates urgency to buy — [Source](https://chartmogul.com/reports/saas-conversion-report/)

### Inferences
- For a 3D portfolio service, the optimal gating strategy would be:
  - Free: Limited number of 3D conversions (e.g., 3/month), basic templates, watermark on published portfolios, community support
  - Pro: Unlimited conversions, premium templates, custom domain, no watermark, basic analytics
  - Studio: Everything in Pro + career animation features, advanced customization, priority rendering, team collaboration
  - Enterprise: Everything in Studio + API access, white-label, SLA, dedicated support, bulk processing
- Usage-based limits (number of 3D conversions) are more natural than feature limits for this type of service because the core value (3D conversion) is the same across tiers — the difference is volume and presentation quality.
- The free tier should allow users to experience the full 3D conversion pipeline but limit output quality or quantity, ensuring they reach the activation moment.

### Gaps
- No specific research found on tier structures for 3D creative tools; recommendations are inferred from general SaaS freemium best practices.
- No data found on pricing sensitivity specifically for Korean creative tool users.

---

## Photo Upload and 3D Conversion Workflow for Non-Technical Users

### Takeaway
The workflow should abstract away all technical complexity behind a simple upload → generate → customize → publish flow. AI handles background removal, depth estimation, and mesh generation automatically. The user's only decisions are which photos to upload and how to present them. Input quality guidance should be proactive, not reactive.

### Cited Findings
- AI image-to-3D generation: upload a clear image, select output quality, configure parameters, click generate, wait ~1 minute, rotate and review the result — [Source](https://docs.meshy.ai/en/webapp/image-to-3d)
- Recommended input: clear subject, simple background, resolution ≥ 512×512; for complex backgrounds, use AI Background Removal first — [Source](https://docs.meshy.ai/en/webapp/image-to-3d)
- Multiple images from different angles generate a more complete, accurate 3D model; recommended: Front + Side + Back + 3/4 view — [Source](https://docs.meshy.ai/en/webapp/image-to-3d)
- The single biggest factor in output quality is input quality — a 300px thumbnail produces a worse model than a 1024px product photo — [Source](https://www.mindstudio.ai/blog/ai-workflow-generate-3d-product-models-from-images)
- A cluttered background confuses the model — always run background removal first — [Source](https://www.mindstudio.ai/blog/ai-workflow-generate-3d-product-models-from-images)
- The back of the generated model is always a guess — set realistic expectations upfront — [Source](https://www.mindstudio.ai/blog/ai-workflow-generate-3d-product-models-from-images)
- Build a review step into the workflow — publishing a badly reconstructed 3D model is worse than having no 3D model at all — [Source](https://www.mindstudio.ai/blog/ai-workflow-generate-3d-product-models-from-images)
- Common issues: back details missing (use multi-view), proportions distorted (use near-orthographic projection), generation ignores details (enable image enhancement or higher-res input) — [Source](https://docs.meshy.ai/en/webapp/image-to-3d)
- For Korean users: clear CTAs, concise copy, and seamless user flow are non-negotiable; Korean applications often integrate multiple features as users prefer one-stop solutions — [Source](https://localazy.com/blog/korean-ux-localization-for-your-app-guide)
- Korean users expect speed + visual polish, high tolerance for motion and animation, strong mobile-first habits — [Source](https://www.computertechreviews.com/website-design-features-in-korea-and-japan/)
- Korean mobile product flows commonly expect: bottom sheets for lightweight choices, full-screen flows for complex funnel steps, sticky bottom actions for primary submit/continue — [Source](https://unpkg.com/ima2-gen@3.15.1/skills/ima2-front/references/korea-2026.md)
- Korean users value dense but scannable information, fast task completion over empty hero space, concrete visual assets over abstract gradient atmosphere — [Source](https://unpkg.com/ima2-gen@3.15.1/skills/ima2-front/references/korea-2026.md)
- For AI tools in Korea: provenance, process, undo, permission clarity are valued; avoid magical gradients, no error/retry/cancel states — [Source](https://unpkg.com/ima2-gen@3.15.1/skills/ima2-front/references/korea-2026.md)

### Inferences
- The upload workflow should include proactive guidance: show example photos that work well, provide real-time feedback on image quality (resolution, background complexity, lighting), and offer AI-powered background removal as a one-click step.
- The generation process should show progress with educational content about what's happening (depth estimation, mesh generation, texturing) to build trust and manage expectations.
- A review step before publishing is essential — users should be able to rotate the 3D model, check for artifacts, and regenerate if unsatisfied.
- For Korean users, the flow should be mobile-first with sticky bottom actions, concise CTAs using -하기 form, and support for local login methods (Kakao, Naver, Toss).

### Gaps
- No research found specifically on UX patterns for photo-to-3D conversion in portfolio contexts.
- No data found on user tolerance for generation waiting times in creative tools.

---

## Key UX Considerations for 3D Portfolio Customization

### Takeaway
3D customization must balance creative freedom with performance constraints. The key principle is "one hard idea executed cleanly" rather than stacking effects. Performance is a feature — without Draco compression, KTX2 textures, and hard mobile budgets, the user pays with load time and poor Core Web Vitals. Customization should be template-guided rather than blank-canvas.

### Cited Findings
- The standout 3D sites pick one hard idea and execute it cleanly rather than stacking effects — [Source](https://www.utsubo.com/blog/best-threejs-websites-2026)
- Scroll became the storytelling engine — sequencing 3D scenes rather than moving a 2D page — [Source](https://www.utsubo.com/blog/best-threejs-websites-2026)
- Performance is a feature, not an afterthought — instancing, baked lighting, BVH collision, and byte budgets separate an award winner from a janky demo — [Source](https://www.utsubo.com/blog/best-threejs-websites-2026)
- Without Draco compression, KTX2 textures, and hard mobile budgets, the user pays with load time, battery, and poor Core Web Vitals — [Source](https://www.in-sync.io/en/knowledge/3d-website)
- A few hundred draw calls and a few hundred thousand vertices is the rough orientation for performance — not millions — [Source](https://www.in-sync.io/en/knowledge/3d-website)
- Continuous 3D rendering drains battery and makes devices hot — set hard budgets on mobile: fewer details, lower resolution, on-demand rendering — [Source](https://www.in-sync.io/en/knowledge/3d-website)
- Respect prefers-reduced-motion setting and make sure actual content is in HTML even without rendered 3D for search engines and AI crawlers — [Source](https://www.in-sync.io/en/knowledge/3d-website)
- In e-commerce studies, interactive 3D lifts conversion by up to 40 percent in some cases and reduces returns — [Source](https://www.in-sync.io/en/knowledge/3d-website)
- Spline (no-code) is best for hero graphics, simple interactive objects, prototypes; custom Three.js is needed when 3D is the product, must run smoothly on mid-range phones, or needs real logic — [Source](https://www.utsubo.com/blog/best-threejs-websites-2026)
- KTX2/Basis Universal compression was the difference between a scene that crawled on mid-range hardware and one that ran smooth — [Source](https://tympanus.net/codrops/2026/04/28/more-than-a-portfolio-building-a-scroll-driven-3d-world-with-something-to-say/)
- GPU instancing is the difference between 30 FPS and 144 — [Source](https://tympanus.net/codrops/2026/04/28/more-than-a-portfolio-building-a-scroll-driven-3d-world-with-something-to-say/)
- Dynamic culling instead of static LODs — aggressively cull anything outside the camera frustum — [Source](https://tympanus.net/codrops/2026/04/28/more-than-a-portfolio-building-a-scroll-driven-3d-world-with-something-to-say/)
- Korean websites love interaction: smooth transitions, micro-animations, scroll-based effects — users expect responsiveness, movement, feedback — [Source](https://www.computertechreviews.com/website-design-features-in-korea-and-japan/)
- Korean design pushes boundaries — visual, interactive, bold — while Japanese design focuses on clarity — structured, detailed, reliable — [Source](https://www.computertechreviews.com/website-design-features-in-korea-and-japan/)
- For Korean users: dense but scannable information, fast task completion, concrete visual assets over abstract gradient atmosphere — [Source](https://unpkg.com/ima2-gen@3.15.1/skills/ima2-front/references/korea-2026.md)

### Inferences
- Customization should be template-guided: users start with a professionally designed 3D scene template and customize colors, layout, lighting, and content rather than building from scratch.
- The customization interface should use a single canvas with dedicated editor modes (Scene, Content, Atmosphere, Camera, Audio, Interactions, Publish) to avoid context switching — [Source](https://super3d.ai/)
- Performance budgets must be enforced automatically — users shouldn't have to choose between visual quality and performance; the system should optimize behind the scenes.
- For Korean markets, the 3D experiences can be more visually bold and interactive than global norms, but must maintain fast load times (LCP ~2.5 seconds or less).

### Gaps
- No research found on customization UX specifically for 3D portfolio templates.
- No data found on the relationship between 3D scene complexity and portfolio viewer engagement.

---

## Career Animation Feature Implementation

### Takeaway
Career animation should be implemented as a post-publishing enhancement that transforms a static 3D portfolio into a narrative experience. It should be template-driven (users select a career story arc) rather than requiring keyframe animation knowledge. The feature maps to the "scroll as storytelling engine" pattern dominant in award-winning 3D sites.

### Cited Findings
- Scroll became the storytelling engine — Cartier, Shopify, Sleep Well, and Primland all drive the whole experience from scroll, sequencing 3D scenes rather than moving a 2D page — [Source](https://www.utsubo.com/blog/best-threejs-websites-2026)
- A scene per product, like museum rooms — scroll moves you between rooms, not just down a page — [Source](https://www.utsubo.com/blog/best-threejs-websites-2026)
- Animation portfolios should include a showreel (1-3 minutes), only the best work first, shot breakdowns, and match work to the role — [Source](https://www.screenskills.com/starting-your-career/building-your-portfolio/build-your-animation-portfolio/)
- For group work, be clear about your contribution; use text to explain what tools or software were used — [Source](https://www.screenskills.com/starting-your-career/building-your-portfolio/build-your-animation-portfolio/)
- Korean users have high tolerance for motion and animation; smooth transitions, micro-animations, scroll-based effects are expected — [Source](https://www.computertechreviews.com/website-design-features-in-korea-and-japan/)
- Korean digital aesthetics favor bold, colorful, animated interfaces with rich gradients, flashing banners, cute icons, and color-coded hierarchies — [Source](https://vocal.media/01/why-korean-web-design-feels-so-different)
- For AI tools in Korea: provenance, process, undo, permission clarity are essential — [Source](https://unpkg.com/ima2-gen@3.15.1/skills/ima2-front/references/korea-2026.md)

### Inferences
- Career animation should be offered as a premium feature (Pro or Studio tier) that adds scroll-driven scene transitions, animated reveals of career milestones, and ambient motion to the 3D portfolio.
- The implementation should be template-based: users select a career narrative structure (e.g., "Growth Story," "Project Showcase," "Skills Journey") and the system generates appropriate camera paths, transitions, and timing.
- Users should be able to preview the animation in real-time and adjust pacing, but should not need to understand keyframe animation or timeline editing.
- For Korean users, the animation can be more expressive and motion-rich than global norms, aligning with local aesthetic preferences.

### Gaps
- No research found specifically on "career animation" as a portfolio feature; this is a novel concept without direct competitors.
- No data found on the impact of animation on portfolio viewer engagement or hiring outcomes.

---

## Onboarding Experience for Free-to-Paid Conversion

### Takeaway
The onboarding experience should be optimized for activation (reaching the aha moment) rather than tour completion. The strongest signals for conversion are users who hit free-tier limitations. Onboarding should use pre-populated sample data, a 5-item activation checklist with auto-completion, contextual tooltips (not modal tours), and intent-based personalization with 2-3 user paths.

### Cited Findings
- Identify your activation metric — the one action that predicts conversion — and design your entire onboarding around it — [Source](https://uxerwave.com/grow-your-creator-tool/saas-onboarding-best-practices/)
- The activation rate directly determines the ceiling of freemium conversion — if 40% of sign-ups activate and 5% of activated users convert, overall conversion is 2%; doubling activation to 80% could double conversions — [Source](https://ivanhub.co.uk/insights/saas-freemium-conversion-optimisation-framework-2026)
- Progressive onboarding (reveal features gradually) outperforms product tours that dump everything at once — [Source](https://uxerwave.com/grow-your-creator-tool/saas-onboarding-best-practices/)
- Onboarding emails are as important as in-app onboarding — 40% of users who don't activate respond to a well-timed email — [Source](https://uxerwave.com/grow-your-creator-tool/saas-onboarding-best-practices/)
- Average SaaS free-to-paid conversion is 3-5%; top-performing onboarding flows achieve 15-25% — [Source](https://uxerwave.com/grow-your-creator-tool/saas-onboarding-best-practices/)
- Pre-populate the first action — the strongest flows pre-fill or pre-generate as much as possible; make the first action a reaction, not a creation — [Source](https://supademo.com/blog/product-led-onboarding)
- A populated workspace at signup: empty-state activation is 20-30%; populated is often 40-60% — [Source](https://www.vibeweek.ai/grow/onboarding-tour-implementation-chat)
- A checklist is more durable than a tour — users see progress, complete items at their own pace — [Source](https://www.vibeweek.ai/grow/onboarding-tour-implementation-chat)
- Auto-completion detection vs manual marking — a user clicks "Create project" and the checklist marks step 1 done automatically — auto-detection beats manual every time — [Source](https://www.vibeweek.ai/grow/onboarding-tour-implementation-chat)
- Contextual tooltips have ~3-5x higher activation lift than modal tours — [Source](https://www.vibeweek.ai/grow/onboarding-tour-implementation-chat)
- Intent-based personalization: ask "What do you want to do?" not "What's your company size?" — 1-2 intent questions early have more impact than a five-field profile form — [Source](https://supademo.com/blog/product-led-onboarding)
- Route users to a use-case-specific starting point — skip the generic dashboard — [Source](https://supademo.com/blog/product-led-onboarding)
- Conversion prompts triggered by value-moments outperform time-based prompts by 2-4x — [Source](https://saasdash.ai/blog/freemium-conversion-rate-benchmarks)
- The 7-email onboarding sequence: Welcome → Quick action → Feature highlight → Social proof → Check-in → Trial ending reminder → Last day urgency — [Source](https://uxerwave.com/grow-your-creator-tool/saas-onboarding-best-practices/)
- Email 2 is the most important — if a user didn't activate on day 1, this email gives them a second chance with a direct deep link — [Source](https://uxerwave.com/grow-your-creator-tool/saas-onboarding-best-practices/)
- For Korean users: offer multiple login options (Kakao, Naver, Toss in addition to Google, Apple) — [Source](https://localazy.com/blog/korean-ux-localization-for-your-app-guide)
- Korean users prefer one-stop solutions — expanding beyond a single function will set you apart — [Source](https://localazy.com/blog/korean-ux-localization-for-your-app-guide)
- Korean users expect minimal onboarding sequences — no time for fluffy walkthroughs or long-form storytelling — [Source](https://vocal.media/01/why-korean-web-design-feels-so-different)

### Inferences
- The onboarding flow should be: Signup → "What's your primary goal?" (1-3 options: Job seeking, Client acquisition, Personal branding) → Pre-populated workspace with example 3D portfolios → Upload first photo → See 3D result → Customize → Publish.
- The activation checklist should have 5 items max: (1) Upload a photo, (2) View your 3D result, (3) Choose a template, (4) Customize your scene, (5) Publish your portfolio.
- Upgrade prompts should fire when users hit the free conversion limit, attempt to use a premium template, or try to remove the watermark — not on a timer.
- For Korean users, onboarding should be even more streamlined — minimal steps, immediate value, mobile-first with sticky bottom actions.

### Gaps
- No research found on onboarding specifically for 3D creative tools with conversion as the primary goal.
- No data found on the effectiveness of different onboarding patterns in the Korean creative tool market.

---

## Essential vs. Nice-to-Have Features for MVP

### Takeaway
The MVP should focus on the core value proposition: photo upload → 3D conversion → basic customization → publish. Use the MoSCoW framework (Must Have, Should Have, Could Have, Won't Have) to prioritize. Must-haves are non-negotiable for the core user journey; won't-haves are explicitly deferred. The MVP should validate the core value before building advanced features.

### Cited Findings
- MoSCoW framework: Must Have (non-negotiable), Should Have, Could Have, Won't Have (explicitly deferred) — [Source](https://www.launchmvp.dev/tools/ai-mvp-feature-prioritizer)
- Features scoring 12+ are Must Have, 8-11 Should Have, 4-7 Could Have, below 4 Won't Have — based on User Impact (2x weight), Revenue Potential (1.5x), and Dev Effort (inverted) — [Source](https://www.zbuild.io/tools/mvp-feature-prioritizer)
- Scope creep is the #1 reason MVPs are delayed or abandoned — [Source](https://www.launchmvp.dev/tools/ai-mvp-feature-prioritizer)
- The activation metric should be specific, measurable, and time-bounded — "X% of new sign-ups reach activation within Y days" — [Source](https://ivanhub.co.uk/insights/saas-freemium-conversion-optimisation-framework-2026)
- Map the shortest path to first value — work backwards from the activation event, count every step between signup and that moment, then cut ruthlessly — [Source](https://supademo.com/blog/product-led-onboarding)
- Each additional step before the "aha moment" increases drop-off by 20-30% — [Source](https://uxerwave.com/grow-your-creator-tool/saas-onboarding-best-practices/)
- The best PLG onboarding is invisible — users accomplish their goal and only afterward realize they just completed "onboarding" — [Source](https://www.lumi.studio/blog/a-guide-to-plg-onboarding)
- For a 3D website: render meaningful HTML first so search engines can read the page — [Source](https://www.utsubo.com/blog/best-threejs-websites-2026)
- The standard stack is three.js plus React Three Fiber; for no-code, Spline leads — [Source](https://www.in-sync.io/en/knowledge/3d-website)
- Model file format is glTF or GLB, compressed with Draco and KTX2 — [Source](https://www.in-sync.io/en/knowledge/3d-website)
- Interactive 3D lifts conversion by up to 40 percent in some e-commerce cases — [Source](https://www.in-sync.io/en/knowledge/3d-website)

### Inferences
- **Must Have (MVP):**
  - Photo upload with quality guidance
  - AI-powered 3D conversion (single image)
  - Basic 3D viewer (rotate, zoom)
  - 3-5 starter templates
  - Basic customization (colors, text, layout)
  - Publish to shareable URL
  - Mobile-responsive output
  - User authentication (email + social login)
  - Free tier with usage limits (3 conversions/month)

- **Should Have (Post-MVP):**
  - Multi-view image upload for better accuracy
  - AI background removal
  - Custom domain support
  - Basic analytics (views, shares)
  - Premium template marketplace
  - Export options (GLB, USDZ for AR)
  - Korean language support with local login (Kakao, Naver)

- **Could Have (V2):**
  - Career animation features (scroll-driven scenes)
  - Advanced customization (lighting, camera paths, audio)
  - Team collaboration
  - API access
  - White-label options
  - Bulk processing

- **Won't Have (Deferred):**
  - Full 3D scene editor (like Spline)
  - Multi-user real-time collaboration
  - Native mobile apps
  - AR/VR viewing modes
  - AI-generated 3D models from text
  - Marketplace for 3D assets

### Gaps
- No research found on MVP feature sets specifically for 3D portfolio services.
- No data found on which features drive the most engagement in creative portfolio tools.
