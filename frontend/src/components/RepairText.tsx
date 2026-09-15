"use client";

import { Children, cloneElement, isValidElement, type ReactNode } from 'react';
import { repairMojibake } from '@/lib/repairMojibake';

const repairNode = (node: ReactNode): ReactNode => {
  if (typeof node === 'string') return repairMojibake(node);
  if (Array.isArray(node)) return node.map(repairNode);
  if (!isValidElement(node)) return node;
  const children = (node.props as { children?: ReactNode }).children;
  return cloneElement(node, undefined, children === undefined ? undefined : Children.map(children, repairNode));
};

export default function RepairText({ children }: { children: ReactNode }) {
  return <>{Children.map(children, repairNode)}</>;
}
