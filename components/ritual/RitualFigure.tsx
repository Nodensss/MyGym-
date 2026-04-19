'use client';

export type MuscleIntensity = {
  chest?: number;
  back?: number;
  shoulders?: number;
  arms?: number;
  core?: number;
  legs?: number;
};

const MUSCLE_LOCI: Record<keyof MuscleIntensity, Array<{ cx: number; cy: number; rx: number; ry: number }>> = {
  chest: [
    { cx: 420, cy: 420, rx: 120, ry: 90 },
    { cx: 600, cy: 420, rx: 120, ry: 90 }
  ],
  back: [
    { cx: 330, cy: 540, rx: 90, ry: 140 },
    { cx: 690, cy: 540, rx: 90, ry: 140 }
  ],
  shoulders: [
    { cx: 310, cy: 370, rx: 95, ry: 85 },
    { cx: 710, cy: 370, rx: 95, ry: 85 }
  ],
  arms: [
    { cx: 240, cy: 560, rx: 80, ry: 150 },
    { cx: 780, cy: 560, rx: 80, ry: 150 }
  ],
  core: [{ cx: 510, cy: 720, rx: 140, ry: 160 }],
  legs: [
    { cx: 430, cy: 1080, rx: 110, ry: 220 },
    { cx: 590, cy: 1080, rx: 110, ry: 220 }
  ]
};

interface RitualFigureProps {
  intensity?: MuscleIntensity;
  size?: number;
}

export default function RitualFigure({ intensity = {}, size = 150 }: RitualFigureProps) {
  const v = (key: keyof MuscleIntensity) => Math.min(1, Math.max(0, intensity[key] ?? 0));

  return (
    <svg width={size} height={size * 1.5} viewBox="0 0 1024 1536" style={{ display: 'block' }}>
      <defs>
        <filter id="ritualEmberBlur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="28" />
        </filter>
        <radialGradient id="ritualEmberGrad">
          <stop offset="0%" stopColor="rgba(255,90,60,1)" />
          <stop offset="60%" stopColor="rgba(180,40,30,0.5)" />
          <stop offset="100%" stopColor="rgba(139,30,30,0)" />
        </radialGradient>
      </defs>

      {/* ritual rings */}
      <circle cx="512" cy="768" r="720" fill="none" stroke="rgba(232,228,218,0.08)" strokeWidth="2" />
      <circle cx="512" cy="768" r="700" fill="none" stroke="rgba(232,228,218,0.05)" strokeWidth="2" />

      {/* stylized anatomical silhouette — hairline engraving */}
      <g stroke="rgba(232,228,218,0.35)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* head */}
        <circle cx="512" cy="240" r="90" />
        {/* neck */}
        <path d="M 480 320 L 480 350 L 544 350 L 544 320" />
        {/* shoulders line */}
        <path d="M 310 370 Q 400 340 512 350 Q 624 340 714 370" />
        {/* torso outline */}
        <path d="M 330 380 Q 300 540 340 700 L 380 880 L 644 880 L 684 700 Q 724 540 694 380" />
        {/* waist */}
        <path d="M 380 720 L 644 720" opacity="0.4" />
        {/* arms */}
        <path d="M 310 380 Q 240 480 220 640 L 200 780" />
        <path d="M 714 380 Q 784 480 804 640 L 824 780" />
        {/* forearms */}
        <path d="M 200 780 L 190 920" />
        <path d="M 824 780 L 834 920" />
        {/* legs */}
        <path d="M 380 880 Q 380 1000 400 1200 L 420 1380" />
        <path d="M 644 880 Q 644 1000 624 1200 L 604 1380" />
        {/* center line */}
        <path d="M 512 350 L 512 880" opacity="0.25" />
      </g>

      {/* ember glow overlays */}
      <g style={{ mixBlendMode: 'screen' }}>
        {(Object.keys(MUSCLE_LOCI) as Array<keyof MuscleIntensity>).flatMap((group) => {
          const i = v(group);
          if (i < 0.05) return [];
          return MUSCLE_LOCI[group].map((loc, idx) => (
            <ellipse
              key={`${group}-${idx}`}
              cx={loc.cx}
              cy={loc.cy}
              rx={loc.rx}
              ry={loc.ry}
              fill="url(#ritualEmberGrad)"
              opacity={0.25 + i * 0.75}
              filter="url(#ritualEmberBlur)"
            />
          ));
        })}
      </g>
    </svg>
  );
}
