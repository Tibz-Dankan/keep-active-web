import React from "react";
import { Metadata } from "next";
import { DocsLayout } from "@/app/layouts/DocsLayout";

export const metadata: Metadata = {
  title: "Documentation",
  description: "Appcrons official documentation",
};

const Page: React.FC = () => {
  return (
    <DocsLayout>
      <div className="w-[100vh] h-[100vh] grid place-items-center">
        Documentation
      </div>
    </DocsLayout>
  );
};

export default Page;
