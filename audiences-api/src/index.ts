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
  combinator: Combinator;
  rules: Rule[];
  retention: Retention;
}

export type Combinator = 'and' | 'or';

export type Retention = 'PAGE' | 'SESSION';

export type Rule = LeafRule | RuleGroup;

export interface LeafRule {
  attr: Attribute;
  op: Operator;
  val: any;
}

export interface RuleGroup {
  combinator: Combinator;
  rules: Rule[];
}

export type Attribute =
  | 'audiences'
  | 'browser_language'
  | 'browser_name'
  | 'browser_version'
  | `cookie:${string}`
  | 'hostname'
  | 'local_date'
  | 'local_hour'
  | 'referrer'
  | `search_param:${string}`
  | 'url';
export type Operator = 'between' | 'eq' | 'include' | 'matches';

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
