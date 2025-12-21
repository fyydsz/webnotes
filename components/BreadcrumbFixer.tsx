"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

// Map prodi names to display titles
const prodiTitles: Record<string, string> = {
  sistem_informasi: "Sistem Informasi",
  teknik_informatika: "Teknik Informatika",
  general: "General",
};

export default function BreadcrumbFixer() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Check for two patterns:
    // 1. /docs/program_studi/{prodi} - redirect "Program Studi" to /docs
    // 2. /docs/program_studi/{prodi}/{course}/... - remove "Program Studi", add prodi link

    const prodiOnlyMatch = pathname.match(
      /^\/docs\/program_studi\/([^\/]+)\/?$/,
    );
    const courseMatch = pathname.match(
      /^\/docs\/program_studi\/([^\/]+)\/([^\/]+)(\/.*)?$/,
    );

    if (!prodiOnlyMatch && !courseMatch) return;

    // Handle prodi-only path (e.g., /docs/program_studi/general)
    if (prodiOnlyMatch) {
      const fixProdiOnlyBreadcrumb = () => {
        const breadcrumb = document.querySelector(".nextra-breadcrumb");
        if (!breadcrumb) return;

        if (breadcrumb.getAttribute("data-fixed") === "true") return;

        // Find "Program Studi" (can be link or plain text) and replace with proper link
        const allElements = breadcrumb.querySelectorAll("*");

        // Get classes from existing link for hover effect
        const existingLink = breadcrumb.querySelector("a");
        const linkClasses = existingLink?.className || "";

        if (process.env.NODE_ENV === "development") {
          console.log("[BreadcrumbFixer] Prodi-only path detected");
        }

        allElements.forEach((element) => {
          const elementText = element.textContent?.trim() || "";
          const directText = Array.from(element.childNodes)
            .filter((node) => node.nodeType === Node.TEXT_NODE)
            .map((node) => node.textContent?.trim())
            .join("");

          // Check if this element contains "Program Studi" text
          if (
            directText === "Program Studi" ||
            (elementText === "Program Studi" && element.children.length === 0)
          ) {
            if (process.env.NODE_ENV === "development") {
              console.log(
                "[BreadcrumbFixer] Found Program Studi element:",
                element.tagName,
              );
            }

            // Create a proper <a> element with all link styling
            const newLink = document.createElement("a");
            newLink.textContent = "Program Studi";
            newLink.href = "/docs";
            newLink.className = linkClasses;
            newLink.title = "Program Studi";

            // Add click handler
            newLink.addEventListener("click", (e) => {
              e.preventDefault();
              e.stopPropagation();
              router.push("/docs");
            });

            // Replace the old element with the new link
            element.parentNode?.replaceChild(newLink, element);

            if (process.env.NODE_ENV === "development") {
              console.log(
                "[BreadcrumbFixer] Replaced with proper link element with hover effect",
              );
            }
          }
        });

        breadcrumb.setAttribute("data-fixed", "true");
      };

      fixProdiOnlyBreadcrumb();
      const timeout = setTimeout(fixProdiOnlyBreadcrumb, 100);

      const observer = new MutationObserver(() => {
        const breadcrumb = document.querySelector(".nextra-breadcrumb");
        if (breadcrumb && breadcrumb.getAttribute("data-fixed") !== "true") {
          fixProdiOnlyBreadcrumb();
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      return () => {
        clearTimeout(timeout);
        observer.disconnect();
      };
    }

    // Handle course path (e.g., /docs/program_studi/teknik_informatika/kalkulus)
    if (!courseMatch) return;
    const [, prodiName] = courseMatch;

    // Wait for DOM to be ready
    const fixBreadcrumb = () => {
      const breadcrumb = document.querySelector(".nextra-breadcrumb");
      if (!breadcrumb) return;

      // Check if already fixed
      if (breadcrumb.getAttribute("data-fixed") === "true") return;

      // Remove "Program Studi" link and its separator if exists
      const allLinks = breadcrumb.querySelectorAll("a");
      allLinks.forEach((link) => {
        if (link.textContent?.trim() === "Program Studi") {
          // Remove the following SVG separator if exists
          let nextNode = link.nextSibling;
          while (nextNode) {
            if (nextNode.nodeName === "svg" || nextNode.nodeName === "SVG") {
              const toRemove = nextNode;
              nextNode = nextNode.nextSibling;
              toRemove.remove();
              break;
            }
            nextNode = nextNode.nextSibling;
          }
          // Remove the link itself
          link.remove();
        }
      });

      // Find the first <a> (Documentation link) and the separator <svg>
      const docLink = breadcrumb.querySelector("a");
      const separator = breadcrumb.querySelector("svg");

      if (!docLink || !separator) return;

      // Get prodi display title
      const prodiTitle = prodiTitles[prodiName] || prodiName.replace(/_/g, " ");

      // Get classes from existing elements
      const linkClass = docLink.className;
      const svgHTML = separator.outerHTML;

      // Create Prodi link
      const prodiLink = document.createElement("a");
      prodiLink.className = linkClass;
      prodiLink.href = `/docs/program_studi/${prodiName}`;
      prodiLink.title = prodiTitle;
      prodiLink.textContent = prodiTitle;

      // Create separator for Prodi
      const separator2 = document.createElement("span");
      separator2.innerHTML = svgHTML;
      const svg2 = separator2.firstChild as Element;

      // Insert after the first separator (after Documentation >)
      // Order: Documentation > [SVG] > [NEW: Prodi] > [NEW: SVG] > Course
      if (separator.nextSibling) {
        breadcrumb.insertBefore(svg2, separator.nextSibling);
        breadcrumb.insertBefore(prodiLink, svg2);
      }

      // Mark as fixed to prevent duplicate fixes
      breadcrumb.setAttribute("data-fixed", "true");
    };

    // Try immediately
    fixBreadcrumb();

    // Also try after a short delay (for hydration)
    const timeout = setTimeout(fixBreadcrumb, 100);

    // Use MutationObserver to catch dynamic updates
    const observer = new MutationObserver(() => {
      // Reset fixed flag if breadcrumb was re-rendered
      const breadcrumb = document.querySelector(".nextra-breadcrumb");
      if (breadcrumb && breadcrumb.getAttribute("data-fixed") !== "true") {
        fixBreadcrumb();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, [pathname, router]);

  return null;
}
