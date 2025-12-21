import type { PageMapItem } from 'nextra'

// Configuration for shared courses
const SHARED_COURSES = ['kalkulus', 'dasar_pemrograman_python', 'logika_matematika'];
const PROGRAMS = ['teknik_informatika', 'sistem_informasi'];

/**
 * Deep clone a page map item and update all routes to use a new base path
 */
function cloneWithNewRoute(item: PageMapItem, oldBasePath: string, newBasePath: string): PageMapItem {
  const cloned = JSON.parse(JSON.stringify(item)) as PageMapItem;
  
  function updateRoutes(obj: PageMapItem): void {
    if ('route' in obj && typeof obj.route === 'string') {
      obj.route = obj.route.replace(oldBasePath, newBasePath);
    }
    if ('children' in obj && Array.isArray(obj.children)) {
      obj.children.forEach(child => updateRoutes(child));
    }
  }
  
  updateRoutes(cloned);
  return cloned;
}

/**
 * Find shared course items from the pageMap
 */
function findSharedCourses(pageMap: PageMapItem[]): PageMapItem[] {
  const sharedCourses: PageMapItem[] = [];
  
  function findInChildren(items: PageMapItem[]): void {
    for (const item of items) {
      // Check if this is the shared folder
      if ('name' in item && item.name === 'shared' && 'children' in item) {
        // Get the course children (skip the data/index items)
        for (const child of item.children) {
          if ('name' in child && SHARED_COURSES.includes(child.name)) {
            sharedCourses.push(child);
          }
        }
        return;
      }
      // Recursively search in children
      if ('children' in item && Array.isArray(item.children)) {
        findInChildren(item.children);
      }
    }
  }
  
  findInChildren(pageMap);
  return sharedCourses;
}

/**
 * Inject shared courses into program folders
 */
export function injectSharedCourses(pageMap: PageMapItem[]): PageMapItem[] {
  const sharedCourses = findSharedCourses(pageMap);
  
  if (sharedCourses.length === 0) {
    return pageMap;
  }
  
  function processItems(items: PageMapItem[]): PageMapItem[] {
    return items.map(item => {
      // Check if this is a program folder that should receive shared courses
      if ('name' in item && PROGRAMS.includes(item.name) && 'children' in item) {
        const programName = item.name;
        
        // Clone the shared courses with updated routes for this program
        const clonedCourses = sharedCourses.map(course => 
          cloneWithNewRoute(
            course, 
            '/docs/shared/', 
            `/docs/${programName}/`
          )
        );
        
        // Inject the cloned courses into this program's children
        return {
          ...item,
          children: [...item.children, ...clonedCourses]
        };
      }
      
      // Recursively process children
      if ('children' in item && Array.isArray(item.children)) {
        return {
          ...item,
          children: processItems(item.children)
        };
      }
      
      return item;
    });
  }
  
  return processItems(pageMap);
}
