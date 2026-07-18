/**
 * Builds the groups of pages to render for a given page count.
 *
 * The first page, last page, and current page are always included. Gaps
 * between consecutive groups represent hidden pages and should be rendered
 * as an ellipsis.
 *
 * Additional pages are added one at a time, in priority order - current+1,
 * current-1, then alternating outward (current+2, current-2, current+3,
 * current-3, ...) - until either every page is shown or no more pages fit
 * within `slotCount` (counting both pages and the ellipsis between groups).
 */
export const getPages = (currentPage: number, lastPage: number, slotCount: number): number[][] => {
  const visible = new Set<number>([1, currentPage, lastPage]);

  const buildGroups = (): number[][] => {
    const sorted = [...visible].sort((a, b) => a - b);
    return sorted.reduce<number[][]>((groups, page) => {
      const group = groups[groups.length - 1];
      if (group && page - group[group.length - 1] === 1) {
        group.push(page);
      } else {
        groups.push([page]);
      }
      return groups;
    }, []);
  };

  const cost = (groups: number[][]): number => (
    groups.reduce((sum, group) => sum + group.length, 0) + Math.max(0, groups.length - 1)
  );

  let groups = buildGroups();

  let offset = 1;
  while (currentPage + offset <= lastPage || currentPage - offset >= 1) {
    const right = currentPage + offset;
    const left = currentPage - offset;

    if (right <= lastPage && !visible.has(right)) {
      visible.add(right);
      const next = buildGroups();
      if (cost(next) <= slotCount) {
        groups = next;
      } else {
        visible.delete(right);
      }
    }

    if (left >= 1 && !visible.has(left)) {
      visible.add(left);
      const next = buildGroups();
      if (cost(next) <= slotCount) {
        groups = next;
      } else {
        visible.delete(left);
      }
    }

    offset += 1;
  }

  return groups;
};
