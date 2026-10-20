interface LogoProps {
	/**
	 * Visual theme:
	 * - "light": Brand Slate (#1e293b) + Codebase Green (#33a674) for light surfaces
	 * - "dark": Crisp White (#ffffff) + Codebase Green (#4aba8a) for Brand (#1e293b) / dark surfaces
	 * - "mono": Pure White (#ffffff) for vibrant green/brand solid backdrops
	 */
	variant?: "light" | "dark" | "mono";
	/** Preset scale that preserves exact aspect ratio */
	size?: "xs" | "sm" | "md" | "lg" | "xl";
	className?: string;
}

const sizeMap = {
	xs: { width: 49, height: 36 },
	sm: { width: 57, height: 42 },
	md: { width: 68, height: 50 },
	lg: { width: 86, height: 64 },
	xl: { width: 120, height: 88 },
} as const;

export function Logo({
	variant = "light",
	size = "md",
	className = "",
}: LogoProps) {
	const dims = sizeMap[size];

	const primaryColor = variant === "light" ? "#1e293b" : "#ffffff";
	const accentColor =
		variant === "light"
			? "#33a674"
			: variant === "dark"
				? "#4aba8a"
				: "#ffffff";

	return (
		<svg
			width={dims.width}
			height={dims.height}
			viewBox="0 0 280 208"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			role="img"
			aria-label="HomeScout"
			className={`shrink-0 select-none ${className}`}
		>
			{/* ── 1. Left Architectural Gable, Wall & Stepped Terrace (#1e293b) ── */}
			<path
				d="M120 28L36 84V186H92V164"
				stroke={primaryColor}
				strokeWidth="9.5"
				strokeLinecap="butt"
				strokeLinejoin="miter"
				strokeMiterlimit="10"
			/>

			{/* ── 2. Overlapping Scout Roof Rafter, Chimney & Lower Foundation (#33a674) ── */}
			<path
				d="M111 13L225 89"
				stroke={accentColor}
				strokeWidth="9.5"
				strokeLinecap="butt"
			/>
			<path
				d="M175 55.5V34H191V66"
				stroke={accentColor}
				strokeWidth="8"
				strokeLinecap="butt"
				strokeLinejoin="miter"
			/>
			<path
				d="M106 186H219"
				stroke={accentColor}
				strokeWidth="9.5"
				strokeLinecap="butt"
			/>

			{/* ── 3. Gable Apex 4-Pane Skylight Window Grid ── */}
			<g transform="translate(113, 47)">
				<rect x="0" y="0" width="7.5" height="7.5" rx="1.8" fill={primaryColor} />
				<rect x="10" y="0" width="7.5" height="7.5" rx="1.8" fill={accentColor} />
				<rect x="0" y="10" width="7.5" height="7.5" rx="1.8" fill={accentColor} />
				<rect x="10" y="10" width="7.5" height="7.5" rx="1.8" fill={primaryColor} />
			</g>

			{/* ── 4. Top Row: "home" — True Circular Arcs ── */}
			<g
				stroke={primaryColor}
				strokeWidth="9.5"
				strokeLinecap="butt"
				strokeLinejoin="round"
				fill="none"
			>
				{/* 'h' */}
				<path d="M64 74V128" />
				<path d="M64 110A13.5 13.5 0 0 1 91 110V128" />

				{/* 'o' */}
				<circle cx="121" cy="112.25" r="15.75" />

				{/* 'm' */}
				<path d="M151 93V128" />
				<path d="M151 110A13.5 13.5 0 0 1 178 110V128" />
				<path d="M178 110A13.5 13.5 0 0 1 205 110V134" />

				{/* 'e' */}
				<path d="M219.75 111.5H251.25A15.75 15.75 0 1 0 248.8 121" />
			</g>

			{/* ── 5. Bottom Row: "scout" — With Scout Magnifying Lens 'o' ── */}
			<g
				stroke={accentColor}
				strokeWidth="9"
				strokeLinecap="butt"
				strokeLinejoin="round"
				fill="none"
			>
				{/* 's' */}
				<path d="M83.5 144C81.5 140.2 77.5 138 72.2 138C66 138 62 141.2 62 145.5C62 150 66.2 151.6 72.8 153C79.4 154.4 83.5 156.5 83.5 161.2C83.5 165.8 78.8 169 72 169C66.2 169 61.8 166.6 59.5 162.5" />

				{/* 'c' */}
				<path d="M122.8 143.3A15.25 15.25 0 1 0 122.8 163.7" />

				{/* 'o' as a Scout Magnifying Lens + Location Pin Target */}
				<circle cx="148" cy="153.5" r="15.25" />
				<path d="M159 164.5L167 172.5" strokeWidth="8.5" strokeLinecap="round" />

				{/* 'u' */}
				<path d="M174.5 137.5V159A10 10 0 0 0 194.5 159V137.5" />

				{/* 't' */}
				<path
					d="M205 128V161.5A7.5 7.5 0 0 0 212.5 169H219"
					strokeWidth="9.5"
				/>
				<path d="M205 142H219" strokeWidth="9" />
			</g>

			{/* Center Compass / Location Pin Dot inside 'o' of scout */}
			<circle cx="148" cy="153.5" r="4.2" fill={primaryColor} />
		</svg>
	);
}

export default Logo;
