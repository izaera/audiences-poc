const SESSION_STORAGE_KEY = 'com.liferay.segments';
const SESSION_SEGMENTS_SEPARATOR = '|';

export class Store {
  private pageSegmentIds: Set<string> = new Set();

  clear(): void {
    this.pageSegmentIds = new Set();
    localStorage.removeItem(SESSION_STORAGE_KEY);
  }

  getPageSegmentIds(): Set<string> {
    return this.pageSegmentIds;
  }

  getSessionSegmentIds(): Set<string> {
    const sessionItem = localStorage.getItem(SESSION_STORAGE_KEY);

    if (!sessionItem) {
      return new Set();
    }

    return new Set(sessionItem.split(SESSION_SEGMENTS_SEPARATOR));
  }

  setPageSegmentIds(segmentIds: Set<string>) {
    this.pageSegmentIds = segmentIds;
  }

  setSessionSegmentIds(segmentIds: Set<string>) {
    localStorage.setItem(
      SESSION_STORAGE_KEY,
      [...segmentIds].join(SESSION_SEGMENTS_SEPARATOR),
    );
  }
}
