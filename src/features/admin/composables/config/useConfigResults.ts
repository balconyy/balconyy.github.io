import {useRemoteConfigStore} from "../../../../store/remoteConfig";
import {computed} from "vue";


export function useConfigResults() {

    const configStore = useRemoteConfigStore();
    const isConfigLoaded = computed(() => configStore.loaded);
    const donation = computed(() => configStore.remoteConfig?.donationInfo);
    const adminAlert = computed(() => configStore.remoteConfig?.adminAlert);

    return {
        isConfigLoaded,
        donation,
        adminAlert
    }

}