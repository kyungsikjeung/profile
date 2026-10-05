# Technical Architecture for 3D Portfolio Service

## Optimal Tech Stack for a Web-Based 3D Portfolio Service

### Takeaway
The optimal stack combines React/Next.js with React Three Fiber (R3F) + Three.js for frontend rendering, a Python FastAPI backend with async job queues for the 3D conversion pipeline, and cloud GPU instances (L4/A100) for AI model inference. This stack balances performance, developer ecosystem maturity, and deployment flexibility.

### Cited Findings
- Astro v5 with island architecture achieved Lighthouse 100/100 SEO while running a full Three.js interactive room — the 1MB Three.js bundle only loads on the 3D explore page — [Source](https://www.aniruddhatrey.com/blog/architecture-behind-3d-portfolio)
- Next.js 16 App Router + React 19 + Three.js + R3F + GSAP + Tailwind CSS v4 is the dominant production stack for 3D portfolios in 2026 — [Source](https://github.com/kalashree225/3d-webgl-portfolio)
- Three.js + R3F + Drei is the standard 3D engine layer; GSAP + Lenis handle scroll-driven animation; React Three Fiber is "the dominant pattern in React-based Three.js work" — [Source](https://www.creativedevjobs.com/blog/how-to-hire-a-threejs-developer)
- FastAPI + Pydantic + Uvicorn is the standard serving layer for 3D generation APIs (Hunyuan3D, TRELLIS) — [Source](https://github.com/Tencent-Hunyuan/Hunyuan3D-2.1/blob/main/api_server.py)
- Cloud Run with GPUs (8vCPU/32GB RAM) or GKE Autopilot with GPUs are standard deployment targets for 3D generation services — [Source](https://github.com/NucleusEngineering/genai-3d-meshes)
- Unity WebGL vs Three.js vs Pixel Streaming: Three.js wins for fast initial load, web integration, and cost-effective scaling; Pixel Streaming costs thousands of GPU-hours/day at 10,000 concurrent users — [Source](https://adilbouchnita.com/blog/unity-webgl-vs-threejs-vs-pixel-streaming)

### Inferences
- For a portfolio service (not a game), Three.js/R3F is the clear choice over Unity WebGL — faster load, no WASM overhead, better SEO, and the 3D is a component of a larger web experience
- The frontend should use island architecture or selective hydration to keep 3D bundles off non-3D pages
- Backend should be Python-based to leverage the PyTorch/TensorFlow ecosystem for 3D generation models

### Gaps
- No direct comparison of SvelteKit or Vue/Nuxt for 3D portfolio use cases was found; React ecosystem dominance in 3D web is clear but not exhaustively benchmarked

---

## 3D Conversion Pipeline Architecture for Scalability

### Takeaway
The pipeline should be an async microservices architecture: API Gateway → Job Queue (Redis/PubSub) → GPU Worker Pool (Hunyuan3D/TRELLIS) → Object Storage (S3/GCS) → CDN delivery. Each stage scales independently based on demand.

### Cited Findings
- A production 3D generation microservice is four pieces: API gateway (accepts requests, validates, enqueues), async worker (calls Hunyuan 3D, writes result), COS (holds inputs/outputs), status endpoint (tells client when model is ready) — [Source](https://www.tencentcloud.com/techpedia/146781)
- 3D generation requests cannot be synchronous — a single high-poly model takes 30-60 seconds; the microservice pattern is async end-to-end: client posts request, service returns job ID immediately, client polls status — [Source](https://www.tencentcloud.com/techpedia/146781)
- Hunyuan3D-2.1 API exposes POST /generate (sync), POST /send (async with task ID), GET /status/{uid} (poll for completion) — [Source](https://github.com/Tencent-Hunyuan/Hunyuan3D-2.1/blob/main/api_server.py)
- 3DAIGC-API provides a self-hosted FastAPI backend with VRAM-aware GPU scheduling, dynamic model loading, multi-model support, and async job queue management — [Source](https://github.com/FishWoWater/3DAIGC-API)
- Cloud-native 3D reconstruction pipeline uses Kubernetes with microservices: Preprocessor (CUDA runtime, CarveKit), Reconstruction (nvdiffrec), Workloads Scheduler (S3-backed job queue) — [Source](https://arxiv.org/html/2409.19322v1)
- Hunyuan3D-v2 + TRELLIS pipeline: ~8 seconds and 8GB VRAM for image-to-3D textured mesh; ~13 seconds and 11GB VRAM for text-to-3D — [Source](https://github.com/FishWoWater/hunyuan_trellis_fast)
- Matrix3D (CVPR 2025) enables single/few-shot 3D reconstruction via unified diffusion transformer, supporting pose estimation, depth prediction, and novel view synthesis with 3DGS optimization — [Source](https://arxiv.org/html/2502.07685v2)
- Photo-to-mesh pipeline: SAM 3 masking → Hunyuan3D (generative) or VGGT (photogrammetric) → mesh export (.glb/.stl) — [Source](https://github.com/Hasasasaki/photo-to-mesh)

### Inferences
- The pipeline should support both generative (Hunyuan3D for single-image) and photogrammetric (VGGT/2DGS for multi-image) routes
- GPU workers should use semaphore-based concurrency control (e.g., limit_model_concurrency=5) to prevent OOM
- Model loading/unloading on demand optimizes VRAM usage when supporting multiple 3D generation models
- A job table (Redis or SQL) must track status transitions so crashed workers can resume

### Gaps
- Exact per-job GPU cost for self-hosted Hunyuan3D vs API-hosted (Tencent Cloud) was not directly compared in found sources
- No benchmarks found for TRELLIS vs Hunyuan3D quality/speed trade-offs in production settings

---

## Key Technical Challenges in Real-Time 3D Rendering on the Web

### Takeaway
The primary challenges are: draw call budget management (target <100 desktop, <50 mobile), texture memory optimization (KTX2 compression), GPU thermal throttling on mobile, and maintaining 60 FPS across diverse hardware. Solutions include instancing, render-on-demand, DPR capping, and adaptive quality tiers.

### Cited Findings
- Draw calls are the single biggest performance bottleneck in WebGL; target under 100 draw calls per frame for desktop, under 50 for mobile — [Source](https://simplified.media/guides/webgl-threejs)
- A 4096×4096 RGBA texture takes 64MB GPU memory uncompressed; KTX2 compression reduces this to ~4MB — [Source](https://www.hontran.dev/blog/three-js-performance-optimization)
- Draco compression reduces mesh file sizes by 80-95%; a 10MB GLB becomes 500KB-2MB after compression — [Source](https://simplified.media/guides/webgl-threejs)
- Mobile GPUs thermally throttle under sustained load — a scene at 60 FPS initially may drop to 20 FPS after 30 seconds without optimization — [Source](https://simplified.media/guides/webgl-threejs)
- Cap pixel ratio at 2x (Math.min(devicePixelRatio, 2)); rendering at 3x means 9x the pixel fill vs 1x — [Source](https://simplified.media/guides/webgl-threejs)
- Three.js does not garbage-collect GPU resources automatically; undisposed geometries/materials/textures leak VRAM until context crashes — [Source](https://simplified.media/guides/webgl-threejs)
- InstancedMesh renders thousands of copies with one draw call; 5,000 trees as separate meshes = 5,000 draw calls, as instances = 1 draw call — [Source](https://simplified.media/guides/webgl-threejs)
- WebGPU is available in Chrome/Edge but Safari and Firefox support remains incomplete as of early 2026; WebGL 2.0 via Three.js is still the practical choice for production — [Source](https://simplified.media/guides/webgl-threejs)
- frameloop="demand" in R3F dropped idle GPU usage to near zero on a product configurator — the single biggest battery/thermal win — [Source](https://www.hontran.dev/blog/three-js-performance-optimization)
- Adaptive DPR: monitors FPS and downgrades DPR to 0.75 if below 45 FPS, raises back to 1.5 when stable 55+ FPS — [Source](https://github.com/iTzRitual/folio-2026)
- KTX2/Basis Universal compression was "the difference between a scene that crawled on mid-range hardware and one that ran smooth" — [Source](https://tympanus.net/codrops/2026/04/28/more-than-a-portfolio-building-a-scroll-driven-3d-world-with-something-to-say/)
- GPU instancing collapsed draw calls: "the difference between 30 FPS and 144" — [Source](https://tympanus.net/codrops/2026/04/28/more-than-a-portfolio-building-a-scroll-driven-3d-world-with-something-to-say/)

### Inferences
- A production 3D portfolio service must implement device capability detection and serve quality tiers (texture resolution, shadow on/off, post-processing on/off)
- The rendering loop should use frameloop="demand" for static/scroll-driven scenes and continuous RAF only for interactive scenes
- SharedArrayBuffer + Web Workers should be used for parsing large geometry files to avoid main thread blocking

### Gaps
- No specific benchmarks found for WebGPU production readiness in Safari/Firefox as of October 2026
- No data found on the performance impact of 3D Gaussian Splatting (3DGS) rendering in browser vs traditional mesh rendering

---

## Development Roadmap (MVP → v1 → v2)

### Takeaway
MVP (4-6 weeks): single-image → 3D model with basic viewer. v1 (8-12 weeks): multi-image support, user accounts, portfolio editor, social sharing. v2 (16-24 weeks): real-time collaboration, AI-powered scene composition, mobile AR, marketplace.

### Cited Findings
- A phased portfolio build: Phase 1 = minimalist digital CV with WebGL flat UI; Phase 2 = full 3D scene reveal with camera transition; Phase 3 = CMS integration; Phase 4 = content polish, mobile fallback, a11y; Phase 5 = deploy — [Source](https://github.com/hari-houdini/me-portfolio)
- Hunyuan3D API integration can produce "a working integration to iterate on" in an afternoon — auth, task submission, polling, mesh retrieval, Three.js viewer — [Source](https://www.tencentcloud.com/techpedia/146527)
- MVP stage team: lean trio (Product Manager, Tech Lead, 1 Frontend Engineer); PMF stage: 2-4 Frontend Engineers, dedicated QA, part-time UX — [Source](https://digiqt.com/blog/vuejs-hiring-roadmap/)
- 8-12 weeks for sourcing to offer, with 2-4 weeks notice for hiring — [Source](https://digiqt.com/blog/vuejs-hiring-roadmap/)
- A simple Three.js landing-page feature might run $5,000-$15,000; a full immersive campaign $25,000-$50,000+ — [Source](https://www.creativedevjobs.com/blog/how-to-hire-a-threejs-developer)

### Inferences
- MVP should use a hosted 3D generation API (Tencent Hunyuan3D) to avoid GPU infrastructure investment until product-market fit
- v1 should bring the 3D generation in-house on cloud GPU to reduce per-generation cost and enable customization
- The roadmap should parallelize frontend (portfolio viewer/editor) and backend (generation pipeline) development

### Gaps
- No specific timeline estimates found for building a production-grade 3D generation pipeline from scratch (vs using hosted APIs)
- No data on user retention or conversion metrics for 3D portfolio services to inform feature prioritization

---

## Team Composition

### Takeaway
A core team of 5-7 people is needed: 2 Frontend/3D Engineers (React/Three.js), 1-2 AI/ML Engineers (3D generation models), 1 Backend Engineer (FastAPI/infrastructure), 1 Product/Design lead. The 3D engineer talent pool is small and specialized.

### Cited Findings
- Three.js developer skills: solid JavaScript fundamentals, Three.js scene graph understanding, animation/RAF loop, GLTF/GLB asset loading, performance awareness (draw call budgets, texture sizes, mobile constraints) — [Source](https://www.creativedevjobs.com/blog/how-to-hire-a-threejs-developer)
- Senior/specialist requirements: custom GLSL shader authorship, post-processing pipelines, physics engine integration (Cannon.js, Rapier), React Three Fiber, WebXR — [Source](https://www.creativedevjobs.com/blog/how-to-hire-a-threejs-developer)
- "Treating it as a senior frontend role [is a mistake]. The skills do not transfer cleanly. A strong React developer can learn Three.js, but the ramp-up time for production-quality GPU work is measured in months, not weeks" — [Source](https://www.creativedevjobs.com/blog/how-to-hire-a-threejs-developer)
- Three.js talent pool is concentrated in specific communities: Three.js Journey (Bruno Simon), Wawa Sensei, Poimandres Discord (R3F/Drei ecosystem) — [Source](https://www.creativedevjobs.com/blog/how-to-hire-a-threejs-developer)
- AI/ML engineers for 3D generation need: PyTorch, diffusion models, CUDA, VRAM optimization, model serving (vLLM/TensorRT) — inferred from 3DAIGC-API and Hunyuan3D architectures
- A Web3D co-founder role requires: deep Web 3D framework knowledge (babylon.js, three.js), WebGL/WebGPU fundamentals, TypeScript, asset pipeline fluency (glTF, textures, compression, animation), performance tuning — [Source](https://www.creativedevjobs.com/-co-founder-web3d-engineer-at-fruid3d-6294)

### Inferences
- Hiring should prioritize demonstrated 3D portfolio work over general frontend experience
- The team needs a blend of creative coding (shaders, animation) and systems engineering (GPU optimization, pipeline architecture)
- AI/ML engineers should have experience with diffusion-based generative models and GPU resource management

### Gaps
- No salary data found specifically for 3D web engineers in 2026 (only project-based pricing)
- No data on team size for comparable 3D portfolio/generation startups at different stages

---

## Infrastructure Costs at Different Scale Levels

### Takeaway
GPU costs dominate: at MVP scale (100 generations/day), ~$50-100/day using spot L4 instances; at scale (10,000+ generations/day), ~$2,000-5,000/day requiring H100/A100 clusters with autoscaling. Storage and CDN costs are secondary but grow linearly with user base.

### Cited Findings
- Cloud GPU pricing 2026: L4 at $0.44-$0.80/hr, A100 80GB at $0.68-$5.03/hr, H100 80GB at $1.49-$6.98/hr depending on provider and spot vs on-demand — [Source](https://www.cloudzero.com/blog/cloud-gpu-pricing-comparison/)
- RunPod RTX 4090 Community at $0.34/hr; Lambda H100 PCIe at $3.29/hr; AWS H100 on-demand at $6.88/hr — [Source](https://www.synpixcloud.com/blog/cloud-gpu-pricing-comparison-2026)
- GCP L4 at $0.70/hr on-demand makes it "the default serving GPU for small and mid-size models" — [Source](https://www.cloudzero.com/blog/cloud-gpu-pricing-comparison/)
- Hunyuan3D API: low poly count finishes in ~15 seconds, high in ~60 seconds; per-call price scales with setting — [Source](https://www.tencentcloud.com/techpedia/146781)
- Self-hosted Hunyuan3D on Cloud Run with GPU: 8vCPU/32GB RAM configuration — [Source](https://github.com/NucleusEngineering/genai-3d-meshes)
- Egress fees: $0.09-$0.20/GB on IaaS platforms; "zero egress beats a lower hourly rate once the dataset is large" — [Source](https://www.cloudzero.com/blog/cloud-gpu-pricing-comparison/)
- Decentralized GPU networks (Nosana) can cut AI inference costs by up to 70% vs centralized cloud — [Source](http://hackernoon.com/how-we-built-an-ai-texture-pipeline-for-3d-games-with-nosana-and-arweave)

### Inferences
- MVP stage: Use hosted API (Tencent Hunyuan3D) at ~$0.05-0.20/generation → $5-20/day for 100 generations
- Growth stage: Self-host on spot L4/A100 instances → ~$0.02-0.08/generation amortized → $200-800/day for 10,000 generations
- Scale stage: Reserved H100 capacity or multi-GPU nodes → $1,500-4,000/day for 50,000+ generations
- Storage: ~5-20MB per optimized GLB → 10,000 models = 50-200GB → $5-20/month S3 standard
- CDN: ~1-5MB per page load → 100,000 daily views = 100-500GB/day egress → $10-100/day

### Gaps
- No found source provides a complete cost breakdown (GPU + storage + CDN + bandwidth) for a production 3D portfolio service at specific scale levels
- Pricing for Tencent Hunyuan3D API per-generation was not found in the researched sources

---

## 3D Asset Storage, Optimization, and Delivery

### Takeaway
Use GLB as the primary format with Draco mesh compression + KTX2 texture compression (achieving 90-95% size reduction). Store originals in S3/GCS, serve via CDN with pre-signed URLs for generated assets. Implement a build-time optimization pipeline using gltf-transform/gltfpack.

### Cited Findings
- GLB (binary glTF) is the recommended export format for real-time web applications: animation support, PBR materials, Draco compression support, single-file delivery — [Source](https://docs.unity.com/asset-transformer-sdk/2026.1/manual/sdktips/export-guidelines)
- GLB optimized + Draco + KTX2 achieves 90-95% file size reduction vs uncompressed exports (5-10% of original size) — [Source](https://docs.unity.com/asset-transformer-sdk/2026.1/manual/sdktips/export-guidelines)
- Draco compression reduces GLB file sizes by 70-90% with minimal visual quality loss — [Source](https://docs.unity.com/asset-transformer-sdk/2026.1/manual/sdktips/export-guidelines)
- KTX2 with Basis Universal: 70-90% texture size reduction vs PNG/JPEG; textures stay compressed in VRAM (~4MB vs 64MB for 4K texture) — [Source](https://www.hontran.dev/blog/three-js-performance-optimization)
- Meshopt compression: very fast decoding (~1 GB/sec with WASM SIMD), appropriate for models of any size; for geometry <1MB, WASM decoder overhead may outweigh savings — [Source](https://gltf-transform.dev/modules/extensions/classes/EXTMeshoptCompression)
- gltf-transform or gltfpack runs Draco + KTX2 + pruning in a single command at build time — [Source](https://www.hontran.dev/blog/three-js-performance-optimization)
- COS with pre-signed URLs: upload URL expires in 10 minutes, read URL for generation expires in 15 minutes, result download URL expires in 24 hours — [Source](https://www.tencentcloud.com/techpedia/146781)
- Hunyuan3D API accepts ImageUrl parameter that must be a public HTTPS URL — COS pre-signed GET URL provides temporary access — [Source](https://www.tencentcloud.com/techpedia/146781)
- KTX2/Basis Universal transcodes to platform-specific formats (ETC, BC, ASTC) at runtime for optimal GPU memory on each device — [Source](https://www.khronos.org/blog/optimize-3d-assets-with-khronos-new-gltf-compressor-tool)

### Inferences
- The optimization pipeline should be: raw mesh → decimation (reduce face count) → Draco compression → KTX2 texture compression → GLB export
- A multi-tier storage strategy: hot storage (recently generated, CDN-cached) → warm storage (S3 standard) → cold storage (S3 glacier for unused assets)
- Client-side loading should use GLTFLoader with DRACOLoader and KTX2Loader configured, with fallback to uncompressed GLB if decoders fail

### Gaps
- No benchmarks found for 3D Gaussian Splatting (.ply/.splat) file sizes vs compressed GLB for equivalent quality
- No data on CDN caching strategies specifically for 3D assets (cache hit ratios, invalidation patterns)

---

## Key Technical Risks and Mitigation Strategies

### Takeaway
Top risks: (1) GPU cost scaling with user growth, (2) model quality inconsistency, (3) browser compatibility/performance fragmentation, (4) VRAM exhaustion on multi-model serving, (5) long-tail generation failures. Mitigations include hybrid cloud/model serving, quality validation pipelines, adaptive rendering, and graceful degradation.

### Cited Findings
- GPU servers are expensive and scale per session; at 10,000 concurrent users, Pixel Streaming costs thousands of GPU-hours/day — [Source](https://adilbouchnita.com/blog/unity-webgl-vs-threejs-vs-pixel-streaming)
- "A scene that runs at 60 FPS on a desktop can drop to 20 FPS on a phone after 30 seconds of sustained rendering as the GPU thermally throttles" — [Source](https://simplified.media/guides/webgl-threejs)
- Image-to-3D reconstruction quality drops on glass, mirrors, chrome, thin wires/hair, hollow interiors, heavy occlusion — [Source](https://bunpav.com/blog/image-to-3d-model-photo-to-mesh-guide)
- Hunyuan3D is generative, not photogrammetric: "it's reconstructing 80% of the mesh from a trained guess about what objects like this one usually look like from the side you didn't photograph" — [Source](https://bunpav.com/blog/image-to-3d-model-photo-to-mesh-guide)
- WebGPU is not yet production-ready across all browsers (Safari/Firefox incomplete as of early 2026) — [Source](https://simplified.media/guides/webgl-threejs)
- Three.js does not garbage-collect GPU resources; memory leaks crash the tab — [Source](https://simplified.media/guides/webgl-threejs)
- 429 rate limits, 5xx transient errors, and model run failures require retry logic with exponential backoff — [Source](https://www.tencentcloud.com/techpedia/146527)
- "Optimize for the worst device your users have. Measure everything." — [Source](https://simplified.media/guides/webgl-threejs)

### Inferences
- Risk: GPU cost explosion → Mitigation: start with hosted API, migrate to self-hosted spot instances at growth stage, implement per-run cost ceilings
- Risk: Inconsistent output quality → Mitigation: implement quality scoring (mesh integrity, texture coverage), automatic re-generation on low quality, user feedback loop
- Risk: Mobile performance failure → Mitigation: device capability detection, quality tiers, static fallback (poster image) for WebGL-unavailable devices
- Risk: VRAM exhaustion → Mitigation: VRAM-aware scheduling, dynamic model loading/unloading, semaphore-based concurrency limits
- Risk: Browser fragmentation → Mitigation: WebGL 2.0 baseline (not WebGPU), progressive enhancement, feature detection

### Gaps
- No found sources address legal/IP risks of AI-generated 3D models (copyright, training data provenance)
- No data on the failure rate of Hunyuan3D/TRELLIS in production (what percentage of generations produce unusable results)
- No sources found on data privacy implications of user-uploaded photos being processed by third-party APIs
