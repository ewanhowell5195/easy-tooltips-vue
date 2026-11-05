import { Comment, Fragment, Teleport, Text, cloneVNode, h, mergeProps, normalizeClass, normalizeStyle } from "vue"
import "easy-tooltips/styles.css"
import "easy-tooltips"

let nextId = 0

function styleText(value) {
  const style = normalizeStyle(value)
  if (!style || typeof style === "string") return style || undefined
  const declarations = Object.entries(style).filter(([, v]) => v != null && v !== "").map(([k, v]) => `${k.startsWith("--") ? k : k.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`)}: ${v}`)
  return declarations.join("; ") || undefined
}

function tooltipAttrs(options, src) {
  const on = !options.disabled
  const { text, hold } = options
  const hasText = text != null && text !== "" && text !== false
  return {
    "data-easy-tooltip": on && !src && hasText ? String(text) : undefined,
    "data-easy-tooltip-src": on && src ? src : undefined,
    "data-easy-tooltip-prefer": on && options.prefer || undefined,
    "data-easy-tooltip-anchor": on && options.anchor || undefined,
    "data-easy-tooltip-class": on && normalizeClass(options.tooltipClass) || undefined,
    "data-easy-tooltip-style": on && styleText(options.tooltipStyle) || undefined,
    "data-easy-tooltip-hold": !on || hold == null ? undefined : hold ? "" : "false",
    "data-easy-tooltip-background": on && options.background || undefined,
    "data-easy-tooltip-border": on && options.border || undefined
  }
}

function applyDirective(el, { value }) {
  const options = value !== null && typeof value === "object" ? value : { text: value }
  for (const [name, attr] of Object.entries(tooltipAttrs(options))) {
    if (attr === undefined) el.removeAttribute(name)
    else el.setAttribute(name, attr)
  }
}

export const vTooltip = {
  mounted: applyDirective,
  updated: applyDirective
}

function rendered(nodes) {
  return nodes.flatMap(node => {
    if (node.type === Comment) return []
    if (node.type === Fragment) return rendered(node.children ?? [])
    if (node.type === Text && !String(node.children).trim()) return []
    return [node]
  })
}

export default {
  name: "EasyTooltip",
  inheritAttrs: false,
  props: {
    text: [String, Number],
    prefer: { type: String, validator: value => ["above", "below", "left", "right", "entry"].includes(value) },
    anchor: { type: String, validator: value => ["element", "cursor", "cursor-x", "cursor-y", "pin", "pin-x", "pin-y"].includes(value) },
    tooltipClass: [String, Array, Object],
    tooltipStyle: [String, Array, Object],
    hold: { type: Boolean, default: undefined },
    background: String,
    border: String,
    disabled: Boolean
  },
  emits: ["open", "close", "move"],
  setup(props, { attrs, emit, slots }) {
    const id = `easy-tooltip-vue-${++nextId}`

    function relay(name) {
      return e => {
        if (e.detail.trigger === e.currentTarget) emit(name, e.detail)
      }
    }

    const listeners = {
      onEasyTooltipOpen: relay("open"),
      onEasyTooltipClose: relay("close"),
      onEasyTooltipMove: relay("move")
    }

    return () => {
      const triggers = rendered(slots.default?.() ?? [])
      if (!triggers.length) return null
      if (triggers.length > 1 || triggers[0].type === Text) {
        console.warn(`easy-tooltips-vue: the default slot needs exactly one element, got ${triggers.length === 1 ? "text" : triggers.length}`)
        return triggers
      }
      const content = props.disabled ? [] : slots.tooltip?.() ?? []
      const hasContent = rendered(content).length > 0
      return [
        cloneVNode(triggers[0], mergeProps(attrs, tooltipAttrs(props, hasContent ? id : undefined), listeners)),
        hasContent ? h(Teleport, { to: "body" }, h("div", { id, hidden: true }, content)) : null
      ]
    }
  }
}
