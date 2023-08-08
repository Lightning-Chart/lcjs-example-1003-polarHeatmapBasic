/*
 * Example showcasing the basics of Polar Heatmap feature.
 */
const lcjs = require('@arction/lcjs')
const xydata = require('@arction/xydata')
const { lightningChart, Themes, LUT, PalettedFill, regularColorSteps } = lcjs
const { createWaterDropDataGenerator } = xydata

const resolutionSectors = 360
const resolutionAnnuli = 100

const polarChart = lightningChart().Polar({
    // theme: Themes.darkGold
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
                units: 'intensity',
                steps: regularColorSteps(0, 60, themeExamples.intensityColorPalette),
                interpolate: true,
            }),
        })
        polarHeatmap.setFillStyle(palette).invalidateIntensityValues(data)

        const legend = polarChart.addLegendBox().add(polarChart).setAutoDispose({
            type: 'max-width',
            maxWidth: 0.3,
        })
    })
