"use client";
import dynamic from 'next/dynamic';
import { Control } from "react-hook-form";

const CustomEditor = dynamic(() => import('./customEditor'), {
  ssr: false,
  loading: () => (
    <div className="border rounded-md p-4 min-h-[200px] bg-gray-50 flex items-center justify-center">
      <p className="text-gray-500">Loading editor...</p>
    </div>
  ),
});

interface CustomEditorWrapperProps {
  control: Control<any>;
  name: string;
}

export default function CustomEditorWrapper({ control, name }: CustomEditorWrapperProps) {
  return <CustomEditor control={control} name={name} />;
}