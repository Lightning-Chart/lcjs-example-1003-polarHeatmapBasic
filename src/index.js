window.lcjsSmallView = window.devicePixelRatio >= 2
if (!window.__lcjsDebugOverlay) {
    window.__lcjsDebugOverlay = document.createElement('div')
    window.__lcjsDebugOverlay.style.cssText = 'position:fixed;top:10px;left:10px;background:rgba(0,0,0,0.7);color:#fff;padding:4px 8px;z-index:99999;font:12px monospace;pointer-events:none'
    const attach = () => { if (document.body && !window.__lcjsDebugOverlay.parentNode) document.body.appendChild(window.__lcjsDebugOverlay) }
    attach()
    setInterval(() => {
        attach()
        window.__lcjsDebugOverlay.textContent = window.innerWidth + 'x' + window.innerHeight + ' dpr=' + window.devicePixelRatio + ' small=' + window.lcjsSmallView
    }, 500)
}
/*
 * Example showcasing the basics of Polar Heatmap feature.
 */
const lcjs = require('@lightningchart/lcjs')
const xydata = require('@lightningchart/xydata')
const { lightningChart, Themes, LUT, PalettedFill, regularColorSteps } = lcjs
const { createWaterDropDataGenerator } = xydata

const resolutionSectors = 360
const resolutionAnnuli = 100

const polarChart = lightningChart({
            resourcesBaseUrl: new URL(document.head.baseURI).origin + new URL(document.head.baseURI).pathname + 'resources/',
        }).Polar({
    theme: (() => {
    const t = Themes[new URLSearchParams(window.location.search).get('theme') || 'darkGold'] || undefined
    return t && window.lcjsSmallView ? lcjs.scaleTheme(t, 0.5) : t
})(),
textRenderer: window.lcjsSmallView ? lcjs.htmlTextRenderer : undefined,
})
const polarHeatmap = polarChart
    .addHeatmapSeries({
        sectors: resolutionSectors,
        annuli: resolutionAnnuli,
        amplitudeStart: 0,
        amplitudeStep: 1,
        dataOrder: 'annuli',
    })
    .setIntensityInterpolation('bilinear')

const themeExamples = polarChart.getTheme().examples
if (!themeExamples) {
    throw new Error()
}

createWaterDropDataGenerator()
    .setRows(resolutionAnnuli)
    .setColumns(resolutionSectors)
    .generate()
    .then((data) => {
        const palette = new PalettedFill({
            lut: new LUT({
                units: '°C',
                steps: regularColorSteps(0, 60, themeExamples.intensityColorPalette),
                interpolate: true,
            }),
        })
        polarHeatmap.setFillStyle(palette).invalidateIntensityValues(data)
    })
