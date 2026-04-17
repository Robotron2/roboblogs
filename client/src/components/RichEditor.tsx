import '../styles/editor.css';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { all, createLowlight } from 'lowlight';
import { marked } from 'marked';
import { useEffect, useCallback } from 'react';
import type { Editor } from '@tiptap/react';

interface RichEditorProps {
  content: string;
  onChange: (html: string) => void;
  onEditorReady?: (editor: Editor) => void;
  placeholder?: string;
}

// Initialize lowlight with all languages
const lowlight = createLowlight(all);

// Simplified markdown patterns for basic detection (avoiding lookbehinds to fix parser issues)
const MARKDOWN_PATTERNS = [
  /^#+\s/m,             // headings
  /\*\*.*\*\*/,         // bold
  /__.*__/,             // bold alternate
  /\*.*\*/,             // italic
  /_.*_/,               // italic alternate
  /^[-*]\s/m,           // unordered list
  /^\d+\.\s/m,          // ordered list
  /```/,                // code blocks
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
        codeBlock: false, // Disable default code block
      }),
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: 'javascript',
        HTMLAttributes: {
          class: 'editor-code-block hljs',
        },
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

        if (!clipboardText || !looksLikeMarkdown(clipboardText)) {
          return false;
        }

        try {
          const html = marked.parse(clipboardText, { async: false }) as string;
          if (html && typeof html === 'string') {
            editor?.chain().focus().insertContent(html).run();
            return true;
          }
        } catch (err) {
          console.error('Markdown paste parsing failed:', err);
        }

        return false;
      },
    },
    onUpdate: ({ editor: e }) => {
      onChange(e.getHTML());
    },
  });

  useEffect(() => {
    if (editor && onEditorReady) {
      onEditorReady(editor);
    }
  }, [editor, onEditorReady]);

  const syncContent = useCallback(
    (newContent: string) => {
      if (!editor) return;
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
