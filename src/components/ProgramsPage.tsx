import { useState, useMemo } from 'react';
import { Search, GitCompare, X, ArrowRight, Info, Check, Clock, Layers } from 'lucide-react';
import { programs, programCategories } from '../data';
import { useNav } from '../nav';
import { NeuralBackground } from './Visuals';
import { Reveal } from './Reveal';
import type { Program } from '../types';

export function ProgramsPage() {
  const { navigate } = useNav();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  const filtered = useMemo(() => {
    return programs.filter((p) => {
      const matchesCategory = category === 'All' || p.category === category;
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.purpose.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [search, category]);

  const comparePrograms = compareIds
    .map((id) => programs.find((p) => p.id === id))
    .filter(Boolean) as Program[];

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  return (
    <div className="animate-fade-in">
      <section className="relative overflow-hidden border-b border-midnight-200/40">
        <NeuralBackground />
        <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-12 sm:px-6 sm:pt-20">
          <span className="section-label mb-4">
            <Layers className="h-3 w-3" />
            Program Explorer
          </span>
          <h1 className="font-display text-4xl font-bold text-midnight-900 sm:text-5xl text-balance">
            Explore <span className="text-forest-700">Brain Training Programs</span>
          </h1>
          <p className="mt-4 max-w-2xl text-midnight-600 text-lg">
            Browse illustrative neurofeedback programs, filter by category, search by
            keyword, and compare up to three side-by-side.
          </p>
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-amber-300/40 bg-amber-50 px-4 py-3 max-w-2xl">
            <Info className="h-4 w-4 text-amber-600 shrink-0" />
            <p className="text-xs text-amber-800">
              All programs are illustrative placeholders — not real offerings. Details
              shown are for demonstration purposes only.
            </p>
          </div>
        </div>
      </section>

      {/* Controls */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pt-8 pb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-midnight-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search programs by name, purpose, or keyword..."
              className="input-field pl-10"
              aria-label="Search programs"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {programCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  category === cat
                    ? 'bg-forest-600 text-ivory-50'
                    : 'bg-white border border-midnight-200 text-midnight-600 hover:border-forest-400 hover:text-forest-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Compare bar */}
        {compareIds.length > 0 && (
          <div className="mt-4 flex items-center justify-between rounded-lg border border-forest-300 bg-forest-50 px-4 py-3">
            <span className="text-sm text-forest-800">
              {compareIds.length} program{compareIds.length > 1 ? 's' : ''} selected for comparison
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCompare(true)}
                disabled={compareIds.length < 2}
                className="flex items-center gap-1.5 rounded-lg bg-forest-600 px-4 py-2 text-sm font-semibold text-ivory-50 transition-colors hover:bg-forest-500 disabled:opacity-40"
              >
                <GitCompare className="h-4 w-4" />
                Compare ({compareIds.length})
              </button>
              <button
                onClick={() => setCompareIds([])}
                className="rounded-lg p-2 text-midnight-500 hover:bg-ivory-200 hover:text-midnight-900"
                aria-label="Clear comparison selection"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Programs grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-20">
        {filtered.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-midnight-600">No programs match your search. Try different keywords or filters.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((program, i) => {
              const isSelected = compareIds.includes(program.id);
              const isMaxed = compareIds.length >= 3 && !isSelected;
              return (
                <Reveal key={program.id} delay={i * 80}>
                <div
                  key={program.id}
                  className={`card card-hover p-7 flex flex-col ${
                    isSelected ? 'border-forest-500 ring-1 ring-forest-500/30' : ''
                  }`}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span className="rounded-full bg-forest-50 px-3 py-1 text-xs font-medium text-forest-700 border border-forest-200">
                      {program.category}
                    </span>
                    <span className="text-xs text-midnight-400">Illustrative</span>
                  </div>

                  <h3 className="font-display text-xl font-bold text-midnight-900 mb-3">
                    {program.name}
                  </h3>
                  <p className="text-sm text-midnight-600 mb-5 leading-relaxed flex-1">
                    {program.description}
                  </p>

                  <div className="space-y-2 mb-5 border-t border-midnight-100 pt-4">
                    <div className="flex items-center gap-2 text-xs text-midnight-500">
                      <span className="font-semibold text-midnight-700 w-16 shrink-0">Purpose:</span>
                      <span>{program.purpose}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-midnight-500">
                      <Clock className="h-3.5 w-3.5 text-forest-600" />
                      <span className="font-semibold text-midnight-700 w-14 shrink-0">Duration:</span>
                      <span>{program.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-midnight-500">
                      <Layers className="h-3.5 w-3.5 text-forest-600" />
                      <span className="font-semibold text-midnight-700 w-14 shrink-0">Format:</span>
                      <span>{program.format}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => navigate('enquiry')}
                      className="flex-1 rounded-lg bg-midnight-900 px-4 py-2.5 text-sm font-semibold text-ivory-100 transition-colors hover:bg-forest-600 flex items-center justify-center gap-1.5"
                    >
                      Enquire
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          try {
                            localStorage.setItem('biocybernaut_enrolment_selected', program.id);
                          } catch {
                            // No-op
                          }
                          navigate('enrol');
                        }}
                        className="flex-1 rounded-lg bg-forest-600 px-4 py-2.5 text-sm font-semibold text-ivory-50 transition-colors hover:bg-forest-500 flex items-center justify-center gap-1.5"
                      >
                        Enrol
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => toggleCompare(program.id)}
                        disabled={isMaxed}
                        className={`flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
                          isSelected
                            ? 'bg-forest-600 text-ivory-50'
                            : 'border border-midnight-200 text-midnight-600 hover:border-forest-500 hover:text-forest-700 disabled:opacity-40 disabled:cursor-not-allowed'
                        }`}
                        aria-label={isSelected ? 'Remove from comparison' : 'Add to comparison'}
                      >
                        {isSelected ? (
                          <>
                            <Check className="h-4 w-4" />
                            Added
                          </>
                        ) : (
                          <>
                            <GitCompare className="h-4 w-4" />
                            Compare
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                </Reveal>
              );
            })}
          </div>
        )}
      </section>

      {/* Comparison modal */}
      {showCompare && comparePrograms.length >= 2 && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-midnight-900/80 backdrop-blur-sm p-4"
          onClick={() => setShowCompare(false)}
        >
          <div
            className="w-full max-w-5xl max-h-[85vh] overflow-auto scrollbar-thin rounded-2xl border border-midnight-200 bg-white p-6 animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold text-midnight-900 flex items-center gap-2">
                <GitCompare className="h-6 w-6 text-forest-600" />
                Program Comparison
              </h2>
              <button
                onClick={() => setShowCompare(false)}
                className="rounded-lg p-2 text-midnight-400 hover:bg-ivory-200 hover:text-midnight-900"
                aria-label="Close comparison"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-midnight-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-midnight-500">Feature</th>
                    {comparePrograms.map((p) => (
                      <th key={p.id} className="text-left py-3 px-4 text-sm font-bold text-midnight-900">
                        {p.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: 'Category', key: 'category' as const },
                    { label: 'Purpose', key: 'purpose' as const },
                    { label: 'Duration', key: 'duration' as const },
                    { label: 'Format', key: 'format' as const },
                    { label: 'Description', key: 'description' as const },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-midnight-100">
                      <td className="py-3 px-4 text-sm font-semibold text-forest-700">{row.label}</td>
                      {comparePrograms.map((p) => (
                        <td key={p.id} className="py-3 px-4 text-sm text-midnight-700">
                          {p[row.key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-end">
              <button onClick={() => setShowCompare(false)} className="btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
