"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import apiClient from "@/lib/axiosInterceptor";
import { JobDescriptionProps } from "@/types/companyInterface";
import { toast } from "sonner";
import Link from "next/link";

const JobDescriptionDetails = () => {
 const params = useParams() as { companyId: string };
  const companyId = params.companyId;


  const [job, setJob] = useState<JobDescriptionProps | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    

    const fetchJobDetails = async () => {
  setLoading(true);
  try {
    const params = new URLSearchParams();
    params.append("page", "1"); // default to first page
    params.append("limit", "10"); // or whatever you want per page

    // If API needs companyId as a query param (not in path)
    const response = await apiClient.get(`/job?companyId=${companyId}&${params.toString()}`);

    // Or if the API expects search or filter logic
    // const response = await apiClient.get(`/job/search?id=${companyId}&${params.toString()}`);

    const jobs = response.data?.jobs || [];
    setJob(jobs);

  } catch (error: any) {
    console.error(error);
    toast.error("Failed to fetch job details");
  } finally {
    setLoading(false);
  }
};

    fetchJobDetails();
  }, [companyId]);

  console.log(job,"jopbbbbbbbbb")

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
    <div className="p-6 sm:p-10 bg-white rounded-xl shadow-sm max-w-5xl mx-auto mt-6">
      <Link href="/job-description" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Back to Job List
      </Link>

      <h1 className="text-2xl font-semibold mb-3">{job.title || "Untitled Job"}</h1>
      <p className="text-gray-600 mb-2"><strong>Location:</strong> {job.location || "NA"}</p>
      <p className="text-gray-600 mb-2"><strong>Experience:</strong> {job.experience || "NA"}</p>
      <p className="text-gray-600 mb-2"><strong>Salary:</strong> {job.salaryRange || "NA"}</p>
      <p className="text-gray-600 mb-2"><strong>Department:</strong> {job.Department?.name || "NA"}</p>
      <p className="text-gray-600 mb-2"><strong>Employment Type:</strong> {job.employmentType?.split("_").join(" ") || "NA"}</p>
      <p className="text-gray-600 mb-2"><strong>Status:</strong> {job.status || "NA"}</p>
      <p className="text-gray-600 mb-2"><strong>Published:</strong> {job.published ? "Yes" : "No"}</p>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Description</h2>
        <p className="text-gray-700 whitespace-pre-line">{job.description || "No description provided."}</p>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Responsibilities</h2>
        <p className="text-gray-700 whitespace-pre-line">{job.responsibilities || "No responsibilities provided."}</p>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Requirements</h2>
        <p className="text-gray-700 whitespace-pre-line">{job.requirements || "No requirements provided."}</p>
      </div>
    </div>
  );
};

export default JobDescriptionDetails;
