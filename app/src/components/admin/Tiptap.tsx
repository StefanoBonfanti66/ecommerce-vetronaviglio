import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export default function Tiptap({ content, onChange }: { content: string, onChange: (html: string) => void }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="border border-aluminum/40">
      <div className="flex gap-2 p-2 border-b border-aluminum/20 bg-aluminum/5">
        <button onClick={() => editor.chain().focus().toggleBold().run()} className="p-1 text-[9px] uppercase tracking-widest hover:bg-aluminum/20">B</button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className="p-1 text-[9px] uppercase tracking-widest hover:bg-aluminum/20">I</button>
      </div>
      <EditorContent editor={editor} className="p-4 prose prose-sm max-w-none font-sans text-sm" />
    </div>
  );
}
