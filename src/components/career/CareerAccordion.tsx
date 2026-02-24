"use client";

import { useState } from "react";

interface ProjectItem {
  name: string;
  period: string;
  role: string;
  details: string[];
  tech: string[];
}

interface CareerItem {
  company: string;
  period: string;
  description: string;
  position: string;
  projects: ProjectItem[];
}

export default function CareerAccordion({ careers }: { careers: CareerItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="space-y-4">
      {careers.map((career, idx) => (
        <div
          key={career.company}
          className="rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden"
        >
          {/* Company Header - clickable */}
          <button
            type="button"
            onClick={() => toggle(idx)}
            className="w-full text-left bg-gray-50 dark:bg-gray-900 p-5 hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 min-w-0">
                <h3 className="text-lg font-bold truncate">{career.company}</h3>
                <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-950/40 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-300 whitespace-nowrap w-fit">
                  {career.period}
                </span>
              </div>
              <svg
                className={`h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200 ${openIndex === idx ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {career.position}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {career.description}
            </p>
          </button>

          {/* Projects - collapsible */}
          {openIndex === idx && (
            <div className="divide-y divide-gray-100 dark:divide-gray-800 border-t border-gray-200 dark:border-gray-800">
              {career.projects.map((project, pidx) => (
                <div key={pidx} className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-2">
                    <h4 className="font-semibold text-sm">{project.name}</h4>
                    <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {project.period}
                    </span>
                  </div>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mb-2">
                    {project.role}
                  </p>
                  <ul className="space-y-1 mb-3">
                    {project.details.map((detail, i) => (
                      <li
                        key={i}
                        className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2"
                      >
                        <span className="text-gray-400 mt-1.5 shrink-0">-</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                  {project.tech.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className="inline-block rounded bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-xs text-gray-600 dark:text-gray-400"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
