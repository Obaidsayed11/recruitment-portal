"use client"; // only in App Router
import { Controller, Control } from "react-hook-form";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  Essentials,
  Paragraph,
  Bold,
  Italic,
  Link,
  List,
  Alignment,
  Undo,
  FontSize,
  Heading, // Add this import
  WordCount
} from "ckeditor5";

import "ckeditor5/ckeditor5.css";

interface CustomEditorProps {
  control: Control<any>;
  name: string;
}

function CustomEditor({ control, name }: CustomEditorProps) {
  return (
    <Controller

      name={name}
      control={control}
      render={({ field }) => {
        let editorInstance = null;
        return (
          <CKEditor
          
            editor={ClassicEditor}
            data={field.value || ""}
            onReady={(editor) => {
              editorInstance = editor;

              if (field.value) {
                field.onChange(field.value);
              }

              if (!field.value) {
                editor.focus();
              }
            }}
            onChange={(event, editor) => {
              const data = editor.getData();
              field.onChange(data);
            }}
            onBlur={(event, editor) => {
              field.onBlur();
            }}
            config={{
              licenseKey: "GPL",
              plugins: [
                Essentials,
                Paragraph,
                Heading, // Add Heading plugin
                Bold,
                Italic,
                Link,
                List,
                Alignment,
                Undo,
                FontSize,
                WordCount, // ✅ Add here
              ],
              toolbar: [
                "undo",
                "|",
                "heading", // Add heading dropdown
                "bold",
                "italic",
                "strikethrough",
                "underline",
                "fontFamily",
                "fontSize",
                "fontColor",
                "fontBackgroundColor",
                "|",
                "link",
                "blockQuote",
                "bulletedList",
                "numberedList",
                "todoList",
                "insertTable",
                "imageUpload",
                "mediaEmbed",
                "alignment",
                "indent",
                "horizontalLine",
                "specialCharacters",
                "highlight",
                "removeFormat",
                "selectAll",
                "findAndReplace",
                "|",
                "codeBlock",
                "subscript",
                "superscript",
                "htmlEmbed",
                "pageBreak",
                "sourceEditing",
              ],
              // Configure heading options
              heading: {
                options: [
                  {
                    model: "paragraph",
                    title: "Paragraph",
                    class: "ck-heading_paragraph",
                  },
                  {
                    model: "heading1",
                    view: "h1",
                    title: "Heading 1",
                    class: "ck-heading_heading1",
                  },
                  {
                    model: "heading2",
                    view: "h2",
                    title: "Heading 2",
                    class: "ck-heading_heading2",
                  },
                  {
                    model: "heading3",
                    view: "h3",
                    title: "Heading 3",
                    class: "ck-heading_heading3",
                  },
                  {
                    model: "heading4",
                    view: "h4",
                    title: "Heading 4",
                    class: "ck-heading_heading4",
                  },
                  {
                    model: "heading5",
                    view: "h5",
                    title: "Heading 5",
                    class: "ck-heading_heading5",
                  },
                  {
                    model: "heading6",
                    view: "h6",
                    title: "Heading 6",
                    class: "ck-heading_heading6",
                  },
                ],
              },
              simpleUpload: {
                uploadUrl: "/api/upload",
                headers: {
                  Authorization: "Bearer <YOUR-TOKEN>",
                },
              },
              image: {
                toolbar: [
                  "imageTextAlternative",
                  "imageStyle:full",
                  "imageStyle:side",
                ],
              },
              table: {
                contentToolbar: [
                  "tableColumn",
                  "tableRow",
                  "mergeTableCells",
                  "tableProperties",
                  "tableCellProperties",
                ],
              },
              wordCount: {
                onUpdate: (count: any) => {
                  console.log("Word Count: ", count);
                },
              },
            }as any}
          />
        );
      }}
    />
  );
}

export default CustomEditor;

// "use client";
// import { useRef } from "react";
// import { Controller, Control } from "react-hook-form";

// interface CustomEditorProps {
//   control: Control<any>;
//   name: string;
// }

// function CustomEditor({ control, name }: CustomEditorProps) {
//   const editorRef = useRef<any>(null);

//   return (
//     <Controller
//       name={name}
//       control={control}
//       render={({ field }) => {
//         // Import CKEditor dynamically to avoid SSR issues
//         const { CKEditor } = require("@ckeditor/ckeditor5-react");
//         const { ClassicEditor } = require("ckeditor5");
        
//         // Dynamically import CSS
//         require("ckeditor5/ckeditor5.css");

//         return (
//           <CKEditor
//             editor={ClassicEditor}
//             data={field.value || ""}
//             onReady={(editor: any) => {
//               editorRef.current = editor;
//               if (!field.value) {
//                 editor.focus();
//               }
//             }}
//             onChange={(event: any, editor: any) => {
//               const data = editor.getData();
//               field.onChange(data);
//             }}
//             onBlur={() => {
//               field.onBlur();
//             }}
//             config={{
//               licenseKey: "GPL",
//               toolbar: {
//                 items: [
//                   "undo",
//                   "redo",
//                   "|",
//                   "heading",
//                   "|",
//                   "bold",
//                   "italic",
//                   "|",
//                   "link",
//                   "bulletedList",
//                   "numberedList",
//                   "|",
//                   "blockQuote",
//                   "insertTable",
//                 ],
//               },
//               heading: {
//                 options: [
//                   {
//                     model: "paragraph",
//                     title: "Paragraph",
//                     class: "ck-heading_paragraph",
//                   },
//                   {
//                     model: "heading1",
//                     view: "h1",
//                     title: "Heading 1",
//                     class: "ck-heading_heading1",
//                   },
//                   {
//                     model: "heading2",
//                     view: "h2",
//                     title: "Heading 2",
//                     class: "ck-heading_heading2",
//                   },
//                   {
//                     model: "heading3",
//                     view: "h3",
//                     title: "Heading 3",
//                     class: "ck-heading_heading3",
//                   },
//                 ],
//               },
//             }}
//           />
//         );
//       }}
//     />
//   );
// }

// export default CustomEditor;
