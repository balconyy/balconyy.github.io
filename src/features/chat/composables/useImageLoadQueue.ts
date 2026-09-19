const MAX_CONCURRENT_LOADS = 4;

let activeCount = 0;
const queue: Array<() => void> = [];

function runNext() {
    if (activeCount >= MAX_CONCURRENT_LOADS) return;
    const next = queue.shift();
    if (!next) return;
    activeCount++;
    next();
}

export function useImageLoadQueue() {
    function enqueue(task: () => void) {
        queue.push(task);
        runNext();
    }

    // Вызывать, когда картинка закончила загрузку (успешно или с ошибкой),
    // чтобы освободить слот для следующей из очереди.
    function release() {
        activeCount = Math.max(0, activeCount - 1);
        runNext();
    }

    return {enqueue, release};
}