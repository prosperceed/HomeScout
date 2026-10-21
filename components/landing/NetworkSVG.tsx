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
		cx: 86,
		cy: 114,
		isBottom: false,
		accent: "#38bdf8",
		accentSoft: "rgba(56, 189, 248, 0.22)",
		bevelLeft: "#3a9db8",
		bevelRight: "#246478",
	},
	{
		num: "02",
		title: "VERIFY",
		line1: "Landlord ID & title",
		line2: "authenticated upfront.",
		cx: 213,
		cy: 188,
		isBottom: true,
		accent: "#5ec8e0",
		accentSoft: "rgba(94, 200, 224, 0.22)",
		bevelLeft: "#2d7f96",
		bevelRight: "#1e293b",
	},
	{
		num: "03",
		title: "CONNECT",
		line1: "Direct chat with owner",
		line2: "or licensed agent.",
		cx: 340,
		cy: 114,
		isBottom: false,
		accent: "#4aba8a",
		accentSoft: "rgba(74, 186, 138, 0.24)",
		bevelLeft: "#33a674",
		bevelRight: "#1e6a4d",
	},
	{
		num: "04",
		title: "INSPECT",
		line1: "Schedule a private",
		line2: "on-site viewing.",
		cx: 467,
		cy: 188,
		isBottom: true,
		accent: "#ff7a52",
		accentSoft: "rgba(255, 122, 82, 0.22)",
		bevelLeft: "#f95d2e",
		bevelRight: "#bb3316",
	},
	{
		num: "05",
		title: "MOVE IN",
		line1: "Sign terms transparently",
		line2: "& receive your keys.",
		cx: 594,
		cy: 114,
		isBottom: false,
		accent: "#33a674",
		accentSoft: "rgba(51, 166, 116, 0.28)",
		bevelLeft: "#33a674",
		bevelRight: "#18543d",
	},
];

// Precision 30-degree isometric rounded slab (half-width 50, half-height 29)
const SLAB_TOP =
	"M -5.5 -25.8 Q 0 -29 5.5 -25.8 L 44.5 -3.2 Q 50 0 44.5 3.2 L 5.5 25.8 Q 0 29 -5.5 25.8 L -44.5 3.2 Q -50 0 -44.5 -3.2 Z";

// Inner recessed isometric frame on top face
const SLAB_INNER =
	"M -4.2 -19.8 Q 0 -22.2 4.2 -19.8 L 34 -2.4 Q 38.2 0 34 2.4 L 4.2 19.8 Q 0 22.2 -4.2 19.8 L -34 2.4 Q -38.2 0 -34 -2.4 Z";

// 3D Extruded thickness (5.5px vertical depth, split at front apex x=0 for directional studio lighting)
const SLAB_BEVEL_LEFT =
	"M -48.2 1.2 Q -50 0 -44.5 3.2 L -5.5 25.8 Q -2.8 27.4 0 27.4 L 0 32.9 Q -2.8 32.9 -5.5 31.3 L -44.5 8.7 Q -50 5.5 -48.2 6.7 Z";

const SLAB_BEVEL_RIGHT =
	"M 0 27.4 Q 2.8 27.4 5.5 25.8 L 44.5 3.2 Q 50 0 48.2 1.2 L 48.2 6.7 Q 50 5.5 44.5 8.7 L 5.5 31.3 Q 2.8 32.9 0 32.9 Z";

// Front-bottom luminous bevel crease
const SLAB_RIM_LINE =
	"M -45.5 2.6 L -5.5 25.8 Q 0 29 5.5 25.8 L 45.5 2.6";

function StepHeroIcon({ index }: { index: number }) {
	switch (index) {
		case 0:
			// Heroicons 24/outline: magnifying-glass / target
			return (
				<g
					stroke="currentColor"
					strokeWidth="1.65"
					strokeLinecap="round"
					strokeLinejoin="round"
					fill="none"
				>
					<circle cx="11" cy="11" r="6.25" />
					<circle cx="11" cy="11" r="2.25" strokeWidth="1.35" opacity="0.6" />
					<path d="M19.25 19.25L15.5 15.5" strokeWidth="1.9" />
				</g>
			);
		case 1:
			// Heroicons 24/outline: shield-check
			return (
				<g
					stroke="currentColor"
					strokeWidth="1.65"
					strokeLinecap="round"
					strokeLinejoin="round"
					fill="none"
				>
					<path d="M12 3c-2.6 1.95-5.4 3.05-8 3.28v4.97c0 4.95 3.38 9.2 8 10.4 4.62-1.2 8-5.45 8-10.4V6.28C17.4 6.05 14.6 4.95 12 3z" />
					<path d="M8.85 12.15l2.1 2.1 4.25-4.4" strokeWidth="1.85" />
				</g>
			);
		case 2:
			// Heroicons 24/outline: chat-bubble-left-right
			return (
				<g
					stroke="currentColor"
					strokeWidth="1.65"
					strokeLinecap="round"
					strokeLinejoin="round"
					fill="none"
				>
					<path d="M12 4.25c-4.7 0-8.5 3.25-8.5 7.25 0 1.85.8 3.55 2.15 4.84.26.25.37.62.28.98l-.52 1.95a.45.45 0 00.55.55l2.08-.52c.3-.07.63-.05.93.05.92.3 1.92.47 2.95.47 4.7 0 8.5-3.25 8.5-7.25S16.7 4.25 12 4.25z" />
					<circle cx="8.75" cy="11.5" r="0.85" fill="currentColor" stroke="none" />
					<circle cx="12" cy="11.5" r="0.85" fill="currentColor" stroke="none" />
					<circle cx="15.25" cy="11.5" r="0.85" fill="currentColor" stroke="none" />
				</g>
			);
		case 3:
			// Heroicons 24/outline: map-pin
			return (
				<g
					stroke="currentColor"
					strokeWidth="1.65"
					strokeLinecap="round"
					strokeLinejoin="round"
					fill="none"
				>
					<path d="M19 10.5c0 6.1-7 10.25-7 10.25S5 16.6 5 10.5a7 7 0 1114 0z" />
					<circle cx="12" cy="10.5" r="2.5" />
				</g>
			);
		default:
			// Heroicons 24/outline: check-badge / verified completion (matches reference step 05)
			return (
				<g
					stroke="currentColor"
					strokeWidth="1.65"
					strokeLinecap="round"
					strokeLinejoin="round"
					fill="none"
				>
					<rect x="4" y="4" width="16" height="16" rx="4" />
					<path d="M8.5 12.15l2.35 2.35 4.75-5" strokeWidth="1.95" />
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
					5%, 16% { transform: translateY(-5.5px); }
					24% { transform: translateY(0px); }
				}
				@keyframes hsFloorCast {
					0%, 100% { opacity: 0.38; transform: scale(0.96); }
					5%, 16% { opacity: 0.72; transform: scale(1.06); }
					24% { opacity: 0.38; transform: scale(0.96); }
				}
				@keyframes hsConduitFlow {
					0%, 6% { stroke-dashoffset: 148; opacity: 0; }
					10% { opacity: 1; }
					20%, 86% { stroke-dashoffset: 0; opacity: 0.9; }
					95%, 100% { stroke-dashoffset: -148; opacity: 0; }
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

				.hs-conduit-0 { stroke-dasharray: 148; animation: hsConduitFlow 10s cubic-bezier(0.22, 1, 0.36, 1) infinite 0.35s; }
				.hs-conduit-1 { stroke-dasharray: 148; animation: hsConduitFlow 10s cubic-bezier(0.22, 1, 0.36, 1) infinite 1.95s; }
				.hs-conduit-2 { stroke-dasharray: 148; animation: hsConduitFlow 10s cubic-bezier(0.22, 1, 0.36, 1) infinite 3.55s; }
				.hs-conduit-3 { stroke-dasharray: 148; animation: hsConduitFlow 10s cubic-bezier(0.22, 1, 0.36, 1) infinite 5.15s; }

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
				viewBox="0 0 680 340"
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
						<feGaussianBlur stdDeviation="9" />
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
						x1="86"
						y1="114"
						x2="213"
						y2="188"
						gradientUnits="userSpaceOnUse"
					>
						<stop offset="0%" stopColor="#38bdf8" />
						<stop offset="100%" stopColor="#5ec8e0" />
					</linearGradient>
					<linearGradient
						id="hs-grad-1"
						x1="213"
						y1="188"
						x2="340"
						y2="114"
						gradientUnits="userSpaceOnUse"
					>
						<stop offset="0%" stopColor="#5ec8e0" />
						<stop offset="100%" stopColor="#4aba8a" />
					</linearGradient>
					<linearGradient
						id="hs-grad-2"
						x1="340"
						y1="114"
						x2="467"
						y2="188"
						gradientUnits="userSpaceOnUse"
					>
						<stop offset="0%" stopColor="#4aba8a" />
						<stop offset="100%" stopColor="#ff7a52" />
					</linearGradient>
					<linearGradient
						id="hs-grad-3"
						x1="467"
						y1="188"
						x2="594"
						y2="114"
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
						x1="86"
						y1="118"
						x2="213"
						y2="192"
						stroke="rgba(255, 255, 255, 0.14)"
						strokeWidth="4.5"
					/>
					<line
						x1="213"
						y1="192"
						x2="340"
						y2="118"
						stroke="rgba(255, 255, 255, 0.14)"
						strokeWidth="4.5"
					/>
					<line
						x1="340"
						y1="118"
						x2="467"
						y2="192"
						stroke="rgba(255, 255, 255, 0.14)"
						strokeWidth="4.5"
					/>
					<line
						x1="467"
						y1="192"
						x2="594"
						y2="118"
						stroke="rgba(255, 255, 255, 0.14)"
						strokeWidth="4.5"
					/>

					{/* Hairline Center Guide */}
					<line
						x1="86"
						y1="118"
						x2="213"
						y2="192"
						stroke="rgba(255, 255, 255, 0.24)"
						strokeWidth="1"
						strokeDasharray="2 4"
					/>
					<line
						x1="213"
						y1="192"
						x2="340"
						y2="118"
						stroke="rgba(255, 255, 255, 0.24)"
						strokeWidth="1"
						strokeDasharray="2 4"
					/>
					<line
						x1="340"
						y1="118"
						x2="467"
						y2="192"
						stroke="rgba(255, 255, 255, 0.24)"
						strokeWidth="1"
						strokeDasharray="2 4"
					/>
					<line
						x1="467"
						y1="192"
						x2="594"
						y2="118"
						stroke="rgba(255, 255, 255, 0.24)"
						strokeWidth="1"
						strokeDasharray="2 4"
					/>

					{/* Sequential Active Signal Beams */}
					<line
						x1="86"
						y1="118"
						x2="213"
						y2="192"
						stroke="url(#hs-grad-0)"
						strokeWidth="3.5"
						className="hs-conduit-0"
					/>
					<line
						x1="213"
						y1="192"
						x2="340"
						y2="118"
						stroke="url(#hs-grad-1)"
						strokeWidth="3.5"
						className="hs-conduit-1"
					/>
					<line
						x1="340"
						y1="118"
						x2="467"
						y2="192"
						stroke="url(#hs-grad-2)"
						strokeWidth="3.5"
						className="hs-conduit-2"
					/>
					<line
						x1="467"
						y1="192"
						x2="594"
						y2="118"
						stroke="url(#hs-grad-3)"
						strokeWidth="3.5"
						className="hs-conduit-3"
					/>
				</g>

				{/* ── 2. Five Isometric 3D Architectural Slabs ── */}
				{STEPS.map((step, idx) => {
					const labelY = step.isBottom ? 254 : 180;

					return (
						<g key={step.num}>
							{/* True Isometric Diamond Floor Shadow */}
							<g transform={`translate(${step.cx}, ${step.cy + 18})`}>
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
										strokeWidth="1.5"
										fill="none"
										className="hs-final-wave"
									/>
								</g>
							)}

							{/* Elevating 3D Slab Assembly */}
							<g className={`hs-slab-${idx}`}>
								<g transform={`translate(${step.cx}, ${step.cy})`}>
									{/* Isometric Perspective Step Numeral (01 - 05) */}
									<g transform="translate(-39, -20) matrix(0.866, -0.5, 0, 1, 0, 0)">
										<text
											x="0"
											y="0"
											fill={step.accent}
											fontSize="16.5"
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
										strokeWidth="0.8"
									/>

									{/* Inner Keycap Isometric Frame */}
									<path
										d={SLAB_INNER}
										fill="none"
										stroke={step.accentSoft}
										strokeWidth="1"
									/>

									{/* Front-Bottom Colored Rim Edge Highlight */}
									<path
										d={SLAB_RIM_LINE}
										stroke={step.accent}
										strokeWidth="1.75"
										strokeLinecap="round"
										fill="none"
									/>

									{/* Heroicon Projected onto the Isometric Top Plane */}
									<g
										transform="translate(0, -0.5) scale(1, 0.577) rotate(-45) scale(1.18) translate(-12, -12)"
										style={{ color: "#1e293b" }}
									>
										<StepHeroIcon index={idx} />
									</g>

									{/* Integrated Isometric Step Confirmation Check (Top-Right Facet) */}
									<g transform="translate(24, -13)">
										{/* Subtle Recessed Socket */}
										<ellipse
											cx="0"
											cy="0"
											rx="6.2"
											ry="3.8"
											fill="#e2e8f0"
										/>
										{/* Confirmed Check State */}
										<g className={`hs-confirm-${idx}`}>
											<ellipse
												cx="0"
												cy="0"
												rx="6.5"
												ry="4"
												fill={step.accent}
											/>
											<path
												d="M -2.3 0 L -0.6 1.3 L 2.5 -1.2"
												stroke="#ffffff"
												strokeWidth="1.4"
												strokeLinecap="round"
												strokeLinejoin="round"
												fill="none"
											/>
										</g>
									</g>
								</g>
							</g>

							{/* ── 3. Precision Editorial Typography Below Each Step ── */}
							<g transform={`translate(${step.cx - 46}, ${labelY})`}>
								<text
									x="0"
									y="0"
									fill={step.accent}
									fontSize="10"
									fontWeight="800"
									letterSpacing="0.14em"
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
									y="6.5"
									width="24"
									height="1.75"
									rx="0.875"
									fill={step.accent}
								/>

								{/* Concise 2-Line Copy */}
								<text
									x="0"
									y="21.5"
									fill="#f1f5f9"
									fontSize="9"
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
									y="33.5"
									fill="#94a3b8"
									fontSize="9"
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
