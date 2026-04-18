interface UnfTableProps {
  columns: string[]
  rows: Record<string, string>[]
  violatingColumns?: string[]
}

export function UnfTable({ columns, rows, violatingColumns = [] }: UnfTableProps) {
  const violatingSet = new Set(violatingColumns.map((v) => v.toLowerCase()))

  return (
    <div className="overflow-x-auto rounded-2xl border border-[#232326]">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            {columns.map((col) => {
              const isViolating = violatingSet.has(col.toLowerCase())
              return (
                <th
                  key={col}
                  className={`px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide border-b border-[#232326] ${
                    isViolating
                      ? 'bg-[#f87171]/15 border-b-2 border-[#f87171] text-[#f87171]'
                      : 'bg-[#141414] text-[#71717a]'
                  }`}
                >
                  {col}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="border-b border-[#232326] last:border-0">
              {columns.map((col) => {
                const isViolating = violatingSet.has(col.toLowerCase())
                return (
                  <td
                    key={col}
                    className={`px-4 py-2 ${
                      isViolating ? 'bg-[#f87171]/10 text-[#fca5a5]' : 'text-[#a1a1aa]'
                    }`}
                  >
                    {row[col] ?? ''}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
