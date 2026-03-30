import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import type { ChecklistItem } from '../types';

export function Checklist() {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await api.getChecklist();
      if (res.success && res.data) {
        setItems(res.data as ChecklistItem[]);
      }
      setLoading(false);
    }
    load();
  }, []);

  const toggleItem = async (item: ChecklistItem) => {
    const newVal = !item.completed;
    await api.toggleChecklistItem(item.id, newVal);
    setItems(items.map((i) => (i.id === item.id ? { ...i, completed: newVal } : i)));
  };

  if (loading) return <div className="container page text-center text-muted">Chargement...</div>;

  const obligatoire = items.filter((i) => i.category === 'obligatoire');
  const recommande = items.filter((i) => i.category === 'recommande');
  const optionnel = items.filter((i) => i.category === 'optionnel');

  const completed = items.filter((i) => i.completed).length;

  return (
    <div className="container page" style={{ maxWidth: 700 }}>
      <div className="page-header">
        <Link to="/dashboard" className="text-sm">&larr; Retour</Link>
        <h1 style={{ marginTop: 8 }}>Checklist administrative</h1>
        <p>{completed} sur {items.length} étapes complétées</p>
      </div>

      {/* Progress bar */}
      <div style={{
        background: 'var(--color-bg-secondary)',
        borderRadius: 'var(--radius)',
        height: 10,
        overflow: 'hidden',
        marginBottom: 24,
      }}>
        <div style={{
          background: 'var(--color-success)',
          height: '100%',
          width: `${items.length > 0 ? (completed / items.length) * 100 : 0}%`,
          borderRadius: 'var(--radius)',
          transition: 'width 0.3s',
        }} />
      </div>

      {obligatoire.length > 0 && (
        <ChecklistSection title="Obligatoire" items={obligatoire} onToggle={toggleItem} />
      )}
      {recommande.length > 0 && (
        <ChecklistSection title="Recommandé" items={recommande} onToggle={toggleItem} />
      )}
      {optionnel.length > 0 && (
        <ChecklistSection title="Optionnel" items={optionnel} onToggle={toggleItem} />
      )}
    </div>
  );
}

function ChecklistSection({
  title,
  items,
  onToggle,
}: {
  title: string;
  items: ChecklistItem[];
  onToggle: (item: ChecklistItem) => void;
}) {
  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <div className="card-header">
        <h2>{title}</h2>
      </div>
      {items.map((item) => (
        <div key={item.id} style={{
          display: 'flex',
          gap: 12,
          padding: '12px 0',
          borderBottom: '1px solid var(--color-border-light)',
          opacity: item.completed ? 0.6 : 1,
        }}>
          <input
            type="checkbox"
            checked={item.completed}
            onChange={() => onToggle(item)}
            style={{ width: 20, height: 20, marginTop: 2, cursor: 'pointer' }}
          />
          <div style={{ flex: 1 }}>
            <div style={{
              fontWeight: 500,
              fontSize: '0.95rem',
              textDecoration: item.completed ? 'line-through' : 'none',
            }}>
              {item.label}
            </div>
            <div className="text-sm text-muted" style={{ marginTop: 2 }}>
              {item.description}
            </div>
            {item.dueDescription && (
              <div className="text-sm" style={{ marginTop: 4, color: 'var(--color-warning)' }}>
                {item.dueDescription}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
