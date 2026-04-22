/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import { Detection } from "./detection";
import { Store } from "./store";

import type { Handler, Rules } from "./index";

interface HandlersMap {
  [segmentId: string]: Handler[];
}

console.log("Loading Liferay Audiences API v0.1.0...");

let handlers: HandlersMap = {};
let store = new Store();

export function clear(): void {
  store.clear();
}

export function get(): Set<string> {
  const set: Set<string> = new Set();

  for (const segmentId of store.getSessionSegmentIds()) {
    set.add(segmentId);
  }

  for (const segmentId of store.getPageSegmentIds()) {
    set.add(segmentId);
  }

  return set;
}

export async function runDetection(rulesURL: string): Promise<void> {
  const result = await fetch(rulesURL);

  const rules: Rules = await result.json();

  const detection = new Detection(rules);

  const matches = await detection.run();

  let pageSegmentIds = store.getPageSegmentIds();
  let sessionSegmentIds = store.getSessionSegmentIds();

  for (const match of matches) {
    switch (match.retention) {
      case "PAGE": {
        pageSegmentIds.add(match.id);
        break;
      }

      case "SESSION": {
        sessionSegmentIds.add(match.id);
        break;
      }

      default: {
        throw new Error(`Unsupported retention: ${match.retention}`);
      }
    }
  }

  store.setPageSegmentIds(pageSegmentIds);
  store.setSessionSegmentIds(sessionSegmentIds);
}

export function on(segment: string, handler: Handler): void {
  console.log(
    "segments:",
    `adding handler ${handler} for segment '${segment}'`,
  );

  if (!handlers[segment]) {
    handlers[segment] = [];
  }

  handlers[segment].push(handler);
}

export async function runHandlers(): Promise<void> {
  // const segments: Set<string> = new Set();
  // // Gather session scope segments
  // const sessionSegments = sessionStorage.getItem(SESSION_STORAGE_KEY);
  // if (sessionSegments) {
  // 	for (const segment of sessionSegments.split(
  // 		SESSION_SEGMENTS_SEPARATOR
  // 	)) {
  // 		segments.add(segment);
  // 	}
  // }
  // // TODO: Gather other scopes' segments
  // // Invoke handlers
  // for (const segment of segments) {
  // 	const segmentHandlers = handlers[segment];
  // 	if (!segmentHandlers) {
  // 		continue;
  // 	}
  // 	for (const handler of segmentHandlers) {
  // 		console.log(
  // 			'segments:',
  // 			`running handler ${handler} for segment '${segment}'`
  // 		);
  // 		await handler();
  // 	}
  // }
  // // Empty handlers map
  // // TODO: we may need to move this elsewere or treat it different depending
  // //       on the lifecycle we define
  // console.log('segments: clearing handlers map');
  // handlers = {};
}
