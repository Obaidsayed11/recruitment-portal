"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import apiClient from "@/lib/axiosInterceptor";
import { toast } from "sonner";
import Link from "next/link";
import DynamicBreadcrumb from "@/components/Navbar/BreadCrumb";
import Button from "@/components/Others/Button";
import { Pencil, Trash2, Save, X } from "lucide-react";
import DOMPurify from "isomorphic-dompurify";

interface Note {
  id: string;
  note: string;
  createdAt?: string;
  User?: {
    fullName?: string;
  };
}

const ApplicationDetails = () => {
  const params = useParams() as { companyId: string; id: string };
  const { companyId, id: applicationId } = params;

  const [application, setApplication] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editedNoteText, setEditedNoteText] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const methods = useForm();

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get(
          `/application?companyId=${companyId}`
        );
        const applications = response.data?.applications || [];
        const selected = applications.find((a: any) => a.id === applicationId);

        if (selected) {
          setApplication(selected);
          // Fetch notes
          await fetchNotes();
        } else {
          toast.error("Application not found");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch application details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplicationDetails();
  }, [companyId, applicationId]);

  // fetch notes

  const fetchNotes = async () => {
    try {
      const response = await apiClient.get(
        `/application/note/${applicationId}`
      );
      const fetchedNotes = response?.data?.data || [];
      console.log(fetchedNotes, "Fetched Notes");
      setNotes(fetchedNotes);
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    }
  };

  // adinng notes

  const handleAddNote = async () => {
    if (!newNote.trim()) {
      toast.error("Note cannot be empty");
      return;
    }

    setIsAddingNote(true);
    try {
      const response = await apiClient.post(
        `/application/note/${applicationId}`,
        {
          note: newNote,
        }
      );
      toast.success("Note added successfully");
      setNewNote("");
      await fetchNotes();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add note");
    } finally {
      setIsAddingNote(false);
    }
  };

  // editing notesssss
  const handleEditNote = (note: Note) => {
    console.log(note.id);
    setEditingNoteId(note.id);
    setEditedNoteText(note?.note);
    fetchNotes();
  };
  
  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setEditedNoteText("");
  };
  // updating notesss
  const handleUpdateNote = async (noteId: string) => {
    if (!editedNoteText.trim()) {
      toast.error("Note cannot be empty");
      return;
    }

    setIsUpdating(true);
    try {
      console.log(noteId, "noteIdddd");
      await apiClient.put(`/application/note/${noteId}`, {
        note: editedNoteText,
      });
      toast.success("Note updated successfully");
      setEditingNoteId(null);
      setEditedNoteText("");
      await fetchNotes();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update note");
    } finally {
      setIsUpdating(false);
    }
  };

  // deleting notesss
  const handleDeleteNote = async (noteId: string) => {
    if (!confirm("Are you sure you want to delete this note?")) return;

    try {
      await apiClient.delete(`/application/note/${noteId}`);
      toast.success("Note deleted successfully");
      await fetchNotes();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete note");
    }
  };

  const getResumeUrl = () => {
    if (!application?.resumeUrl) return null;
    return application.resumeUrl.startsWith("http")
      ? application.resumeUrl
      : `${process.env.NEXT_PUBLIC_API_URL}${application.resumeUrl}`;
  };

  console.log(notes, "noteeeeeeeeee");

  return (
    <>
      <DynamicBreadcrumb
        links={[
          { label: "Companies", href: "/dashboard/companies" },
          {
            label: "Applications",
            href: `/dashboard/companies/${companyId}?tab=application`,
          },
          { label: "Application Details" },
        ]}
      />

      <FormProvider {...methods}>
        <div className="flex flex-col h-[calc(100vh-105px)] overflow-hidden gap-5">
          {/* Header */}
          <div className="flex justify-between items-center bg-white border border-gray-200 rounded-xl p-4">
            <h2 className="text-xl font-bold text-gray-800">
              Application Details
            </h2>
            <Link href={`/dashboard/companies/${companyId}?tab=application`}>
              <Button variant="outline" className="text-sm">
                Back to List
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="text-center py-20 text-gray-500">
              Loading application data...
            </div>
          ) : !application ? (
            <div className="text-center py-20 text-gray-500">
              No application found.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 overflow-hidden">
              {/* LEFT: Resume Preview */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 overflow-hidden flex flex-col">
                <h3 className="text-lg font-semibold mb-3 text-gray-700">
                  Resume Preview
                </h3>
                <div className="flex-1 overflow-hidden rounded-lg border border-gray-300">
                  {getResumeUrl() ? (
                    <iframe
                      src={getResumeUrl()!}
                      className="w-full h-full"
                      title="Resume Preview"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      No resume available
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT: Details + Notes */}
              <div className="flex flex-col gap-5 overflow-hidden">
                {/* Application Details Section */}
                <section className="bg-white border border-gray-200 rounded-xl p-4">
                  <h3 className="text-lg font-semibold mb-4 text-gray-700">
                    Candidate Information
                  </h3>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">
                        Candidate Name
                      </p>
                      <p className="text-gray-800">
                        {application.candidateName || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Email</p>
                      <p className="text-gray-800">
                        {application.email || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Phone</p>
                      <p className="text-gray-800">
                        {application.phone || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">
                        Status
                      </p>
                      <p className="text-gray-800">
                        {application.status || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">
                        Source
                      </p>
                      <p className="text-gray-800">
                        {application.source || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">
                        Notice Period
                      </p>
                      <p className="text-gray-800">
                        {application.noticePeriod || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">
                        Current CTC
                      </p>
                      <p className="text-gray-800">
                        {application.currentCTC || "N/A"} LPA
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">
                        Expected CTC
                      </p>
                      <p className="text-gray-800">
                        {application.expectedCTC || "N/A"} LPA
                      </p>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="mt-5">
                    <h4 className="text-sm font-semibold mb-2 text-gray-700">
                      Skills
                    </h4>
                    {application.skills && application.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {application.skills.map((skill: string, i: number) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600">No skills listed.</p>
                    )}
                  </div>

                  {/* Experience */}
                  <div className="mt-5">
                    <h4 className="text-sm font-semibold mb-2 text-gray-700">
                      Experience
                    </h4>
                    {application.experience &&
                    application.experience.length > 0 ? (
                      application.experience.some(
                        (exp: any) =>
                          exp.role?.trim() ||
                          exp.company?.trim() ||
                          exp.years?.trim()
                      ) ? (
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          {application.experience.map((exp: any, i: number) => {
                            const hasData =
                              exp.role?.trim() ||
                              exp.company?.trim() ||
                              exp.years?.trim();
                            if (!hasData) return null;

                            return (
                              <li key={i} className="text-gray-800">
                                {exp.role?.trim() || "N/A"}{" "}
                                {exp.company?.trim() && (
                                  <>
                                    at{" "}
                                    <span className="font-medium">
                                      {exp.company}
                                    </span>
                                  </>
                                )}
                                {exp.years?.trim() && ` — ${exp.years} years`}
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-600">N/A</p>
                      )
                    ) : (
                      <p className="text-sm text-gray-600">N/A</p>
                    )}
                  </div>
                </section>

                {/* Notes Section */}
             <section className="bg-white border border-gray-200 rounded-xl p-4">
  <h3 className="text-lg font-semibold mb-4 text-gray-700">Notes</h3>

  {/* Add Note Input */}
  <div className="flex gap-2 mb-4">
    <input
      type="text"
      value={newNote}
      onChange={(e) => setNewNote(e.target.value)}
      placeholder="Add a new note..."
      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      onKeyPress={(e) => {
        if (e.key === "Enter") handleAddNote();
      }}
    />
    <Button
      type="button"
      onClick={handleAddNote}
      disabled={isAddingNote || !newNote.trim()}
      className="text-sm"
    >
      {isAddingNote ? "Adding..." : "Submit"}
    </Button>
  </div>

  {/* Notes List */}
  <div
    className={`space-y-3 ${
      notes.length > 2 ? "max-h-30 overflow-y-scroll pr-1 " : ""
    }`}
  >
    {notes.length === 0 ? (
      <p className="text-sm text-gray-600 text-center py-4">
        No notes added yet.
      </p>
    ) : (
      notes.map((note) => (
        <div
          key={note.id}
          className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200"
        >
          {editingNoteId === note.id ? (
            <>
              <input
                type="text"
                value={editedNoteText}
                onChange={(e) => setEditedNoteText(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => handleUpdateNote(note.id)}
                disabled={isUpdating}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                title="Save"
              >
                <Save className="w-4 h-4" />
              </button>
              <button
                onClick={handleCancelEdit}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Cancel"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <div className="flex-1">
                <p className="text-sm text-gray-800">{note.note}</p>
                {/* {note.User?.fullName && (
                  <p className="text-xs text-gray-500 mt-1">
                   
                  </p>
                )} */}
                {note.createdAt && (
                  <p className="text-xs text-gray-500 mt-1">
                   <span className="mr-2">Created By: {note.User?.fullName}</span>  <span>{new Date(note.createdAt).toLocaleString() } </span>
                  </p>
                )}
              </div>
              <button
                onClick={() => handleEditNote(note)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDeleteNote(note.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      ))
    )}
  </div>
</section>

              </div>
            </div>
          )}
        </div>
      </FormProvider>
    </>
  );
};

export default ApplicationDetails;
