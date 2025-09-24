
// import React from 'react';
// import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, ListOrdered, List } from 'lucide-react';
// import { Textarea } from "@/components/ui/textarea";

// interface TextEditorProps {
//   content: string;
//   onChange: (value: string) => void;
// }

// const TextEditor: React.FC<TextEditorProps> = ({ content, onChange }) => {
//   const handleFormat = (command: string, value?: string) => {
//     document.execCommand(command, false, value);
//     const formattedContent = document.querySelector('[contenteditable="true"]')?.innerHTML || '';
//     onChange(formattedContent);
//   };

//   return (
//     <div className="w-full border rounded-lg overflow-hidden">
//       {/* Formatting Toolbar */}
//       <div className="bg-white border-b p-2 flex items-center gap-1 flex-wrap">
//         <button
//           onClick={() => handleFormat('bold')}
//           className="p-2 hover:bg-gray-100 rounded"
//           title="Bold"
//         >
//           <Bold size={18} />
//         </button>
//         <button
//           onClick={() => handleFormat('italic')}
//           className="p-2 hover:bg-gray-100 rounded"
//           title="Italic"
//         >
//           <Italic size={18} />
//         </button>
//         <button
//           onClick={() => handleFormat('underline')}
//           className="p-2 hover:bg-gray-100 rounded"
//           title="Underline"
//         >
//           <Underline size={18} />
//         </button>
//         <div className="w-px h-6 bg-gray-200 mx-1" />
//         <button
//           onClick={() => handleFormat('justifyLeft')}
//           className="p-2 hover:bg-gray-100 rounded"
//           title="Align Left"
//         >
//           <AlignLeft size={18} />
//         </button>
//         <button
//           onClick={() => handleFormat('justifyCenter')}
//           className="p-2 hover:bg-gray-100 rounded"
//           title="Align Center"
//         >
//           <AlignCenter size={18} />
//         </button>
//         <button
//           onClick={() => handleFormat('justifyRight')}
//           className="p-2 hover:bg-gray-100 rounded"
//           title="Align Right"
//         >
//           <AlignRight size={18} />
//         </button>
//         <div className="w-px h-6 bg-gray-200 mx-1" />
//         <button
//           onClick={() => handleFormat('insertOrderedList')}
//           className="p-2 hover:bg-gray-100 rounded"
//           title="Ordered List"
//         >
//           <ListOrdered size={18} />
//         </button>
//         <button
//           onClick={() => handleFormat('insertUnorderedList')}
//           className="p-2 hover:bg-gray-100 rounded"
//           title="Unordered List"
//         >
//           <List size={18} />
//         </button>
//         <button
//           onClick={() => handleFormat('formatBlock', '<h2>')}
//           className="p-2 hover:bg-gray-100 rounded"
//           title="Heading"
//         >
//           <Bold size={18} className="font-bold" />
//         </button>
//       </div>

//       {/* Editable Content Area */}
//       <div
//         contentEditable
//         dangerouslySetInnerHTML={{ __html: content }}
//         onInput={(e) => onChange(e.currentTarget.innerHTML)}
//         className="min-h-[200px] p-4 focus:outline-none"
//       />
//     </div>
//   );
// };

// export default TextEditor;



import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface TextEditorProps {
  content: string;
  onChange: (value: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ content, onChange }) => {
  return (
    <div className="w-full border rounded-lg overflow-hidden">
      <Editor
        apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
        value={content}
        onEditorChange={(value: string) => onChange(value)}
        init={{
          height: 200,
          menubar: false,
          plugins: [
            'lists', 'link', 'image', 'charmap', 'preview',
            'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'help', 'wordcount'
          ],
          toolbar: 'bold italic underline | alignleft aligncenter alignright | bullist numlist | link',
          content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 14px }',
          skin: 'oxide',
          content_css: 'default'
        }}
      />
    </div>
  );
};

export default TextEditor;