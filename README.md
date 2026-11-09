# easy-tooltips-vue

A lightweight tooltip component and directive for Vue 3, built on [easy-tooltips](https://github.com/ewanhowell5195/easy-tooltips).  
Just add `v-tooltip` to any element, or wrap it in `<EasyTooltip>` for rich content!

[![npm version](https://badge.fury.io/js/easy-tooltips-vue.svg)](https://www.npmjs.com/package/easy-tooltips-vue)
[![License: MPL 2.0](https://img.shields.io/badge/License-MPL_2.0-brightgreen.svg)](https://opensource.org/licenses/MPL-2.0)

[**Live Demo**](https://easy-tooltips.ewanhowell.com/)

## Features

* Works with mouse, touch, and keyboard focus
* Customizable via CSS variables
* Gradient and image backgrounds and borders
* Automatically repositions and shifts to fit the screen
* Smooth, non-interrupting animations with smart skip-delay between adjacent tooltips
* Anchor to the trigger element, the cursor, or where the user first hovered
* Plain text, or rich content from a slot
* Seamless body + arrow drawn as a single SVG path
* Adds no wrapper elements around your trigger
* Reactive text, content and options, even while the tooltip is showing

## Quick Start

### Install via npm
```bash
npm install easy-tooltips-vue
```

### Add tooltips to your component

```vue
<script setup>
import EasyTooltip, { vTooltip } from "easy-tooltips-vue"
</script>

<template>
  <button v-tooltip="'Click to save your changes'">Save</button>

  <EasyTooltip text="This field is required">
    <span>Username *</span>
  </EasyTooltip>

  <EasyTooltip>
    <button>Shipping info</button>
    <template #tooltip>
      <strong>Free shipping</strong> on orders over £50
    </template>
  </EasyTooltip>
</template>
```

The script and styles are imported for you. A bundler that handles CSS imports is required.

Multi-line text uses `\n`, for example `v-tooltip="'Multi-line tooltips\nare supported too'"`.

Tooltips also show on keyboard focus. Natively focusable elements (buttons, links, inputs) work automatically; for other elements (such as a `<div>` or `<span>`), add `tabindex="0"` so they can receive focus.

## Directive

`v-tooltip` takes the tooltip text. A value of `null`, `false` or `""` turns the tooltip off:

```vue
<button v-tooltip="saved ? 'All saved' : null">Save</button>
```

It also takes an object with `text` and the same options as the component:

```vue
<button v-tooltip="{ text: 'Shows below', prefer: 'below' }">Hover me</button>
```

To use it without importing it in every component, register it on your app:

```js
app.directive("tooltip", vTooltip)
```

## Component

`<EasyTooltip>` adds the tooltip to the single element or component in its default slot, without adding a wrapper element. `class`, `style` and listeners set on `<EasyTooltip>` go on that element too.

| Slot | Description |
|---|---|
| default | The trigger. It must be one element or component. Anything else logs a warning and shows no tooltip. |
| `#tooltip` | Rich tooltip content. It takes priority over `text`. If it renders nothing, `text` is used. |

The slot content is copied into the tooltip, so it can show components and update live, but anything interactive inside it will not respond.

## Options

These are props on `<EasyTooltip>`, and keys of the `v-tooltip` object.

| Option | Description |
|---|---|
| `text` | The tooltip text. |
| `prefer` | The preferred side. See [Preferred side](#preferred-side). |
| `anchor` | What the tooltip is anchored to. See [Anchor modes](#anchor-modes). |
| `tooltip-class` | Classes for the tooltip, in any form Vue's `class` accepts. In a `v-tooltip` object, use `tooltipClass`. |
| `tooltip-style` | Styles for the tooltip, in any form Vue's `style` accepts. In a `v-tooltip` object, use `tooltipStyle`. |
| `hold` | Whether to stay open while the trigger is pressed. See [Holding while interacting](#holding-while-interacting). |
| `dismiss` | Whether to hide when the trigger is clicked. See [Dismissing on click](#dismissing-on-click). |
| `background` | A background image or gradient. Takes priority over `--easy-tooltip-background`. |
| `border` | A border image or gradient. Takes priority over `--easy-tooltip-border`. |
| `disabled` | Turns the tooltip off. If it is showing, it hides. |

`prefer`, `anchor`, `tooltip-class` and `hold` apply the next time the tooltip opens or updates.

### Custom tooltip classes
```vue
<EasyTooltip text="Saved!" tooltip-class="success-tooltip">
  <button>Save</button>
</EasyTooltip>
```

```css
.success-tooltip {
  --easy-tooltip-background-color: #f0fdf4;
  --easy-tooltip-border-color: #27ae60;
  --easy-tooltip-text-color: #27ae60;
}
```

Tooltips are rendered outside your component, so a `scoped` style does not reach them. Use a global style.

### Per-tooltip styling
```vue
<EasyTooltip text="Pill shaped, just for me" :tooltip-style="{ '--easy-tooltip-border-radius': '999px' }">
  <div tabindex="0">?</div>
</EasyTooltip>
```

### Preferred side
`prefer` controls which side a tooltip shows on. It still flips to the opposite side when there isn't room. Using `left` or `right` switches the tooltip to horizontal mode.

* `above` (default): show above, fall back to below
* `below`: show below, fall back to above
* `left`: show to the left, fall back to the right
* `right`: show to the right, fall back to the left
* `entry`: show on whichever edge of the trigger the cursor crossed on the way in. The side is locked in as you enter, so it stays right even when you move fast. Keyboard focus has no entry point, so it falls back to `above`

### Anchor modes
By default a tooltip is anchored to its trigger element. `anchor` changes the anchor point:

* `element` (default): anchored to the trigger's bounding box.
* `cursor`: anchored to the cursor (or touch point), follows the cursor as it moves around the element. On touch, the tooltip appears at the tap point and tracks the finger if you drag.
* `pin`: pins to the point on the trigger's nearest edge to the cursor when the tooltip appears, so coming in from the left pins it to the left edge at the height you are at. The side defaults to `entry`, and setting `prefer` overrides that while keeping the pinned position. If the tooltip is delayed, it pins where the cursor ends up rather than where it entered, and it keeps tracking the page as you scroll.

`cursor` and `pin` also come in single axis versions, which take one axis from the cursor and the other from the trigger's bounding box:

* `cursor-x` and `pin-x`: horizontally on the cursor, vertically on the trigger
* `cursor-y` and `pin-y`: vertically on the cursor, horizontally on the trigger

The axis versions of `pin` freeze the cursor position on that axis rather than snapping to an edge.

Keyboard focus has no coordinates and automatically falls back to element anchoring.

### Holding while interacting
A tooltip stays open while you are pressing its trigger, even once the pointer leaves it. This means that dragging a slider keeps its tooltip up until you let go, instead of losing it as soon as the cursor leaves the track.

This happens automatically when the press lands on a control: `input`, `select`, `textarea`, `button`, or anything with a `button`, `slider`, `checkbox`, `radio`, or `switch` role. The control can be the trigger itself, or sit inside it.

Set `hold` to turn it on for anything else, and `:hold="false"` to turn it off for a control:

```vue
<EasyTooltip text="I stay while you drag me" hold>
  <div>…</div>
</EasyTooltip>
```

The tooltip hides when you release, unless the pointer is back over the trigger by then.

### Dismissing on click
`dismiss` hides the tooltip when its trigger is clicked, and keeps it hidden until the pointer leaves the trigger. It takes priority over `hold`. Touch is not affected, since a tap is how a tooltip is shown there.

```vue
<EasyTooltip text="Copy" dismiss>
  <button>Copy</button>
</EasyTooltip>
```

To turn it on for every tooltip, use `setTooltipDefaults`. `:dismiss="false"` then turns it off for one:

```js
import { setTooltipDefaults } from "easy-tooltips-vue"

setTooltipDefaults({ dismiss: true })
```

## Events

`<EasyTooltip>` emits these with the `detail` below as the payload:

* `open`: the tooltip appeared
* `close`: the tooltip started hiding
* `move`: the tooltip changed where it is attached

```vue
<EasyTooltip text="Hello" @open="detail => console.log(detail.side, detail.point)">
  <button>Hover me</button>
</EasyTooltip>
```

They only fire for that component's own tooltip, not for tooltips nested inside its trigger. With `v-tooltip`, listen for the native events on the element, and read the payload from `e.detail`. These bubble:

```vue
<button v-tooltip="'Hello'" @easy-tooltip-open="e => console.log(e.detail.side)">Hover me</button>
```

Every event has the same `detail`:

* `trigger`: the element the tooltip belongs to
* `tooltip`: the tooltip element
* `text`: the tooltip text
* `side`: `above`, `below`, `left`, or `right`
* `inside`: `true` when the tooltip did not fit on any side, so it floats over the trigger without an arrow. `side` still reports the side it is using
* `anchor`: the anchor mode in use, `element` unless the tooltip was opened by pointer
* `anchorRect`: the box the tooltip is anchored to. For cursor and pin anchoring this is a zero size box at the anchor point
* `point`: the point on the anchor that the tooltip points at
* `rect`: the box of the tooltip itself
* `previous`: on `move`, the same placement values from before the change

All coordinates are viewport coordinates, the same as `getBoundingClientRect`. The types are exported if you need them:

```ts
import type { EasyTooltipProps, TooltipEventDetail, TooltipSide, TooltipAnchor } from "easy-tooltips-vue"
```

`open` fires when the tooltip actually appears, after any delay, so a hover too brief to show a tooltip fires nothing at all.

`move` fires when the tooltip flips to another side, and when its anchor point moves, for example while scrolling or when using cursor anchoring. Flips are sent straight away. Anchor point changes are limited to one event every 100ms, so cursor anchoring does not spam.

## Customization

You can style tooltips using CSS variables (recommended) or by targeting the tooltip classes directly. Note that some CSS variables are required for proper positioning:

```css
:root {
  /* Tooltip appearance */
  --easy-tooltip-background-color: #fff;     /* Background color */
  --easy-tooltip-text-color: #000;           /* Text color */
  --easy-tooltip-border-color: #aaa;         /* Border color */
  --easy-tooltip-border-size: 1px;           /* Border thickness */
  --easy-tooltip-background: none;           /* Background image/gradient, replaces the background color */
  --easy-tooltip-border: none;               /* Border image/gradient, replaces the border color */
  --easy-tooltip-border-radius: 4px;         /* Corner radius, clamped to half the tooltip like CSS, so a large value gives a pill */
  --easy-tooltip-padding: 8px 12px;          /* Inner padding */
  --easy-tooltip-max-width: 100%;            /* Maximum tooltip width */

  /* Positioning */
  --easy-tooltip-distance: 16px;             /* Distance from trigger element */
  --easy-tooltip-viewport-padding: 16px;     /* Minimum distance from screen edges */
  --easy-tooltip-arrow-size: 16px;           /* Arrow size (height defaults to width / 2; 0 to disable) */
  --easy-tooltip-arrow-size: 16px 8px;       /* Or specify arrow width and height separately */
  --easy-tooltip-arrow-edge-buffer-x: 12px;  /* Minimum arrow gap from where the border radius starts (for above or below tooltips) */
  --easy-tooltip-arrow-edge-buffer-y: 6px;   /* Minimum arrow gap from where the border radius starts (for left or right tooltips) */
  --easy-tooltip-arrow-radius: 0;            /* Border radius of the arrow tip */

  /* Animation */
  --easy-tooltip-animation-length: 0.15s;    /* Duration of fade animation */
  --easy-tooltip-animation-distance: 4px;    /* Distance the tooltip slides in */
  --easy-tooltip-delay: 0s;                  /* Base delay before the tooltip shows; always added */
  --easy-tooltip-inactive-delay: 0.15s;      /* Extra delay when no tooltip was recently active; drops to 0 once a tooltip is showing */
  --easy-tooltip-cooldown: 0.15s;            /* How long after the last tooltip closes before the inactive-delay applies again */
}
```

### Image backgrounds and borders

`--easy-tooltip-background` and `--easy-tooltip-border` accept any CSS `<image>`: gradients or `url()` images. Both follow the tooltip shape, arrow included, and replace the flat background/border colors when set.

```css
.fancy-tooltip {
  --easy-tooltip-background: linear-gradient(135deg, #667eea, #764ba2);
  --easy-tooltip-border: linear-gradient(135deg, #f0f, #0ff);
  --easy-tooltip-border-size: 2px;
  --easy-tooltip-text-color: #fff;
}
```

They can also be set per tooltip with the `background` and `border` options, which take priority over the variables:

```vue
<EasyTooltip text="Photo background" background="url('photo.jpg')">
  <button>Hover me</button>
</EasyTooltip>
```

### Show delay and quick-switch
Easy-tooltips uses a two-part delay so that the first tooltip waits, but switching between adjacent tooltips feels instant:

* On the first hover, the tooltip waits `delay + inactive-delay` (`0 + 0.15s` by default) before showing. This protects against accidental hovers.
* Once a tooltip has fully appeared, all subsequent tooltips skip the inactive-delay and show in just `delay` (`0s` by default, i.e. instantly).
* When all tooltips have been closed for `cooldown` (`0.15s` by default), behaviour resets to "first hover" again.

Each part is its own variable so you can tune them independently. For example, a slow, deliberate tooltip with a long initial wait but instant skip:

```css
.slow-tooltip {
  --easy-tooltip-inactive-delay: 1s;
}
```

Or a permanent delay regardless of recent activity (e.g. a 500ms reveal on every tooltip):

```css
.always-slow-tooltip {
  --easy-tooltip-delay: 500ms;
}
```

### Advanced customization

The tooltip body and arrow are drawn as a single SVG path, so anything beyond the variables can be done by targeting the path directly with SVG-flavored CSS. `.easy-tooltip-bg` is the SVG element; `.easy-tooltip-bg path` is the path that draws the outline and fill.

#### Borders

The border is the SVG path's `stroke`, so any stroke property works:

```css
/* Dashed border */
.dashed-tooltip .easy-tooltip-bg path {
  stroke-dasharray: 5 3;
  stroke-linecap: round;
}
```

#### Backgrounds

For gradient or image backgrounds, use `--easy-tooltip-background` (see [Image backgrounds and borders](#image-backgrounds-and-borders)). Alternatively, the path's `fill` accepts any SVG paint server declared in the document, referenced by id:

```html
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <defs>
    <linearGradient id="brand-gradient" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#3498db"/>
      <stop offset="100%" stop-color="#9b59b6"/>
    </linearGradient>
  </defs>
</svg>
```

```css
.gradient-tooltip .easy-tooltip-bg path {
  fill: url(#brand-gradient);
}
```

The same approach works for `stroke` (an alternative to `--easy-tooltip-border`), and for radial, conic, or pattern paint servers.

For a drop shadow that follows the full body + arrow shape, apply a filter to the SVG element:

```css
.shadow-tooltip .easy-tooltip-bg {
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.25));
}
```

## How it works

Easy-tooltips uses a smart positioning system that:

1. **Picks a side**: Shows on the preferred side (above by default, or below/left/right) and flips to the opposite side when there isn't room
2. **Keeps it on screen**: Shifts the tooltip along its edge (horizontally for above/below, vertically for left/right) so it stays within the viewport while the arrow keeps pointing at the element
3. **Falls back gracefully**: When a tooltip can't fit on either side, it pins inside the viewport instead of overflowing
4. **Manages animations**: Queues tooltip updates to prevent conflicts and flicker on rapid hover
5. **Skips the delay when grazing**: The first hover waits a short delay to ignore accidental movement, but once any tooltip is showing, switching to adjacent tooltips is instant until you stop hovering for the cooldown period
6. **Stacks newest on top**: When multiple tooltips are visible at once, the most recently activated one renders above the others. When triggers are nested, only the innermost one shows
7. **Always paints above everything**: The tooltip container lives in the browser's top layer (via the Popover API), so tooltips render above any z-index, no matter how large, and re-promote themselves above modal dialogs and fullscreen elements when activated. Falls back to a high z-index in browsers without popover support
8. **Cleans up**: Removes a tooltip automatically when its trigger element leaves the DOM

## License

[MPL-2.0](LICENSE) © [Ewan Howell](https://ewanhowell.com/)