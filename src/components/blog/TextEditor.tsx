
import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface TextEditorProps {
  content: string;
  onChange: (value: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ content, onChange }) => {
  const editorRef = useRef<any>(null);

  return (
    <div className="w-full border rounded-lg overflow-hidden">
      <Editor
        apiKey="no-api-key" // You can get a free API key from TinyMCE
        onInit={(evt, editor) => editorRef.current = editor}
        initialValue={content}
        onEditorChange={(newContent) => onChange(newContent)}
        init={{
          height: 350,
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic underline | alignleft aligncenter ' +
            'alignright | bullist numlist | ' +
            'removeformat | help',
          content_style: 'body { font-family:Inter,Helvetica,Arial,sans-serif; font-size:16px }',
          branding: false,
          statusbar: false,
          skin: 'oxide',
          browser_spellcheck: true,
          contextmenu: false,
          elementpath: false,
          promotion: false,
          setup: (editor) => {
            editor.ui.registry.addButton('heading', {
              text: 'Heading',
              onAction: () => {
                editor.execCommand('formatBlock', false, 'h2');
              }
            });
          }
        }}
      />
    </div>
  );
};

export default TextEditor;
