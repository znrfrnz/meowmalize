interface UnfTableProps {
  columns: string[]
  rows: Record<string, string>[]
  violatingColumns?: string[]
}

export function UnfTable({ columns, rows, violatingColumns = [] }: UnfTableProps) {
  const violatingSet = new Set(violatingColumns.map((v) => v.toLowerCase()))

  return (
    <div className="overflow-x-auto rounded-xl border border-[#27272a]">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            {columns.map((col) => {
              const isViolating = violatingSet.has(col.toLowerCase())
              return (
                <th
                  key={col}
                  className={`px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide border-b border-[#27272a] ${
                    isViolating
                      ? 'bg-[#ef4444]/15 border-b-2 border-[#ef4444] text-[#ef4444]'
                      : 'bg-[#27272a] text-[#71717a]'
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
            <tr key={ri} className="border-b border-[#27272a] last:border-0">
              {columns.map((col) => {
                const isViolating = violatingSet.has(col.toLowerCase())
                return (
                  <td
                    key={col}
                    className={`px-4 py-2 ${
                      isViolating ? 'bg-[#ef4444]/10 text-[#fca5a5]' : 'text-[#a1a1aa]'
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
