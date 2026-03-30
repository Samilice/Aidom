import { useState } from 'react';
import { CANTONS, type CantonData } from '../../lib/cantons';

// Grille géographique simplifiée de la Suisse
// Chaque canton est placé dans une grille 10x6 approximant sa position réelle
const GRID: { code: string; row: number; col: number }[] = [
  // Row 0 (nord)
  { code: 'BS', row: 0, col: 3 },
  { code: 'SH', row: 0, col: 5 },
  { code: 'TG', row: 0, col: 7 },
  // Row 1
  { code: 'JU', row: 1, col: 1 },
  { code: 'BL', row: 1, col: 3 },
  { code: 'AG', row: 1, col: 4 },
  { code: 'ZH', row: 1, col: 5 },
  { code: 'AR', row: 1, col: 7 },
  { code: 'AI', row: 1, col: 8 },
  // Row 2
  { code: 'NE', row: 2, col: 1 },
  { code: 'SO', row: 2, col: 3 },
  { code: 'LU', row: 2, col: 4 },
  { code: 'ZG', row: 2, col: 5 },
  { code: 'SZ', row: 2, col: 6 },
  { code: 'GL', row: 2, col: 7 },
  { code: 'SG', row: 2, col: 8 },
  // Row 3
  { code: 'VD', row: 3, col: 1 },
  { code: 'FR', row: 3, col: 2 },
  { code: 'BE', row: 3, col: 3 },
  { code: 'OW', row: 3, col: 5 },
  { code: 'NW', row: 3, col: 6 },
  { code: 'UR', row: 3, col: 7 },
  { code: 'GR', row: 3, col: 8 },
  // Row 4
  { code: 'GE', row: 4, col: 0 },
  { code: 'VS', row: 4, col: 3 },
  { code: 'TI', row: 4, col: 6 },
];

interface SwissMapProps {
  onSelect?: (canton: CantonData) => void;
  selected?: string | null;
}

export function SwissMap({ onSelect, selected }: SwissMapProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(9, 1fr)',
      gridTemplateRows: 'repeat(5, 1fr)',
      gap: 6,
      maxWidth: 640,
      margin: '0 auto',
      padding: '8px 0',
    }}>
      {GRID.map(({ code, row, col }) => {
        const canton = CANTONS.find(c => c.code === code);
        if (!canton) return null;

        const isSelected = selected === code;
        const isHovered = hovered === code;
        const isActive = isSelected || isHovered;

        return (
          <div
            key={code}
            onClick={() => onSelect?.(canton)}
            onMouseEnter={() => setHovered(code)}
            onMouseLeave={() => setHovered(null)}
            style={{
              gridColumn: col + 1,
              gridRow: row + 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px 4px',
              borderRadius: 'var(--radius-lg)',
              cursor: 'pointer',
              background: isSelected
                ? 'var(--color-primary)'
                : isHovered
                  ? 'var(--color-primary-light)'
                  : '#fff',
              border: `2px solid ${isActive ? 'var(--color-primary)' : 'var(--color-border)'}`,
              boxShadow: isActive ? '0 4px 12px rgba(26, 86, 219, 0.15)' : 'var(--shadow-sm)',
              transition: 'all 0.15s ease',
              transform: isActive ? 'scale(1.08)' : 'scale(1)',
              zIndex: isActive ? 2 : 1,
              position: 'relative',
              minHeight: 52,
            }}
          >
            <span style={{
              fontWeight: 800,
              fontSize: '0.85rem',
              color: isSelected ? '#fff' : 'var(--color-primary)',
              lineHeight: 1,
            }}>
              {code}
            </span>
            <span style={{
              fontSize: '0.62rem',
              color: isSelected ? 'rgba(255,255,255,0.8)' : 'var(--color-text-muted)',
              marginTop: 2,
              textAlign: 'center',
              lineHeight: 1.2,
              maxWidth: 70,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {canton.name}
            </span>

            {/* Indicateur de sélection */}
            {isSelected && (
              <div style={{
                position: 'absolute',
                top: -4,
                right: -4,
                width: 14,
                height: 14,
                borderRadius: '50%',
                background: 'var(--color-success)',
                border: '2px solid #fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '8px',
                color: '#fff',
                fontWeight: 700,
              }}>
                ✓
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
