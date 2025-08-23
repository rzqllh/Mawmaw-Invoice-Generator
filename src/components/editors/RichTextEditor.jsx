import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

function RichTextEditor({ value, onChange }) {
  // Get your free API key from tiny.cloud
  const apiKey = 'qsowa2oxzv8qij7v5muqjx3obtyzvj9o30w7juw5yzlb5qup'; 

  return (
    <Editor
      apiKey={apiKey}
      value={value}
      onEditorChange={(content) => onChange(content)}
      init={{
        height: 250,
        menubar: false,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
          'preview', 'anchor', 'searchreplace', 'visualblocks', 'code',
          'fullscreen', 'insertdatetime', 'media', 'table', 'help', 'wordcount'
        ],
        toolbar: 'undo redo | blocks | ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | help',
        content_style: 'body { font-family:Inter,Helvetica,Arial,sans-serif; font-size:14px }'
      }}
    />
  );
}

export default RichTextEditor;