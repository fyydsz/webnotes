"use client";

import React, { useMemo } from "react";
import type { ComponentProps } from "react";
import { usePathname } from "next/navigation";
import { Layout } from "nextra-theme-docs";
import { LastUpdated } from "@/components/last-updated";

type LayoutPageMap = ComponentProps<typeof Layout>["pageMap"];
type SidebarOption = {
  toggleButton?: boolean;
  defaultMenuCollapseLevel?: number;
  [k: string]: unknown;
};

// Helper function to deep clone and transform routes
const transformRoutes = (
  node: Record<string, unknown>,
  fromBase: string,
  toBase: string,
): Record<string, unknown> => {
  const cloned = JSON.parse(JSON.stringify(node)) as Record<string, unknown>;

  const transform = (obj: unknown): void => {
    if (!obj || typeof obj !== "object") return;
    if (Array.isArray(obj)) {
      obj.forEach(transform);
      return;
    }
    const record = obj as Record<string, unknown>;

    // Transform route property
    if (typeof record.route === "string") {
      record.route = record.route.replace(fromBase, toBase);
    }

    // Transform href property if exists
    if (typeof record.href === "string") {
      record.href = record.href.replace(fromBase, toBase);
    }

    // Recursively transform children
    if (Array.isArray(record.children)) {
      record.children.forEach(transform);
    }

    // Transform any nested objects
    for (const key of Object.keys(record)) {
      if (record[key] && typeof record[key] === "object") {
        transform(record[key]);
      }
    }
  };

  transform(cloned);
  return cloned;
};

export default function NextraLayoutWrapper({
  pageMap,
  children,
  ...rest
}: ComponentProps<typeof Layout> & { pageMap?: LayoutPageMap }) {
  const pathname = usePathname();

  const filteredPageMap = useMemo((): LayoutPageMap => {
    const pm = pageMap ?? [];

    // clone to avoid mutating original
    const cloned = JSON.parse(JSON.stringify(pm)) as LayoutPageMap;

    // Helper: recursively remove any `children` properties in a node/subtree
    const removeChildrenRecursively = (node: unknown): boolean => {
      let removed = false;
      const recurse = (n: unknown) => {
        if (!n || typeof n !== "object") return;
        if (Array.isArray(n)) {
          (n as Array<unknown>).forEach(recurse);
          return;
        }
        const obj = n as Record<string, unknown>;
        if (Object.prototype.hasOwnProperty.call(obj, "children")) {
          delete (obj as Record<string, unknown> & { children?: unknown })
            .children;
          removed = true;
        }
        for (const k of Object.keys(obj)) {
          const v = obj[k];
          if (v && typeof v === "object") recurse(v);
        }
      };
      recurse(node);
      return removed;
    };

    // Helper: traverse and find all `program_studi` nodes and apply callback
    const applyToProgramStudiNodes = (
      fn: (programNode: Record<string, unknown>) => void,
    ) => {
      const walk = (nodes: unknown) => {
        if (!nodes || typeof nodes !== "object") return;
        if (Array.isArray(nodes)) {
          (nodes as Array<unknown>).forEach(walk);
          return;
        }
        const obj = nodes as Record<string, unknown>;
        // detect program_studi either by name or explicit route
        const name = (obj.name ?? "").toString();
        const route = (obj.route ?? "").toString().replace(/\/+$/, "");
        if (name === "program_studi" || route === "/docs/program_studi") {
          fn(obj);
          // still walk into its children to find any nested program_studi occurrences
        }
        if (Array.isArray(obj.children)) {
          (obj.children as Array<unknown>).forEach(walk);
        }
      };
      (cloned as Array<unknown>).forEach(walk);
    };

    // Helper: find mata_kuliah node in pageMap
    const findMataKuliahNode = (): Record<string, unknown> | null => {
      let mataKuliahNode: Record<string, unknown> | null = null;

      const walk = (nodes: unknown): void => {
        if (mataKuliahNode || !nodes || typeof nodes !== "object") return;
        if (Array.isArray(nodes)) {
          nodes.forEach(walk);
          return;
        }
        const obj = nodes as Record<string, unknown>;
        const name = (obj.name ?? "").toString();
        const route = (obj.route ?? "").toString().replace(/\/+$/, "");

        if (name === "mata_kuliah" || route === "/docs/mata_kuliah") {
          mataKuliahNode = obj;
          return;
        }

        if (Array.isArray(obj.children)) {
          obj.children.forEach(walk);
        }
      };

      (cloned as Array<unknown>).forEach(walk);
      return mataKuliahNode;
    };

    // Helper: find a course node within mata_kuliah by course name
    const findCourseInMataKuliah = (
      courseName: string,
    ): Record<string, unknown> | null => {
      const mataKuliahNode = findMataKuliahNode();
      if (!mataKuliahNode || !Array.isArray(mataKuliahNode.children)) {
        return null;
      }

      for (const child of mataKuliahNode.children as Array<
        Record<string, unknown>
      >) {
        const name = (child.name ?? "").toString();
        const route = (child.route ?? "").toString().replace(/\/+$/, "");

        if (
          name === courseName ||
          route === `/docs/mata_kuliah/${courseName}`
        ) {
          return child;
        }
      }

      return null;
    };

    // Normalize path (remove trailing slash)
    const normPath = (pathname ?? "").replace(/\/+$/, "");
    const isDocsRoot = normPath === "/docs";
    const isDocsTentang =
      normPath === "/docs/tentang" || normPath.startsWith("/docs/tentang/");
    const isDocsKontribusi =
      normPath === "/docs/kontribusi" ||
      normPath.startsWith("/docs/kontribusi/");
    const isProgramStudiPath =
      normPath === "/docs/program_studi" ||
      normPath.startsWith("/docs/program_studi/");

    // Check if we're inside a specific course path
    // Pattern: /docs/program_studi/{prodi}/{course}/...
    const coursePathMatch = normPath.match(
      /^\/docs\/program_studi\/([^\/]+)\/([^\/]+)(?:\/|$)/,
    );
    const isInsideCoursePath = coursePathMatch !== null;

    // If inside a course path, show ALL prodi courses + general courses in sidebar
    // The active course will be expanded with its content
    if (isInsideCoursePath && coursePathMatch) {
      const [, prodiName, activeCourse] = coursePathMatch;

      // Find prodi node in program_studi
      let prodiNode: Record<string, unknown> | null = null;

      const findProdiForCourse = (nodes: unknown): void => {
        if (!nodes || typeof nodes !== "object") return;
        if (Array.isArray(nodes)) {
          nodes.forEach(findProdiForCourse);
          return;
        }
        const obj = nodes as Record<string, unknown>;
        const name = (obj.name ?? "").toString();
        const route = (obj.route ?? "").toString().replace(/\/+$/, "");

        if (name === "program_studi" || route === "/docs/program_studi") {
          if (Array.isArray(obj.children)) {
            for (const child of obj.children as Array<
              Record<string, unknown>
            >) {
              const childName = (child.name ?? "").toString();
              const childRoute = (child.route ?? "")
                .toString()
                .replace(/\/+$/, "");

              if (
                childName === prodiName ||
                childRoute === `/docs/program_studi/${prodiName}`
              ) {
                prodiNode = child;
              }
            }
          }
        }

        if (Array.isArray(obj.children)) {
          obj.children.forEach(findProdiForCourse);
        }
      };

      (cloned as Array<unknown>).forEach(findProdiForCourse);

      // Build sidebar with all prodi courses + general courses
      const allCourseNodes: Array<Record<string, unknown>> = [];
      const addedCourseNames = new Set<string>(); // Track added courses to avoid duplicates

      // Helper to build course node (with or without children based on if it's active)
      const buildCourseNode = (
        courseName: string,
        isActive: boolean,
        baseProdi: string,
      ): Record<string, unknown> | null => {
        // Skip if already added (avoid duplicates)
        if (addedCourseNames.has(courseName)) {
          return null;
        }

        const courseFromMataKuliah = findCourseInMataKuliah(courseName);
        if (courseFromMataKuliah) {
          const transformed = transformRoutes(
            courseFromMataKuliah,
            "/docs/mata_kuliah",
            `/docs/program_studi/${baseProdi}`,
          );
          if (!isActive) {
            // Remove children for non-active courses
            delete (transformed as Record<string, unknown>).children;
          }
          // Ensure proper route and href
          const route = `/docs/program_studi/${baseProdi}/${courseName}`;
          (transformed as Record<string, unknown>).route = route;
          if (!(transformed as Record<string, unknown>).href) {
            (transformed as Record<string, unknown>).href = route;
          }
          addedCourseNames.add(courseName);
          return transformed;
        }
        return null;
      };

      // Extract courses from prodi node
      if (
        prodiNode &&
        Array.isArray((prodiNode as Record<string, unknown>).children)
      ) {
        for (const child of (prodiNode as Record<string, unknown>)
          .children as Array<Record<string, unknown>>) {
          const courseName = (child.name ?? "").toString();
          // Skip empty or invalid course names
          if (!courseName) continue;

          const isActive = courseName === activeCourse;
          const courseNode = buildCourseNode(courseName, isActive, prodiName);
          if (courseNode) {
            allCourseNodes.push(courseNode);
          }
          // Don't use fallback - only use courses that exist in mata_kuliah
        }
      }

      // Replace program_studi node with all course nodes directly (splice in place)
      const replaceProgramStudiWithCourses = (nodes: unknown): boolean => {
        if (!nodes || typeof nodes !== "object") return false;
        if (Array.isArray(nodes)) {
          for (let i = 0; i < nodes.length; i++) {
            const obj = nodes[i] as Record<string, unknown>;
            const name = (obj.name ?? "").toString();
            const route = (obj.route ?? "").toString().replace(/\/+$/, "");

            if (name === "program_studi" || route === "/docs/program_studi") {
              // Remove program_studi and insert all course nodes at that position
              nodes.splice(i, 1, ...allCourseNodes);
              return true;
            }

            if (Array.isArray(obj.children)) {
              if (replaceProgramStudiWithCourses(obj.children)) return true;
            }
          }
        }
        return false;
      };

      replaceProgramStudiWithCourses(cloned);

      if (process.env.NODE_ENV === "development") {
        console.log(
          `[NextraLayoutWrapper] Inside course ${activeCourse} for prodi ${prodiName}, showing ${allCourseNodes.length} courses in sidebar`,
        );
      }

      return cloned;
    }

    // Helper: remove mata_kuliah node from pageMap to prevent pagination to it
    const removeMataKuliahNode = (nodes: unknown): boolean => {
      if (!nodes || typeof nodes !== "object") return false;
      if (Array.isArray(nodes)) {
        for (let i = 0; i < nodes.length; i++) {
          const obj = nodes[i] as Record<string, unknown>;
          const name = (obj.name ?? "").toString();
          const route = (obj.route ?? "").toString().replace(/\/+$/, "");

          if (name === "mata_kuliah" || route === "/docs/mata_kuliah") {
            // Remove mata_kuliah node
            nodes.splice(i, 1);
            return true;
          }

          if (Array.isArray(obj.children)) {
            if (removeMataKuliahNode(obj.children)) return true;
          }
        }
      }
      return false;
    };

    // Behavior:
    // - On docs-like pages (/docs, /docs/tentang, /docs/kontribusi): keep program_studi as a folder,
    //   but ensure its immediate children (general, sistem_informasi, teknik_informatika) have no grandchildren.
    // - On /docs/program_studi and its subpaths: same cleanup (no grandchildren under those children).
    if (isDocsRoot || isDocsTentang || isDocsKontribusi || isProgramStudiPath) {
      // Apply removal of grandchildren for each found program_studi node
      applyToProgramStudiNodes((programNode) => {
        if (Array.isArray(programNode.children)) {
          // log before for dev
          if (process.env.NODE_ENV === "development") {
            try {
              // Minimal, safe representation
              const before = (
                programNode.children as Array<Record<string, unknown>>
              ).map((c) => ({
                name: (c.name ?? "").toString(),
                route: (c.route ?? "").toString(),
                hasChildren: Array.isArray(
                  (c as Record<string, unknown>).children,
                ),
              }));

              console.log(
                "[NextraLayoutWrapper] program_studi children BEFORE cleanup:",
                before,
              );
            } catch {
              // ignore serialization errors
            }
          }

          for (const child of programNode.children as Array<
            Record<string, unknown>
          >) {
            removeChildrenRecursively(child);
          }

          if (process.env.NODE_ENV === "development") {
            try {
              const after = (
                programNode.children as Array<Record<string, unknown>>
              ).map((c) => ({
                name: (c.name ?? "").toString(),
                route: (c.route ?? "").toString(),
                hasChildren: Array.isArray(
                  (c as Record<string, unknown>).children,
                ),
              }));

              console.log(
                "[NextraLayoutWrapper] program_studi children AFTER cleanup:",
                after,
              );
            } catch {
              // ignore
            }
          }
        }
      });

      // Mirror changes into meta (cloned[0].data) if present
      try {
        if (
          Array.isArray(cloned) &&
          cloned[0] &&
          "data" in (cloned[0] as Record<string, unknown>)
        ) {
          const meta =
            ((cloned[0] as Record<string, unknown>).data as
              | Record<string, unknown>
              | undefined) ?? undefined;
          if (meta) {
            for (const key of Object.keys(meta)) {
              const entry = meta[key] as Record<string, unknown> | undefined;
              if (!entry || !Array.isArray(entry.children)) continue;
              const pid = (
                entry.children as Array<Record<string, unknown>>
              ).findIndex((c) => c && (c.name ?? "") === "program_studi");
              if (pid >= 0) {
                const pn = (entry.children as Array<Record<string, unknown>>)[
                  pid
                ] as Record<string, unknown> | undefined;
                if (pn && Array.isArray(pn.children)) {
                  for (const c of pn.children as Array<
                    Record<string, unknown>
                  >) {
                    removeChildrenRecursively(c);
                  }
                }
              }
            }
          }
        }
      } catch {
        // ignore meta manipulation errors, keep UI stable
      }

      // Remove mata_kuliah from pageMap when on program_studi pages
      // This prevents "Next" pagination from going to mata_kuliah/bahasa_indonesia
      if (isProgramStudiPath) {
        removeMataKuliahNode(cloned);
        if (process.env.NODE_ENV === "development") {
          console.log(
            "[NextraLayoutWrapper] Removed mata_kuliah from pageMap to prevent pagination leak",
          );
        }
      }

      if (process.env.NODE_ENV === "development") {
        try {
          console.log(
            "[NextraLayoutWrapper] cleanup applied (docs-like/program_studi path)",
            JSON.parse(JSON.stringify(cloned)),
          );
        } catch {
          // ignore stringify issues
        }
      }

      return cloned;
    }

    // Default: return the cloned map unchanged
    return cloned;
  }, [pageMap, pathname]);

  // Build an effective sidebar config
  const baseSidebar = (rest as unknown as { sidebar?: SidebarOption })
    ?.sidebar ?? {
    toggleButton: true,
  };
  const effectiveSidebar: SidebarOption = {
    ...baseSidebar,
  };

  return (
    <Layout
      {...rest}
      sidebar={effectiveSidebar}
      pageMap={filteredPageMap}
      lastUpdated={<LastUpdated />}
    >
      {children}
    </Layout>
  );
}
