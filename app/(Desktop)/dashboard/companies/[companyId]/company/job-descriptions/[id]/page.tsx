"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import apiClient from "@/lib/axiosInterceptor";
import { toast } from "sonner";
import Link from "next/link";
import DynamicBreadcrumb from "@/components/Navbar/BreadCrumb";
import { FormProvider, useForm } from "react-hook-form";
import Button from "@/components/Others/Button";
import DOMPurify from "isomorphic-dompurify"; // Already imported!

const JobDescriptionDetails = () => {
  const params = useParams() as { companyId: string; id: string };
  const { companyId, id: jobId } = params;
  const methods = useForm();

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobDetails = async () => {
      setLoading(true);
      try {
        // NOTE: Removed 'limit' and 'page' as you are fetching all jobs for a company
        const response = await apiClient.get(`/job?companyId=${companyId}`);

        const jobs = response.data?.jobs || [];

        // ✅ Find the job whose ID matches the param
        const selectedJob = jobs.find((j: any) => j.id === jobId);

        if (selectedJob) {
          setJob(selectedJob);
        } else {
          toast.error("Job not found");
        }
      } catch (error: any) {
        console.error(error);
        toast.error("Failed to fetch job details");
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [companyId, jobId]);

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading job details...
      </div>
    );
  }

  if (!job) {
    return (
      <div className="p-10 text-center text-gray-500">
        No job description found.
      </div>
    );
  }
  
  // NOTE: This stripHtml function is NOT needed when using dangerouslySetInnerHTML,
  // as the goal is to *keep* the bold/list formatting. 
  /*
  const stripHtml = (html: string = "") =>
    html
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ")
      .trim();
  */

 // --- HTML Sanitization and Rendering Function ---
const renderSafeHTML = (htmlContent: string | null | undefined, defaultMessage: string) => {
    const content = htmlContent || defaultMessage;
    if (content === defaultMessage) {
        return <p className="text-gray-800">{defaultMessage}</p>;
    }

    // UPDATED CONFIGURATION:
    const sanitizedHtml = DOMPurify.sanitize(content, { 
        // 1. ALLOWED TAGS: Added 'a' (link) and 'span' (font style)
        ALLOWED_TAGS: ['b', 'i', 'strong', 'em', 'ul', 'ol', 'li', 'p', 'br', 'h1', 'h2', 'h3', 'h4', 'a', 'span'],
        
        // 2. ALLOWED ATTRIBUTES: 
        //    Added 'href' (for links), 'style' (for font size/color), and 'class' (for styles).
        ALLOWED_ATTR: ['href', 'style', 'class'], 
        
        // NOTE: If you are using images, you must also allow 'img' tag and 'src' attribute.
        // ALLOWED_TAGS: [..., 'img'],
        // ALLOWED_ATTR: [..., 'src', 'alt']
    });

    return (
        <div
            className="text-gray-800 ck-content-display" // Add a class for specific styling
            dangerouslySetInnerHTML={{
                __html: sanitizedHtml,
            }}
        />
    );
};
// -------
  // ----------------------------------------------


  return (
    <>
      <DynamicBreadcrumb
        links={[
          { label: "Companies", href: "/dashboard/companies" },
          {
            label: "Jobs",
            href: `/dashboard/companies/${companyId}?tab=job-descriptions`,
          },
          { label: "Job Details" },
        ]}
      />

      <FormProvider {...methods}>
        <form className="flex flex-col h-[calc(100vh-105px)] overflow-y-hidden overflow-x-hidden  gap-5">
          <section className="bg-white border border-gray-200 rounded-xl p-4 grid gap-5">
            <div className="rounded-xl flex justify-end">
              <Link
                href={`/dashboard/companies/${companyId}?tab=job-descriptions`}
              >
                <Button variant="outline" className="text-sm">
                  Back to List
                </Button>
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-4 text-gray-500">
                Loading job details...
              </div>
            ) : !job ? (
              <div className="text-center py-4 text-gray-500">
                No job description found.
              </div>
            ) : (
              <>
                {/* Job Details */}
                <div className="grid sm:grid-cols-2 gap-5 mt-2">
                  <div>
                    <p className="text-gray-600 font-semibold">Job Title</p>
                    <p className="text-gray-800">
                      {job.title || "Untitled Job"}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-600 font-semibold">Location</p>
                    <p className="text-gray-800">{job.location || "NA"}</p>
                  </div>

                  <div>
                    <p className="text-gray-600 font-semibold">Experience</p>
                    <p className="text-gray-800">{job.experience || "NA"}</p>
                  </div>

                  <div>
                    <p className="text-gray-600 font-semibold">Salary Range</p>
                    <p className="text-gray-800">{job.salaryRange || "NA"}</p>
                  </div>

                  <div>
                    <p className="text-gray-600 font-semibold">Department</p>
                    <p className="text-gray-800">
                      {job.Department?.name || "NA"}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-600 font-semibold">
                      Employment Type
                    </p>
                    <p className="text-gray-800">
                      {job.employmentType?.split("_").join(" ") || "NA"}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-600 font-semibold">Status</p>
                    <p className="text-gray-800">{job.status || "NA"}</p>
                  </div>

                  <div>
                    <p className="text-gray-600 font-semibold">Published</p>
                    <p className="text-gray-800">
                      {job.published ? "Yes" : "No"}
                    </p>
                  </div>
                </div>

                {/* Description Section */}
                <div className="mt-5">
                  <h3 className="text-lg font-semibold mb-2 text-gray-700">
                    Description
                  </h3>
                  {/* The renderSafeHTML function now handles both the HTML rendering and attribute stripping */}
                  {renderSafeHTML(job.description, "No description provided.")}
                </div>

                {/* Content/Responsibilities Section */}
                <div className="mt-5">
                  <h3 className="text-lg font-semibold mb-2 text-gray-700 overflow-x-hidden">
                    Content
                  </h3>
                  {/* 🛑 FIX APPLIED HERE: Use the same safe HTML rendering function */}
                 <div className="rendered-content">
  {renderSafeHTML(job.content, "No content provided.")}
</div>

                </div>

                {/* Requirements */}
               
              </>
            )}
          </section>
        </form>
      </FormProvider>
    </>
  );
};
export default JobDescriptionDetails;