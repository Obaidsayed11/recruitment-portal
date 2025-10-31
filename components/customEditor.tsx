// "use client"; // only in App Router
// import { Controller, Control } from "react-hook-form";
// import { CKEditor } from "@ckeditor/ckeditor5-react";
// import {
//   ClassicEditor,
//   Essentials,
//   Paragraph,
//   Bold,
//   Italic,
//   Link,
//   List,
//   Alignment,
//   Undo,
//   FontSize,
//   Heading, // Add this import
// } from "ckeditor5";

// import "ckeditor5/ckeditor5.css";

// interface CustomEditorProps {
//   control: Control<any>;
//   name: string;
// }

// function CustomEditor({ control, name }: CustomEditorProps) {
//   return (
//     <Controller
//       name={name}
//       control={control}
//       render={({ field }) => {
//         let editorInstance = null;
//         return (
//           <CKEditor
//             editor={ClassicEditor}
//             data={field.value || ""}
//             onReady={(editor) => {
//               editorInstance = editor;

//               if (field.value) {
//                 field.onChange(field.value);
//               }

//               if (!field.value) {
//                 editor.focus();
//               }
//             }}
//             onChange={(event, editor) => {
//               const data = editor.getData();
//               field.onChange(data);
//             }}
//             onBlur={(event, editor) => {
//               field.onBlur();
//             }}
//             config={{
//               licenseKey: "GPL",
//               plugins: [
//                 Essentials,
//                 Paragraph,
//                 Heading, // Add Heading plugin
//                 Bold,
//                 Italic,
//                 Link,
//                 List,
//                 Alignment,
//                 Undo,
//                 FontSize,
//               ],
//               toolbar: [
//                 "undo",
//                 "|",
//                 "heading", // Add heading dropdown
//                 "bold",
//                 "italic",
//                 "strikethrough",
//                 "underline",
//                 "fontFamily",
//                 "fontSize",
//                 "fontColor",
//                 "fontBackgroundColor",
//                 "|",
//                 "link",
//                 "blockQuote",
//                 "bulletedList",
//                 "numberedList",
//                 "todoList",
//                 "insertTable",
//                 "imageUpload",
//                 "mediaEmbed",
//                 "alignment",
//                 "indent",
//                 "horizontalLine",
//                 "specialCharacters",
//                 "highlight",
//                 "removeFormat",
//                 "selectAll",
//                 "findAndReplace",
//                 "|",
//                 "codeBlock",
//                 "subscript",
//                 "superscript",
//                 "htmlEmbed",
//                 "pageBreak",
//                 "sourceEditing",
//               ],
//               // Configure heading options
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
//                   {
//                     model: "heading4",
//                     view: "h4",
//                     title: "Heading 4",
//                     class: "ck-heading_heading4",
//                   },
//                   {
//                     model: "heading5",
//                     view: "h5",
//                     title: "Heading 5",
//                     class: "ck-heading_heading5",
//                   },
//                   {
//                     model: "heading6",
//                     view: "h6",
//                     title: "Heading 6",
//                     class: "ck-heading_heading6",
//                   },
//                 ],
//               },
//               simpleUpload: {
//                 uploadUrl: "/api/upload",
//                 headers: {
//                   Authorization: "Bearer <YOUR-TOKEN>",
//                 },
//               },
//               image: {
//                 toolbar: [
//                   "imageTextAlternative",
//                   "imageStyle:full",
//                   "imageStyle:side",
//                 ],
//               },
//               table: {
//                 contentToolbar: [
//                   "tableColumn",
//                   "tableRow",
//                   "mergeTableCells",
//                   "tableProperties",
//                   "tableCellProperties",
//                 ],
//               },
//               wordCount: {
//                 onUpdate: (count) => {
//                   console.log("Word Count: ", count);
//                 },
//               },
//             }}
//           />
//         );
//       }}
//     />
//   );
// }

// export default CustomEditor;
