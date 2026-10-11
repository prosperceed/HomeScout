export default function NetworkSVG() {
  return (
    <svg
      viewBox="0 0 480 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="glow-violet" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7c5cf6" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#7c5cf6" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="glow-coral" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f95d2e" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#f95d2e" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="line-grad-1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7c5cf6" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#f95d2e" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="line-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c5cf6" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0.45" />
        </linearGradient>
        <linearGradient id="line-grad-3" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f95d2e" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="node-violet" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9b7cf8" />
          <stop offset="100%" stopColor="#5730cc" />
        </linearGradient>
        <linearGradient id="node-coral" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff7a52" />
          <stop offset="100%" stopColor="#e04520" />
        </linearGradient>
        <linearGradient id="node-emerald" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="hub-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c5cf6" />
          <stop offset="50%" stopColor="#9b7cf8" />
          <stop offset="100%" stopColor="#5730cc" />
        </linearGradient>
      </defs>

      <ellipse cx="240" cy="190" rx="160" ry="120" fill="url(#glow-violet)" />
      <ellipse cx="380" cy="120" rx="80" ry="60" fill="url(#glow-coral)" />
      <ellipse cx="100" cy="290" rx="70" ry="55" fill="url(#glow-coral)" />

      {[60, 120, 180, 240, 300, 360, 420].map((x) =>
        [60, 120, 180, 240, 300, 360].map((y) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="1.2" fill="rgba(255,255,255,0.12)" />
        ))
      )}

      <line x1="240" y1="190" x2="100" y2="85"  stroke="url(#line-grad-2)" strokeWidth="1.5" strokeDasharray="6 4" />
      <line x1="240" y1="190" x2="390" y2="95"  stroke="url(#line-grad-1)" strokeWidth="1.5" strokeDasharray="6 4" />
      <line x1="240" y1="190" x2="410" y2="230" stroke="url(#line-grad-1)" strokeWidth="1.5" strokeDasharray="6 4" />
      <line x1="240" y1="190" x2="330" y2="320" stroke="url(#line-grad-3)" strokeWidth="1.5" strokeDasharray="6 4" />
      <line x1="240" y1="190" x2="100" y2="305" stroke="url(#line-grad-2)" strokeWidth="1.5" strokeDasharray="6 4" />
      <line x1="240" y1="190" x2="60"  y2="195" stroke="url(#line-grad-2)" strokeWidth="1.5" strokeDasharray="6 4" />

      <line x1="100" y1="85"  x2="390" y2="95"  stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      <line x1="390" y1="95"  x2="410" y2="230" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      <line x1="330" y1="320" x2="100" y2="305" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

      <circle cx="240" cy="190" r="52" stroke="rgba(124,92,246,0.2)" strokeWidth="1" fill="none" />
      <circle cx="240" cy="190" r="70" stroke="rgba(124,92,246,0.1)" strokeWidth="1" fill="none" />

      <circle cx="240" cy="190" r="44" fill="url(#hub-grad)" opacity="0.15" />
      <circle cx="240" cy="190" r="36" fill="url(#hub-grad)" />
      <circle cx="240" cy="190" r="36" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" fill="none" />
      <text x="240" y="185" textAnchor="middle" fill="white" fontSize="9" fontWeight="700" letterSpacing="0.5" opacity="0.9">HOME</text>
      <text x="240" y="198" textAnchor="middle" fill="white" fontSize="9" fontWeight="700" letterSpacing="0.5" opacity="0.9">SCOUT</text>

      <circle cx="100" cy="85" r="28" fill="url(#node-emerald)" opacity="0.15" />
      <circle cx="100" cy="85" r="22" fill="url(#node-emerald)" />
      <circle cx="100" cy="85" r="22" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" fill="none" />
      <text x="100" y="89" textAnchor="middle" fill="white" fontSize="18" dominantBaseline="middle">🎓</text>
      <rect x="62" y="113" width="76" height="20" rx="10" fill="rgba(255,255,255,0.12)" />
      <text x="100" y="126" textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize="9" fontWeight="600">Student</text>

      <circle cx="390" cy="95" r="28" fill="url(#node-violet)" opacity="0.15" />
      <circle cx="390" cy="95" r="22" fill="url(#node-violet)" />
      <circle cx="390" cy="95" r="22" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" fill="none" />
      <text x="390" y="99" textAnchor="middle" fill="white" fontSize="18" dominantBaseline="middle">🏡</text>
      <rect x="352" y="123" width="76" height="20" rx="10" fill="rgba(255,255,255,0.12)" />
      <text x="390" y="136" textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize="9" fontWeight="600">Family</text>

      <circle cx="410" cy="230" r="28" fill="url(#node-coral)" opacity="0.15" />
      <circle cx="410" cy="230" r="22" fill="url(#node-coral)" />
      <circle cx="410" cy="230" r="22" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" fill="none" />
      <text x="410" y="234" textAnchor="middle" fill="white" fontSize="18" dominantBaseline="middle">🤝</text>
      <rect x="372" y="258" width="76" height="20" rx="10" fill="rgba(255,255,255,0.12)" />
      <text x="410" y="271" textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize="9" fontWeight="600">Agent</text>

      <circle cx="330" cy="320" r="28" fill="url(#node-violet)" opacity="0.15" />
      <circle cx="330" cy="320" r="22" fill="url(#node-violet)" />
      <circle cx="330" cy="320" r="22" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" fill="none" />
      <text x="330" y="324" textAnchor="middle" fill="white" fontSize="18" dominantBaseline="middle">🔑</text>
      <rect x="288" y="348" width="84" height="20" rx="10" fill="rgba(255,255,255,0.12)" />
      <text x="330" y="361" textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize="9" fontWeight="600">Landlord</text>

      <circle cx="100" cy="305" r="28" fill="url(#node-emerald)" opacity="0.15" />
      <circle cx="100" cy="305" r="22" fill="url(#node-emerald)" />
      <circle cx="100" cy="305" r="22" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" fill="none" />
      <text x="100" y="309" textAnchor="middle" fill="white" fontSize="18" dominantBaseline="middle">👤</text>
      <rect x="62" y="333" width="76" height="20" rx="10" fill="rgba(255,255,255,0.12)" />
      <text x="100" y="346" textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize="9" fontWeight="600">Renter</text>

      <circle cx="60" cy="195" r="24" fill="url(#node-coral)" opacity="0.15" />
      <circle cx="60" cy="195" r="18" fill="url(#node-coral)" />
      <circle cx="60" cy="195" r="18" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" fill="none" />
      <text x="60" y="199" textAnchor="middle" fill="white" fontSize="14" dominantBaseline="middle">👥</text>
      <rect x="24" y="219" width="72" height="18" rx="9" fill="rgba(255,255,255,0.1)" />
      <text x="60" y="231" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="8" fontWeight="600">Friends</text>

      <g transform="translate(148, 118)">
        <rect width="90" height="24" rx="12" fill="rgba(16,185,129,0.25)" stroke="rgba(16,185,129,0.5)" strokeWidth="1" />
        <circle cx="14" cy="12" r="4" fill="#10b981" />
        <text x="26" y="16" fill="rgba(255,255,255,0.92)" fontSize="8.5" fontWeight="600">Verified listing</text>
      </g>
      <g transform="translate(168, 248)">
        <rect width="88" height="24" rx="12" fill="rgba(249,93,46,0.22)" stroke="rgba(249,93,46,0.45)" strokeWidth="1" />
        <circle cx="14" cy="12" r="4" fill="#f95d2e" />
        <text x="26" y="16" fill="rgba(255,255,255,0.92)" fontSize="8.5" fontWeight="600">₦ No hidden fee</text>
      </g>
      <g transform="translate(258, 158)">
        <rect width="82" height="24" rx="12" fill="rgba(124,92,246,0.25)" stroke="rgba(124,92,246,0.5)" strokeWidth="1" />
        <circle cx="14" cy="12" r="4" fill="#7c5cf6" />
        <text x="26" y="16" fill="rgba(255,255,255,0.92)" fontSize="8.5" fontWeight="600">Direct chat</text>
      </g>
    </svg>
  );
}
