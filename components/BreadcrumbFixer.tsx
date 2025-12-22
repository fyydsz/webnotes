"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

// Map prodi names to display titles
const prodiTitles: Record<string, string> = {
  sistem_informasi: "Sistem Informasi",
  teknik_informatika: "Teknik Informatika",
  general: "Umum",
};

export default function BreadcrumbFixer() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Check for course path pattern: /docs/program_studi/{prodi}/{course}/...
    // Remove "Program Studi", add prodi link

    const courseMatch = pathname.match(
      /^\/docs\/program_studi\/([^\/]+)\/([^\/]+)(\/.*)?$/,
    );

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
