/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import type { Attribute, Operator, Retention, Rules } from './index';

export interface SegmentMatch {
  id: string;
  retention: Retention;
}

// TODO: attr referrer
// TODO: op matches
export class Detection {
  private _rules: Rules;

  constructor(rules: Rules) {
    this._rules = rules;
  }

  async run(): Promise<SegmentMatch[]> {
    const matches = {};

    for (const segment of this._rules.segments) {
      const { id, rule, retention } = segment;

      const attribute = await getAttribute(rule.attr);
      const operator = getOperator(rule.op);

      if (operator(attribute, rule.val)) {
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

async function getAttribute(attr: Attribute): Promise<any> {
  switch (attr) {
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
