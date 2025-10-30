"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import apiClient from "@/lib/axiosInterceptor";
import { toast } from "sonner";
import Link from "next/link";
import DynamicBreadcrumb from "@/components/Navbar/BreadCrumb";
import Button from "@/components/Others/Button";

const ApplicationDetails = () => {
  const params = useParams() as { companyId: string; id: string };
  const { companyId, id: applicationId } = params;

  const [application, setApplication] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const methods = useForm();

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get(`/application?companyId=${companyId}`);
        const applications = response.data?.applications || [];
        const selected = applications.find((a: any) => a.id === applicationId);

        if (selected) {
          setApplication(selected);
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

  return (
    <>
      <DynamicBreadcrumb
        links={[
          { label: "Companies", href: "/dashboard/companies" },
          { label: "Applications", href: `/dashboard/companies/${companyId}?tab=applications` },
          { label: "Application Details" },
        ]}
      />

      <FormProvider {...methods}>
        <form className="flex flex-col h-[calc(100vh-105px)] overflow-y-auto gap-5">
          {/* Application Details Section */}
          <section className="bg-white border border-gray-200 rounded-xl p-4 grid gap-5">
            <div className="rounded-xl flex justify-end">
              <Link href={`/dashboard/companies/${companyId}?tab=application`}>
                <Button variant="outline" className="text-sm">
                  Back to List
                </Button>
              </Link>
            </div>

            {isLoading ? (
              <div className="text-center py-4 text-gray-500">Loading application data...</div>
            ) : !application ? (
              <div className="text-center py-4 text-gray-500">No application found.</div>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 gap-5 mt-2">
                  <div>
                    <p className="text-gray-600 font-semibold">Candidate Name</p>
                    <p className="text-gray-800">{application.candidateName || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-semibold">Email</p>
                    <p className="text-gray-800">{application.email || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-semibold">Phone</p>
                    <p className="text-gray-800">{application.phone || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-semibold">Status</p>
                    <p className="text-gray-800">{application.status || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-semibold">Source</p>
                    <p className="text-gray-800">{application.source || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-semibold">Notice Period</p>
                    <p className="text-gray-800">{application.noticePeriod || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-semibold">Current CTC</p>
                    <p className="text-gray-800">{application.currentCTC || "N/A"} LPA</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-semibold">Expected CTC</p>
                    <p className="text-gray-800">{application.expectedCTC || "N/A"} LPA</p>
                  </div>
                </div>

                {/* Skills */}
                <div className="mt-5">
                  <h3 className="text-lg font-semibold mb-2 text-gray-700">Skills</h3>
                  {application.skills && application.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {application.skills.map((skill: string, i: number) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-lg"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">No skills listed.</p>
                  )}
                </div>

                {/* Experience */}
                <div className="mt-5">
                  <h3 className="text-lg font-semibold mb-2 text-gray-700">Experience</h3>
                  {application.experience && application.experience.length > 0 ? (
                    <ul className="list-disc pl-6 space-y-1">
                      {application.experience.map((exp: any, i: number) => (
                        <li key={i} className="text-gray-800">
                          {exp.role} at{" "}
                          <span className="font-medium">{exp.company}</span> — {exp.years} years
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-600">No experience details provided.</p>
                  )}
                </div>

                {/* Resume */}
                {application.resumeUrl && (
                  <div className="mt-5">
                    <h3 className="text-lg font-semibold mb-2 text-gray-700">Resume</h3>
                    <a
                      href={
                        application.resumeUrl.startsWith("http")
                          ? application.resumeUrl
                          : `${process.env.NEXT_PUBLIC_API_URL}${application.resumeUrl}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Resume
                    </a>
                  </div>
                )}

                {/* Notes & History */}
              {/* Notes & History */}
                <div className="grid sm:grid-cols-2 gap-8 mt-5">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-700">Notes</h3>
                    {application.Notes && application.Notes.length > 0 ? (
                      <ul className="list-disc pl-6 space-y-1">
                        {application.Notes.map((note: any, i: number) => (
                          <li key={i} className="text-gray-800">
                            {typeof note === 'string' 
                              ? note 
                              : note.text || note.content || note.note || 'No content'}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-600">No notes added.</p>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-700">History</h3>
                    {application.History && application.History.length > 0 ? (
                      <ul className="list-disc pl-6 space-y-1">
                        {application.History.map((h: any, i: number) => (
                          <li key={i} className="text-gray-800">
                            <span className="font-medium">{h.oldStatus || 'N/A'}</span>
                            {' → '}
                            <span className="font-medium">{h.newStatus || 'N/A'}</span>
                            {h.changeById && (
                              <span className="text-sm text-gray-500 ml-2">
                                (by {h.changeById})
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-600">No history available.</p>
                    )}
                  </div>
                </div>
              </>
            )}
          </section>

          {/* Footer Section */}
         
        </form>
      </FormProvider>
    </>
  );
};

export default ApplicationDetails;
