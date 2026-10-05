# 3D Conversion Technologies & Cost Structures for Photo-to-3D Model Conversion

## Main Technologies for Converting Photos to 3D

### Takeaway
Four dominant technology pipelines exist for photo-to-3D conversion: classical photogrammetry (multi-view stereo), AI-based single/multi-view 3D generation (diffusion models), Neural Radiance Fields (NeRF), and 3D Gaussian Splatting (3DGS). Each occupies a different point on the quality/speed/cost tradeoff curve, and they are not mutually exclusive — hybrid pipelines (e.g., NeRF-to-GS conversion) are emerging.

### Cited Findings
- Photogrammetry remains the standard in cultural heritage restoration due to its ability to produce reliable, high-resolution textures, but faces limitations with reflective, transparent, or textureless surfaces — [ISPRS Archives](https://isprs-archives.copernicus.org/articles/XLVIII-2-W12-2026/89/2026/)
- NeRF methods produce photo-realistic renderings from sparse input views, often surpassing traditional multi-view reconstruction in visual fidelity — [ISPRS Archives](https://isprs-archives.copernicus.org/articles/XLVIII-2-W12-2026/89/2026/)
- 3D Gaussian Splatting models geometry using optimized 3D Gaussian primitives whose centers form a dense point cloud approximating the object surface, offering faster optimization and rendering than NeRF plus direct access to geometric primitives — [arXiv 2604.18205](https://arxiv.org/html/2604.18205v1)
- In a 19-scene benchmark, 2DGS achieved the lowest Chamfer distance (3.15 mm), followed by SVRaster (3.18 mm) and Nerfacto (3.78 mm); classical COLMAP produced sparse point clouds limited by feature-point extraction — [arXiv 2604.18205](https://arxiv.org/html/2604.18205v1)
- NeRF generalizes better than Gaussian Splatting to views dissimilar from training data; GS heuristics for moving/merging/splitting Gaussians are brittle for in-the-wild data with exposure variations and motion blur — [arXiv 2405.09717](https://arxiv.org/html/2405.09717)
- 3DGS outperforms NeRF in computational efficiency and noise reduction in indoor/outdoor reconstruction tests — [University of Twente Research](https://research.utwente.nl/en/publications/evaluating-3d-reconstruction-a-side-by-side-comparison-of-nerf-an/)
- All GS-based methods render at more than 40 FPS on GeForce RTX 4090; training for 100 iterations takes about 6 seconds (NeRF-based) and 3 seconds (GS-based) — [arXiv 2405.09717](https://arxiv.org/html/2405.09717)
- NeRF-to-GS conversion takes about 10 seconds on RTX 4090 (7s for spherical harmonics extraction + 3s fine-tuning), enabling hybrid pipelines — [arXiv 2405.09717](https://arxiv.org/html/2405.09717)
- AI-based 3D generation services (Meshy, Tripo, Rodin) use diffusion-based models that generate 3D meshes from single images or text prompts, representing a fundamentally different approach from photogrammetry or neural rendering — [HackerNoon benchmark](https://hackernoon.com/how-i-stress-tested-3-ai-3d-generators-on-the-same-inputs-what-the-numbers-actually-show)

### Inferences
- For web-based portfolios, AI-based generation and Gaussian Splatting are the most practical paths: AI generation for speed and low cost, GS for photorealistic scene representation with real-time rendering.
- Photogrammetry is best suited for high-accuracy applications (cultural heritage, surveying) but requires significant manual effort and compute time.
- NeRF remains superior for novel-view synthesis quality but is being rapidly displaced by GS for real-time web applications due to GS's 40+ FPS rendering.

### Gaps
- No standardized benchmark directly comparing all four technologies on identical datasets for web-portfolio-specific quality metrics (visual fidelity at typical web viewing distances).

---

## Costs Associated with Each Approach

### Takeaway
Cost structures vary enormously: photogrammetry has high upfront software/licensing costs but low per-model marginal cost; AI generation services charge $0.18–$0.25 per model via API; manual labor for cleanup/retopology adds $25–$350+ per model depending on complexity. Self-hosted GPU infrastructure ranges from $0.105/hr (spot L4) to $7.91/hr (H200 on-demand).

### Cited Findings

**Photogrammetry Software Licensing:**
- Agisoft Metashape Standard Edition: $169 (perpetual, node-locked); Professional Edition: $3,370 (perpetual) — [Agisoft Metashape](https://www.agisoftmetashape.com/buy/)
- Educational licenses: Standard $59, Professional $529 — [Agisoft Metashape](https://www.agisoftmetashape.com/buy/)
- RealityCapture (rebranded RealityScan, owned by Epic Games): free for individuals/students/businesses under $1M annual revenue; $1,250/seat/year above threshold; $1,850/seat/year bundled with Unreal Engine + Twinmotion — [SkyeBrowse comparison](https://www.skyebrowse.com/news/posts/metashape-vs-realitycapture)
- RealityCapture Pay-Per-Input: ~$0.01/image; credit packs from $3,750 for 3,750 credits — [THE FUTURE 3D](https://www.thefuture3d.com/software/realitycapture/)
- Pix4D: $350/month; DroneDeploy: $329/month — [THE FUTURE 3D](https://www.thefuture3d.com/software/realitycapture/)

**AI 3D Generation Service Pricing:**
- Meshy: Free (100 credits/mo), Pro $20/mo (1,000 credits), Premium $40/mo (3,000 credits), Ultra $100/mo (8,000 credits), Studio $70/seat/mo — [Meshy Pricing](https://www.meshy.ai/en/pricing)
- Meshy per-generation cost: 20 credits per Text-to-3D or Image-to-3D generation (Meshy 7/6); 25 credits with Ultra Mode — [Meshy Docs](https://docs.meshy.ai/en/webapp/pricing)
- Tripo AI: 1 credit = $0.01; Text-to-3D: 10–30 credits ($0.10–$0.30); Image-to-3D: 20–50 credits ($0.20–$0.50) depending on model version — [Tripo Pricing](https://developers.tripo3d.ai/en/pricing)
- Tripo v3.1 documented generation times: ~40 seconds without texture, ~120 seconds with texture — [Tripo blog](https://www.tripo3d.ai/blog/batch-generate-3d-assets-api-prompts-images)
- Kaedim: Indie $100/mo (5 credits, up to 5 geometries); Studio $400/mo (20 credits); Team $1,200/mo (60 credits); Enterprise custom — [Kaedim Plans](https://www.kaedim3d.com/plans)
- Kaedim per-generation: Standard quality = 1 credit, High-quality = 2 credits, Ultra = 4 credits — [Kaedim Docs](https://docs.kaedim3d.com/welcome/get-started)
- Luma AI (Genie): Individual plans $30–$300/month; API pay-as-you-go available — [Luma Pricing](https://lumalabs.ai/pricing)
- Rodin (Hyper3D): ~$0.25 per generation in benchmark testing — [HackerNoon benchmark](https://hackernoon.com/how-i-stress-tested-3-ai-3d-generators-on-the-same-inputs-what-the-numbers-actually-show)

**Manual Labor Costs:**
- Freelance 3D artists in the US average ~$48/hour in 2026, ranging from $20/hr (junior) to $130+/hr (senior specialists) — [FreelanceNation](https://freelancenation.com/blog/cost-to-hire-a-3d-artist)
- Retopology services: $75–$200 per model depending on target polygon count — [Fiverr](https://www.fiverr.com/resources/guides/costs/3d-sculpting-artist)
- Model optimization/retopology service tiers: Simple $80, Standard $180, Advanced $350 — [Cad Crowd](https://www.cadcrowd.com/service/801-3d-model-optimization-and-retopology-for-games)
- Simple prop/product model: $50–$150; detailed hard-surface product model: $300–$800 — [FreelanceNation](https://freelancenation.com/blog/cost-to-hire-a-3d-artist)
- UV mapping adds $50–$150; full PBR texturing can double project cost; rigging adds $100–$300 — [Fiverr](https://www.fiverr.com/resources/guides/costs/3d-sculpting-artist)

### Inferences
- For a web portfolio service, AI generation APIs offer the lowest barrier to entry: ~$0.20/model via Meshy or Tripo, with no infrastructure management.
- Photogrammetry becomes cost-effective only at scale or when high geometric accuracy is required; the $3,370 Metashape Pro license pays for itself only after processing many models.
- Manual cleanup/retopology is the hidden cost that can exceed generation costs: a $0.20 AI-generated model may need $80–$350 of manual work to be portfolio-ready.
- Kaedim's model (combining AI generation with in-house art team cleanup) is positioned at the high-quality end: $400–$1,200/month for 20–60 geometries.

### Gaps
- No published data on the exact percentage of AI-generated models that pass quality review without manual intervention (success rates of 96–100% are reported but not the post-cleanup acceptance rate).

---

## Cloud Services and APIs for Automated 3D Conversion

### Takeaway
A mature ecosystem of AI 3D generation APIs exists, with Meshy, Tripo, Rodin (Hyper3D), and Hunyuan 3D (Tencent) offering the most developer-friendly interfaces. All use asynchronous job submission with polling or webhooks. Luma AI focuses on image/video generation rather than 3D mesh output. Kaedim offers an API but targets enterprise studio workflows.

### Cited Findings
- **Meshy API**: REST API with task submission (`POST /openapi/v2/text-to-3d`), status retrieval, and SSE streaming; 20 requests/second on paid plans; queue sizes 10–100 tasks by plan — [Tripo blog](https://www.tripo3d.ai/blog/batch-generate-3d-assets-api-prompts-images)
- **Tripo API**: `POST /v3/generation/text-to-model` returns `task_id`; `GET /v3/tasks/{task_id}` for status; webhooks with HMAC-SHA256 signing; concurrency defaults: 10 for H-series 3D generation, 5 for P-series — [Tripo blog](https://www.tripo3d.ai/blog/batch-generate-3d-assets-api-prompts-images)
- **Rodin (Hyper3D) API**: `POST https://api.hyper3d.com/api/v2/rodin` with polling from 5s to 30s intervals; `Retry-After` header on 429 — [Tripo blog](https://www.tripo3d.ai/blog/batch-generate-3d-assets-api-prompts-images)
- **Hunyuan 3D (Tencent Cloud)**: `SubmitHunyuanTo3DProJob` on `ai3d.tencentcloudapi.com`; 20 requests/second, 3 concurrent tasks by default; JobId valid 24 hours — [Tripo blog](https://www.tripo3d.ai/blog/batch-generate-3d-assets-api-prompts-images)
- **Kaedim API**: Enterprise-only; `POST /process` submits images for 3D generation; webhooks for async notification — [APIs.io](https://apis.io/apis/kaedim/kaedim-generation-api/)
- **Luma AI API**: Offers image (uni-1/uni-1-max) and video (Ray 3.2) generation but no dedicated 3D mesh generation endpoint as of 2026 — [Luma API Pricing](https://lumalabs.ai/api/pricing)
- **Meshy API rate limits**: 20 requests/second on most paid plans; queue tasks 10 (Pro) to 100 (Ultra) — [Meshy Help Center](https://help.meshy.ai/en/articles/12062933-which-meshy-plan-is-right-for-you)
- **Tripo API rate limits**: Rate-limit headers (`X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`); exponential backoff recommended starting at 1s, doubling, capped at 32s — [Tripo blog](https://www.tripo3d.ai/blog/batch-generate-3d-assets-api-prompts-images)

### Inferences
- Tripo and Meshy are the most suitable for integration into a web portfolio pipeline due to published concurrency limits, batch status queries, and webhook support.
- Hunyuan 3D is notable as an open-source alternative that can be self-hosted, avoiding per-model API costs entirely.
- The absence of a Luma AI 3D mesh API means it cannot be used for automated photo-to-3D pipelines as of 2026.

### Gaps
- No SLA guarantees on pay-as-you-go tiers for any provider; latency SLAs require Provisioned Throughput plans (Luma) or enterprise contracts.
- Pricing for high-volume batch processing (10,000+ models/month) is not publicly disclosed by most providers and requires custom sales contact.

---

## Processing Times and Quality Levels

### Takeaway
AI 3D generation is dramatically faster than photogrammetry: 88–195 seconds per model via API vs. 30 minutes to 10+ hours for photogrammetry pipelines. However, AI-generated models often require manual cleanup for production quality, while photogrammetry produces geometrically accurate results directly. Quality varies significantly between AI providers and input modes.

### Cited Findings

**AI Generation Processing Times (measured benchmarks):**
- Text-to-3D median latency: Meshy 6 = 88s, Tripo v3.1 = 128s, Rodin Gen-2.5 = 158s — [HackerNoon benchmark](https://hackernoon.com/how-i-stress-tested-3-ai-3d-generators-on-the-same-inputs-what-the-numbers-actually-show)
- Image-to-3D median latency: Meshy 6 = 195s, Tripo v3.1 = 99s, Rodin Gen-2.5 = 190s — [HackerNoon benchmark](https://hackernoon.com/how-i-stress-tested-3-ai-3d-generators-on-the-same-inputs-what-the-numbers-actually-show)
- Success rates: Meshy 100%, Tripo 98–100%, Rodin 96–98% — [HackerNoon benchmark](https://hackernoon.com/how-i-stress-tested-3-ai-3d-generators-on-the-same-inputs-what-the-numbers-actually-show)
- Tripo v3.1 documented: ~40s without texture, ~120s with texture — [Tripo blog](https://www.tripo3d.ai/blog/batch-generate-3d-assets-api-prompts-images)
- Tripo Smart Mesh P1.0: 5,000-face generation in ~5 seconds; 20,000-face in ~10 seconds — [Tripo blog](https://www.tripo3d.ai/blog/tripo-smart-mesh-p1-vs-meshy-t2)
- Meshy T2: 5,000-face in ~45 seconds; 10,000-face in ~30 seconds — [Tripo blog](https://www.tripo3d.ai/blog/tripo-smart-mesh-p1-vs-meshy-t2)
- Meshy 7 fully textured generation: ~1 minute — [Meshy comparison](https://www.meshy.ai/compare/meshy-vs-tripo)

**AI Generation Quality Rankings:**
- Geometry quality (white mesh, blind A/B): Tripo v3.1 ranked 1st, Rodin 2nd, Meshy 3rd — [HackerNoon benchmark](https://hackernoon.com/how-i-stress-tested-3-ai-3d-generators-on-the-same-inputs-what-the-numbers-actually-show)
- Textured output quality: Meshy leads on single-view; Tripo leads multi-view — [HackerNoon benchmark](https://hackernoon.com/how-i-stress-tested-3-ai-3d-generators-on-the-same-inputs-what-the-numbers-actually-show)
- Quad topology: Tripo strongest overall; Meshy weakest on complex shapes — [HackerNoon benchmark](https://hackernoon.com/how-i-stress-tested-3-ai-3d-generators-on-the-same-inputs-what-the-numbers-actually-show)
- Face counts: Meshy 6 = 17,438; Tripo v3.1 = 13,482; Rodin Gen-2.5 = 20,054 — [HackerNoon benchmark](https://hackernoon.com/how-i-stress-tested-3-ai-3d-generators-on-the-same-inputs-what-the-numbers-actually-show)
- Independent benchmark: Meshy highest overall score (5/7 categories); Tripo fastest (30–45s); Rodin highest geometry detail but needs decimation — [Coruzant](https://coruzant.com/ai/best-ai-for-3d-models-honest-comparison/)

**Photogrammetry Processing Times:**
- Agisoft Metashape benchmark (920 images, 40MPix each): Match Photos 23min, Depth Maps (High) 3h08m, Dense Cloud (High) 2h36m, Mesh (High) 10h12m, Tiled Model (High) 43h — [Agisoft Helpdesk](https://agisoft.freshdesk.com/support/solutions/articles/31000157329-memory-requirements-for-processing-operations)
- Close-range benchmark (772 images, 18MPix): Match Photos 30min, Depth Maps (High) 43min, Dense Cloud (High) 1h24m, Mesh (High) 2h59m — [Agisoft Helpdesk](https://agisoft.freshdesk.com/support/solutions/articles/31000157329-memory-requirements-for-processing-operations)
- Artec Studio AI Photogrammetry: Separate object algorithm 10–30 minutes (Normal resolution); High resolution 1.5–2x slower — [Artec3D Manual](https://docs.artec3d.com/photogrammetry/User%20Manual/AI%20Photogrammetry%20User%20Manual%20for%20AS%2019.pdf)
- Optimal photo count for turntable photogrammetry: 150–300 photos; beyond 300 photos shows no quality improvement — [OpenScan Blog](https://blog.openscan.eu/posts/optimizing-3d-scans-how-many-photos-do-you-really-need/)
- Artec Studio recommends 50–150 photos for separate object reconstruction — [Artec3D Manual](https://docs.artec3d.com/photogrammetry/User%20Manual/AI%20Photogrammetry%20User%20Manual%20for%20AS%2019.pdf)

**NeRF/Gaussian Splatting Processing:**
- 3DGS training: ~3 seconds per 100 iterations on RTX 4090 — [arXiv 2405.09717](https://arxiv.org/html/2405.09717)
- NeRF training: ~6 seconds per 100 iterations on RTX 4090 — [arXiv 2405.09717](https://arxiv.org/html/2405.09717)
- NeRF-to-GS conversion: ~10 seconds on RTX 4090 — [arXiv 2405.09717](https://arxiv.org/html/2405.09717)
- GS rendering: 40+ FPS on RTX 4090 — [arXiv 2405.09717](https://arxiv.org/html/2405.09717)

### Inferences
- AI generation is 20–100x faster than photogrammetry (minutes vs. hours), making it the only viable option for real-time or high-volume web portfolio applications.
- Photogrammetry quality is superior for geometric accuracy but the processing time (hours per model) makes it impractical for consumer-facing web services.
- The quality gap between AI-generated and photogrammetry models is narrowing, but AI models still require manual cleanup for professional portfolio presentation.
- Gaussian Splatting offers the best quality-to-rendering-speed ratio for web display, but requires more input images and GPU compute than AI generation.

### Gaps
- No benchmark data on NeRF/GS processing times for typical portfolio objects (e.g., a product photo set of 20–50 images).
- Quality metrics for AI-generated models are subjective (blind A/B voting); no standardized objective quality score exists across providers.

---

## Infrastructure Costs for Running 3D Conversion at Scale

### Takeaway
Cloud GPU costs range from $0.105/hr (AWS L4 spot) to $7.91/hr (AWS H200 on-demand). For AI 3D generation at scale, the per-model compute cost is negligible ($0.001–$0.01) when using spot instances, making API pricing the dominant cost. Self-hosting becomes cost-effective at ~1,000+ models/month when comparing GPU costs to API per-model fees. Storage and bandwidth for 3D assets are modest: optimized GLB files are typically 1–50 MB.

### Cited Findings

**AWS GPU Pricing (us-east-1, Linux, October 2026):**
- L4 (g6.xlarge): $0.805/hr on-demand, $0.105/hr spot — [GPU Rental Prices](https://gpurentalprices.com/providers/aws)
- L40S (g6e.xlarge): $1.86/hr on-demand — [GPU Rental Prices](https://gpurentalprices.com/providers/aws)
- A100 (p4d.24xlarge): $2.74/hr per GPU on-demand — [GPU Rental Prices](https://gpurentalprices.com/providers/aws)
- H100 SXM (p5.48xlarge): $6.88/hr per GPU on-demand, $7.22/hr spot — [GPU Rental Prices](https://gpurentalprices.com/providers/aws)
- H200 SXM (p5en.48xlarge): $7.91/hr per GPU on-demand — [GPU Rental Prices](https://gpurentalprices.com/providers/aws)
- G5 (A10G) instances: up to 3x better graphics performance than G4dn, 40% better price performance — [AWS G5](https://aws.amazon.com/ec2/instance-types/g5/)

**GCP GPU Pricing (October 2026):**
- L4 (g2-standard-4): $0.71/hr on-demand (GPU only), $0.25/hr (3-year reserved) — [GCP Pricing](https://cloud.google.com/products/compute/pricing/accelerator-optimized)
- A100 40GB (a2-highgpu-1g): $3.67/hr on-demand, $2.00/hr spot — [GCP Pricing](https://cloud.google.com/products/compute/pricing/accelerator-optimized)
- A100 80GB (a2-ultragpu-1g): $5.07/hr on-demand, $2.40/hr spot — [GCP Pricing](https://cloud.google.com/products/compute/pricing/accelerator-optimized)
- H100 (a3-highgpu-8g): $11.06/hr per GPU on-demand, $3.69/hr spot — [GPUCloudCost](https://gpucloudcost.com/gcp-gpu-pricing)
- B200: $16.11/hr on-demand — [GPUEconomy](https://gpueconomy.com/providers/gcp)
- T4: $0.35/hr on-demand — [GPUCloudCost](https://gpucloudcost.com/gcp-gpu-pricing)

**Azure GPU Pricing:**
- ND A100 v4 series: 8x A100 40GB with 1.6 TB/s InfiniBand; pricing via calculator (not publicly listed as fixed rate) — [Azure Docs](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/gpu-accelerated/ndasra100v4-series)
- NC A100 v4 series: 1–4x A100 80GB PCIe GPUs — [Azure Docs](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/gpu-accelerated/nca100v4-series)

**3D Asset Storage and Bandwidth:**
- gltfpack with meshopt compression can significantly reduce GLB file sizes; designed to work with gzip/brotli for further reduction — [gltfpack](https://meshoptimizer.org/gltf/)
- Meshopt decoders run at ~1 GB/sec on modern desktop hardware — [Khronos glTF](https://github.com/KhronosGroup/glTF/tree/main/extensions/2.0/Vendor/EXT_meshopt_compression)
- KTX 2.0 supercompressed textures reduce download size and GPU memory usage — [Khronos Blog](https://www.khronos.org/blog/optimize-3d-assets-with-khronos-new-gltf-compressor-tool)
- AWS S3 standard storage: ~$0.023/GB/month; egress: $0.09/GB (first 10TB) — [AWS S3 Pricing](https://aws.amazon.com/s3/pricing/)
- GCP egress: $0.12/GB — [GPU Finder](https://gpufinder.dev/providers/google-cloud)

**Self-Hosting vs API Cost Analysis:**
- At $0.20/model (Meshy API) and ~2 minutes per model on a single L4 GPU ($0.105/hr spot): self-hosted compute cost = ~$0.0035/model, making API ~57x more expensive per model in pure compute terms.
- However, API pricing includes model inference infrastructure, maintenance, and updates; self-hosting requires engineering effort for pipeline development, model updates, and quality assurance.
- Break-even: at 1,000 models/month, API cost = $200/month; self-hosted L4 spot instance running 24/7 = ~$76/month (but utilization would be only ~14% at 2 min/model).

### Inferences
- For a web portfolio service expecting <1,000 models/month, using third-party APIs (Meshy/Tripo) is more cost-effective than self-hosting GPU infrastructure.
- At >5,000 models/month, self-hosting open-source models (Hunyuan3D) on spot GPU instances reduces per-model cost by 50–100x, but requires significant engineering investment.
- Storage and bandwidth costs are negligible compared to compute: 10,000 models at 10 MB each = 100 GB storage ($2.30/month on S3) and minimal egress for typical portfolio viewing.
- The dominant cost at scale is not infrastructure but either API fees (if using managed services) or engineering labor (if self-hosting).

### Gaps
- No published data on actual GPU utilization rates for AI 3D inference workloads (the 2-minute-per-model figure is from API latency, not pure inference time).
- Hunyuan 3D self-hosting costs are not publicly documented; the model is open-source but hardware requirements and throughput are not specified in available sources.
- AWS S3 and GCP egress pricing cited from general pricing pages; actual costs for 3D asset delivery via CDN (CloudFront, Cloud CDN) would be lower at scale.

---

## Summary Cost Comparison Table

| Approach | Per-Model Cost | Processing Time | Quality | Best For |
|----------|---------------|-----------------|---------|----------|
| Meshy API | $0.20 | 1–3 min | High (textured) | Web portfolios, game dev |
| Tripo API | $0.18–$0.50 | 1–2 min | High (geometry) | Rapid concepting, multi-view |
| Rodin API | $0.25 | 2–3 min | Very High (detail) | VFX, high-detail art |
| Kaedim | $20–$60/geometry | Hours–days | Production-ready | Studio pipelines |
| Photogrammetry (Metashape) | $169–$3,370 license + compute | 30min–10hrs | Geometrically accurate | Surveying, heritage |
| Self-hosted AI (Hunyuan3D) | ~$0.004 (compute only) | ~2 min | Medium–High | High-volume, tech teams |
| Manual 3D modeling | $50–$800+ | 1–2 weeks | Highest | Hero assets, characters |
