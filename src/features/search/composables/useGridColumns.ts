import {nextTick, onBeforeUnmount, ref, Ref} from "vue";


export function useGridColumns(listRef: Ref<HTMLElement | null>) {
    const columnsCount = ref(1);
    let resizeObserver: ResizeObserver | null = null;

    function updateColumnsCount() {
        if (!listRef.value) return;
        const template = window.getComputedStyle(listRef.value).gridTemplateColumns;
        const count = template.split(' ').filter(Boolean).length;
        columnsCount.value = count || 1;
    }

    async function observe() {
        await nextTick();
        updateColumnsCount();

        if (!resizeObserver && listRef.value) {
            resizeObserver = new ResizeObserver(() => updateColumnsCount());
            resizeObserver.observe(listRef.value);
        }
    }

    onBeforeUnmount(() => {
        resizeObserver?.disconnect();
    });

    return {
        columnsCount,
        updateColumnsCount,
        observe,
    };
}