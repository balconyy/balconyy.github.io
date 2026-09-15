import {PlayerSelectorItem, PlayerType} from "@/models/playerModels";
import {Component, ComputedRef} from "vue";
import {PlayerOverlay} from "@/features/player/contract/playerOverlay";

/**
 * Единый контракт источника воспроизведения.
 *
 * Каждый тип плеера (iframe-трансляция, прямое video) реализует его
 * целиком и сам инкапсулирует свои "if"-ы: загрузку списка, подписи,
 * пустые состояния, ошибки, собственные элементы управления. Наружу
 * торчит только этот интерфейс, поэтому MainPlayer / PlayerContainer
 * работают с любым источником одинаково.
 */
export interface PlayerSource {
    /** Дискриминатор. Нужен для ключей/логов, в UI-логике не участвует. */
    readonly type: PlayerType

    /** Компонент, который умеет отрисовать медиа этого источника. */
    readonly mediaComponent: Component

    /** Список источников для модалки выбора. */
    readonly items: ComputedRef<PlayerSelectorItem[]>
    /** Ключ выбранного элемента (подсветка в модалке). */
    readonly selectedKey: ComputedRef<string | null>
    /** Подпись в PlayerSelectorBar, включая промежуточные состояния. */
    readonly selectedLabel: ComputedRef<string>

    /**
     * Ответ на вопрос "есть ли тут вообще контент" уже получен.
     * Пока false — про источник ничего не известно, переключаться
     * на него или прятать тумблер рано.
     */
    readonly isResolved: ComputedRef<boolean>
    /** Источник резолвнут и в нём есть что показать. */
    readonly isAvailable: ComputedRef<boolean>

    /**
     * Идентичность того, что играет: ролик, плеер. Меняется — медиа-элемент
     * пересоздаётся по mediaKey. Не меняется при смене качества, поэтому
     * переключение качества не перезапускает просмотр с начала.
     */
    readonly mediaId: ComputedRef<string | null>
    /** Текущий src. Может меняться при неизменном mediaId (качество). */
    readonly mediaUrl: ComputedRef<string | null>
    /** Человекочитаемое имя того, что сейчас играет. */
    readonly mediaLabel: ComputedRef<string>
    /** Текст под спиннером. */
    readonly loadingText: ComputedRef<string>

    /** Панель управления поверх медиа. null = источнику нечего показать. */
    readonly overlay: ComputedRef<PlayerOverlay | null>

    /** Идут сетевые запросы источника (список, ссылки). */
    readonly isLoading: ComputedRef<boolean>
    /** Непустая строка = показать заглушку "ничего не найдено". */
    readonly emptyMessage: ComputedRef<string>
    /** Непустая строка = показать ErrorScreen вместо всего плеера. */
    readonly errorMessage: ComputedRef<string>
    readonly errorCode: ComputedRef<string | number | null>

    /** Выбор источника по ключу из PlayerSelectorItem. */
    select(key: string): void

    /**
     * Узнать, есть ли контент, не становясь активным. Вызывается для всех
     * источников сразу: без этого нельзя решить, показывать ли тумблер.
     * Должен быть идемпотентным.
     */
    prefetch?(): void

    /** Источник стал активным: доподгрузка, автовыбор первого элемента. */
    activate(): void

    /** Уход с источника: пауза, отмена запросов и т.п. */
    deactivate?(): void
}
