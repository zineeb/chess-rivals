import { vi } from 'vitest';

// Mock Web Worker for test environment
class WorkerMock {
    onmessage: ((event: MessageEvent) => void) | null = null;

    postMessage(): void {
        // Simulate worker returning a random move
        setTimeout(() => {
            this.onmessage?.(new MessageEvent('message', {
                data: { bestMove: 'e4' },
            }));
        }, 0);
    }

    terminate(): void {}
}

vi.stubGlobal('Worker', WorkerMock);
