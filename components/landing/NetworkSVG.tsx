"use client";

interface StepConfig {
	num: string;
	title: string;
	line1: string;
	line2: string;
	cx: number;
	cy: number;
	isBottom: boolean;
	accent: string;
	accentSoft: string;
	bevelLeft: string;
	bevelRight: string;
}

const STEPS: StepConfig[] = [
	{
		num: "01",
		title: "SEARCH",
		line1: "Filter by location,",
		line2: "property type & budget.",
		cx: 84,
		cy: 112,
		isBottom: false,
		accent: "#38bdf8",
		accentSoft: "rgba(56, 189, 248, 0.24)",
		bevelLeft: "#3a9db8",
		bevelRight: "#246478",
	},
	{
		num: "02",
		title: "VERIFY",
		line1: "Landlord ID & title",
		line2: "authenticated upfront.",
		cx: 212,
		cy: 186,
		isBottom: true,
		accent: "#5ec8e0",
		accentSoft: "rgba(94, 200, 224, 0.24)",
		bevelLeft: "#2d7f96",
		bevelRight: "#1e293b",
	},
	{
		num: "03",
		title: "CONNECT",
		line1: "Direct chat with owner",
		line2: "or licensed agent.",
		cx: 340,
		cy: 112,
		isBottom: false,
		accent: "#4aba8a",
		accentSoft: "rgba(74, 186, 138, 0.26)",
		bevelLeft: "#33a674",
		bevelRight: "#1e6a4d",
	},
	{
		num: "04",
		title: "INSPECT",
		line1: "Schedule a private",
		line2: "on-site viewing.",
		cx: 468,
		cy: 186,
		isBottom: true,
		accent: "#ff7a52",
		accentSoft: "rgba(255, 122, 82, 0.24)",
		bevelLeft: "#f95d2e",
		bevelRight: "#bb3316",
	},
	{
		num: "05",
		title: "MOVE IN",
		line1: "Sign terms transparently",
		line2: "& receive your keys.",
		cx: 596,
		cy: 112,
		isBottom: false,
		accent: "#33a674",
		accentSoft: "rgba(51, 166, 116, 0.3)",
		bevelLeft: "#33a674",
		bevelRight: "#18543d",
	},
];

// Enlarged 30-degree isometric rounded slab (half-width 57, half-height 33)
const SLAB_TOP =
	"M -6.2 -29.4 Q 0 -33 6.2 -29.4 L 50.8 -3.6 Q 57 0 50.8 3.6 L 6.2 29.4 Q 0 33 -6.2 29.4 L -50.8 3.6 Q -57 0 -50.8 -3.6 Z";

// Inner recessed isometric frame on top face
const SLAB_INNER =
	"M -4.8 -22.6 Q 0 -25.4 4.8 -22.6 L 38.8 -2.8 Q 43.6 0 38.8 2.8 L 4.8 22.6 Q 0 25.4 -4.8 22.6 L -38.8 2.8 Q -43.6 0 -38.8 -2.8 Z";

// 3D Extruded thickness (6.3px vertical depth, split at front apex x=0 for directional studio lighting)
const SLAB_BEVEL_LEFT =
	"M -55 1.4 Q -57 0 -50.8 3.6 L -6.2 29.4 Q -3.1 31.2 0 31.2 L 0 37.5 Q -3.1 37.5 -6.2 35.7 L -50.8 9.9 Q -57 6.3 -55 7.7 Z";

const SLAB_BEVEL_RIGHT =
	"M 0 31.2 Q 3.1 31.2 6.2 29.4 L 50.8 3.6 Q 57 0 55 1.4 L 55 7.7 Q 57 6.3 50.8 9.9 L 6.2 35.7 Q 3.1 37.5 0 37.5 Z";

// Front-bottom luminous bevel crease
const SLAB_RIM_LINE =
	"M -52 3 L -6.2 29.4 Q 0 33 6.2 29.4 L 52 3";

function StepHeroIcon({ index }: { index: number }) {
	switch (index) {
		case 0:
			// Heroicons 24/outline: magnifying-glass / target
			return (
				<g
					stroke="currentColor"
					strokeWidth="1.7"
					strokeLinecap="round"
					strokeLinejoin="round"
					fill="none"
				>
					<circle cx="11" cy="11" r="6.25" />
					<circle cx="11" cy="11" r="2.25" strokeWidth="1.4" opacity="0.6" />
					<path d="M19.25 19.25L15.5 15.5" strokeWidth="1.95" />
				</g>
			);
		case 1:
			// Heroicons 24/outline: shield-check
			return (
				<g
					stroke="currentColor"
					strokeWidth="1.7"
					strokeLinecap="round"
					strokeLinejoin="round"
					fill="none"
				>
					<path d="M12 3c-2.6 1.95-5.4 3.05-8 3.28v4.97c0 4.95 3.38 9.2 8 10.4 4.62-1.2 8-5.45 8-10.4V6.28C17.4 6.05 14.6 4.95 12 3z" />
					<path d="M8.85 12.15l2.1 2.1 4.25-4.4" strokeWidth="1.9" />
				</g>
			);
		case 2:
			// Heroicons 24/outline: chat-bubble-left-right
			return (
				<g
					stroke="currentColor"
					strokeWidth="1.7"
					strokeLinecap="round"
					strokeLinejoin="round"
					fill="none"
				>
					<path d="M12 4.25c-4.7 0-8.5 3.25-8.5 7.25 0 1.85.8 3.55 2.15 4.84.26.25.37.62.28.98l-.52 1.95a.45.45 0 00.55.55l2.08-.52c.3-.07.63-.05.93.05.92.3 1.92.47 2.95.47 4.7 0 8.5-3.25 8.5-7.25S16.7 4.25 12 4.25z" />
					<circle cx="8.75" cy="11.5" r="0.9" fill="currentColor" stroke="none" />
					<circle cx="12" cy="11.5" r="0.9" fill="currentColor" stroke="none" />
					<circle cx="15.25" cy="11.5" r="0.9" fill="currentColor" stroke="none" />
				</g>
			);
		case 3:
			// Heroicons 24/outline: map-pin
			return (
				<g
					stroke="currentColor"
					strokeWidth="1.7"
					strokeLinecap="round"
					strokeLinejoin="round"
					fill="none"
				>
					<path d="M19 10.5c0 6.1-7 10.25-7 10.25S5 16.6 5 10.5a7 7 0 1114 0z" />
					<circle cx="12" cy="10.5" r="2.5" />
				</g>
			);
		default:
			// Heroicons 24/outline: check-badge / verified completion
			return (
				<g
					stroke="currentColor"
					strokeWidth="1.7"
					strokeLinecap="round"
					strokeLinejoin="round"
					fill="none"
				>
					<rect x="4" y="4" width="16" height="16" rx="4" />
					<path d="M8.5 12.15l2.35 2.35 4.75-5" strokeWidth="2" />
				</g>
			);
	}
}

export default function NetworkSVG() {
	return (
		<div className="relative w-full select-none">
			<style>{`
				@keyframes hsSlabElevate {
					0%, 100% { transform: translateY(0px); }
					5%, 16% { transform: translateY(-6px); }
					24% { transform: translateY(0px); }
				}
				@keyframes hsFloorCast {
					0%, 100% { opacity: 0.4; transform: scale(0.96); }
					5%, 16% { opacity: 0.75; transform: scale(1.06); }
					24% { opacity: 0.4; transform: scale(0.96); }
				}
				@keyframes hsConduitFlow {
					0%, 6% { stroke-dashoffset: 150; opacity: 0; }
					10% { opacity: 1; }
					20%, 86% { stroke-dashoffset: 0; opacity: 0.92; }
					95%, 100% { stroke-dashoffset: -150; opacity: 0; }
				}
				@keyframes hsCheckConfirm {
					0%, 5% { opacity: 0; transform: scale(0.75); }
					10%, 86% { opacity: 1; transform: scale(1); }
					95%, 100% { opacity: 0; transform: scale(0.85); }
				}
				@keyframes hsFinalPulse {
					0%, 66% { opacity: 0; transform: scale(0.94); }
					74% { opacity: 0.65; transform: scale(1.08); }
					88%, 100% { opacity: 0; transform: scale(1.22); }
				}

				.hs-slab-0 { animation: hsSlabElevate 10s cubic-bezier(0.16, 1, 0.3, 1) infinite 0s; }
				.hs-slab-1 { animation: hsSlabElevate 10s cubic-bezier(0.16, 1, 0.3, 1) infinite 1.6s; }
				.hs-slab-2 { animation: hsSlabElevate 10s cubic-bezier(0.16, 1, 0.3, 1) infinite 3.2s; }
				.hs-slab-3 { animation: hsSlabElevate 10s cubic-bezier(0.16, 1, 0.3, 1) infinite 4.8s; }
				.hs-slab-4 { animation: hsSlabElevate 10s cubic-bezier(0.16, 1, 0.3, 1) infinite 6.4s; }

				.hs-cast-0 { animation: hsFloorCast 10s cubic-bezier(0.16, 1, 0.3, 1) infinite 0s; transform-box: fill-box; transform-origin: center; }
				.hs-cast-1 { animation: hsFloorCast 10s cubic-bezier(0.16, 1, 0.3, 1) infinite 1.6s; transform-box: fill-box; transform-origin: center; }
				.hs-cast-2 { animation: hsFloorCast 10s cubic-bezier(0.16, 1, 0.3, 1) infinite 3.2s; transform-box: fill-box; transform-origin: center; }
				.hs-cast-3 { animation: hsFloorCast 10s cubic-bezier(0.16, 1, 0.3, 1) infinite 4.8s; transform-box: fill-box; transform-origin: center; }
				.hs-cast-4 { animation: hsFloorCast 10s cubic-bezier(0.16, 1, 0.3, 1) infinite 6.4s; transform-box: fill-box; transform-origin: center; }

				.hs-conduit-0 { stroke-dasharray: 150; animation: hsConduitFlow 10s cubic-bezier(0.22, 1, 0.36, 1) infinite 0.35s; }
				.hs-conduit-1 { stroke-dasharray: 150; animation: hsConduitFlow 10s cubic-bezier(0.22, 1, 0.36, 1) infinite 1.95s; }
				.hs-conduit-2 { stroke-dasharray: 150; animation: hsConduitFlow 10s cubic-bezier(0.22, 1, 0.36, 1) infinite 3.55s; }
				.hs-conduit-3 { stroke-dasharray: 150; animation: hsConduitFlow 10s cubic-bezier(0.22, 1, 0.36, 1) infinite 5.15s; }

				.hs-confirm-0 { animation: hsCheckConfirm 10s cubic-bezier(0.16, 1, 0.3, 1) infinite 0.3s; transform-box: fill-box; transform-origin: center; }
				.hs-confirm-1 { animation: hsCheckConfirm 10s cubic-bezier(0.16, 1, 0.3, 1) infinite 1.9s; transform-box: fill-box; transform-origin: center; }
				.hs-confirm-2 { animation: hsCheckConfirm 10s cubic-bezier(0.16, 1, 0.3, 1) infinite 3.5s; transform-box: fill-box; transform-origin: center; }
				.hs-confirm-3 { animation: hsCheckConfirm 10s cubic-bezier(0.16, 1, 0.3, 1) infinite 5.1s; transform-box: fill-box; transform-origin: center; }
				.hs-confirm-4 { animation: hsCheckConfirm 10s cubic-bezier(0.16, 1, 0.3, 1) infinite 6.7s; transform-box: fill-box; transform-origin: center; }

				.hs-final-wave { animation: hsFinalPulse 10s cubic-bezier(0.16, 1, 0.3, 1) infinite; transform-box: fill-box; transform-origin: center; }

				@media (prefers-reduced-motion: reduce) {
					.hs-slab-0, .hs-slab-1, .hs-slab-2, .hs-slab-3, .hs-slab-4,
					.hs-cast-0, .hs-cast-1, .hs-cast-2, .hs-cast-3, .hs-cast-4,
					.hs-conduit-0, .hs-conduit-1, .hs-conduit-2, .hs-conduit-3,
					.hs-confirm-0, .hs-confirm-1, .hs-confirm-2, .hs-confirm-3, .hs-confirm-4,
					.hs-final-wave {
						animation: none !important;
					}
				}
			`}</style>

			<svg
				viewBox="18 46 644 260"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				className="h-auto w-full overflow-visible"
				role="img"
				aria-label="HomeScout 5-step architectural workflow: Search, Verify, Connect, Inspect, and Move In"
			>
				<defs>
					{/* True Isometric Diamond Floor Blur Filter */}
					<filter
						id="hs-iso-blur"
						x="-50%"
						y="-50%"
						width="200%"
						height="200%"
					>
						<feGaussianBlur stdDeviation="10" />
					</filter>

					{/* Crisp Studio Top Plate Gradient */}
					<linearGradient
						id="hs-plate-surface"
						x1="0%"
						y1="0%"
						x2="100%"
						y2="100%"
					>
						<stop offset="0%" stopColor="#ffffff" />
						<stop offset="65%" stopColor="#f8fafc" />
						<stop offset="100%" stopColor="#f1f5f9" />
					</linearGradient>

					{/* Conduit Gradients */}
					<linearGradient
						id="hs-grad-0"
						x1="84"
						y1="112"
						x2="212"
						y2="186"
						gradientUnits="userSpaceOnUse"
					>
						<stop offset="0%" stopColor="#38bdf8" />
						<stop offset="100%" stopColor="#5ec8e0" />
					</linearGradient>
					<linearGradient
						id="hs-grad-1"
						x1="212"
						y1="186"
						x2="340"
						y2="112"
						gradientUnits="userSpaceOnUse"
					>
						<stop offset="0%" stopColor="#5ec8e0" />
						<stop offset="100%" stopColor="#4aba8a" />
					</linearGradient>
					<linearGradient
						id="hs-grad-2"
						x1="340"
						y1="112"
						x2="468"
						y2="186"
						gradientUnits="userSpaceOnUse"
					>
						<stop offset="0%" stopColor="#4aba8a" />
						<stop offset="100%" stopColor="#ff7a52" />
					</linearGradient>
					<linearGradient
						id="hs-grad-3"
						x1="468"
						y1="186"
						x2="596"
						y2="112"
						gradientUnits="userSpaceOnUse"
					>
						<stop offset="0%" stopColor="#ff7a52" />
						<stop offset="100%" stopColor="#33a674" />
					</linearGradient>
				</defs>

				{/* ── 1. Precision Isometric Connecting Channels (01 -> 02 -> 03 -> 04 -> 05) ── */}
				<g strokeLinecap="round">
					{/* Recessed Isometric Channel Tracks */}
					<line
						x1="84"
						y1="116"
						x2="212"
						y2="190"
						stroke="rgba(255, 255, 255, 0.15)"
						strokeWidth="5"
					/>
					<line
						x1="212"
						y1="190"
						x2="340"
						y2="116"
						stroke="rgba(255, 255, 255, 0.15)"
						strokeWidth="5"
					/>
					<line
						x1="340"
						y1="116"
						x2="468"
						y2="190"
						stroke="rgba(255, 255, 255, 0.15)"
						strokeWidth="5"
					/>
					<line
						x1="468"
						y1="190"
						x2="596"
						y2="116"
						stroke="rgba(255, 255, 255, 0.15)"
						strokeWidth="5"
					/>

					{/* Hairline Center Guide */}
					<line
						x1="84"
						y1="116"
						x2="212"
						y2="190"
						stroke="rgba(255, 255, 255, 0.26)"
						strokeWidth="1"
						strokeDasharray="2.5 4.5"
					/>
					<line
						x1="212"
						y1="190"
						x2="340"
						y2="116"
						stroke="rgba(255, 255, 255, 0.26)"
						strokeWidth="1"
						strokeDasharray="2.5 4.5"
					/>
					<line
						x1="340"
						y1="116"
						x2="468"
						y2="190"
						stroke="rgba(255, 255, 255, 0.26)"
						strokeWidth="1"
						strokeDasharray="2.5 4.5"
					/>
					<line
						x1="468"
						y1="190"
						x2="596"
						y2="116"
						stroke="rgba(255, 255, 255, 0.26)"
						strokeWidth="1"
						strokeDasharray="2.5 4.5"
					/>

					{/* Sequential Active Signal Beams */}
					<line
						x1="84"
						y1="116"
						x2="212"
						y2="190"
						stroke="url(#hs-grad-0)"
						strokeWidth="4"
						className="hs-conduit-0"
					/>
					<line
						x1="212"
						y1="190"
						x2="340"
						y2="116"
						stroke="url(#hs-grad-1)"
						strokeWidth="4"
						className="hs-conduit-1"
					/>
					<line
						x1="340"
						y1="116"
						x2="468"
						y2="190"
						stroke="url(#hs-grad-2)"
						strokeWidth="4"
						className="hs-conduit-2"
					/>
					<line
						x1="468"
						y1="190"
						x2="596"
						y2="116"
						stroke="url(#hs-grad-3)"
						strokeWidth="4"
						className="hs-conduit-3"
					/>
				</g>

				{/* ── 2. Five Isometric 3D Architectural Slabs ── */}
				{STEPS.map((step, idx) => {
					const labelY = step.isBottom ? 256 : 182;

					return (
						<g key={step.num}>
							{/* True Isometric Diamond Floor Shadow */}
							<g transform={`translate(${step.cx}, ${step.cy + 20})`}>
								<path
									d={SLAB_TOP}
									fill={step.accent}
									filter="url(#hs-iso-blur)"
									className={`hs-cast-${idx}`}
								/>
							</g>

							{/* Cycle-Complete Isometric Confirmation Wave on Step 05 */}
							{idx === 4 && (
								<g transform={`translate(${step.cx}, ${step.cy})`}>
									<path
										d={SLAB_TOP}
										stroke="#4aba8a"
										strokeWidth="1.75"
										fill="none"
										className="hs-final-wave"
									/>
								</g>
							)}

							{/* Elevating 3D Slab Assembly */}
							<g className={`hs-slab-${idx}`}>
								<g transform={`translate(${step.cx}, ${step.cy})`}>
									{/* Isometric Perspective Step Numeral (01 - 05) */}
									<g transform="translate(-44, -22) matrix(0.866, -0.5, 0, 1, 0, 0)">
										<text
											x="0"
											y="0"
											fill={step.accent}
											fontSize="19"
											fontWeight="800"
											letterSpacing="-0.02em"
											style={{
												fontFamily:
													"var(--font-sans), 'Plus Jakarta Sans', sans-serif",
												fontVariantNumeric: "tabular-nums",
											}}
										>
											{step.num}
										</text>
									</g>

									{/* 3D Left & Right Extruded Bevel Faces (Directional Lighting) */}
									<path d={SLAB_BEVEL_LEFT} fill={step.bevelLeft} />
									<path d={SLAB_BEVEL_RIGHT} fill={step.bevelRight} />

									{/* Crisp Alabaster Top Surface */}
									<path
										d={SLAB_TOP}
										fill="url(#hs-plate-surface)"
										stroke="#ffffff"
										strokeWidth="0.9"
									/>

									{/* Inner Keycap Isometric Frame */}
									<path
										d={SLAB_INNER}
										fill="none"
										stroke={step.accentSoft}
										strokeWidth="1.1"
									/>

									{/* Front-Bottom Colored Rim Edge Highlight */}
									<path
										d={SLAB_RIM_LINE}
										stroke={step.accent}
										strokeWidth="2"
										strokeLinecap="round"
										fill="none"
									/>

									{/* Heroicon Projected onto the Isometric Top Plane */}
									<g
										transform="translate(0, -0.5) scale(1, 0.577) rotate(-45) scale(1.36) translate(-12, -12)"
										style={{ color: "#1e293b" }}
									>
										<StepHeroIcon index={idx} />
									</g>

									{/* Integrated Isometric Step Confirmation Check (Top-Right Facet) */}
									<g transform="translate(27, -15)">
										{/* Subtle Recessed Socket */}
										<ellipse
											cx="0"
											cy="0"
											rx="7"
											ry="4.2"
											fill="#e2e8f0"
										/>
										{/* Confirmed Check State */}
										<g className={`hs-confirm-${idx}`}>
											<ellipse
												cx="0"
												cy="0"
												rx="7.3"
												ry="4.4"
												fill={step.accent}
											/>
											<path
												d="M -2.6 0 L -0.7 1.5 L 2.8 -1.3"
												stroke="#ffffff"
												strokeWidth="1.5"
												strokeLinecap="round"
												strokeLinejoin="round"
												fill="none"
											/>
										</g>
									</g>
								</g>
							</g>

							{/* ── 3. Precision Editorial Typography Below Each Step ── */}
							<g transform={`translate(${step.cx - 52}, ${labelY})`}>
								<text
									x="0"
									y="0"
									fill={step.accent}
									fontSize="11.5"
									fontWeight="800"
									letterSpacing="0.13em"
									style={{
										fontFamily:
											"var(--font-sans), 'Plus Jakarta Sans', sans-serif",
									}}
								>
									{step.title}
								</text>

								{/* Crisp Architectural Rule */}
								<rect
									x="0"
									y="7"
									width="28"
									height="2"
									rx="1"
									fill={step.accent}
								/>

								{/* Concise 2-Line Copy */}
								<text
									x="0"
									y="23"
									fill="#f1f5f9"
									fontSize="10.2"
									fontWeight="500"
									letterSpacing="-0.01em"
									style={{
										fontFamily:
											"var(--font-sans), 'Plus Jakarta Sans', sans-serif",
									}}
								>
									{step.line1}
								</text>
								<text
									x="0"
									y="36"
									fill="#94a3b8"
									fontSize="10.2"
									fontWeight="400"
									letterSpacing="-0.01em"
									style={{
										fontFamily:
											"var(--font-sans), 'Plus Jakarta Sans', sans-serif",
									}}
								>
									{step.line2}
								</text>
							</g>
						</g>
					);
				})}
			</svg>
		</div>
	);
}
