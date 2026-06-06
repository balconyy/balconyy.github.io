

export function useAnalytics() {

    const track = (eventName: string) => {
        window.gtag?.('event', eventName);
    }

    return {
        track,
    }

}