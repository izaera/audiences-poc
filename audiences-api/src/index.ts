/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import { clear, get, on, runDetection, runHandlers } from './implementation';

// Rules JSON API

export interface Rules {
  segments: Segment[];
}

export interface Segment {
  id: string;
  rule: Rule;
  retention: Retention;
}

export type Retention = 'PAGE' | 'SESSION';

export interface Rule {
  attr: Attribute;
  op: Operator;
  val: any;
}

export type Attribute = 'browser_language' | 'local_hour' | 'referrer';
export type Operator = 'between' | 'eq' | 'matches';

// Executable API

export interface Handler {
  name: string | undefined;
  (): Promise<void> | void;
}

export interface SegmentsAPI {
  clear(): void;
  get(): Set<string>;
  runDetection(rulesURL: string): Promise<void>;
  on(segmentId: string, handler: Handler): void;
  runHandlers(): Promise<void>;
}

export const segments: SegmentsAPI = {
  clear,
  get,
  on,
  runDetection,
  runHandlers,
};
