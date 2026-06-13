export function useAnalytics() {

    const track = (eventName: string, params?: Record<string, unknown>) => {
        if (params) window.gtag?.('event', eventName, params);
        else window.gtag?.('event', eventName);
    }

    return {
        track,
    }

}