# iamthe.law

## Current State
- Full accident documentation app, UK + Malta jurisdiction
- Dangerous Roads page: grid heat map tiles, filterable road cards, no geographic map
- Legal references cover violations but no dedicated cycling section

## Requested Changes (Diff)

### Add
- Cycling legal references (UK): HC Rules 59-82, 211-215; case law: Eagle v Chambers [2004], Gough v Thorne [1966], Phipps v Rochester Corporation [1955]; Highways Act 1980 s.41; Active Travel Act 2017. Add as 'Cycling' violation type in legalReferences.ts
- Cycling legal references (Malta): Malta Road Code cycling sections, TRO Cap. 65 cycling articles, Civil Code Arts. 1031-1033 applied to cycling. Add as 'Cycling' violation type in maltaLegalReferences.ts
- Geographic SVG heat map on DangerousRoadsPage: UK SVG outline of Great Britain + Malta SVG outline, with coloured dots (red/orange/amber by severity) for each dangerous road location. Hovering shows road name tooltip. Clicking scrolls to road card. Placed above existing grid heat map as a new 'Geographic Overview' card.

### Modify
- DangerousRoadsPage.tsx: add GeographicHeatMap component above grid
- legalReferences.ts: add Cycling violation type
- maltaLegalReferences.ts: add Cycling violation type

### Remove
- Nothing

## Implementation Plan
1. Add Cycling entry to UK legalReferences.ts with HC Rules 59-82, 211-215, case law, Highways Act
2. Add Cycling entry to Malta maltaLegalReferences.ts with Road Code cycling + TRO articles
3. Build GeographicHeatMap component with SVG outlines for UK and Malta, dots per road
4. Wire dot clicks to scroll to road cards using existing handleHeatClick pattern
5. Render GeographicHeatMap in DangerousRoadsPage above grid heat map
6. Validate
