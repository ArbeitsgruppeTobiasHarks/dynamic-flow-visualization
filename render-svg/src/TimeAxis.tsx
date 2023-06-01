const TimeAxis = ({
  t,
  strokeWidth,
  timeFrom,
  timeTo,
  yPos,
  xPosStart,
  xPosEnd,
  fontSize,
  redIntervals
}: {
  t: number
  strokeWidth: number
  timeFrom: number
  timeTo: number
  yPos: number
  xPosStart: number
  xPosEnd: number
  redIntervals: [number, number][]
  fontSize: number
}) => {
  const timeToX = (time: number) => xPosStart + ((time - timeFrom) / (timeTo - timeFrom)) * (xPosEnd - xPosStart)

  const xPosT = timeToX(t)

  const arrowLength = 5 * strokeWidth
  const tickSize = 8 * strokeWidth

  return (
    <>
      <path
        strokeLinejoin="round"
        strokeLinecap="round"
        d={`M${xPosStart} ${yPos} H ${xPosEnd} l ${-arrowLength} ${arrowLength} m ${arrowLength} ${-arrowLength} l ${-arrowLength} ${-arrowLength}`}
        fill="none"
        strokeWidth={strokeWidth}
        stroke="black"
      />
      <text x={xPosT} y={yPos - 2 * tickSize} alignmentBaseline="baseline" textAnchor="middle" fontSize={fontSize}>
        {String.raw`\raisebox{-.5\totalheight}{$\theta$}`}
      </text>
      {redIntervals.map(([from, to], index) => {
        const xFrom = timeToX(from)
        const xTo = timeToX(to)
        return (
          <path
            key={index}
            strokeLinejoin="round"
            strokeLinecap="round"
            d={`M ${xFrom} ${yPos - tickSize / 2} v ${tickSize} H ${xTo} v ${-tickSize} z`}
            fill="red"
            strokeWidth={strokeWidth}
            stroke="red"
          />
        )
      })}

      <path
        strokeLinejoin="round"
        strokeLinecap="round"
        d={`M ${xPosT} ${yPos - tickSize / 2} v ${tickSize}`}
        fill="none"
        strokeWidth={strokeWidth}
        stroke="black"
      />
      <text x={xPosEnd + 0.05} y={yPos} alignmentBaseline="middle" textAnchor="start" fontSize={fontSize}>
        {String.raw`\raisebox{-.5\totalheight}{Zeit}`}
      </text>
    </>
  )
}

export default TimeAxis
