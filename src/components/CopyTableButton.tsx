import { useState } from 'react';

type CopyTableButtonProps = {
  headers: string[];
  rows: Array<Array<string | number | boolean | null | undefined>>;
  label?: string;
};

const normalizeCell = (value: string | number | boolean | null | undefined) => {
  if (value === null || value === undefined) return '';
  const text = String(value);
  return text.replace(/\t/g, ' ').replace(/\r?\n/g, ' ');
};

const buildClipboardText = (headers: string[], rows: CopyTableButtonProps['rows']) => {
  const headerLine = headers.join('\t');
  const rowLines = rows.map((row) => row.map(normalizeCell).join('\t'));
  return [headerLine, ...rowLines].join('\n');
};

const CopyTableButton = ({ headers, rows, label = 'Copiar tabla' }: CopyTableButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = buildClipboardText(headers, rows);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('No se pudo copiar la tabla', err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-gray-50"
    >
      <span className="material-symbols-outlined text-sm">content_copy</span>
      {copied ? 'Copiado' : label}
    </button>
  );
};

export default CopyTableButton;
