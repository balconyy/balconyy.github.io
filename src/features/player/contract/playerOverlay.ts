import {Component} from "vue";


/**
 * Слой управления поверх медиа: качество, ссылка на источник и т.п.
 * Контейнер отрисовывает его вслепую через <component :is>, поэтому
 * добавление новых кнопок не требует правок ни в PlayerContainer,
 * ни в MainPlayer — только в самом источнике.
 */

export interface PlayerOverlay {
    component: Component
    props: Record<string, unknown>
    listeners?: Record<string, (...args: never[]) => void>
}

/**
 * Хелпер для типобезопасной сборки оверлея на стороне источника:
 * props проверяются против пропсов конкретного компонента, а наружу
 * отдаётся стёртый PlayerOverlay.
 */
export function definePlayerOverlay<P extends Record<string, unknown>>(
    component: Component<P>,
    props: P,
    listeners?: Record<string, (...args: never[]) => void>
): PlayerOverlay {
    return {component: component as Component, props, listeners}
}