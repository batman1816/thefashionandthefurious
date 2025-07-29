import { useState } from 'react';
import { Bold, Italic, List } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor = ({ value, onChange, placeholder, className = "" }: RichTextEditorProps) => {
  const [text, setText] = useState(value);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setText(newValue);
    onChange(newValue);
  };

  const insertFormatting = (format: string) => {
    const textarea = document.querySelector(`textarea[data-rich-editor="true"]`) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = text.substring(start, end);
    
    let newText = '';
    let newCursorPos = start;

    switch (format) {
      case 'bold':
        if (selectedText) {
          newText = text.substring(0, start) + `**${selectedText}**` + text.substring(end);
          newCursorPos = start + selectedText.length + 4;
        } else {
          newText = text.substring(0, start) + '**bold text**' + text.substring(end);
          newCursorPos = start + 2;
        }
        break;
      case 'italic':
        if (selectedText) {
          newText = text.substring(0, start) + `*${selectedText}*` + text.substring(end);
          newCursorPos = start + selectedText.length + 2;
        } else {
          newText = text.substring(0, start) + '*italic text*' + text.substring(end);
          newCursorPos = start + 1;
        }
        break;
      case 'bullet':
        const beforeCursor = text.substring(0, start);
        const afterCursor = text.substring(end);
        const isNewLine = beforeCursor === '' || beforeCursor.endsWith('\n');
        const bulletPoint = isNewLine ? '• ' : '\n• ';
        newText = beforeCursor + bulletPoint + afterCursor;
        newCursorPos = start + bulletPoint.length;
        break;
      default:
        return;
    }

    setText(newText);
    onChange(newText);

    // Set cursor position after state update
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Formatting Toolbar */}
      <div className="flex gap-2 p-2 bg-zinc-700 rounded-t border-b border-zinc-600">
        <button
          type="button"
          onClick={() => insertFormatting('bold')}
          className="p-2 text-gray-300 hover:text-white hover:bg-zinc-600 rounded flex items-center gap-1 text-sm"
          title="Bold (surround text with **)"
        >
          <Bold size={16} />
          <span>Bold</span>
        </button>
        <button
          type="button"
          onClick={() => insertFormatting('italic')}
          className="p-2 text-gray-300 hover:text-white hover:bg-zinc-600 rounded flex items-center gap-1 text-sm"
          title="Italic (surround text with *)"
        >
          <Italic size={16} />
          <span>Italic</span>
        </button>
        <button
          type="button"
          onClick={() => insertFormatting('bullet')}
          className="p-2 text-gray-300 hover:text-white hover:bg-zinc-600 rounded flex items-center gap-1 text-sm"
          title="Bullet point"
        >
          <List size={16} />
          <span>Bullet</span>
        </button>
      </div>

      {/* Textarea */}
      <textarea
        data-rich-editor="true"
        value={text}
        onChange={handleTextChange}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-white rounded-b bg-zinc-900 border-t-0 h-32 resize-vertical"
        style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
      />

      {/* Format Help */}
      <div className="text-xs text-gray-400 space-y-1">
        <p><strong>Formatting tips:</strong></p>
        <p>• **bold text** for <strong>bold</strong></p>
        <p>• *italic text* for <em>italic</em></p>
        <p>• Start lines with • for bullet points</p>
      </div>
    </div>
  );
};

export default RichTextEditor;