import type { DefineComponent, ObjectDirective, StyleValue } from "vue"
import type { TooltipAnchor, TooltipEventDetail } from "easy-tooltips"

export type { TooltipAnchor, TooltipEvent, TooltipEventDetail, TooltipPlacement, TooltipPoint, TooltipRect, TooltipSide } from "easy-tooltips"

export type TooltipPrefer = "above" | "below" | "left" | "right" | "entry"

export interface EasyTooltipOptions {
  prefer?: TooltipPrefer
  anchor?: TooltipAnchor
  tooltipClass?: string | unknown[] | Record<string, unknown>
  tooltipStyle?: StyleValue
  hold?: boolean
  background?: string
  border?: string
  disabled?: boolean
}

export interface EasyTooltipProps extends EasyTooltipOptions {
  text?: string | number
}

export interface EasyTooltipEmits {
  open: (detail: TooltipEventDetail) => void
  close: (detail: TooltipEventDetail) => void
  move: (detail: TooltipEventDetail) => void
}

export type TooltipDirectiveValue = string | number | boolean | null | undefined | (EasyTooltipOptions & { text?: string | number | boolean | null })

export const vTooltip: ObjectDirective<HTMLElement, TooltipDirectiveValue>

declare const EasyTooltip: DefineComponent<EasyTooltipProps, {}, {}, {}, {}, {}, {}, EasyTooltipEmits>

export default EasyTooltip
