"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

const processSteps = [
  {
    image: "/process/1.png",
    title: "Consultation",
    copy: "Share your situation, timeline, relationship background, and immediate concerns.",
  },
  {
    image: "/process/2.png",
    title: "Eligibility and Pathway Review",
    copy: "Understand which spouse visa or sponsorship option may fit your facts and current rules.",
  },
  {
    image: "/process/3.png",
    title: "Document and Application Preparation",
    copy: "Organize forms, evidence, letters, and supporting documents with professional structure.",
  },
  {
    image: "/process/4.png",
    title: "Submission Guidance and Follow-Up",
    copy: "Move forward with clarity, practical next steps, and support after submission.",
  },
];

const clamp = (value: number) => Math.max(0, Math.min(value, 1));

export default function ProcessStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const grid = gridRef.current;
    if (!section || !stage || !grid) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    if (reducedMotion.matches) {
      section.dataset.activeStep = String(processSteps.length);
      section.style.setProperty("--process-reveal", "100%");
      section.style.setProperty(
        "--process-line-height",
        `${Math.max(0, grid.getBoundingClientRect().height - 72)}px`,
      );
      return;
    }

    const desktopStory = window.matchMedia(
      "(min-width: 1040px) and (min-height: 720px)",
    );
    let frame = 0;

    const update = () => {
      frame = 0;
      const sectionRect = section.getBoundingClientRect();
      const stageHeight = stage.getBoundingClientRect().height;
      const gridRect = grid.getBoundingClientRect();
      const gridHeight = gridRect.height;
      const range = desktopStory.matches
        ? Math.max(1, sectionRect.height - stageHeight)
        : Math.max(
            1,
            gridHeight + window.innerHeight * 0.22,
          );
      const progress = desktopStory.matches
        ? clamp(-sectionRect.top / range)
        : clamp(
            (window.innerHeight * 0.78 - gridRect.top) / range,
          );

      section.dataset.activeStep = String(
        Math.min(
          processSteps.length,
          Math.floor(progress * processSteps.length) + 1,
        ),
      );
      section.style.setProperty("--process-reveal", `${progress * 100}%`);
      section.style.setProperty(
        "--process-line-height",
        `${Math.max(0, gridHeight - 72) * progress}px`,
      );
      section.style.setProperty(
        "--process-heading-y",
        `${(1 - progress) * 8}px`,
      );
    };

    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      aria-labelledby="process-title"
      className="process-section"
      data-active-step="4"
      id="process"
      ref={sectionRef}
    >
      <div className="process-stage" ref={stageRef}>
        <div className="section-shell process-content">
          <div className="section-heading process-heading">
            <p className="eyebrow process-eyebrow">Simple process</p>
            <h2 id="process-title">
              From uncertainty to an organized <span>next step.</span>
            </h2>
          </div>
          <div className="process-grid" ref={gridRef}>
            <svg
              aria-hidden="true"
              className="process-connector"
              preserveAspectRatio="none"
              viewBox="0 0 1000 100"
            >
              <path
                className="process-connector-base"
                d="M175 50 C220 5 280 5 325 50 M425 50 C470 5 530 5 575 50 M675 50 C720 5 780 5 825 50"
              />
              <path
                className="process-connector-progress"
                d="M175 50 C220 5 280 5 325 50 M425 50 C470 5 530 5 575 50 M675 50 C720 5 780 5 825 50"
              />
            </svg>
            {processSteps.map((step, index) => {
              return (
                <article className="process-step" key={step.title}>
                  <div className="process-node">
                    <span aria-hidden="true" className="process-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="process-icon">
                      <Image
                        alt=""
                        height={64}
                        src={step.image}
                        unoptimized
                        width={64}
                      />
                    </span>
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
