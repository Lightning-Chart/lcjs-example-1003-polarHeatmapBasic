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
    theme: Themes[new URLSearchParams(window.location.search).get('theme') || 'darkGold'] || undefined,
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
