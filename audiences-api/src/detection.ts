/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import type { Attribute, Operator, Retention, Rules } from './index';
import { store } from './store';

export interface SegmentMatch {
  id: string;
  retention: Retention;
}

export class Detection {
  private _rules: Rules;

  constructor(rules: Rules) {
    this._rules = rules;
  }

  async run(): Promise<SegmentMatch[]> {
    const matches = {};

    for (const segment of this._rules.segments) {
      const { combinator, id, retention, rules } = segment;

      const results = await Promise.all(
        rules.map(async (rule) => {
          const attribute = await getAttribute(rule.attr);
          const operator = getOperator(rule.op);

          return operator(attribute, rule.val);
        }),
      );

      const matched =
        combinator === 'and' ? results.every(Boolean) : results.some(Boolean);

      if (matched) {
        console.log(`Matched ${retention} segment: ${id}`);
        matches[id] = {
          id,
          retention,
        };
      }
    }

    return Object.values(matches);
  }
}

interface OperatorImpl {
  (actual: any, expected: any): boolean;
}

// TODO: implement custom attributes
async function getAttribute(attr: Attribute): Promise<any> {
  switch (attr) {
    case 'audiences': {
      return store.getSegmentIds();
    }

    case 'browser_language': {
      return navigator.language;
    }

    case 'local_hour': {
      return new Date().getHours();
    }

    case 'referrer': {
      return document.referrer;
    }

    default: {
      throw new Error(`Unsupported attribute: ${attr}`);
    }
  }
}

// TODO: implement custom operators
function getOperator(op: Operator): OperatorImpl {
  switch (op) {
    case 'between': {
      return (value: number, expected: [number, number]): boolean => {
        return value >= expected[0] && value <= expected[1];
      };
    }

    case 'eq': {
      return (value: any, expected: any): boolean => {
        return value === expected;
      };
    }

    case 'include': {
      return (value: Set<string>, expected: string): boolean => {
        return value.has(expected);
      };
    }

    case 'matches': {
      return (value: string, expected: string): boolean => {
        return new RegExp(expected).test(value);
      };
    }

    default: {
      throw new Error(`Unsupported operator: ${op}`);
    }
  }
}
