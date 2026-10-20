export default function NetworkSVG() {
	return (
		<div className="relative w-full select-none">
			<svg
				viewBox="0 0 560 460"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				className="h-auto w-full overflow-visible drop-shadow-[0_24px_48px_rgba(6,11,22,0.55)]"
				role="img"
				aria-label="HomeScout network connecting House Hunters, Verified Landlords, and Licensed Agents through a central verification hub"
			>
				<defs>
					{/* Ambient Stage Glows */}
					<radialGradient id="hs-stage-glow" cx="50%" cy="48%" r="50%">
						<stop offset="0%" stopColor="#33a674" stopOpacity="0.22" />
						<stop offset="45%" stopColor="#3a9db8" stopOpacity="0.1" />
						<stop offset="100%" stopColor="#0c1220" stopOpacity="0" />
					</radialGradient>
					<radialGradient id="hs-teal-glow" cx="50%" cy="50%" r="50%">
						<stop offset="0%" stopColor="#3a9db8" stopOpacity="0.28" />
						<stop offset="100%" stopColor="#3a9db8" stopOpacity="0" />
					</radialGradient>
					<radialGradient id="hs-sage-glow" cx="50%" cy="50%" r="50%">
						<stop offset="0%" stopColor="#33a674" stopOpacity="0.28" />
						<stop offset="100%" stopColor="#33a674" stopOpacity="0" />
					</radialGradient>
					<radialGradient id="hs-coral-glow" cx="50%" cy="50%" r="50%">
						<stop offset="0%" stopColor="#f95d2e" stopOpacity="0.26" />
						<stop offset="100%" stopColor="#f95d2e" stopOpacity="0" />
					</radialGradient>

					{/* Card Surfaces */}
					<linearGradient id="hs-card-surface" x1="0%" y1="0%" x2="100%" y2="100%">
						<stop offset="0%" stopColor="#162133" stopOpacity="0.95" />
						<stop offset="100%" stopColor="#0d1524" stopOpacity="0.95" />
					</linearGradient>
					<linearGradient id="hs-hub-surface" x1="0%" y1="0%" x2="100%" y2="100%">
						<stop offset="0%" stopColor="#1e293b" />
						<stop offset="55%" stopColor="#0f172a" />
						<stop offset="100%" stopColor="#090e1a" />
					</linearGradient>

					{/* Role Accent Gradients */}
					<linearGradient id="hs-teal-badge" x1="0%" y1="0%" x2="100%" y2="100%">
						<stop offset="0%" stopColor="#5ec8e0" />
						<stop offset="100%" stopColor="#2d7f96" />
					</linearGradient>
					<linearGradient id="hs-sage-badge" x1="0%" y1="0%" x2="100%" y2="100%">
						<stop offset="0%" stopColor="#4aba8a" />
						<stop offset="100%" stopColor="#268660" />
					</linearGradient>
					<linearGradient id="hs-coral-badge" x1="0%" y1="0%" x2="100%" y2="100%">
						<stop offset="0%" stopColor="#ff7a52" />
						<stop offset="100%" stopColor="#e04520" />
					</linearGradient>

					{/* Conduit Gradients */}
					<linearGradient id="hs-wire-client" x1="112" y1="120" x2="280" y2="218" gradientUnits="userSpaceOnUse">
						<stop offset="0%" stopColor="#5ec8e0" stopOpacity="0.85" />
						<stop offset="100%" stopColor="#33a674" stopOpacity="0.45" />
					</linearGradient>
					<linearGradient id="hs-wire-landlord" x1="448" y1="120" x2="280" y2="218" gradientUnits="userSpaceOnUse">
						<stop offset="0%" stopColor="#4aba8a" stopOpacity="0.85" />
						<stop offset="100%" stopColor="#3a9db8" stopOpacity="0.45" />
					</linearGradient>
					<linearGradient id="hs-wire-agent" x1="280" y1="344" x2="280" y2="218" gradientUnits="userSpaceOnUse">
						<stop offset="0%" stopColor="#ff7a52" stopOpacity="0.9" />
						<stop offset="100%" stopColor="#33a674" stopOpacity="0.5" />
					</linearGradient>
					<linearGradient id="hs-wire-bridge" x1="204" y1="72" x2="356" y2="72" gradientUnits="userSpaceOnUse">
						<stop offset="0%" stopColor="#5ec8e0" stopOpacity="0.55" />
						<stop offset="50%" stopColor="#ffffff" stopOpacity="0.35" />
						<stop offset="100%" stopColor="#4aba8a" stopOpacity="0.55" />
					</linearGradient>

					{/* Reusable Motion Paths (Strictly Non-Overlapping) */}
					<path id="path-client-to-hub" d="M 112 120 C 112 178, 198 196, 236 212" />
					<path id="path-hub-to-landlord" d="M 324 212 C 362 196, 448 178, 448 120" />
					<path id="path-landlord-to-client" d="M 356 72 C 306 52, 254 52, 204 72" />
					<path id="path-agent-to-hub" d="M 280 344 L 280 264" />
					<path id="path-client-to-agent" d="M 96 120 C 96 268, 132 372, 170 392" />
					<path id="path-landlord-to-agent" d="M 464 120 C 464 268, 428 372, 390 392" />
				</defs>

				{/* ── 1. Ambient Background Field & Architectural Grid ── */}
				<ellipse cx="280" cy="222" rx="235" ry="185" fill="url(#hs-stage-glow)" />
				<circle cx="112" cy="72" r="85" fill="url(#hs-teal-glow)" />
				<circle cx="448" cy="72" r="85" fill="url(#hs-sage-glow)" />
				<circle cx="280" cy="390" r="95" fill="url(#hs-coral-glow)" />

				{/* Subtle Architectural Coordinate Rings */}
				<circle
					cx="280"
					cy="218"
					r="138"
					stroke="rgba(255,255,255,0.05)"
					strokeWidth="1"
					strokeDasharray="3 7"
				/>
				<circle
					cx="280"
					cy="218"
					r="96"
					stroke="rgba(255,255,255,0.07)"
					strokeWidth="1"
				/>

				{/* ── 2. Network Conduits (Static Base Tracks + Animated Flow) ── */}
				{/* Outer Perimeter Arcs (Client <-> Agent & Landlord <-> Agent) */}
				<use
					href="#path-client-to-agent"
					stroke="rgba(94,200,224,0.2)"
					strokeWidth="1.5"
					strokeDasharray="4 6"
				/>
				<use
					href="#path-landlord-to-agent"
					stroke="rgba(74,186,138,0.2)"
					strokeWidth="1.5"
					strokeDasharray="4 6"
				/>

				{/* Direct Top Bridge (Landlord <-> Client) */}
				<use
					href="#path-landlord-to-client"
					stroke="url(#hs-wire-bridge)"
					strokeWidth="1.75"
					strokeDasharray="5 5"
				/>

				{/* Primary Tri-Core Conduits into HomeScout Hub */}
				<use
					href="#path-client-to-hub"
					stroke="url(#hs-wire-client)"
					strokeWidth="2.25"
				/>
				<use
					href="#path-hub-to-landlord"
					stroke="url(#hs-wire-landlord)"
					strokeWidth="2.25"
				/>
				<use
					href="#path-agent-to-hub"
					stroke="url(#hs-wire-agent)"
					strokeWidth="2.25"
				/>

				{/* Animated Data Packets Acting Out the Platform Workflow */}
				{/* Packet 1: Client Search Request -> HomeScout Hub */}
				<g>
					<circle r="6" fill="#5ec8e0" opacity="0.28">
						<animate
							attributeName="r"
							values="4;8;4"
							dur="2.8s"
							repeatCount="indefinite"
						/>
					</circle>
					<circle r="3.2" fill="#e8f7fb" />
					<animateMotion dur="2.8s" repeatCount="indefinite" rotate="auto">
						<mpath href="#path-client-to-hub" />
					</animateMotion>
				</g>

				{/* Packet 2: Verified Match -> Landlord */}
				<g>
					<circle r="6" fill="#4aba8a" opacity="0.28">
						<animate
							attributeName="r"
							values="4;8;4"
							dur="3.1s"
							repeatCount="indefinite"
						/>
					</circle>
					<circle r="3.2" fill="#edf8f3" />
					<animateMotion
						dur="3.1s"
						begin="0.6s"
						repeatCount="indefinite"
						rotate="auto"
					>
						<mpath href="#path-hub-to-landlord" />
					</animateMotion>
				</g>

				{/* Packet 3: Direct Verified Listing Stream (Landlord -> Client) */}
				<g>
					<circle r="5" fill="#4aba8a" opacity="0.3" />
					<circle r="2.8" fill="#ffffff" />
					<animateMotion dur="3.6s" begin="1.1s" repeatCount="indefinite">
						<mpath href="#path-landlord-to-client" />
					</animateMotion>
				</g>

				{/* Packet 4: Agent Tour & Key Handover -> Hub */}
				<g>
					<circle r="6" fill="#ff7a52" opacity="0.3">
						<animate
							attributeName="r"
							values="4;8;4"
							dur="2.5s"
							repeatCount="indefinite"
						/>
					</circle>
					<circle r="3.2" fill="#fff4f0" />
					<animateMotion dur="2.5s" begin="0.3s" repeatCount="indefinite">
						<mpath href="#path-agent-to-hub" />
					</animateMotion>
				</g>

				{/* Packet 5: Inspection Sync (Client -> Agent) */}
				<g>
					<circle r="4.5" fill="#5ec8e0" opacity="0.25" />
					<circle r="2.5" fill="#5ec8e0" />
					<animateMotion dur="4.2s" begin="0.4s" repeatCount="indefinite">
						<mpath href="#path-client-to-agent" />
					</animateMotion>
				</g>

				{/* Packet 6: Mandate & Key Release (Landlord -> Agent) */}
				<g>
					<circle r="4.5" fill="#4aba8a" opacity="0.25" />
					<circle r="2.5" fill="#4aba8a" />
					<animateMotion dur="4.2s" begin="1.8s" repeatCount="indefinite">
						<mpath href="#path-landlord-to-agent" />
					</animateMotion>
				</g>

				{/* ── 3. Top Bridge Pill: Direct Match (x: 222..338, y: 46..72) ── */}
				<g transform="translate(222, 46)">
					<rect
						width="116"
						height="26"
						rx="13"
						fill="#0f172a"
						fillOpacity="0.9"
						stroke="rgba(255,255,255,0.16)"
						strokeWidth="1"
					/>
					<circle cx="15" cy="13" r="3.5" fill="#4aba8a">
						<animate
							attributeName="opacity"
							values="1;0.35;1"
							dur="2s"
							repeatCount="indefinite"
						/>
					</circle>
					<text
						x="25"
						y="16.5"
						fill="#f8fafc"
						fontSize="8.5"
						fontWeight="700"
						letterSpacing="0.06em"
					>
						DIRECT MATCH
					</text>
				</g>

				{/* ── 4. Central HomeScout Verification Hub (cx: 280, cy: 218) ── */}
				<g>
					{/* Animated Expanding Trust Pulse */}
					<circle
						cx="280"
						cy="218"
						r="46"
						stroke="#33a674"
						strokeWidth="1.5"
						fill="none"
						opacity="0.45"
					>
						<animate
							attributeName="r"
							values="44;66;44"
							dur="3.6s"
							repeatCount="indefinite"
						/>
						<animate
							attributeName="opacity"
							values="0.5;0;0.5"
							dur="3.6s"
							repeatCount="indefinite"
						/>
					</circle>

					{/* Rotating Segmented Verification Ring */}
					<g>
						<circle
							cx="280"
							cy="218"
							r="54"
							stroke="rgba(94,200,224,0.35)"
							strokeWidth="1.5"
							strokeDasharray="18 10 6 10"
							fill="none"
						/>
						<animateTransform
							attributeName="transform"
							type="rotate"
							from="0 280 218"
							to="360 280 218"
							dur="24s"
							repeatCount="indefinite"
						/>
					</g>

					{/* Hub Outer Bezel */}
					<circle
						cx="280"
						cy="218"
						r="44"
						fill="url(#hs-hub-surface)"
						stroke="rgba(255,255,255,0.2)"
						strokeWidth="1.5"
					/>
					<circle
						cx="280"
						cy="218"
						r="36"
						fill="#0f172a"
						stroke="rgba(51,166,116,0.45)"
						strokeWidth="1"
					/>

					{/* Architectural Home + Verification Check Emblem */}
					<path
						d="M266 216 L280 204 L294 216 V229 C294 230.5 292.8 231.5 291.5 231.5 H268.5 C267.2 231.5 266 230.5 266 229 V216 Z"
						fill="rgba(51,166,116,0.16)"
						stroke="#4aba8a"
						strokeWidth="1.75"
						strokeLinejoin="round"
					/>
					<path
						d="M275 219.5 L278.8 223.2 L286 215.5"
						stroke="#ffffff"
						strokeWidth="2.2"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>

					{/* Hub Connection Ports */}
					<circle cx="236" cy="212" r="3.5" fill="#5ec8e0" />
					<circle cx="324" cy="212" r="3.5" fill="#4aba8a" />
					<circle cx="280" cy="262" r="3.5" fill="#ff7a52" />

					{/* Hub Nameplate Pill (x: 204..356, y: 274..300) */}
					<rect
						x="204"
						y="274"
						width="152"
						height="26"
						rx="13"
						fill="#0c1322"
						stroke="rgba(51,166,116,0.45)"
						strokeWidth="1"
					/>
					<circle cx="219" cy="287" r="3.5" fill="#33a674" />
					<text
						x="286"
						y="290.5"
						textAnchor="middle"
						fill="#ffffff"
						fontSize="8.5"
						fontWeight="800"
						letterSpacing="0.1em"
					>
						HOMESCOUT CORE
					</text>
				</g>

				{/* ── 5. Mid-Stage Telemetry Callouts (Left & Right, Non-Overlapping) ── */}
				{/* Left Telemetry Pill: GPS & ID Verified (x: 16..182, y: 204..242) */}
				<g transform="translate(16, 204)">
					<rect
						width="166"
						height="38"
						rx="12"
						fill="#111b2d"
						fillOpacity="0.92"
						stroke="rgba(94,200,224,0.32)"
						strokeWidth="1"
					/>
					<rect
						x="8"
						y="8"
						width="22"
						height="22"
						rx="7"
						fill="rgba(94,200,224,0.16)"
					/>
					<path
						d="M19 13.5 C16.8 13.5 15 15.2 15 17.4 C15 20.2 19 24.2 19 24.2 C19 24.2 23 20.2 23 17.4 C23 15.2 21.2 13.5 19 13.5 Z"
						stroke="#5ec8e0"
						strokeWidth="1.4"
						fill="none"
					/>
					<circle cx="19" cy="17.3" r="1.4" fill="#5ec8e0" />
					<text x="37" y="18" fill="#f8fafc" fontSize="9.5" fontWeight="700">
						GPS-Pinned Address
					</text>
					<text x="37" y="29.5" fill="#94a3b8" fontSize="8" fontWeight="500">
						Real photos · Live map
					</text>
				</g>

				{/* Right Telemetry Pill: Transparent Pricing (x: 378..544, y: 204..242) */}
				<g transform="translate(378, 204)">
					<rect
						width="166"
						height="38"
						rx="12"
						fill="#111b2d"
						fillOpacity="0.92"
						stroke="rgba(74,186,138,0.32)"
						strokeWidth="1"
					/>
					<rect
						x="8"
						y="8"
						width="22"
						height="22"
						rx="7"
						fill="rgba(74,186,138,0.16)"
					/>
					<path
						d="M19 13 L24 15.2 V19.2 C24 22.2 21.8 24.4 19 25.2 C16.2 24.4 14 22.2 14 19.2 V15.2 L19 13 Z"
						stroke="#4aba8a"
						strokeWidth="1.4"
						fill="none"
					/>
					<path
						d="M16.8 19 L18.4 20.6 L21.4 17.5"
						stroke="#4aba8a"
						strokeWidth="1.4"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<text x="37" y="18" fill="#f8fafc" fontSize="9.5" fontWeight="700">
						Zero Exploitation
					</text>
					<text x="37" y="29.5" fill="#94a3b8" fontSize="8" fontWeight="500">
						Clear ₦ rent &amp; fee terms
					</text>
				</g>

				{/* ── 6. Role Node 1: CLIENT / HOUSE HUNTER (Top-Left, x: 16..204, y: 20..120) ── */}
				<g transform="translate(16, 20)">
					<rect
						width="188"
						height="100"
						rx="18"
						fill="url(#hs-card-surface)"
						stroke="rgba(94,200,224,0.45)"
						strokeWidth="1.25"
					/>
					{/* Top Accent Line */}
					<path
						d="M 18 0.75 H 170"
						stroke="url(#hs-teal-badge)"
						strokeWidth="2.5"
						strokeLinecap="round"
					/>

					{/* Icon Tile */}
					<rect
						x="14"
						y="14"
						width="36"
						height="36"
						rx="11"
						fill="url(#hs-teal-badge)"
					/>
					{/* Custom House Hunter / Search Person Vector Icon */}
					<circle
						cx="30"
						cy="28"
						r="5.5"
						stroke="white"
						strokeWidth="1.8"
						fill="none"
					/>
					<path
						d="M21.5 41 C22.8 36.8 26 35 30 35 C34 35 37.2 36.8 38.5 41"
						stroke="white"
						strokeWidth="1.8"
						strokeLinecap="round"
						fill="none"
					/>
					<circle cx="38.5" cy="24.5" r="2.2" fill="#e8f7fb" />

					{/* Role Meta & Title */}
					<text
						x="60"
						y="25"
						fill="#5ec8e0"
						fontSize="8"
						fontWeight="800"
						letterSpacing="0.12em"
					>
						HOUSE HUNTER
					</text>
					<text x="60" y="41" fill="#ffffff" fontSize="13" fontWeight="800">
						Client &amp; Tenant
					</text>

					{/* Status Pill inside Card */}
					<rect
						x="14"
						y="60"
						width="160"
						height="26"
						rx="8"
						fill="rgba(94,200,224,0.12)"
						stroke="rgba(94,200,224,0.24)"
						strokeWidth="1"
					/>
					<circle cx="25" cy="73" r="3" fill="#5ec8e0">
						<animate
							attributeName="opacity"
							values="1;0.3;1"
							dur="2.2s"
							repeatCount="indefinite"
						/>
					</circle>
					<text x="34" y="76.5" fill="#e2e8f0" fontSize="8.8" fontWeight="600">
						Finds verified 2-Bed · Lekki
					</text>

					{/* Connection Port at Bottom Center (local 96, 100 -> global 112, 120) */}
					<circle
						cx="96"
						cy="100"
						r="4.5"
						fill="#0d1524"
						stroke="#5ec8e0"
						strokeWidth="2"
					/>
				</g>

				{/* ── 7. Role Node 2: LANDLORD / PROPERTY OWNER (Top-Right, x: 356..544, y: 20..120) ── */}
				<g transform="translate(356, 20)">
					<rect
						width="188"
						height="100"
						rx="18"
						fill="url(#hs-card-surface)"
						stroke="rgba(74,186,138,0.45)"
						strokeWidth="1.25"
					/>
					{/* Top Accent Line */}
					<path
						d="M 18 0.75 H 170"
						stroke="url(#hs-sage-badge)"
						strokeWidth="2.5"
						strokeLinecap="round"
					/>

					{/* Icon Tile */}
					<rect
						x="14"
						y="14"
						width="36"
						height="36"
						rx="11"
						fill="url(#hs-sage-badge)"
					/>
					{/* Custom Verified Building Vector Icon */}
					<path
						d="M23 39 V25 L32 20 L41 25 V39"
						stroke="white"
						strokeWidth="1.8"
						strokeLinecap="round"
						strokeLinejoin="round"
						fill="none"
					/>
					<path
						d="M29 39 V32 H35 V39"
						stroke="white"
						strokeWidth="1.6"
						strokeLinejoin="round"
						fill="none"
					/>
					<rect x="27" y="26" width="2.5" height="2.5" rx="0.5" fill="white" />
					<rect x="34.5" y="26" width="2.5" height="2.5" rx="0.5" fill="white" />

					{/* Role Meta & Title */}
					<text
						x="60"
						y="25"
						fill="#4aba8a"
						fontSize="8"
						fontWeight="800"
						letterSpacing="0.12em"
					>
						PROPERTY OWNER
					</text>
					<text x="60" y="41" fill="#ffffff" fontSize="13" fontWeight="800">
						Verified Landlord
					</text>

					{/* Status Pill inside Card */}
					<rect
						x="14"
						y="60"
						width="160"
						height="26"
						rx="8"
						fill="rgba(74,186,138,0.12)"
						stroke="rgba(74,186,138,0.24)"
						strokeWidth="1"
					/>
					<circle cx="25" cy="73" r="3" fill="#4aba8a">
						<animate
							attributeName="opacity"
							values="1;0.3;1"
							dur="2.6s"
							repeatCount="indefinite"
						/>
					</circle>
					<text x="34" y="76.5" fill="#e2e8f0" fontSize="8.8" fontWeight="600">
						ID &amp; Title Confirmed · ₦1.8M
					</text>

					{/* Connection Port at Bottom Center (local 92, 100 -> global 448, 120) */}
					<circle
						cx="92"
						cy="100"
						r="4.5"
						fill="#0d1524"
						stroke="#4aba8a"
						strokeWidth="2"
					/>
				</g>

				{/* ── 8. Role Node 3: LICENSED AGENT (Bottom-Center, x: 170..390, y: 344..444) ── */}
				<g transform="translate(170, 344)">
					<rect
						width="220"
						height="100"
						rx="18"
						fill="url(#hs-card-surface)"
						stroke="rgba(255,122,82,0.48)"
						strokeWidth="1.25"
					/>
					{/* Top Accent Line */}
					<path
						d="M 22 0.75 H 198"
						stroke="url(#hs-coral-badge)"
						strokeWidth="2.5"
						strokeLinecap="round"
					/>

					{/* Connection Port at Top Center (local 110, 0 -> global 280, 344) */}
					<circle
						cx="110"
						cy="0"
						r="4.5"
						fill="#0d1524"
						stroke="#ff7a52"
						strokeWidth="2"
					/>

					{/* Icon Tile */}
					<rect
						x="14"
						y="16"
						width="36"
						height="36"
						rx="11"
						fill="url(#hs-coral-badge)"
					/>
					{/* Custom Key / Deal Handover Vector Icon */}
					<circle
						cx="28"
						cy="34"
						r="4.5"
						stroke="white"
						strokeWidth="1.8"
						fill="none"
					/>
					<path
						d="M32.5 34 H41 M38 34 V37.5 M41 34 V38.5"
						stroke="white"
						strokeWidth="1.8"
						strokeLinecap="round"
					/>

					{/* Role Meta & Title */}
					<text
						x="60"
						y="27"
						fill="#ff9d7a"
						fontSize="8"
						fontWeight="800"
						letterSpacing="0.12em"
					>
						FIELD PARTNER
					</text>
					<text x="60" y="43" fill="#ffffff" fontSize="13" fontWeight="800">
						Licensed Agent
					</text>

					{/* Verified Tag Pill on Top Right of Agent Card */}
					<rect
						x="154"
						y="15"
						width="52"
						height="18"
						rx="9"
						fill="rgba(249,93,46,0.18)"
					/>
					<text
						x="180"
						y="27"
						textAnchor="middle"
						fill="#ff9d7a"
						fontSize="7.5"
						fontWeight="800"
					>
						VETTED
					</text>

					{/* Status Pill inside Card */}
					<rect
						x="14"
						y="62"
						width="192"
						height="26"
						rx="8"
						fill="rgba(249,93,46,0.12)"
						stroke="rgba(249,93,46,0.25)"
						strokeWidth="1"
					/>
					<circle cx="25" cy="75" r="3" fill="#ff7a52">
						<animate
							attributeName="opacity"
							values="1;0.3;1"
							dur="2s"
							repeatCount="indefinite"
						/>
					</circle>
					<text x="34" y="78.5" fill="#e2e8f0" fontSize="8.8" fontWeight="600">
						Hosts viewing &amp; closes deal safely
					</text>
				</g>
			</svg>
		</div>
	);
}
