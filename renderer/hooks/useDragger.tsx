'use client';
import { useEffect, useRef } from 'react';

interface Coords {
  startX: number;
  startY: number;
  lastX: number;
  lastY: number;
}

const useDragger = (targetId: string, holderId: string): void => {
  const isClicked = useRef<boolean>(false);
  const coords = useRef<Coords>({ startX: 0, startY: 0, lastX: 0, lastY: 0 });

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) throw new Error("Element with given id doesn't exist");

    const holder = document.getElementById(holderId);
    if (!holder) throw new Error("Holder with given id doesn't exist");

    const container = target.parentElement;
    if (!container) throw new Error('target element must have a parent');

    const onMouseDown = (e: MouseEvent) => {
      isClicked.current = true;
      coords.current.startX = e.clientX - target.offsetLeft;
      coords.current.startY = e.clientY - target.offsetTop;
    };

    const onMouseUp = () => {
      isClicked.current = false;
      coords.current.lastX = target.offsetLeft;
      coords.current.lastY = target.offsetTop;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isClicked.current) return;

      const nextX = e.clientX - coords.current.startX;
      const nextY = e.clientY - coords.current.startY;

      target.style.top = `${nextY}px`;
      target.style.left = `${nextX}px`;

      coords.current.lastX = nextX;
      coords.current.lastY = nextY;
    };

    holder.addEventListener('mousedown', onMouseDown);
    holder.addEventListener('mouseup', onMouseUp);
    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseleave', onMouseUp);

    const cleanup = () => {
      holder.removeEventListener('mousedown', onMouseDown);
      holder.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mouseleave', onMouseUp);
    };

    return cleanup;
  }, [targetId]);
};

export default useDragger;
