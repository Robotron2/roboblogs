import '../styles/editor.css';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { marked } from 'marked';
import { useEffect, useCallback } from 'react';
import type { Editor } from '@tiptap/react';

interface RichEditorProps {
  content: string;
  onChange: (html: string) => void;
  onEditorReady?: (editor: Editor) => void;
  placeholder?: string;
}

// Lightweight check for markdown patterns
const MARKDOWN_PATTERNS = [
  /^#{1,3}\s/m,         // headings
  /\*\*.+?\*\*/,        // bold
  /(?<!\*)\*(?!\*).+?(?<!\*)\*(?!\*)/,  // italic
  /^[-*]\s/m,           // unordered list
  /^\d+\.\s/m,          // ordered list
  /```[\s\S]*?```/,     // code blocks
  /^>\s/m,              // blockquotes
];

function looksLikeMarkdown(text: string): boolean {
  return MARKDOWN_PATTERNS.some((pattern) => pattern.test(text));
}

export default function RichEditor({
  content,
  onChange,
  onEditorReady,
  placeholder = 'Tell your story...',
}: RichEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: { HTMLAttributes: { class: 'editor-code-block' } },
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'rich-editor-content',
        'data-placeholder': placeholder,
      },
      handlePaste: (_view, event) => {
        const clipboardText = event.clipboardData?.getData('text/plain');

        // Only intercept plain text pastes that look like markdown
        if (!clipboardText || !looksLikeMarkdown(clipboardText)) {
          return false; // Let TipTap handle it normally
        }

        try {
          const html = marked.parse(clipboardText, { async: false }) as string;
          if (html && typeof html === 'string') {
            editor?.chain().focus().insertContent(html).run();
            return true; // We handled it
          }
        } catch (err) {
          console.error('Markdown paste parsing failed, falling back to default:', err);
        }

        return false; // Fallback to default paste
      },
    },
    onUpdate: ({ editor: e }) => {
      onChange(e.getHTML());
    },
  });

  // Expose editor to parent for toolbar control
  useEffect(() => {
    if (editor && onEditorReady) {
      onEditorReady(editor);
    }
  }, [editor, onEditorReady]);

  // Sync external content changes (draft restore, edit mode load)
  const syncContent = useCallback(
    (newContent: string) => {
      if (!editor) return;
      // Only update if the content actually differs from what's in the editor
      // This prevents cursor jumps during normal typing
      const currentHtml = editor.getHTML();
      if (newContent !== currentHtml) {
        editor.commands.setContent(newContent, { emitUpdate: false });
      }
    },
    [editor]
  );

  useEffect(() => {
    syncContent(content);
  }, [content, syncContent]);

  if (!editor) return null;

  return <EditorContent editor={editor} />;
}
