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
	lipColor: string;
	glowId: string;
}

const STEPS: StepConfig[] = [
	{
		num: "01",
		title: "SEARCH",
		line1: "Filter homes by",
		line2: "city & budget.",
		cx: 86,
		cy: 116,
		isBottom: false,
		accent: "#3a9db8",
		lipColor: "#2d7f96",
		glowId: "iso-glow-1",
	},
	{
		num: "02",
		title: "VERIFY",
		line1: "Owner ID & title",
		line2: "checked upfront.",
		cx: 213,
		cy: 190,
		isBottom: true,
		accent: "#33a674",
		lipColor: "#268660",
		glowId: "iso-glow-2",
	},
	{
		num: "03",
		title: "CONNECT",
		line1: "Chat with owner",
		line2: "or vetted agent.",
		cx: 340,
		cy: 116,
		isBottom: false,
		accent: "#0ea5e9",
		lipColor: "#0284c7",
		glowId: "iso-glow-3",
	},
	{
		num: "04",
		title: "INSPECT",
		line1: "Book a live tour",
		line2: "at your time.",
		cx: 467,
		cy: 190,
		isBottom: true,
		accent: "#f59e0b",
		lipColor: "#d97706",
		glowId: "iso-glow-4",
	},
	{
		num: "05",
		title: "MOVE IN",
		line1: "Sign lease safely",
		line2: "& get your keys.",
		cx: 594,
		cy: 116,
		isBottom: false,
		accent: "#f95d2e",
		lipColor: "#e04520",
		glowId: "iso-glow-5",
	},
];

// Rounded isometric diamond top face (half-width 52, half-height 30)
const ISO_TOP_PATH =
	"M -6 -26.5 Q 0 -30 6 -26.5 L 46 -3.5 Q 52 0 46 3.5 L 6 26.5 Q 0 30 -6 26.5 L -46 3.5 Q -52 0 -46 -3.5 Z";

// 3D extruded lower rim / thickness lip (6.5px depth)
const ISO_LIP_PATH =
	"M -49.5 1.5 Q -52 0 -46 3.5 L -6 26.5 Q 0 30 6 26.5 L 46 3.5 Q 52 0 49.5 1.5 L 49.5 7.5 Q 52 6 46 9.5 L 6 32.5 Q 0 36 -6 32.5 L -46 9.5 Q -52 6 -49.5 7.5 Z";

function StepHeroIcon({ index, color }: { index: number; color: string }) {
	switch (index) {
		case 0:
			// Heroicons: magnifying-glass
			return (
				<g
					stroke={color}
					strokeWidth="1.9"
					strokeLinecap="round"
					strokeLinejoin="round"
					fill="none"
				>
					<circle cx="11" cy="11" r="6.5" />
					<circle cx="11" cy="11" r="2.5" strokeWidth="1.5" opacity="0.55" />
					<path d="M20 20L15.65 15.65" strokeWidth="2.2" />
				</g>
			);
		case 1:
			// Heroicons: shield-check
			return (
				<g
					stroke={color}
					strokeWidth="1.85"
					strokeLinecap="round"
					strokeLinejoin="round"
					fill="none"
				>
					<path d="M12 2.75c-2.8 2.1-5.8 3.25-8.5 3.5v5.25c0 5.25 3.6 9.75 8.5 11 4.9-1.25 8.5-5.75 8.5-11V6.25c-2.7-.25-5.7-1.4-8.5-3.5z" />
					<path d="M8.75 12.25l2.25 2.25 4.5-4.75" strokeWidth="2.1" />
				</g>
			);
		case 2:
			// Heroicons: chat-bubble-left-ellipsis
			return (
				<g
					stroke={color}
					strokeWidth="1.85"
					strokeLinecap="round"
					strokeLinejoin="round"
					fill="none"
				>
					<path d="M12 3.75c-4.97 0-9 3.47-9 7.75 0 1.98.86 3.79 2.28 5.16.28.27.4.67.3 1.05l-.58 2.14a.5.5 0 00.61.61l2.26-.57c.33-.08.68-.05 1 .06.98.33 2.04.5 3.13.5 4.97 0 9-3.47 9-7.75s-4.03-7.75-9-7.75z" />
					<circle cx="8.5" cy="11.5" r="1" fill={color} stroke="none" />
					<circle cx="12" cy="11.5" r="1" fill={color} stroke="none" />
					<circle cx="15.5" cy="11.5" r="1" fill={color} stroke="none" />
				</g>
			);
		case 3:
			// Heroicons: map-pin + home inspection
			return (
				<g
					stroke={color}
					strokeWidth="1.85"
					strokeLinecap="round"
					strokeLinejoin="round"
					fill="none"
				>
					<path d="M19.5 10.5c0 6.5-7.5 11-7.5 11S4.5 17 4.5 10.5a7.5 7.5 0 1115 0z" />
					<circle cx="12" cy="10.5" r="2.75" />
				</g>
			);
		default:
			// Heroicons: check-badge / confirmed handover (matches reference tile 05)
			return (
				<g
					stroke={color}
					strokeWidth="1.9"
					strokeLinecap="round"
					strokeLinejoin="round"
					fill="none"
				>
					<rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
					<path d="M8.25 12.25l2.5 2.5 5.25-5.5" strokeWidth="2.2" />
				</g>
			);
	}
}

export default function NetworkSVG() {
	return (
		<div className="relative w-full select-none">
			<style>{`
				@keyframes hsTileLift {
					0%, 100% { transform: translateY(0px); }
					6%, 18% { transform: translateY(-9px); }
					26% { transform: translateY(0px); }
				}
				@keyframes hsShadowPulse {
					0%, 100% { transform: scale(1); opacity: 0.42; }
					6%, 18% { transform: scale(1.14); opacity: 0.78; }
					26% { transform: scale(1); opacity: 0.42; }
				}
				@keyframes hsCheckBadge {
					0%, 4% { transform: scale(0); opacity: 0; }
					10%, 88% { transform: scale(1); opacity: 1; }
					96%, 100% { transform: scale(0); opacity: 0; }
				}
				@keyframes hsTrackBeam {
					0%, 8% { stroke-dashoffset: 160; opacity: 0; }
					12% { opacity: 1; }
					24%, 88% { stroke-dashoffset: 0; opacity: 1; }
					96%, 100% { stroke-dashoffset: -160; opacity: 0; }
				}
				@keyframes hsCycleRing {
					0%, 72% { transform: scale(0.85); opacity: 0; }
					80% { transform: scale(1.18); opacity: 0.75; }
					94%, 100% { transform: scale(1.45); opacity: 0; }
				}
				.hs-tile-0 { animation: hsTileLift 9s cubic-bezier(0.22, 1, 0.36, 1) infinite 0s; }
				.hs-tile-1 { animation: hsTileLift 9s cubic-bezier(0.22, 1, 0.36, 1) infinite 1.5s; }
				.hs-tile-2 { animation: hsTileLift 9s cubic-bezier(0.22, 1, 0.36, 1) infinite 3.0s; }
				.hs-tile-3 { animation: hsTileLift 9s cubic-bezier(0.22, 1, 0.36, 1) infinite 4.5s; }
				.hs-tile-4 { animation: hsTileLift 9s cubic-bezier(0.22, 1, 0.36, 1) infinite 6.0s; }

				.hs-shadow-0 { animation: hsShadowPulse 9s ease-in-out infinite 0s; transform-box: fill-box; transform-origin: center; }
				.hs-shadow-1 { animation: hsShadowPulse 9s ease-in-out infinite 1.5s; transform-box: fill-box; transform-origin: center; }
				.hs-shadow-2 { animation: hsShadowPulse 9s ease-in-out infinite 3.0s; transform-box: fill-box; transform-origin: center; }
				.hs-shadow-3 { animation: hsShadowPulse 9s ease-in-out infinite 4.5s; transform-box: fill-box; transform-origin: center; }
				.hs-shadow-4 { animation: hsShadowPulse 9s ease-in-out infinite 6.0s; transform-box: fill-box; transform-origin: center; }

				.hs-check-0 { animation: hsCheckBadge 9s cubic-bezier(0.34, 1.56, 0.64, 1) infinite 0.35s; transform-box: fill-box; transform-origin: center; }
				.hs-check-1 { animation: hsCheckBadge 9s cubic-bezier(0.34, 1.56, 0.64, 1) infinite 1.85s; transform-box: fill-box; transform-origin: center; }
				.hs-check-2 { animation: hsCheckBadge 9s cubic-bezier(0.34, 1.56, 0.64, 1) infinite 3.35s; transform-box: fill-box; transform-origin: center; }
				.hs-check-3 { animation: hsCheckBadge 9s cubic-bezier(0.34, 1.56, 0.64, 1) infinite 4.85s; transform-box: fill-box; transform-origin: center; }
				.hs-check-4 { animation: hsCheckBadge 9s cubic-bezier(0.34, 1.56, 0.64, 1) infinite 6.35s; transform-box: fill-box; transform-origin: center; }

				.hs-beam-0 { stroke-dasharray: 160; animation: hsTrackBeam 9s ease-out infinite 0.4s; }
				.hs-beam-1 { stroke-dasharray: 160; animation: hsTrackBeam 9s ease-out infinite 1.9s; }
				.hs-beam-2 { stroke-dasharray: 160; animation: hsTrackBeam 9s ease-out infinite 3.4s; }
				.hs-beam-3 { stroke-dasharray: 160; animation: hsTrackBeam 9s ease-out infinite 4.9s; }

				.hs-cycle-ring { animation: hsCycleRing 9s ease-out infinite; transform-box: fill-box; transform-origin: center; }
			`}</style>

			<svg
				viewBox="0 0 680 350"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				className="h-auto w-full overflow-visible"
				role="img"
				aria-label="HomeScout 5-step home finding flow: Search, Verify, Connect, Inspect, and Move In"
			>
				<defs>
					{/* Isometric Floor Glow Gradients */}
					{STEPS.map((step) => (
						<radialGradient
							key={step.glowId}
							id={step.glowId}
							cx="50%"
							cy="50%"
							r="50%"
						>
							<stop offset="0%" stopColor={step.accent} stopOpacity="0.52" />
							<stop offset="55%" stopColor={step.accent} stopOpacity="0.16" />
							<stop offset="100%" stopColor={step.accent} stopOpacity="0" />
						</radialGradient>
					))}

					{/* Clean White-to-Snow Isometric Tile Surface */}
					<linearGradient id="iso-tile-top" x1="0%" y1="0%" x2="100%" y2="100%">
						<stop offset="0%" stopColor="#ffffff" />
						<stop offset="100%" stopColor="#f1f5f9" />
					</linearGradient>

					{/* Track Gradients between consecutive steps */}
					<linearGradient
						id="iso-track-0"
						x1="86"
						y1="116"
						x2="213"
						y2="190"
						gradientUnits="userSpaceOnUse"
					>
						<stop offset="0%" stopColor="#3a9db8" />
						<stop offset="100%" stopColor="#33a674" />
					</linearGradient>
					<linearGradient
						id="iso-track-1"
						x1="213"
						y1="190"
						x2="340"
						y2="116"
						gradientUnits="userSpaceOnUse"
					>
						<stop offset="0%" stopColor="#33a674" />
						<stop offset="100%" stopColor="#0ea5e9" />
					</linearGradient>
					<linearGradient
						id="iso-track-2"
						x1="340"
						y1="116"
						x2="467"
						y2="190"
						gradientUnits="userSpaceOnUse"
					>
						<stop offset="0%" stopColor="#0ea5e9" />
						<stop offset="100%" stopColor="#f59e0b" />
					</linearGradient>
					<linearGradient
						id="iso-track-3"
						x1="467"
						y1="190"
						x2="594"
						y2="116"
						gradientUnits="userSpaceOnUse"
					>
						<stop offset="0%" stopColor="#f59e0b" />
						<stop offset="100%" stopColor="#f95d2e" />
					</linearGradient>
				</defs>

				{/* ── 1. Isometric Zig-Zag Connecting Tracks (01 -> 02 -> 03 -> 04 -> 05) ── */}
				<g strokeLinecap="round">
					{/* Base static tracks (matching the subtle gray/white isometric bars in reference) */}
					<line
						x1="86"
						y1="120"
						x2="213"
						y2="194"
						stroke="rgba(255,255,255,0.16)"
						strokeWidth="7"
					/>
					<line
						x1="213"
						y1="194"
						x2="340"
						y2="120"
						stroke="rgba(255,255,255,0.16)"
						strokeWidth="7"
					/>
					<line
						x1="340"
						y1="120"
						x2="467"
						y2="194"
						stroke="rgba(255,255,255,0.16)"
						strokeWidth="7"
					/>
					<line
						x1="467"
						y1="194"
						x2="594"
						y2="120"
						stroke="rgba(255,255,255,0.16)"
						strokeWidth="7"
					/>

					{/* Animated sequential flow beams */}
					<line
						x1="86"
						y1="120"
						x2="213"
						y2="194"
						stroke="url(#iso-track-0)"
						strokeWidth="7"
						className="hs-beam-0"
					/>
					<line
						x1="213"
						y1="194"
						x2="340"
						y2="120"
						stroke="url(#iso-track-1)"
						strokeWidth="7"
						className="hs-beam-1"
					/>
					<line
						x1="340"
						y1="120"
						x2="467"
						y2="194"
						stroke="url(#iso-track-2)"
						strokeWidth="7"
						className="hs-beam-2"
					/>
					<line
						x1="467"
						y1="194"
						x2="594"
						y2="120"
						stroke="url(#iso-track-3)"
						strokeWidth="7"
						className="hs-beam-3"
					/>
				</g>

				{/* ── 2. Five Isometric 3D Step Cards, Perspective Numbers & Labels ── */}
				{STEPS.map((step, idx) => {
					const labelY = step.isBottom ? 262 : 188;

					return (
						<g key={step.num}>
							{/* Ambient Colored Shadow Underneath Tile */}
							<ellipse
								cx={step.cx}
								cy={step.cy + 24}
								rx="54"
								ry="30"
								fill={`url(#${step.glowId})`}
								className={`hs-shadow-${idx}`}
							/>

							{/* Final Step Cycle-Complete Pulse Ring */}
							{idx === 4 && (
								<ellipse
									cx={step.cx}
									cy={step.cy + 2}
									rx="56"
									ry="33"
									stroke="#33a674"
									strokeWidth="2"
									fill="none"
									className="hs-cycle-ring"
								/>
							)}

							{/* Animated Lifting Group (3D Tile + Perspective Number + Icon + Confirmation Check) */}
							<g className={`hs-tile-${idx}`}>
								<g transform={`translate(${step.cx}, ${step.cy})`}>
									{/* Isometric Perspective Number (01 - 05) Floating at Top-Left Edge */}
									<g transform="translate(-38, -22) skewY(-30)">
										<text
											x="0"
											y="0"
											fill={step.accent}
											fontSize="20"
											fontWeight="900"
											letterSpacing="-0.03em"
											style={{
												fontFamily:
													"var(--font-sans), 'Plus Jakarta Sans', sans-serif",
											}}
										>
											{step.num}
										</text>
									</g>

									{/* 3D Extruded Colored Bottom Rim */}
									<path d={ISO_LIP_PATH} fill={step.lipColor} />

									{/* Crisp White Isometric Top Surface */}
									<path
										d={ISO_TOP_PATH}
										fill="url(#iso-tile-top)"
										stroke="rgba(255,255,255,0.95)"
										strokeWidth="1"
									/>

									{/* Subtle Colored Inner Rim Highlight on Bottom Edges */}
									<path
										d="M -46 3.5 L -6 26.5 Q 0 30 6 26.5 L 46 3.5"
										stroke={step.accent}
										strokeWidth="2"
										strokeLinecap="round"
										fill="none"
									/>

									{/* Heroicon Projected Flat onto Isometric Tile Surface */}
									<g transform="translate(0, -1) scale(1, 0.58) rotate(-32) scale(1.25) translate(-12, -12)">
										<StepHeroIcon index={idx} color={step.accent} />
									</g>

									{/* Step Confirmation Checkmark Badge (Pops in as step completes) */}
									<g transform="translate(34, -14)">
										<g className={`hs-check-${idx}`}>
											<circle
												cx="0"
												cy="0"
												r="9.5"
												fill="#33a674"
												stroke="#ffffff"
												strokeWidth="1.8"
											/>
											<path
												d="M -3.5 0.2 L -1 2.7 L 4 -2.5"
												stroke="#ffffff"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
												fill="none"
											/>
										</g>
									</g>
								</g>
							</g>

							{/* Concise Step Heading, Accent Bar & 2-Line Description */}
							<g transform={`translate(${step.cx - 48}, ${labelY})`}>
								<text
									x="0"
									y="0"
									fill={step.accent}
									fontSize="11.5"
									fontWeight="800"
									letterSpacing="0.08em"
									style={{
										fontFamily:
											"var(--font-sans), 'Plus Jakarta Sans', sans-serif",
									}}
								>
									{step.title}
								</text>

								{/* Colored Underline Bar (matching reference image) */}
								<rect
									x="0"
									y="7"
									width="32"
									height="2.5"
									rx="1.25"
									fill={step.accent}
								/>

								{/* Apt, Precise 2-Line Description */}
								<text
									x="0"
									y="24"
									fill="#e2e8f0"
									fontSize="9.5"
									fontWeight="500"
									style={{
										fontFamily:
											"var(--font-sans), 'Plus Jakarta Sans', sans-serif",
									}}
								>
									{step.line1}
								</text>
								<text
									x="0"
									y="37"
									fill="#94a3b8"
									fontSize="9.5"
									fontWeight="500"
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
