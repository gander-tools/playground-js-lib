import { type Ref, computed } from '@vue/reactivity'

/**
 * This function adds the two passed numbers together.
 */
export function add(a: number, b: number): number {
    return a + b
}

/**
 * This function adds the two passed references with numbers together.
 * The return type is also new reference with number
 *
 * @example
 * ```ts
 * import { ref } from "@vue/reactivity"
 * import { addRef } from "@gander/playground"
 *
 * const partA = ref(123);
 * const partB = ref(321);
 *
 * const result = addRef(partA, partB);
 *
 * console.log('Result', result.value);
 * ```
 */
export function addRef(a: Ref<number>, b: Ref<number>): Ref<number> {
    return computed(() => a.value + b.value)
}
