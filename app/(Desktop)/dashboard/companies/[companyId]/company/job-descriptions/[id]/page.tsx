// "use client";

// import React, { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import apiClient from "@/lib/axiosInterceptor";
// import { JobDescriptionProps } from "@/types/companyInterface";
// import { toast } from "sonner";
// import Link from "next/link";

// const JobDescriptionDetails = () => {
//  const params = useParams() as { companyId: string; id: string };
//  const { companyId, id: jobId } = params;


//   const [job, setJob] = useState<JobDescriptionProps | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
    

//     const fetchJobDetails = async () => {
//   setLoading(true);
//   try {
//     const params = new URLSearchParams();
//     params.append("page", "1"); // default to first page
//     params.append("limit", "10"); // or whatever you want per page

//     // If API needs companyId as a query param (not in path)
//     const response = await apiClient.get(`/job?companyId=${companyId}&${params.toString()}`);

//     // Or if the API expects search or filter logic
//     // const response = await apiClient.get(`/job/search?id=${companyId}&${params.toString()}`);

//     const jobs = response.data?.jobs || [];
//     setJob(jobs);

//   } catch (error: any) {
//     console.error(error);
//     toast.error("Failed to fetch job details");
//   } finally {
//     setLoading(false);
//   }
// };

//     fetchJobDetails();
//   }, [companyId]);

//   console.log(job,"jopbbbbbbbbb")

//   if (loading) {
//     return (
//       <div className="p-10 text-center text-gray-500">
//         Loading job details...
//       </div>
//     );
//   }

//   if (!job) {
//     return (
//       <div className="p-10 text-center text-gray-500">
//         No job description found.
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 sm:p-10 bg-white rounded-xl shadow-sm max-w-5xl mx-auto mt-6">
//       <Link href="/job-description" className="text-blue-600 hover:underline mb-4 inline-block">
//         ← Back to Job List
//       </Link>

//       <h1 className="text-2xl font-semibold mb-3">{job.title || "Untitled Job"}</h1>
//       <p className="text-gray-600 mb-2"><strong>Location:</strong> {job.location || "NA"}</p>
//       <p className="text-gray-600 mb-2"><strong>Experience:</strong> {job.experience || "NA"}</p>
//       <p className="text-gray-600 mb-2"><strong>Salary:</strong> {job.salaryRange || "NA"}</p>
//       <p className="text-gray-600 mb-2"><strong>Department:</strong> {job.Department?.name || "NA"}</p>
//       <p className="text-gray-600 mb-2"><strong>Employment Type:</strong> {job.employmentType?.split("_").join(" ") || "NA"}</p>
//       <p className="text-gray-600 mb-2"><strong>Status:</strong> {job.status || "NA"}</p>
//       <p className="text-gray-600 mb-2"><strong>Published:</strong> {job.published ? "Yes" : "No"}</p>

//       <div className="mt-6">
//         <h2 className="text-xl font-semibold mb-2">Description</h2>
//         <p className="text-gray-700 whitespace-pre-line">{job.description || "No description provided."}</p>
//       </div>

//       <div className="mt-6">
//         <h2 className="text-xl font-semibold mb-2">Responsibilities</h2>
//         <p className="text-gray-700 whitespace-pre-line">{job.responsibilities || "No responsibilities provided."}</p>
//       </div>

//       <div className="mt-6">
//         <h2 className="text-xl font-semibold mb-2">Requirements</h2>
//         <p className="text-gray-700 whitespace-pre-line">{job.requirements || "No requirements provided."}</p>
//       </div>
//     </div>
//   );
// };

// export default JobDescriptionDetails;

"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import apiClient from "@/lib/axiosInterceptor";
import { toast } from "sonner";
import Link from "next/link";
import DynamicBreadcrumb from "@/components/Navbar/BreadCrumb";
import { FormProvider, useForm } from "react-hook-form";
import Button from "@/components/Others/Button";

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
        const response = await apiClient.get(
          `/job?companyId=${companyId}`
        );

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
        <form className="flex flex-col h-[calc(100vh-105px)] overflow-y-auto gap-5">
          <section className="bg-white border border-gray-200 rounded-xl p-4 grid gap-5">
            <div className="rounded-xl flex justify-end">
              <Link href={`/dashboard/companies/${companyId}?tab=job-descriptions`}>
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
                    <p className="text-gray-800">{job.title || "Untitled Job"}</p>
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
                    <p className="text-gray-600 font-semibold">Employment Type</p>
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
                  <p className="text-gray-800 whitespace-pre-line">
                    {job.description || "No description provided."}
                  </p>
                </div>

                {/* Responsibilities */}
                <div className="mt-5">
                  <h3 className="text-lg font-semibold mb-2 text-gray-700">
                    Responsibilities
                  </h3>
                  <p className="text-gray-800 whitespace-pre-line">
                    {job.responsibilities || "No responsibilities provided."}
                  </p>
                </div>

                {/* Requirements */}
                <div className="mt-5">
                  <h3 className="text-lg font-semibold mb-2 text-gray-700">
                    Requirements
                  </h3>
                  <p className="text-gray-800 whitespace-pre-line">
                    {job.requirements || "No requirements provided."}
                  </p>
                </div>
              </>
            )}
          </section>
        </form>
      </FormProvider>
    </>
  );
};
export default JobDescriptionDetails;

